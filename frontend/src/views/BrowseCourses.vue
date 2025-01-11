<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <Toast ref="toast" />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Browse Courses</h1>
        <router-link
          to="/create-course"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Course
        </router-link>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="course in filteredCourses" :key="course.id" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
          <div class="relative h-48 w-full">
            <img
              :src="course.imageUrl || '/default-course.png'"
              :alt="course.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <label class="cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                Update Image
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="(e) => handleImageUpdate(e, course.id)"
                />
              </label>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span
                  :class="getDifficultyClass(course.difficulty)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ course.difficulty }}
                </span>
                <span class="text-gray-600 dark:text-gray-400 text-sm">{{ course.duration }}</span>
              </div>
              <h3 class="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{{ course.title }}</h3>
              <p class="mt-2 text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{{ course.description }}</p>
              <div class="mt-4 flex items-center">
                <img
                  :src="course.imageUrl || '/default-avatar.png'"
                  class="h-8 w-8 rounded-full"
                  :alt="course.imageUrl || 'Unknown Instructor'"
                />
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ course.instructor || 'Unknown Instructor' }}</span>
              </div>
            </div>
            <div class="mt-6 flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">${{ course.price }}</span>
              <button
                @click="enrollInCourse(course.id)"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ getButtonText(course.id) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredCourses.length === 0"
        class="mt-8 text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <i class="fas fa-search text-gray-400 dark:text-gray-600 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courses'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Toast from '../components/Toast.vue'

const router = useRouter()
const coursesStore = useCourseStore()
const authStore = useAuthStore()
const { allCourses } = storeToRefs(coursesStore)
const toast = ref(null)

const enrollments = ref({}) // Store enrollment status by courseId

const searchQuery = ref('')
const selectedCategories = ref([])

const categories = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Personal Development',
  'Other'
]

const filteredCourses = computed(() => {
  const allCoursesValue = allCourses.value || []
  if (!searchQuery.value && !selectedCategories.value.length) return allCoursesValue
  
  return allCoursesValue.filter(course => {
    const matchesSearch = !searchQuery.value || 
      (course.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
       course.description?.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesCategory = !selectedCategories.value.length || selectedCategories.value.includes(course.category)
    
    return matchesSearch && matchesCategory
  })
})

const getDifficultyClass = (difficulty) => {
  const classes = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return classes[difficulty] || 'bg-gray-100 text-gray-800'
}

// Check enrollment directly from Firestore
const isUserEnrolled = async (courseId) => {
  if (!authStore.user) return false
  
  if (enrollments.value[courseId] !== undefined) {
    return enrollments.value[courseId]
  }

  const enrollmentQuery = query(
    collection(db, 'enrollments'),
    where('courseId', '==', courseId),
    where('userId', '==', authStore.user.uid)
  )
  const snapshot = await getDocs(enrollmentQuery)
  enrollments.value[courseId] = !snapshot.empty
  return !snapshot.empty
}

// Computed property for button text
const getButtonText = computed(() => (courseId) => {
  return enrollments.value[courseId] ? 'Continue' : 'Enroll Now'
})

const enrollInCourse = async (courseId) => {
  try {
    if (!authStore.user) {
      toast.value.error('Please sign in to enroll in courses')
      router.push('/login')
      return
    }

    // If already enrolled, navigate to course view
    if (enrollments.value[courseId]) {
      router.push(`/course/${courseId}/learn`)
      return
    }

    await coursesStore.enrollInCourse(courseId, authStore.user.uid)
    toast.value.success('Successfully enrolled in course!')
    router.push(`/course/${courseId}/learn`)
  } catch (error) {
    console.error('Error enrolling in course:', error)
    toast.value.error(error.message || 'Failed to enroll in course. Please try again later.')
  }
}

const handleImageError = (event) => {
  event.target.src = '/default-course.png'
}

const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleImageUpdate = async (event, courseId) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    console.log('Updating image for course:', courseId)
    console.log('Original image file:', file)
    
    const imageUrl = await processImage(file)
    console.log('New image data URL:', imageUrl.substring(0, 100) + '...')
    
    await coursesStore.updateCourse(courseId, {
      imageUrl: imageUrl,
      updatedAt: new Date().toISOString()
    })
    
    // Force a refresh of the courses
    await coursesStore.fetchAllCourses()
    
    toast.value.success('Image updated successfully!')
    console.log('Image updated successfully')
  } catch (error) {
    console.error('Error updating image:', error)
    toast.value.error('Failed to update image. Please try again.')
  }
}

onMounted(async () => {
  await coursesStore.fetchAllCourses()
  // Pre-fetch enrollment status for all courses
  if (authStore.user) {
    const enrollmentQuery = query(
      collection(db, 'enrollments'),
      where('userId', '==', authStore.user.uid)
    )
    const snapshot = await getDocs(enrollmentQuery)
    snapshot.forEach(doc => {
      const data = doc.data()
      enrollments.value[data.courseId] = true
    })
  }
})
</script>
