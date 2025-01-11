<template>
  <div class="course-view dark:bg-gray-800">
    <div v-if="loading" class="text-center py-12">
      <div class="spinner"></div>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading course...</p>
    </div>

    <div v-else>
      <!-- Course Header -->
      <div class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ course.title }}
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                {{ course.shortDescription }}
              </p>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Created by {{ course.instructor.name }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm text-gray-500 dark:text-gray-400">Estimated Time</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ course.estimatedHours }} hours
                </p>
              </div>
              <button
                v-if="!isEnrolled"
                class="btn btn-primary"
                @click="enrollInCourse"
              >
                Enroll Now
              </button>
              <button
                v-else
                class="btn btn-primary"
                @click="startLearning"
              >
                {{ buttonText }}
                <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Content Section -->
      <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <nav class="flex space-x-4 mb-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="px-3 py-2 text-sm font-medium rounded-md"
                :class="[
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
                @click="activeTab = tab.id"
              >
                {{ tab.name }}
              </button>
            </nav>

            <!-- Tab Content -->
            <div v-if="activeTab === 'content'">
              <CourseContent
                :modules="course.modules"
                :showProgress="true"
                @module-completed="handleModuleCompleted"
              />
            </div>

            <div v-else-if="activeTab === 'overview'" class="prose max-w-none">
              <div v-html="course.description"></div>
            </div>

            <div v-else-if="activeTab === 'reviews'">
              <CourseReviews
                :reviews="course.reviews"
                @new-review="handleNewReview"
              />
            </div>
          </div>

          <!-- Sidebar -->
          <div class="mt-8 lg:mt-0">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Course Progress
              </h3>
              
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">Completion</span>
                    <span class="font-medium">{{ courseProgress }}%</span>
                  </div>
                  <div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-blue-600 dark:bg-blue-300 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${courseProgress}%` }"
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Quick Stats</h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">Modules Completed</span>
                      <span class="font-medium">
                        {{ completedModules }}/{{ course?.modules?.length || 0 }}
                      </span>
                    </li>
                    <li class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">Time Spent</span>
                      <span class="font-medium">{{ timeSpent }} hrs</span>
                    </li>
                    <li class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">Quizzes Passed</span>
                      <span class="font-medium">
                        {{ passedQuizzes }}/{{ totalQuizzes }}
                      </span>
                    </li>
                  </ul>
                </div>

                <div v-if="nextModule">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Next Up</h4>
                  <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ nextModule.title }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ nextModule.duration }} mins
                    </p>
                    <button
                      class="btn btn-primary w-full mt-3"
                      @click="startNextModule"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courses'
import { useAuthStore } from '../stores/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import CourseContent from '../components/CourseContent.vue'
import CourseReviews from '../components/CourseReviews.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

const loading = ref(true)
const course = ref(null)
const activeTab = ref('content')
const hasStarted = ref(false)

const tabs = [
  { id: 'content', name: 'Course Content' },
  { id: 'overview', name: 'Overview' },
  { id: 'reviews', name: 'Reviews' }
]

// Computed properties
const isEnrolled = computed(() => {
  if (!course.value || !authStore.user) return false
  return course.value.enrolledStudents?.includes(authStore.user.uid)
})

const buttonText = computed(() => {
  if (!isEnrolled.value) return 'Enroll Now'
  return hasStarted.value ? 'Continue Learning' : 'Start Learning'
})

const courseProgress = computed(() => {
  if (!course.value?.modules) return 0
  const completed = course.value.modules.filter(m => m.status === 'completed').length
  return Math.round((completed / course.value.modules.length) * 100)
})

const completedModules = computed(() => {
  if (!course.value?.modules) return 0
  return course.value.modules.filter(m => m.status === 'completed').length
})

const timeSpent = computed(() => {
  if (!course.value?.progress?.timeSpent) return 0
  return Math.round(course.value.progress.timeSpent / 60)
})

const totalQuizzes = computed(() => {
  if (!course.value?.modules) return 0
  return course.value.modules.filter(m => m.quiz).length
})

const passedQuizzes = computed(() => {
  if (!course.value?.progress?.passedQuizzes) return 0
  return course.value.progress.passedQuizzes
})

const nextModule = computed(() => {
  if (!course.value?.modules) return null
  return course.value.modules.find(m => m.status !== 'completed')
})

// Methods
const loadCourse = async () => {
  try {
    loading.value = true
    const courseData = await courseStore.fetchCourseById(route.params.id)
    course.value = courseData

    // Check enrollment status and progress
    if (authStore.user && isEnrolled.value) {
      const enrollmentQuery = query(
        collection(db, 'enrollments'),
        where('userId', '==', authStore.user.uid),
        where('courseId', '==', route.params.id)
      )
      const enrollmentSnapshot = await getDocs(enrollmentQuery)
      if (!enrollmentSnapshot.empty) {
        const enrollmentData = enrollmentSnapshot.docs[0].data()
        hasStarted.value = enrollmentData.progress > 0 || (enrollmentData.completedModules || []).length > 0
      }
    }
  } catch (error) {
    console.error('Error loading course:', error)
  } finally {
    loading.value = false
  }
}

const enrollInCourse = async () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }

  try {
    await courseStore.enrollInCourse(course.value.id)
    await loadCourse()
  } catch (error) {
    console.error('Error enrolling in course:', error)
  }
}

const startLearning = () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  router.push(`/course/${route.params.id}/learn`)
}

const handleModuleCompleted = async (moduleId) => {
  try {
    await courseStore.markModuleCompleted(course.value.id, moduleId)
    await loadCourse()
  } catch (error) {
    console.error('Error marking module as completed:', error)
  }
}

const startNextModule = () => {
  if (nextModule.value) {
    activeTab.value = 'content'
    const moduleElement = document.getElementById(`module-${nextModule.value.id}`)
    if (moduleElement) {
      moduleElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const handleNewReview = async (review) => {
  try {
    await courseStore.addReview(course.value.id, review)
    await loadCourse()
  } catch (error) {
    console.error('Error adding review:', error)
  }
}

// Load course data on mount
onMounted(loadCourse)
</script>

<style scoped>
.course-view {
  @apply min-h-screen bg-gray-50 dark:bg-gray-800;
}

.spinner {
  @apply w-12 h-12 border-4 border-blue-200 rounded-full;
  border-top-color: theme('colors.blue.600');
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-300 dark:hover:bg-blue-400;
}

.prose {
  @apply text-gray-600 dark:text-gray-300;
}

.prose h2 {
  @apply text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-4;
}

.prose p {
  @apply mb-4;
}

.prose ul {
  @apply list-disc list-inside mb-4;
}
</style>
