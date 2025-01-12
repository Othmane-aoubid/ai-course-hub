import axios from 'axios'
import { getAuth } from 'firebase/auth'
import crypto from 'crypto'

const API_URL = import.meta.env.VITE_API_URL
console.log('API URL:', API_URL)

// Cache the auth token
let cachedToken = null;
let tokenExpiry = null;

// Helper function to get the current user's token
const getAuthToken = async () => {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const auth = getAuth()
    const user = auth.currentUser
    console.log('Current user:', user?.email)
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    const token = await user.getIdToken()
    console.log('Got auth token:', token.substring(0, 20) + '...')
    
    // Cache the token for 5 minutes
    cachedToken = token;
    tokenExpiry = Date.now() + (5 * 60 * 1000);
    
    return token
  } catch (error) {
    console.error('Error getting auth token:', error)
    throw error
  }
}

// Helper function to clean and format content
const cleanContent = (content) => {
  if (typeof content !== 'string') return content;
  return content
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n');
};

// Helper function to format module content
const formatModuleContent = (content) => {
  if (typeof content === 'string') {
    return {
      overview: cleanContent(content),
      content: cleanContent(content),
      sections: []
    };
  }
  return {
    overview: cleanContent(content.overview || content.content || ''),
    content: cleanContent(content.content || ''),
    sections: content.sections || []
  };
};

export const aiService = {
  async generateCourseContent(params) {
    const { topic, difficulty, targetAudience, numberOfSections = 5 } = params;

    if (!topic || !difficulty || !targetAudience) {
      throw new Error('Missing required fields: topic, difficulty, or targetAudience');
    }

    // Add educational context and rephrase security topics
    let safeTopic = topic;
    if (topic.toLowerCase().includes('security') || topic.toLowerCase().includes('cyber')) {
      safeTopic = `Educational Course: ${topic} Fundamentals for IT Professionals`;
    }

    const prompt = `Create a detailed educational course outline for teaching "${safeTopic}" at a ${difficulty} level for ${targetAudience}. 
    Generate exactly ${numberOfSections} sections.
    This is for professional educational purposes only.
    
    For each section, include:
    1. A clear, descriptive title
    2. Detailed content explaining the concepts
    3. Key points to remember
    4. Practical examples
    5. Best practices where applicable
    
    Return a valid JSON response with the following structure. DO NOT include any explanatory text before or after the JSON:
    {
      "sections": [
        {
          "title": "string - section title",
          "content": "string - detailed section content",
          "keyPoints": ["string - key point 1", "string - key point 2"],
          "examples": ["string - example 1", "string - example 2"],
          "bestPractices": ["string - practice 1", "string - practice 2"],
          "order": 1,
          "duration": 90,
          "lessons": [
            {
              "title": "string - lesson title",
              "content": "string - detailed lesson content",
              "duration": 90,
              "completed": false,
              "resources": [],
              "quiz": null
            }
          ]
        }
      ]
    }
    
    Important: 
    1. The response must be a valid JSON object
    2. Do not include any markdown formatting or additional text
    3. All array values must be strings, not objects
    4. All numeric values must be numbers, not strings
    5. Ensure all JSON properties are properly quoted
    6. Do not use trailing commas`;

    try {
      const token = await getAuthToken()

      // Generate course outline
      console.log('Generating course outline...')
      const outlineResponse = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic,
          difficulty, 
          targetAudience,
          prompt,
          numberOfSections
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Validate and clean the response
      if (!outlineResponse.data) {
        throw new Error('Empty response from outline generation');
      }

      let courseData;
      try {
        // If response is a string, try to parse it
        courseData = typeof outlineResponse.data === 'string' 
          ? JSON.parse(outlineResponse.data)
          : outlineResponse.data;

        // Validate the structure
        if (!courseData.sections || !Array.isArray(courseData.sections)) {
          throw new Error('Invalid response structure: missing sections array');
        }

        // Clean and validate each section
        courseData.sections = courseData.sections.map((section, index) => ({
          title: String(section.title || ''),
          content: String(section.content || ''),
          keyPoints: Array.isArray(section.keyPoints) ? section.keyPoints.map(String) : [],
          examples: Array.isArray(section.examples) ? section.examples.map(String) : [],
          bestPractices: Array.isArray(section.bestPractices) ? section.bestPractices.map(String) : [],
          order: Number(section.order || index + 1),
          duration: Number(section.duration || 90),
          lessons: Array.isArray(section.lessons) ? section.lessons.map(lesson => ({
            title: String(lesson.title || ''),
            content: String(lesson.content || ''),
            duration: Number(lesson.duration || 90),
            completed: Boolean(lesson.completed || false),
            resources: Array.isArray(lesson.resources) ? lesson.resources : [],
            quiz: lesson.quiz || null
          })) : []
        }));

      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response: ' + parseError.message);
      }

      return courseData;
    } catch (error) {
      console.error('Error generating course content:', error)
      throw error
    }
  },

  async generateDetailedContent(title, moduleTitle) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: title,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'lesson'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return formatModuleContent(response.data.sections[0])
    } catch (error) {
      console.error('Error generating detailed content:', error)
      return { content: '', activities: [], exercises: [] }
    }
  },

  async generateKeyPoints(title) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: `Key points for: ${title}`,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'keypoints'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.sections[0].content.split('\n')
    } catch (error) {
      console.error('Error generating key points:', error)
      return []
    }
  },

  async generateExamples(title) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: `Examples for: ${title}`,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'examples'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.sections[0].content.split('\n')
    } catch (error) {
      console.error('Error generating examples:', error)
      return []
    }
  },

  async generateBestPractices(title) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: `Best practices for: ${title}`,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'bestpractices'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.sections[0].content.split('\n')
    } catch (error) {
      console.error('Error generating best practices:', error)
      return []
    }
  },

  async generateSummary(title) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: `Summary of: ${title}`,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'summary'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.sections[0].content
    } catch (error) {
      console.error('Error generating summary:', error)
      return ''
    }
  },

  async generateResources(title) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: `Resources for: ${title}`,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'resources'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.sections[0].content.split('\n')
    } catch (error) {
      console.error('Error generating resources:', error)
      return []
    }
  },

  async generateQuizQuestions(title) {
    try {
      const token = await getAuthToken()
      
      const response = await axios.post(
        `${API_URL}/ai/generate-course-outline`,
        {
          topic: `Quiz questions for: ${title}`,
          difficulty: 'intermediate',
          targetAudience: 'learners',
          contentType: 'quiz'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const content = response.data.sections[0].content;
      return content.split('\n').map(line => ({
        question: line,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0
      }));
    } catch (error) {
      console.error('Error generating quiz questions:', error)
      return []
    }
  },

  async generateModuleDescription(title) {
    return `A comprehensive module covering all aspects of ${title.toLowerCase()}, 
from fundamental concepts to advanced applications.`
  },

  async generateDefaultResources(title) {
    return [
      {
        type: 'article',
        title: `Understanding ${title}`,
        url: '#',
        description: 'A comprehensive guide to the fundamentals'
      },
      {
        type: 'video',
        title: `${title} in Practice`,
        url: '#',
        description: 'Video tutorial with practical examples'
      }
    ]
  },

  async generateDefaultAssignments(title) {
    return [
      {
        title: `${title} Implementation Project`,
        description: 'Apply the concepts learned in this module to a real-world scenario',
        type: 'project',
        deadline: '2 weeks'
      }
    ]
  },

  async getAIFeedback(courseContent) {
    try {
      const token = await getAuthToken()
      const response = await axios.post(`${API_URL}/ai/feedback`, 
        { content: courseContent },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error getting AI feedback:', error)
      throw error
    }
  },

  async analyzeStudentProgress(progressData) {
    try {
      const token = await getAuthToken()
      const response = await axios.post(`${API_URL}/ai/analyze-progress`, 
        { data: progressData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error analyzing student progress:', error)
      throw error
    }
  },

  async getChatResponse(message, context) {
    try {
      console.log('Starting chat response request with context:', {
        courseTitle: context.courseTitle,
        difficulty: context.difficulty,
        targetAudience: context.targetAudience
      })
      
      const token = await getAuthToken()
      console.log('Auth token obtained successfully')
      
      // Enhanced prompt to better guide the AI
      const enhancedPrompt = `You are an AI course assistant helping to improve the course "${context.courseTitle}". 
      The course is targeted at ${context.targetAudience} at a ${context.difficulty} level.

      When analyzing or modifying course content:
      1. Automatically detect and preserve existing section structure
      2. Generate detailed, non-repetitive content for each section
      3. Each section should include:
         - Clear title
         - Comprehensive content
         - Specific, practical examples
         - Actionable key points
         - Best practices where applicable
      4. When asked to enhance content:
         - Add new, relevant information
         - Avoid repeating existing content
         - Maintain consistent depth and quality
         - Ensure smooth transitions between topics
      
      ${message}`

      const response = await axios.post(
        `${API_URL}/ai/chat`,
        {
          message: enhancedPrompt,
          context: {
            currentContent: context.currentContent,
            difficulty: context.difficulty,
            targetAudience: context.targetAudience,
            courseTitle: context.courseTitle,
            chatHistory: context.chatHistory || []
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.data) {
        throw new Error('Empty response from AI')
      }
      
      console.log('Received AI response:', {
        hasAdjustedContent: !!response.data.adjustedContent,
        hasMessage: !!response.data.message,
        hasResponse: !!response.data.response
      })

      let adjustedContent = null
      let aiMessage = ''

      // Enhanced content parsing
      if (response.data.adjustedContent) {
        adjustedContent = response.data.adjustedContent
        aiMessage = response.data.message || 'Course content updated successfully!'
      } else if (response.data.message || response.data.response) {
        const messageText = response.data.message || response.data.response
        
        // Try to extract course content from the message
        try {
          // Look for section patterns in the text
          const sections = []
          const sectionPattern = /\*\*Section \d+:([^*]+)\*\*([^*]+)(?=\*\*Section|$)/g
          let match

          while ((match = sectionPattern.exec(messageText)) !== null) {
            const title = match[1].trim()
            const content = match[2].trim()
            
            // Extract key points and examples
            const keyPoints = []
            const examples = []
            const bestPractices = []
            
            // Parse key points
            const keyPointPattern = /\* ([^*\n]+)/g
            let keyPointMatch
            while ((keyPointMatch = keyPointPattern.exec(content)) !== null) {
              keyPoints.push(keyPointMatch[1].trim())
            }
            
            // Parse examples
            const examplePattern = /Example:([^*\n]+)/g
            let exampleMatch
            while ((exampleMatch = examplePattern.exec(content)) !== null) {
              examples.push(exampleMatch[1].trim())
            }
            
            sections.push({
              title,
              content,
              keyPoints,
              examples,
              bestPractices,
              order: sections.length + 1,
              duration: 90,
              lessons: [{
                title: title,
                content: content,
                duration: 90,
                completed: false,
                resources: [],
                quiz: null
              }]
            })
          }

          if (sections.length > 0) {
            adjustedContent = { sections }
            aiMessage = 'Course content updated based on your request.'
          } else {
            aiMessage = messageText
          }
        } catch (parseError) {
          console.warn('Content parsing error:', parseError.message)
          aiMessage = messageText
        }
      }

      // Clean and validate the final response
      return {
        message: cleanContent(aiMessage),
        adjustedContent: adjustedContent ? {
          sections: adjustedContent.sections.map((section, index) => ({
            title: String(section.title || ''),
            content: String(section.content || ''),
            keyPoints: Array.isArray(section.keyPoints) ? section.keyPoints.map(String) : [],
            examples: Array.isArray(section.examples) ? section.examples.map(String) : [],
            bestPractices: Array.isArray(section.bestPractices) ? section.bestPractices.map(String) : [],
            order: Number(section.order || index + 1),
            duration: Number(section.duration || 90),
            lessons: Array.isArray(section.lessons) ? section.lessons.map(lesson => ({
              title: String(lesson.title || ''),
              content: String(lesson.content || ''),
              duration: Number(lesson.duration || 90),
              completed: Boolean(lesson.completed || false),
              resources: Array.isArray(lesson.resources) ? lesson.resources : [],
              quiz: lesson.quiz || null
            })) : []
          }))
        } : null
      }
    } catch (error) {
      console.error('Error in getChatResponse:', error)
      throw error
    }
  }
}
