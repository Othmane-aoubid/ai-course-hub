const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Rate limiting setup
const requestQueue = [];
const MAX_REQUESTS_PER_MINUTE = 60;
const RETRY_DELAY = 1000; // 1 second delay between retries
let requestsThisMinute = 0;
let lastResetTime = Date.now();

// Reset the counter every minute
setInterval(() => {
  requestsThisMinute = 0;
  lastResetTime = Date.now();
  // Process queued requests
  while (requestQueue.length > 0 && requestsThisMinute < MAX_REQUESTS_PER_MINUTE) {
    const nextRequest = requestQueue.shift();
    nextRequest();
  }
}, 60000);

// Helper function to handle rate-limited API calls
async function makeRateLimitedRequest(apiCall) {
  // Reset counter if a minute has passed
  if (Date.now() - lastResetTime > 60000) {
    requestsThisMinute = 0;
    lastResetTime = Date.now();
  }

  // If we haven't hit the limit, make the request
  if (requestsThisMinute < MAX_REQUESTS_PER_MINUTE) {
    requestsThisMinute++;
    return apiCall();
  }

  // Otherwise, queue the request
  return new Promise((resolve, reject) => {
    const queuedRequest = async () => {
      try {
        requestsThisMinute++;
        const result = await apiCall();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    requestQueue.push(queuedRequest);
  });
}

// Helper function to retry failed requests
async function retryWithBackoff(apiCall, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await makeRateLimitedRequest(apiCall);
    } catch (error) {
      if (error.message.includes('429') && retries < maxRetries - 1) {
        retries++;
        const delay = RETRY_DELAY * Math.pow(2, retries - 1);
        console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini AI
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('Successfully initialized Gemini AI');
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

// Initialize Firebase Admin
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://firebasestorage.googleapis.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// AI Routes
app.post('/api/ai/generate-course-outline', async (req, res) => {
  try {
    const { prompt, topic, difficulty, targetAudience, numberOfSections } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log('Generating course outline with prompt:', prompt);

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    console.log('Raw AI response:', text);
    
    // Clean up any markdown formatting and control characters
    let cleanText = text
      .replace(/```json\n?|\n?```/g, '')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .trim();
    
    console.log('Cleaned text:', cleanText);
    
    try {
      // Find JSON content between curly braces if it exists
      const jsonMatch = cleanText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
        console.log('Extracted JSON:', cleanText);
      }
      
      // Parse the JSON response
      const data = JSON.parse(cleanText);
      console.log('Successfully parsed JSON data');
      
      // Validate the response structure
      if (!data.sections || !Array.isArray(data.sections)) {
        throw new Error('Invalid response format: missing sections array');
      }

      // Ensure we have the requested number of sections
      if (data.sections.length !== numberOfSections) {
        throw new Error(`AI generated ${data.sections.length} sections but ${numberOfSections} were requested`);
      }

      // Validate and clean up each section
      data.sections = data.sections.map((section, index) => ({
        title: section.title || `Section ${index + 1}`,
        content: section.content
          ?.replace(/\*\*/g, '')  // Remove markdown bold
          ?.replace(/\\n/g, '\n')  // Convert escaped newlines
          ?.trim() || 'Content to be added',
        keyPoints: Array.isArray(section.keyPoints) ? section.keyPoints : [],
        examples: Array.isArray(section.examples) ? section.examples : [],
        bestPractices: Array.isArray(section.bestPractices) ? section.bestPractices : [],
        order: index + 1,
        duration: section.duration || 45,
        lessons: Array.isArray(section.lessons) ? section.lessons : []
      }));

      res.json(data);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(400).json({
        error: 'Failed to parse AI response',
        details: parseError.message
      });
    }
  } catch (error) {
    console.error('Error generating course outline:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      details: error.message
    });
  }
});

// New endpoint for generating detailed lesson content
app.post('/api/ai/generate-lesson-content', async (req, res) => {
  try {
    if (!genAI) {
      console.error('Gemini AI not initialized');
      return res.status(500).json({ 
        error: 'AI service not available',
        details: 'Failed to initialize AI service. Please check API key configuration.'
      });
    }

    const { lessonTitle, moduleTitle, format, sections } = req.body;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate detailed educational content for a lesson titled "${lessonTitle}" which is part of the module "${moduleTitle}".

    Return a JSON object with the following sections:
    {
      "overview": "Brief overview of the lesson",
      "introduction": "Detailed introduction",
      "key_concepts": ["List of key concepts"],
      "detailed_explanation": "In-depth explanation of concepts",
      "examples": ["Practical examples"],
      "code_samples": ["Code examples if applicable"],
      "best_practices": ["List of best practices"],
      "common_pitfalls": "Common mistakes and how to avoid them",
      "exercises": [{"title": "Exercise title", "description": "Exercise description"}],
      "additional_resources": [{"title": "Resource title", "url": "Resource URL"}],
      "summary": "Lesson summary"
    }

    Make the content comprehensive, practical, and suitable for ${moduleTitle}.`;

    const result = await retryWithBackoff(async () => {
      const genResult = await model.generateContent(prompt);
      const response = await genResult.response;
      return response;
    });

    const response = result;
    let text = response.text();
    
    console.log('Raw lesson content response:', text);
    
    // Clean up any markdown formatting or backticks
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      // Find JSON content between curly braces if it exists
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        text = jsonMatch[0];
        console.log('Extracted JSON:', text);
      }
      
      // Parse the JSON response
      const data = JSON.parse(text);
      
      res.json(data);
    } catch (error) {
      console.error('Error parsing lesson content:', error);
      res.status(500).json({ error: 'Failed to parse lesson content' });
    }
  } catch (error) {
    console.error('Error generating lesson content:', error);
    res.status(500).json({ error: 'Failed to generate lesson content' });
  }
});

// Quiz Generation Route
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    if (!genAI) {
      console.error('Gemini AI not initialized');
      return res.status(500).json({ 
        error: 'AI service not available',
        details: 'Failed to initialize AI service. Please check API key configuration.'
      });
    }

    const { sections, difficulty } = req.body;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a content string from the sections
    const courseContent = sections.map(section => 
      `Section: ${section.title}\n${section.content}`
    ).join('\n\n');

    const prompt = `Create a ${difficulty} level quiz based on the following course content:\n\n${courseContent}\n
    Generate 5 multiple choice questions. Format the response as a JSON array with this exact structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "correct option here",
          "explanation": "explanation of why this is correct"
        }
      ]
    }
    Make sure the response is valid JSON and follows this exact structure.`;

    // Generate content
    const result = await retryWithBackoff(async () => {
      const genResult = await model.generateContent(prompt);
      const response = await genResult.response;
      return response;
    });

    let text = result.text();
    
    // Clean up any markdown formatting or backticks
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      // Parse the response to ensure it's valid JSON
      const quizData = JSON.parse(text);
      res.json(quizData);
    } catch (error) {
      console.error('Failed to parse quiz data:', error);
      console.error('Raw text:', text);
      res.status(500).json({ error: 'Failed to generate valid quiz data. Please try again.' });
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message });
  }
});

// Progress Analysis Route
app.post('/api/ai/analyze-progress', async (req, res) => {
  try {
    if (!genAI) {
      console.error('Gemini AI not initialized');
      return res.status(500).json({ 
        error: 'AI service not available',
        details: 'Failed to initialize AI service. Please check API key configuration.'
      });
    }

    const { data } = req.body;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the following learning progress data and provide recommendations: ${JSON.stringify(data)}
    Include strengths, areas for improvement, and specific recommendations.`;

    // Generate content
    const result = await retryWithBackoff(async () => {
      const genResult = await model.generateContent(prompt);
      const response = await genResult.response;
      return response;
    });

    const text = result.text();
    
    res.json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing progress:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chat Route
app.post('/api/ai/chat', async (req, res) => {
  try {
    if (!genAI) {
      console.error('Gemini AI not initialized');
      return res.status(500).json({ 
        error: 'AI service not available',
        details: 'Failed to initialize AI service. Please check API key configuration.'
      });
    }

    const { message, context } = req.body;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Context: ${context}\n\nQuestion: ${message}`;

    // Generate content
    const result = await retryWithBackoff(async () => {
      const genResult = await model.generateContent(prompt);
      const response = await genResult.response;
      return response;
    });

    const text = result.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quiz generation endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    if (!genAI) {
      console.error('Gemini AI not initialized');
      return res.status(500).json({ 
        error: 'AI service not available',
        details: 'Failed to initialize AI service. Please check API key configuration.'
      });
    }

    const { sectionTitle, sectionContent } = req.body;
    
    const prompt = `Create an educational quiz based on this course section:
    Title: ${sectionTitle}
    Content: ${sectionContent}
    
    Generate 5 multiple choice questions that:
    - Test understanding of key concepts
    - Include practical scenarios
    - Vary in difficulty
    - Have clear and unambiguous answers
    
    Format the response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "Clear, well-written question text",
          "options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          "correctAnswer": "The correct option",
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await retryWithBackoff(async () => {
      const genResult = await model.generateContent(prompt);
      const response = genResult.response;
      return response;
    });

    let text = result.text();
    
    // Clean up any markdown formatting or backticks
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      // Parse and validate the JSON response
      const quizData = JSON.parse(text);
      
      // Ensure the response has the required structure
      if (!Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz generation response');
      }
      
      res.json(quizData);
    } catch (error) {
      console.error('Failed to parse quiz data:', error);
      console.error('Raw text:', text);
      res.status(500).json({ error: 'Failed to generate valid quiz data. Please try again.' });
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Course Creation Endpoint
app.post('/api/courses', async (req, res) => {
  try {
    console.log('Received course creation request:', req.body);
    const { title, description, difficulty, targetAudience, category, status, price, sections, imageUrl } = req.body;
    
    const courseData = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      targetAudience,
      category,
      status,
      price: parseFloat(price) || 0,
      sections: sections || [],
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    console.log('Attempting to write course data:', courseData);
    
    // Using Firebase Admin SDK to write directly to Firestore
    const courseRef = await db.collection('courses').add(courseData);
    console.log('Successfully created course with ID:', courseRef.id);
    
    res.status(201).json({
      id: courseRef.id,
      ...courseData
    });
  } catch (error) {
    console.error('Error creating course. Full error:', error);
    console.error('Error stack trace:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Course Routes
app.get('/api/courses', async (req, res) => {
  try {
    const coursesSnapshot = await db.collection('courses').get();
    const courses = [];
    coursesSnapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const doc = await db.collection('courses').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Firebase Storage proxy endpoint
app.post('/api/storage-proxy', async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;
    
    const response = await fetch(url, {
      method: method || 'POST',
      headers: {
        ...headers,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Storage proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
