<template>
  <div class="py-6 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Loading course...</p>
      </div>

      <template v-else-if="course">
        <!-- Course Header -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ course.title }}</h1>
                <p class="mt-2 text-gray-500 dark:text-gray-400">{{ course.description }}</p>
              </div>
              <div v-if="isInstructor" class="flex space-x-2">
                <button @click="editCourse" class="btn btn-secondary">
                  Edit Course
                </button>
                <button @click="confirmDelete" class="btn btn-danger">
                  Delete Course
                </button>
              </div>
            </div>

            <div class="mt-6 flex items-center space-x-4">
              <div class="flex items-center">
                <span class="text-gray-500 dark:text-gray-400">Category:</span>
                <span class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                  {{ course.category }}
                </span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 dark:text-gray-400">Created by:</span>
                <div class="ml-2 flex items-center">
                  <span v-if="!editingInstructor" class="text-gray-900 dark:text-white">{{ course.instructor?.name || 'Unknown Instructor' }}</span>
                  <input
                    v-else
                    v-model="editedInstructorName"
                    type="text"
                    class="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:border-[#7CC0F1] dark:focus:border-[#7CC0F1] text-gray-900 dark:text-white"
                    @keyup.enter="saveInstructorName"
                    @blur="saveInstructorName"
                  />
                  <button 
                    v-if="isInstructor && !editingInstructor" 
                    @click="startEditingInstructor" 
                    class="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Progress (for enrolled students) -->
        <div v-if="isEnrolled && !isInstructor" class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Your Progress</h2>
          <div class="mt-4">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div class="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full" 
                   :style="{ width: `${progress}%` }"></div>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ progress }}% Complete
            </p>
          </div>
        </div>

        <!-- Course Content -->
        <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Content</h2>
            
            <div class="mt-6 space-y-4">
              <div v-for="(section, index) in course.sections" 
                   :key="index"
                   class="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div class="p-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                     @click="toggleSection(index)">
                  <div class="flex items-center space-x-3">
                    <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 font-semibold">
                      {{ index + 1 }}
                    </span>
                    <h3 class="text-md font-medium text-gray-900 dark:text-white">
                      {{ section.title }}
                    </h3>
                  </div>
                  <span class="transform transition-transform duration-200"
                        :class="{ 'rotate-180': openSections[index] }">
                    <i class="fas fa-chevron-down text-gray-500 dark:text-gray-400"></i>
                  </span>
                </div>
                
                <div v-show="openSections[index]" 
                     class="p-6 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
                     :class="{ 'animate-fadeIn': openSections[index] }">
                  <!-- Section Overview -->
                  <div v-if="section.overview" class="mb-6">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Overview</h4>
                    <p class="text-gray-600 dark:text-gray-400">{{ section.overview }}</p>
                  </div>

                  <!-- Main Content -->
                  <div class="prose max-w-none">
                    <div v-if="section.content" class="space-y-4">
                      <template v-if="Array.isArray(section.content)">
                        <div v-for="(item, itemIndex) in section.content" 
                             :key="itemIndex"
                             class="ml-4">
                          <p class="text-gray-700 dark:text-gray-300">• {{ item }}</p>
                        </div>
                      </template>
                      <template v-else>
                        <div class="whitespace-pre-line text-gray-700 dark:text-gray-300">{{ section.content }}</div>
                      </template>
                    </div>
                  </div>
                  
                  <!-- Learning Objectives -->
                  <div v-if="section.objectives && section.objectives.length" class="mt-6">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                      Learning Objectives
                    </h4>
                    <ul class="space-y-2 list-disc list-inside">
                      <li v-for="objective in section.objectives" 
                          :key="objective"
                          class="text-gray-600 dark:text-gray-400">
                        {{ objective }}
                      </li>
                    </ul>
                  </div>

                  <!-- Resources -->
                  <div v-if="section.resources && section.resources.length" class="mt-6">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                      Additional Resources
                    </h4>
                    <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                      <li v-for="resource in section.resources" 
                          :key="resource.id"
                          class="py-3 flex items-center space-x-3">
                        <i class="fas fa-external-link-alt text-primary-500 dark:text-primary-400"></i>
                        <a :href="resource.url" 
                           target="_blank"
                           class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium">
                          {{ resource.title }}
                        </a>
                      </li>
                    </ul>
                  </div>

                  <!-- Key Terms -->
                  <div v-if="section.keyTerms && section.keyTerms.length" class="mt-6">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                      Key Terms
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-for="term in section.keyTerms" 
                           :key="term.term"
                           class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h5 class="font-medium text-gray-900 dark:text-white">{{ term.term }}</h5>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ term.definition }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enrollment Section -->
        <div v-if="!isEnrolled && !isInstructor" class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="text-center">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Ready to Start Learning?</h2>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              Enroll now to access all course content and track your progress.
            </p>
            <button
              @click="enrollInCourse"
              class="mt-4 btn btn-primary"
              :disabled="enrolling"
            >
              <span v-if="enrolling">Enrolling...</span>
              <span v-else>Enroll in Course</span>
            </button>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Course not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '../stores/courses'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

const course = ref(null)
const loading = ref(true)
const enrolling = ref(false)
const openSections = ref([])
const progress = ref(0)
const editingInstructor = ref(false)
const editedInstructorName = ref('')

// Make sure course.value exists before accessing instructor.id
const isInstructor = computed(() => {
  return course.value && authStore.user && course.value.instructor?.id === authStore.user.uid
})

// Use courseStore.isEnrolled method
const isEnrolled = computed(() => {
  return course.value && courseStore.isEnrolled(course.value.id)
})

onMounted(async () => {
  try {
    // First fetch the course
    course.value = await courseStore.fetchCourseById(route.params.id)
    
    // Then fetch enrolled courses if user is authenticated
    if (authStore.user) {
      await courseStore.fetchEnrolledCourses(authStore.user.uid)
      
      // Check enrollment and fetch progress if enrolled
      if (courseStore.isEnrolled(route.params.id)) {
        progress.value = await courseStore.fetchProgress(route.params.id)
      }
    }
    
    // Initialize sections array if course has sections
    if (course.value && course.value.sections) {
      openSections.value = new Array(course.value.sections.length).fill(false)
    }
  } catch (error) {
    console.error('Error fetching course:', error)
  } finally {
    loading.value = false
  }
})

const toggleSection = (index) => {
  openSections.value[index] = !openSections.value[index]
}

const enrollInCourse = async () => {
  enrolling.value = true
  try {
    await courseStore.enrollInCourse(route.params.id)
    // Refresh the page to show enrolled view
    window.location.reload()
  } catch (error) {
    console.error('Error enrolling in course:', error)
  } finally {
    enrolling.value = false
  }
}

const editCourse = () => {
  router.push(`/course/${route.params.id}/edit`)
}

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
    try {
      await courseStore.deleteCourse(route.params.id)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }
}

const startEditingInstructor = () => {
  editedInstructorName.value = course.value.instructor?.name || ''
  editingInstructor.value = true
}

const saveInstructorName = async () => {
  if (editedInstructorName.value.trim()) {
    try {
      const updatedCourse = { ...course.value }
      updatedCourse.instructor = {
        ...course.value.instructor,
        name: editedInstructorName.value.trim()
      }
      await courseStore.updateCourse(course.value.id, updatedCourse)
      course.value = updatedCourse
    } catch (error) {
      console.error('Error updating instructor name:', error)
    }
  }
  editingInstructor.value = false
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
}
</style>
