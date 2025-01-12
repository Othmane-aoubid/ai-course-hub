<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="spinner"></div>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading course content...</p>
    </div>

    <div v-else-if="!course" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Course Not Found</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Unable to load the course content.</p>
        <button
          @click="router.push('/courses')"
          class="mt-4 btn btn-primary"
        >
          Back to Courses
        </button>
      </div>
    </div>

    <div v-else class="flex h-screen">
      <!-- Course Sidebar -->
      <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Course Info -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ course?.title }}</h2>
          <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <i class="fas fa-book-reader mr-2"></i>
            <span>{{ courseProgress }}% Complete</span>
          </div>
        </div>

        <!-- Course Content (Modules or Sections) -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 space-y-4">
            <div
              v-for="(content, contentIndex) in (course?.sections || course?.modules || [])"
              :key="contentIndex"
              class="space-y-2"
            >
              <div
                class="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="toggleModule(contentIndex)"
              >
                <div class="flex items-center space-x-2">
                  <i
                    class="fas"
                    :class="[
                      expandedModules[contentIndex]
                        ? 'fa-chevron-down text-blue-500'
                        : 'fa-chevron-right text-gray-400'
                    ]"
                  ></i>
                  <span class="font-medium text-gray-700 dark:text-gray-300">
                    {{ content.title }}
                  </span>
                </div>
                <span
                  class="text-sm text-gray-500 dark:text-gray-400"
                  v-if="content.duration"
                >
                  {{ content.duration }}min
                </span>
              </div>

              <!-- Lessons -->
              <div v-show="expandedModules[contentIndex]" class="ml-6 space-y-1">
                <div
                  v-for="(lesson, lessonIndex) in content.lessons"
                  :key="lessonIndex"
                  @click="selectLesson(contentIndex, lessonIndex)"
                  class="flex items-center justify-between p-2 rounded-lg cursor-pointer"
                  :class="[
                    isCurrentLesson(contentIndex, lessonIndex)
                      ? 'bg-blue-50 dark:bg-blue-900'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <div class="flex items-center space-x-2">
                    <i
                      class="fas fa-circle text-xs"
                      :class="[
                        lesson.completed
                          ? 'text-green-500'
                          : isCurrentLesson(contentIndex, lessonIndex)
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      ]"
                    ></i>
                    <span
                      class="text-sm"
                      :class="[
                        isCurrentLesson(contentIndex, lessonIndex)
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300'
                      ]"
                    >
                      {{ lesson.title }}
                    </span>
                  </div>
                  <span
                    v-if="lesson.duration"
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ lesson.duration }}min
                  </span>
                </div>
                
                <!-- Quiz button -->
                <div
                  v-if="hasQuiz(contentIndex)"
                  @click="selectQuiz(contentIndex)"
                  class="flex items-center p-2 rounded-lg cursor-pointer mt-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <i class="fas fa-question-circle text-purple-500 mr-2"></i>
                  <span class="text-sm text-gray-600 dark:text-gray-300">Section Quiz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto px-4 py-8">
          <div v-if="currentLesson && !showingQuiz" class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ currentLesson.title }}
            </h1>
            
            <div class="prose dark:prose-invert max-w-none">
              <div v-html="renderedContent"></div>
            </div>

            <!-- Resources -->
            <div v-if="currentLesson?.resources?.length > 0 || course?.resources?.length > 0" class="mt-8">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resources</h2>
              
              <!-- Lesson Resources -->
              <div v-if="currentLesson?.resources?.length > 0" class="space-y-4 mb-6">
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Lesson Resources</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="(resource, index) in currentLesson.resources" 
                       :key="index"
                       class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-start space-x-3">
                      <!-- Resource Icon -->
                      <div class="flex-shrink-0">
                        <i v-if="resource.type === 'link'" class="fas fa-link text-blue-500"></i>
                        <i v-else-if="resource.type === 'video'" class="fas fa-video text-red-500"></i>
                        <i v-else-if="resource.type === 'image'" class="fas fa-image text-green-500"></i>
                        <i v-else class="fas fa-file text-gray-500"></i>
                      </div>
                      
                      <!-- Resource Content -->
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 dark:text-white">{{ resource.title }}</h4>
                        <p v-if="resource.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {{ resource.description }}
                        </p>
                        
                        <!-- Resource Actions -->
                        <div class="mt-2">
                          <a v-if="resource.url" 
                             :href="resource.url" 
                             target="_blank"
                             class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                            Visit Resource
                            <i class="fas fa-external-link-alt ml-1"></i>
                          </a>
                          <a v-if="resource.fileUrl" 
                             :href="resource.fileUrl"
                             download
                             class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                            Download
                            <i class="fas fa-download ml-1"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Course Resources -->
              <div v-if="course?.resources?.length > 0" class="space-y-4">
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Course Resources</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="(resource, index) in course.resources" 
                       :key="index"
                       class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-start space-x-3">
                      <!-- Resource Icon -->
                      <div class="flex-shrink-0">
                        <i v-if="resource.type === 'link'" class="fas fa-link text-blue-500"></i>
                        <i v-else-if="resource.type === 'video'" class="fas fa-video text-red-500"></i>
                        <i v-else-if="resource.type === 'image'" class="fas fa-image text-green-500"></i>
                        <i v-else class="fas fa-file text-gray-500"></i>
                      </div>
                      
                      <!-- Resource Content -->
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 dark:text-white">{{ resource.title }}</h4>
                        <p v-if="resource.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {{ resource.description }}
                        </p>
                        
                        <!-- Resource Actions -->
                        <div class="mt-2">
                          <a v-if="resource.url" 
                             :href="resource.url" 
                             target="_blank"
                             class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                            Visit Resource
                            <i class="fas fa-external-link-alt ml-1"></i>
                          </a>
                          <a v-if="resource.fileUrl" 
                             :href="resource.fileUrl"
                             download
                             class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
                            Download
                            <i class="fas fa-download ml-1"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between pt-6">
              <button
                @click="previousLesson"
                class="btn btn-secondary"
                :disabled="!hasPreviousLesson"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Previous Lesson
              </button>
              
              <button
                @click="nextLesson"
                class="btn btn-primary"
                :disabled="!hasNextLesson"
              >
                Next Lesson
                <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>

          <div v-if="showingQuiz && currentQuiz" class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Section {{ currentModuleIndex + 1 }} Quiz
            </h1>
            
            <div class="space-y-8">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {{ currentQuiz.question }}
                </h3>
                
                <div class="space-y-3">
                  <label
                    v-for="(option, optIndex) in currentQuiz.options"
                    :key="optIndex"
                    class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <input
                      type="radio"
                      :name="'quiz-answer'"
                      :value="option"
                      v-model="quizAnswers[currentModuleIndex]"
                      class="h-4 w-4 text-blue-600"
                    >
                    <span class="text-gray-700 dark:text-gray-300">{{ option }}</span>
                  </label>
                </div>
              </div>

              <div class="flex justify-between pt-6">
                <button
                  @click="showingQuiz = false"
                  class="btn btn-secondary"
                >
                  Back to Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courses'
import { useAuthStore } from '../stores/auth'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

const course = ref(null)
const loading = ref(true)
const currentModuleIndex = ref(0)
const currentLessonIndex = ref(0)
const expandedModules = ref({})
const showingQuiz = ref(false)
const quizAnswers = ref({})
const selectedResource = ref(null)

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {}
    }
    return code
  },
  breaks: true,
  gfm: true
})

const loadCourse = async () => {
  try {
    loading.value = true
    const courseId = route.params.id

    // Query enrollments collection for this course
    const enrollmentsRef = collection(db, 'enrollments')
    const q = query(
      enrollmentsRef,
      where('userId', '==', authStore.user.uid),
      where('courseId', '==', courseId)
    )
    
    const enrollmentSnapshot = await getDocs(q)
    
    if (enrollmentSnapshot.empty) {
      router.push('/courses')
      return
    }

    // Get the first enrollment document
    const enrollmentDoc = enrollmentSnapshot.docs[0]
    const enrollmentData = enrollmentDoc.data()

    // Get the actual course data
    const courseRef = doc(db, 'courses', courseId)
    const courseDoc = await getDoc(courseRef)
    
    if (!courseDoc.exists()) {
      console.error('Course not found')
      router.push('/courses')
      return
    }

    // Combine course data with enrollment data
    const courseData = courseDoc.data()
    course.value = {
      id: courseId,
      ...courseData,
      progress: enrollmentData.progress || 0,
      enrolledAt: enrollmentData.enrolledAt
    }

    console.log('Loaded course data:', course.value)

    // Set initial expanded state for first section and select first lesson
    if (course.value?.sections?.length > 0) {
      expandedModules.value[0] = true
      currentModuleIndex.value = 0
      if (course.value.sections[0]?.lessons?.length > 0) {
        currentLessonIndex.value = 0
      }
    }

    loading.value = false
  } catch (error) {
    console.error('Error loading course:', error)
    loading.value = false
  }
}

const currentSection = computed(() => {
  if (!course.value?.sections || currentModuleIndex.value === null) return null
  return course.value.sections[currentModuleIndex.value]
})

const currentLesson = computed(() => {
  if (!currentSection.value?.lessons || currentLessonIndex.value === null) return null
  return currentSection.value.lessons[currentLessonIndex.value]
})

const currentQuiz = computed(() => {
  if (!course.value?.quizzes || currentModuleIndex.value === null) return null
  return course.value.quizzes[currentModuleIndex.value]
})

const renderedContent = computed(() => {
  if (!currentLesson.value?.content) return ''
  return marked(currentLesson.value.content)
})

const courseProgress = computed(() => {
  if (!course.value) return 0
  return course.value.progress || 0
})

const selectLesson = (moduleIndex, lessonIndex) => {
  currentModuleIndex.value = moduleIndex
  currentLessonIndex.value = lessonIndex
}

const selectQuiz = (moduleIndex) => {
  currentModuleIndex.value = moduleIndex
  showingQuiz.value = true
  quizAnswers.value = {}
}

const toggleModule = (moduleIndex) => {
  expandedModules.value[moduleIndex] = !expandedModules.value[moduleIndex]
}

const isCurrentLesson = (moduleIndex, lessonIndex) => {
  return currentModuleIndex.value === moduleIndex && currentLessonIndex.value === lessonIndex
}

const hasQuiz = (sectionIndex) => {
  return course.value?.quizzes && course.value.quizzes[sectionIndex]
}

// Load course data on mount
onMounted(() => {
  loadCourse()
})

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadCourse()
    }
  }
)
</script>

<style>
.prose {
  max-width: none;
}
.prose pre {
  background-color: #1a1a1a;
  color: #e5e5e5;
  padding: 1rem;
  border-radius: 0.375rem;
}
.prose code {
  color: #e5e5e5;
  background-color: #1a1a1a;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}
.prose h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}
.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}
.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
}
.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.prose li {
  margin-bottom: 0.5rem;
}

/* Dark mode styles */
.dark .prose h1,
.dark .prose h2 {
  color: #e5e5e5;
}
.dark .prose p,
.dark .prose li {
  color: #d1d5db;
}
</style>
