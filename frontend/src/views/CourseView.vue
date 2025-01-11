<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="spinner"></div>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading course...</p>
    </div>

    <div v-else-if="!course" class="flex flex-col items-center justify-center min-h-screen">
      <div class="text-center py-12">
        <i class="fas fa-book-reader text-6xl text-gray-400 dark:text-gray-500 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Course not found</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-300">The course you're looking for doesn't exist or has been removed.</p>
        <button 
          @click="router.push('/browse-courses')" 
          class="mt-6 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Browse Courses
        </button>
      </div>
    </div>

    <div v-else>
      <!-- Course Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-1">
              <div class="flex items-center space-x-4 mb-4">
                <span class="text-blue-200">{{ course.category }}</span>
              </div>
              <h1 class="text-4xl font-bold mb-4">{{ course.title }}</h1>
              <p class="text-xl text-blue-100 mb-6">{{ course.shortDescription }}</p>
              <div class="flex flex-wrap items-center gap-6 text-blue-100">
                <div class="flex items-center">
                  <i class="fas fa-user-tie mr-2"></i>
                  <span>{{ course.instructor.name }}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-clock mr-2"></i>
                  <span>{{ course.estimatedHours }} hours</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-users mr-2"></i>
                  <span>{{ course.enrolledCount || 0 }} enrolled</span>
                </div>
              </div>
            </div>
            <div class="mt-6 md:mt-0 md:ml-8">
              <button
                v-if="!isEnrolled"
                @click="enrollInCourse"
                class="btn btn-primary text-lg px-8 py-3"
                :disabled="loading"
              >
                Enroll Now
              </button>
              <button
                v-else
                @click="startLearning"
                class="btn btn-primary text-lg px-8 py-3"
              >
                {{ hasStarted ? 'Continue Learning' : 'Start Learning' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <!-- Course Navigation -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-6" aria-label="Course">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="[
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Content Tab -->
            <div v-if="activeTab === 'content'" class="space-y-6">
              <div v-for="(module, index) in course.modules" :key="index" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ module.title }}</h3>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ module.estimatedTime }} mins</span>
                </div>
                <p class="mt-2 text-gray-600 dark:text-gray-300">{{ module.description }}</p>
                <div class="mt-4 space-y-2">
                  <div v-for="(lesson, lessonIndex) in module.lessons" :key="lessonIndex" class="flex items-center">
                    <span class="mr-2">{{ lessonIndex + 1 }}.</span>
                    <span>{{ lesson.title }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Overview Tab -->
            <div v-else-if="activeTab === 'overview'" class="prose dark:prose-invert max-w-none">
              <div v-html="course.description"></div>
            </div>

            <!-- Reviews Tab -->
            <div v-else-if="activeTab === 'reviews'">
              <CourseReviews
                :reviews="course.reviews"
                @new-review="handleNewReview"
              />
            </div>
          </div>
        </div>

        <!-- Course Progress Sidebar -->
        <div v-if="isEnrolled" class="mt-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Progress</h3>
            <div class="space-y-4">
              <!-- Progress Bar -->
              <div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Overall Progress</span>
                  <span class="font-medium">{{ courseProgress }}%</span>
                </div>
                <div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${courseProgress}%` }"
                  ></div>
                </div>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Modules Completed</span>
                  <p class="font-medium">{{ completedModules }}/{{ course.modules?.length }}</p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Time Spent</span>
                  <p class="font-medium">{{ timeSpent }} hrs</p>
                </div>
              </div>

              <!-- Next Module -->
              <div v-if="nextModule" class="mt-6">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Continue Learning</h4>
                <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p class="font-medium text-gray-900 dark:text-white">{{ nextModule.title }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ nextModule.estimatedTime }} mins</p>
                  <button
                    @click="startLearning"
                    class="mt-3 w-full btn btn-primary"
                  >
                    Continue
                  </button>
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
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/courses'
import { collection, getDocs, where, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useToast } from 'vue-toastification'
import CourseReviews from '../components/CourseReviews.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const courseStore = useCourseStore()

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

const startLearning = async () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }

  try {
    // Check if user is enrolled
    const q = query(
      collection(db, 'enrollments'),
      where('courseId', '==', route.params.id),
      where('userId', '==', authStore.user.uid)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      // Not enrolled, show error message
      toast.error('Please enroll in the course first')
      return
    }

    // User is enrolled, proceed to course
    router.push(`/course/${route.params.id}/learn`)
  } catch (error) {
    console.error('Error checking enrollment:', error)
    toast.error('Something went wrong. Please try again.')
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
