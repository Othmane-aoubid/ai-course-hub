<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
        <button
          @click="createNewCourse"
          class="btn btn-primary"
        >
          Create New Course
        </button>
      </div>

      <!-- Course List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courses"
          :key="course.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ course.title }}
            </h3>
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full',
                course.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              ]"
            >
              {{ course.status }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {{ course.description }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {{ formatDate(course.updatedAt) }}
            </span>
            <div class="space-x-2">
              <button
                @click="editCourse(course)"
                class="btn btn-secondary btn-sm"
              >
                Edit
              </button>
              <button
                @click="previewCourse(course)"
                class="btn btn-outline btn-sm"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'

const router = useRouter()
const toast = useToast()
const courses = ref([])

const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const loadCourses = async () => {
  try {
    // TODO: Implement API call to fetch courses
    // This is a placeholder for demonstration
    courses.value = [
      {
        id: 1,
        title: 'Sample Course',
        description: 'This is a sample course description.',
        status: 'draft',
        updatedAt: new Date().toISOString()
      }
    ]
  } catch (error) {
    toast.error('Failed to load courses')
    console.error('Error loading courses:', error)
  }
}

const createNewCourse = () => {
  router.push('/instructor/courses/new')
}

const editCourse = (course) => {
  router.push(`/instructor/courses/${course.id}/edit`)
}

const previewCourse = (course) => {
  router.push(`/instructor/courses/${course.id}/preview`)
}

onMounted(() => {
  loadCourses()
})
</script>
