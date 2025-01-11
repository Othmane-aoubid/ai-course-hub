<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div v-if="loading" class="text-center">
      <div class="spinner"></div>
      <p class="mt-2 text-sm text-gray-500">Loading course...</p>
    </div>

    <div v-else-if="!courseData" class="text-center">
      <p class="text-gray-500">Course not found</p>
      <button @click="router.push('/my-courses')" class="mt-4 text-blue-600 hover:text-blue-800">
        Return to My Courses
      </button>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Course
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="handleSubmit"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
        <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Course Information</h3>
              <p class="mt-1 text-sm text-gray-500">
                Update your course details and content.
              </p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-4">
                  <label class="block text-sm font-medium text-gray-700">Course Title</label>
                  <input
                    type="text"
                    v-model="courseData.title"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    v-model="courseData.category"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700">Difficulty Level</label>
                  <select
                    v-model="courseData.difficulty"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option v-for="level in difficultyLevels" :key="level" :value="level">
                      {{ level }}
                    </option>
                  </select>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700">Duration (hours)</label>
                  <input
                    type="number"
                    v-model.number="courseData.duration"
                    min="0"
                    step="0.5"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    v-model="courseData.status"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div class="col-span-6">
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="courseData.description"
                    rows="3"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Course Content</h3>
              <p class="mt-1 text-sm text-gray-500">
                Organize your course content into sections.
              </p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="space-y-4">
                <div v-for="(section, index) in courseData.sections" :key="index" class="border rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <input
                      v-model="section.title"
                      type="text"
                      placeholder="Section Title"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      @click="removeSection(index)"
                      class="ml-2 text-red-600 hover:text-red-800"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  <textarea
                    v-model="section.content"
                    rows="3"
                    placeholder="Section Content"
                    class="block w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                <button
                  type="button"
                  @click="addSection"
                  class="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500"
                >
                  Add New Section
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseStore } from '../stores/courses'

const router = useRouter()
const route = useRoute()
const courseStore = useCourseStore()
const loading = ref(true)
const courseData = ref(null)

const categories = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Personal Development',
  'Other'
]

const difficultyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced'
]

function addSection() {
  if (!courseData.value) return
  courseData.value.sections.push({
    title: '',
    content: ''
  })
}

function removeSection(index) {
  if (!courseData.value) return
  courseData.value.sections.splice(index, 1)
}

async function handleSubmit() {
  if (!courseData.value) return

  try {
    await courseStore.updateCourse(courseData.value.id, courseData.value)
    router.push('/my-courses')
  } catch (error) {
    console.error('Error updating course:', error)
  }
}

onMounted(async () => {
  const courseId = route.params.id
  if (!courseId) {
    router.push('/my-courses')
    return
  }

  try {
    loading.value = true
    await courseStore.fetchCourseById(courseId)
    courseData.value = { ...courseStore.getCurrentCourse }
    
    if (!courseData.value) {
      router.push('/my-courses')
    }
  } catch (error) {
    console.error('Error fetching course:', error)
    router.push('/my-courses')
  } finally {
    loading.value = false
  }
})
</script>
