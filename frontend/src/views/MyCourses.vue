<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">My Courses</h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Manage and track your created courses</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <router-link
            to="/create-course"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fas fa-plus -ml-1 mr-2"></i>
            Create New Course
          </router-link>
        </div>
      </div>

      <div class="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div v-if="loading" class="text-center py-12">
          <div class="spinner"></div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading your courses...</p>
        </div>

        <div v-else-if="userCourses.length === 0" class="text-center py-12">
          <div class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
            <i class="fas fa-book-open text-4xl"></i>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new course</p>
          <div class="mt-6">
            <router-link
              to="/create-course"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i class="fas fa-plus -ml-1 mr-2"></i>
              Create New Course
            </router-link>
          </div>
        </div>

        <div v-else>
          <div class="border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between p-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {{ userCourses.length }} {{ userCourses.length === 1 ? 'Course' : 'Courses' }}
              </h3>
            </div>
            <div class="mt-3 sm:mt-0 sm:ml-4">
              <div class="flex rounded-md shadow-sm">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search courses..."
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                >
              </div>
            </div>
          </div>

          <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" class="py-3 px-6">Course</th>
                  <th scope="col" class="py-3 px-6">Instructor</th>
                  <th scope="col" class="py-3 px-6">Created Date</th>
                  <th scope="col" class="py-3 px-6">Duration</th>
                  <th scope="col" class="py-3 px-6">Level</th>
                  <th scope="col" class="py-3 px-6">Enrolled</th>
                  <th scope="col" class="py-3 px-6">Status</th>
                  <th scope="col" class="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in filteredCourses" :key="course.id" 
                    class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="py-4 px-6">
                    <div class="text-sm font-medium text-blue-600 dark:text-blue-400">{{ course.title }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ course.category }}</div>
                  </td>
                  <td class="py-4 px-6 text-gray-900 dark:text-gray-300">{{ course.instructor || 'Unknown' }}</td>
                  <td class="py-4 px-6 text-gray-900 dark:text-gray-300">{{ formatDate(course.createdAt) }}</td>
                  <td class="py-4 px-6 text-gray-900 dark:text-gray-300">{{ course.duration || 0 }} hours</td>
                  <td class="py-4 px-6 text-gray-900 dark:text-gray-300">{{ course.difficulty }}</td>
                  <td class="py-4 px-6 text-gray-900 dark:text-gray-300">{{ course.enrolledCount || 0 }} students</td>
                  <td class="py-4 px-6">
                    <span :class="[getStatusClass(course.status), 
                          'px-2 py-1 text-xs font-semibold rounded-full']">
                      {{ course.status }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <div class="flex justify-end space-x-2">
                      <button @click="editCourse(course.id)" 
                              class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="previewCourse(course.id)" 
                              class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="deleteCourse(course.id)" 
                              class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courses'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const loading = ref(true)

const userCourses = computed(() => {
  // Combine user created courses and enrolled courses
  const created = courseStore.getUserCourses || []
  const enrolled = courseStore.getEnrolledCourses || []
  
  // Create a Map to deduplicate courses by ID
  const coursesMap = new Map()
  
  // Add created courses
  created.forEach(course => {
    coursesMap.set(course.id, { ...course, isCreator: true })
  })
  
  // Add enrolled courses
  enrolled.forEach(course => {
    if (!coursesMap.has(course.id)) {
      coursesMap.set(course.id, { ...course, isEnrolled: true })
    }
  })
  
  return Array.from(coursesMap.values())
})

const filteredCourses = computed(() => {
  return userCourses.value.filter(course => {
    const searchLower = searchQuery.value.toLowerCase()
    return (
      course.title.toLowerCase().includes(searchLower) ||
      (course.instructor?.name || '').toLowerCase().includes(searchLower) ||
      (course.category || '').toLowerCase().includes(searchLower)
    )
  })
})

function formatDate(date) {
  if (!date) return 'Invalid Date'
  // Handle Firebase Timestamp
  if (date && typeof date.toDate === 'function') {
    date = date.toDate()
  }
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function editCourse(courseId) {
  router.push(`/edit-course/${courseId}`)
}

function previewCourse(courseId) {
  router.push(`/course/${courseId}`)
}

function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

function deleteCourse(courseId) {
  if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
    try {
      courseStore.deleteCourse(courseId)
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }
}

onMounted(async () => {
  try {
    if (!authStore.user) {
      await authStore.initializeAuth()
    }
    
    if (!authStore.user) {
      console.error('No authenticated user')
      router.push('/login')
      return
    }

    console.log('Current user ID:', authStore.user.uid)
    loading.value = true

    try {
      // Fix existing courses first
      await courseStore.fixExistingCourses()
      console.log('Courses fixed')
      
      // Fetch both user created and enrolled courses
      await Promise.all([
        courseStore.fetchUserCourses(authStore.user.uid),
        courseStore.fetchEnrolledCourses(authStore.user.uid)
      ])
      console.log('All courses fetched')
    } catch (error) {
      console.error('Error in course operations:', error)
    } finally {
      loading.value = false
    }
  } catch (error) {
    console.error('Error in component initialization:', error)
    loading.value = false
  }
})
</script>

<style scoped>
.spinner {
  @apply w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto;
}
</style>
