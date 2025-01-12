<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {{ isNewCourse ? 'Create New Course' : 'Edit Course' }}
        </h1>
        <div class="flex space-x-4">
          <button
            @click="previousStep"
            v-if="currentStep > 1"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            @click="nextStep"
            v-if="currentStep < totalSteps"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
          <button
            v-if="currentStep === totalSteps"
            @click="saveDraft"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Save Draft
          </button>
          <button
            v-if="currentStep === totalSteps"
            @click="publishCourse"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>

      <!-- Step Progress -->
      <div class="mb-8">
        <div class="flex">
          <div 
            v-for="step in steps" 
            :key="step.id"
            class="flex flex-col items-center"
          >
            <div class="flex items-center">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]"
                class="ml-5"
              >
                {{ step.id }}
              </div>
              <div 
                v-if="step.id !== steps.length"
                :class="[
                  'h-1 w-16 mx-2',
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
              ></div>
            </div>
            <span 
              class="text-sm font-medium mt-1 mr-[2.8rem]"
              :class="[
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500',
                step.name === 'Preview' ? 'mr-0 ml-[2rem]' : '',
                step.name === 'Quiz' ? 'mr-[3.8rem]' : '',
                step.name === 'Content' ? 'mr-[3.8rem]' : ''
              ]"
            >
              {{ step.name }}
            </span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step 1: Basic Information -->
        <div v-show="currentStep === 1" class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Course Title *</label>
              <input
                v-model="courseData.title"
                type="text"
                placeholder="Enter course title"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">AI Description *</label>
              <textarea
                v-model="courseData.aiDescription"
                rows="4"
                placeholder="Enter detailed course description for AI understanding"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  v-model="courseData.category"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Personal Development">Personal Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Level *</label>
                <select
                  v-model="courseData.difficulty"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Duration (hours) *</label>
                <input
                  v-model="courseData.duration"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Enter course duration"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price ($) *</label>
                <input
                  v-model="courseData.price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter course price"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Course Content -->
        <div v-show="currentStep === 2" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">Course Content</h2>
              <div class="space-x-4">
                <button
                  type="button"
                  @click="generateQuiz"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isGeneratingQuiz"
                >
                  Generate Quiz
                </button>
                <button
                  type="button"
                  @click="generateCourseOutline"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isGenerating || !aiTopic"
                >
                  Generate Course
                </button>
                <button
                  v-if="isGenerating"
                  type="button"
                  @click="cancelGeneration"
                  class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Cancel Generation
                </button>
                <button
                  type="button"
                  @click="loadTestCourse"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Load Test Course
                </button>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Course Topic</label>
              <input
                v-model="aiTopic"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter the topic you want to create a course about"
              />
            </div>

            <div v-if="generationStatus" class="mt-4">
              <div
                :class="{
                  'bg-blue-100 text-blue-800': generationStatus.type === 'info',
                  'bg-green-100 text-green-800': generationStatus.type === 'success',
                  'bg-red-100 text-red-800': generationStatus.type === 'error'
                }"
                class="p-4 rounded-lg"
              >
                {{ generationStatus.message }}
              </div>
            </div>

            <div v-if="generatedOutline" class="mt-4">
              <button
                @click="useGeneratedOutline"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Use Generated Outline
              </button>
            </div>

            <!-- AI Chat Section -->
            <div class="mt-6 border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Course Assistant</h3>
              
              <div class="space-y-4">
                <!-- Chat History -->
                <div class="space-y-4 max-h-60 overflow-y-auto">
                  <div
                    v-for="(message, index) in chatHistory"
                    :key="index"
                    :class="{
                      'bg-gray-100 dark:bg-gray-700': message.role === 'user',
                      'bg-blue-50 dark:bg-gray-600': message.role === 'assistant'
                    }"
                    class="p-3 rounded-lg"
                  >
                    <p class="text-sm text-gray-900 dark:text-white">{{ message.content }}</p>
                  </div>
                </div>

                <!-- Suggested Prompts -->
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="prompt in suggestedPrompts"
                    :key="prompt"
                    @click="usePrompt(prompt)"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {{ prompt }}
                  </button>
                </div>

                <!-- Input Area -->
                <div class="flex space-x-2">
                  <input
                    v-model="aiPrompt"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ask AI to modify the course content..."
                    @keyup.enter="sendAIPrompt"
                  />
                  <button
                    @click="sendAIPrompt"
                    :disabled="isAdjusting || !aiPrompt.trim()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4 mt-6">
              <div
                v-for="(section, sectionIndex) in courseData.sections"
                :key="sectionIndex"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div class="flex justify-between items-center mb-4">
                  <input
                    v-model="section.title"
                    type="text"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Section Title"
                  />
                  <button
                    @click="removeSection(sectionIndex)"
                    class="ml-2 text-red-600 hover:text-red-800"
                    type="button"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>

                <div class="space-y-2 ml-4">
                  <div
                    v-for="(lesson, lessonIndex) in section.lessons"
                    :key="lessonIndex"
                    class="flex items-center space-x-2"
                  >
                    <input
                      v-model="lesson.title"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Lesson Title"
                    />
                    <button
                      @click="removeLesson(sectionIndex, lessonIndex)"
                      class="text-red-600 hover:text-red-800"
                      type="button"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <button
                    @click="addLesson(sectionIndex)"
                    class="text-sm text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    + Add Lesson
                  </button>
                </div>
              </div>
              <button
                @click="addSection"
                class="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                type="button"
              >
                + Add Section
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Resources -->
        <div v-show="currentStep === 3" class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Resources</h2>
          
          <div class="space-y-4">
            <div 
              v-for="(resource, index) in courseData.resources" 
              :key="index"
              class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Resource Type</label>
                  <select
                    v-model="resource.type"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    v-model="resource.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>

                <div class="flex items-end">
                  <button
                    @click="removeResource(index)"
                    class="px-3 py-2 text-red-600 hover:text-red-800"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {{ resource.type === 'link' ? 'URL' : 'File' }}
                </label>
                <input
                  v-if="resource.type === 'link'"
                  v-model="resource.url"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <input
                  v-else
                  type="file"
                  @change="e => handleResourceUpload(e, index)"
                  :accept="getAcceptedFileTypes(resource.type)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>

            <button
              @click="addResource"
              class="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              type="button"
            >
              + Add Resource
            </button>
          </div>
        </div>

        <!-- Step 4: Quiz Generation -->
        <div v-show="currentStep === 4" class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Course Quiz</h2>
            <button
              type="button"
              @click="generateQuiz"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              :disabled="isGeneratingQuiz"
            >
              Generate Quiz
            </button>
          </div>

          <div v-if="courseData.quiz && courseData.quiz.length > 0" class="space-y-6">
            <div 
              v-for="(question, index) in courseData.quiz" 
              :key="index"
              class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Question {{ index + 1 }}</label>
                  <input
                    v-model="question.question"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>

                <div class="space-y-2">
                  <div 
                    v-for="(option, optionIndex) in question.options" 
                    :key="optionIndex"
                    class="flex items-center space-x-2"
                  >
                    <input
                      :id="`option-${index}-${optionIndex}`"
                      type="radio"
                      :name="`question-${index}`"
                      :value="optionIndex"
                      v-model="question.correctAnswer"
                      class="h-4 w-4 text-blue-600"
                    />
                    <input
                      v-model="question.options[optionIndex]"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      :placeholder="`Option ${optionIndex + 1}`"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Preview -->
        <div v-if="currentStep === 5" class="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Course Preview</h2>
          <div class="space-y-8">
            <!-- Basic Info -->
            <div>
              <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Basic Information</h3>
              <div class="grid grid-cols-2 gap-4">
                <div><span class="text-gray-500">Title:</span> {{ courseData.title }}</div>
                <div><span class="text-gray-500">Category:</span> {{ courseData.category }}</div>
                <div><span class="text-gray-500">Difficulty:</span> {{ courseData.difficulty }}</div>
                <div><span class="text-gray-500">Duration:</span> {{ courseData.duration }} hours</div>
                <div><span class="text-gray-500">Price:</span> ${{ courseData.price }}</div>
              </div>
              <div class="mt-4">
                <span class="text-gray-500">Description:</span>
                <p class="mt-1">{{ courseData.aiDescription }}</p>
              </div>
            </div>
            
            <!-- Content -->
            <div>
              <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Course Content</h3>
              <div class="space-y-4">
                <div v-for="section in courseData.sections" :key="section.id" class="border p-4 rounded">
                  <h4 class="font-medium mb-2">{{ section.title }}</h4>
                  <ul class="list-disc list-inside">
                    <li v-for="lesson in section.lessons" :key="lesson.id">{{ lesson.title }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Resources -->
            <div>
              <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Resources</h3>
              <ul class="list-disc list-inside">
                <li v-for="resource in courseData.resources" :key="resource.id">
                  {{ resource.title }} ({{ resource.type }})
                </li>
              </ul>
            </div>

            <!-- Quiz -->
            <div>
              <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Quiz Questions</h3>
              <div class="space-y-4">
                <div v-for="(question, index) in courseData.quiz" :key="index" class="border p-4 rounded">
                  <p class="font-medium mb-2">{{ index + 1 }}. {{ question.question }}</p>
                  <ul class="list-inside space-y-1">
                    <li v-for="(option, optIndex) in question.options" :key="optIndex"
                        :class="{'text-green-600': optIndex === question.correctAnswer}">
                      {{ option }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-4 mt-8">
              <button @click="previousStep" class="px-4 py-2 bg-gray-600 text-white rounded">
                Make Changes
              </button>
              <button @click="saveDraft" class="px-4 py-2 bg-gray-600 text-white rounded">
                Save Draft
              </button>
              <button @click="handleSubmit" class="px-4 py-2 bg-blue-600 text-white rounded">
                Create Course
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/courses'
import { aiService } from '../api/ai'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const showPreview = ref(false)
const generatedOutline = ref(null)
const isSubmitting = ref(false)
const error = ref(null)
const isGenerating = ref(false)
const isGeneratingQuiz = ref(false)
const aiTopic = ref('')
const generationStatus = ref(null)
const generatedQuiz = ref(null)
const numberOfSections = ref(1)
const currentSection = ref(0)
const generatedContent = ref([])

const aiPrompt = ref('')
const isAdjusting = ref(false)
const chatHistory = ref([])

const suggestedPrompts = [
  "Make the content more beginner-friendly",
  "Add more practical examples",
  "Include more advanced topics",
  "Simplify the explanations",
  "Add more interactive exercises",
  "Focus more on best practices"
]

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Content' },
  { id: 3, name: 'Resources' },
  { id: 4, name: 'Quiz' },
  { id: 5, name: 'Preview' }
]

const currentStep = ref(1)
const totalSteps = steps.length

const courseData = reactive({
  title: '',
  aiDescription: '', // Detailed description for AI understanding
  difficulty: 'beginner',
  category: '',
  duration: '',
  price: '',
  imageUrl: '',
  instructor: '',
  status: 'draft',
  targetAudience: '',
  sections: [],
  prerequisites: [],
  learningObjectives: [],
  totalLessons: 0,
  completedLessons: [],
  enrolledCount: 0,
  rating: 0,
  reviews: [],
  lastUpdated: null,
  language: 'English',
  certificate: false,
  tags: [],
  quizzes: [],
  resources: [],
  syllabus: '',
  thumbnail: '',
  previewVideo: '',
  requirements: [],
  outcomes: [],
  featured: false,
  isPublished: false,
  publishDate: null,
  enrollmentStart: null,
  enrollmentEnd: null,
  courseStart: null,
  courseEnd: null,
  maxEnrollments: null,
  pricing: {
    regular: 0,
    sale: null,
    saleEndDate: null
  }
})

const initializeForm = () => {
  courseData.sections = [{
    title: '',
    content: '',
    duration: 0,
    order: 0,
    lessons: [],
    resources: [],
    quiz: null
  }]
  courseData.prerequisites = []
  courseData.learningObjectives = []
  courseData.requirements = []
  courseData.outcomes = []
  courseData.tags = []
  chatHistory.value = []
}

onMounted(() => {
  loadCourse()
  initializeForm()
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const processImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    courseData.imageFile = file
    try {
      console.log('Original image file:', file)
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log('Image data URL:', e.target.result.substring(0, 100) + '...')
        courseData.imageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }
}

const generateCourseOutline = async () => {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    
    if (!user) {
      throw new Error('Please login to generate course outline')
    }

    isGenerating.value = true
    generationStatus.value = { type: 'info', message: 'Generating course outline...' }

    const prompt = `Create a detailed educational course outline for teaching "${aiTopic.value}" at a ${courseData.difficulty} level for ${courseData.targetAudience}. 
    Generate exactly ${numberOfSections.value} sections.
    This is for professional educational purposes only.
    
    For each section, include:
    1. A clear, descriptive title
    2. Detailed content explaining the concepts
    3. Key points to remember
    4. Practical examples
    5. Best practices where applicable
    
    Return a valid JSON response with the following structure:
    {
      "sections": [
        {
          "title": "Section Title",
          "content": "Detailed section content",
          "keyPoints": ["Key point 1", "Key point 2"],
          "examples": ["Example 1", "Example 2"],
          "bestPractices": ["Practice 1", "Practice 2"],
          "order": 1,
          "duration": 90,
          "lessons": [
            {
              "title": "Lesson Title",
              "content": "Lesson content",
              "duration": 30,
              "completed": false,
              "resources": [],
              "quiz": null
            }
          ]
        }
      ]
    }`;

    const data = await aiService.generateCourseContent({
      topic: aiTopic.value,
      difficulty: courseData.difficulty,
      targetAudience: courseData.targetAudience,
      numberOfSections: parseInt(numberOfSections.value) || 1,
      prompt
    })

    generatedOutline.value = data
    generationStatus.value = { type: 'success', message: 'Course outline generated successfully!' }

    if (data && data.sections) {
      courseData.sections = data.sections.map(section => ({
        ...section,
        lessons: section.lessons || []
      }))
    }

  } catch (error) {
    console.error('Error generating course outline:', error)
    generationStatus.value = { type: 'error', message: error.message || 'Failed to generate course outline' }
  } finally {
    isGenerating.value = false
  }
}

const generateQuiz = async () => {
  try {
    isGeneratingQuiz.value = true
    const quizData = await aiService.generateQuiz({
      courseContent: courseData.sections,
      difficulty: courseData.difficulty,
      numberOfQuestions: 5
    })

    if (quizData && quizData.questions) {
      courseData.quiz = quizData.questions
    }

    toast.success('Quiz generated successfully')
  } catch (error) {
    console.error('Error generating quiz:', error)
    toast.error('Failed to generate quiz')
  } finally {
    isGeneratingQuiz.value = false
  }
}

const generateAIDescription = async () => {
  try {
    const description = await aiService.generateDescription({
      title: courseData.title,
      content: courseData.sections,
      targetAudience: courseData.targetAudience,
      difficulty: courseData.difficulty
    })

    if (description) {
      courseData.aiDescription = description
    }

    toast.success('Description generated successfully')
  } catch (error) {
    console.error('Error generating description:', error)
    toast.error('Failed to generate description')
  }
}

const handleSubmit = async (event) => {
  event.preventDefault()
  
  try {
    isSubmitting.value = true
    error.value = null
    
    const auth = getAuth()
    const user = auth.currentUser
    
    if (!user) {
      throw new Error('Please login to create a course')
    }

    const courseRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      authorId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    toast.success('Course created successfully')
    router.push(`/courses/${courseRef.id}`)
  } catch (err) {
    error.value = err.message
    toast.error(err.message)
  } finally {
    isSubmitting.value = false
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const useGeneratedOutline = () => {
  if (generatedOutline.value && generatedOutline.value.sections) {
    courseData.sections = generatedOutline.value.sections.map(section => ({
      ...section,
      lessons: section.lessons || []
    }))
    toast.success('Generated outline applied')
  } else {
    toast.error('No generated outline available')
  }
}

const generateShortDescription = () => {
  if (courseData.aiDescription) {
    courseData.description = courseData.aiDescription.split('.').slice(0, 2).join('.') + '.'
  }
}

const addSection = () => {
  courseData.sections.push({
    title: '',
    content: '',
    duration: 0,
    order: courseData.sections.length,
    lessons: [],
    resources: [],
    quiz: null
  })
}

const removeSection = (index) => {
  courseData.sections.splice(index, 1)
}

const cancelGeneration = () => {
  isGenerating.value = false
  generationStatus.value = { type: 'info', message: 'Generation cancelled' }
  // TODO: Implement actual cancellation of AI request
}

const addResource = () => {
  courseData.resources.push({
    type: 'document',
    title: '',
    url: ''
  })
}

const removeResource = (index) => {
  courseData.resources.splice(index, 1)
}

const getAcceptedFileTypes = (type) => {
  switch (type) {
    case 'document':
      return '.pdf,.doc,.docx,.txt'
    case 'video':
      return '.mp4,.webm,.ogg'
    default:
      return '*'
  }
}

const handleResourceUpload = async (event, index) => {
  const file = event.target.files[0]
  if (file) {
    // TODO: Implement file upload
    console.log('Uploading file:', file)
  }
}

const usePrompt = (prompt) => {
  aiPrompt.value = prompt
}

const sendAIPrompt = async () => {
  if (!aiPrompt.value.trim()) {
    toast.error('Please enter a prompt')
    return
  }

  try {
    isAdjusting.value = true
    chatHistory.value.push({
      role: 'user',
      content: aiPrompt.value
    })

    const response = await aiService.adjustCourse({
      prompt: aiPrompt.value,
      courseContent: courseData.sections,
      difficulty: courseData.difficulty,
      targetAudience: courseData.targetAudience
    })

    if (response) {
      chatHistory.value.push({
        role: 'assistant',
        content: response.message
      })

      if (response.adjustedContent) {
        courseData.sections = response.adjustedContent
      }
    }

    aiPrompt.value = ''
    toast.success('Course adjusted successfully')
  } catch (error) {
    console.error('Error adjusting course:', error)
    toast.error('Failed to adjust course')
  } finally {
    isAdjusting.value = false
  }
}

const loadCourse = async () => {
  if (!isNewCourse.value) {
    try {
      // TODO: Implement API call to fetch course
      const mockCourse = {
        title: 'Sample Course',
        aiDescription: 'Sample AI description',
        category: 'Programming',
        difficulty: 'intermediate',
        duration: 10,
        price: 99.99,
        sections: [],
        resources: [],
        quiz: [],
        status: 'draft'
      }
      Object.assign(courseData, mockCourse)
    } catch (error) {
      toast.error('Failed to load course')
      console.error('Error loading course:', error)
    }
  }
}
</script>
