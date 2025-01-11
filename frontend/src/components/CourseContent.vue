<template>
  <div class="course-content">
    <!-- Course Progress -->
    <div v-if="showProgress" class="mb-6">
      <div class="bg-gray-200 rounded-full h-4">
        <div
          class="bg-blue-600 h-4 rounded-full transition-all duration-500"
          :style="{ width: `${courseProgress}%` }"
        ></div>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        {{ courseProgress }}% Complete
      </p>
    </div>

    <!-- Module List -->
    <div class="space-y-4">
      <div
        v-for="module in modules"
        :key="module.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div
          class="p-4 cursor-pointer"
          :class="{
            'bg-gray-50': module.status === 'locked',
            'bg-green-50': module.status === 'completed'
          }"
          @click="toggleModule(module.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <!-- Status Icon -->
              <span v-if="module.status === 'locked'" class="text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <span v-else-if="module.status === 'completed'" class="text-green-500">
                <i class="fas fa-check-circle"></i>
              </span>
              <span v-else class="text-blue-500">
                <i class="fas fa-book-open"></i>
              </span>

              <h3 class="text-lg font-medium">{{ module.title }}</h3>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                {{ module.duration }} mins
              </span>
              <i
                class="fas"
                :class="expandedModules[module.id] ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </div>
          </div>
        </div>

        <!-- Module Content -->
        <div v-if="expandedModules[module.id]" class="p-4 border-t">
          <p class="text-gray-600 mb-4">{{ module.description }}</p>

          <!-- Module Resources -->
          <div v-if="module.resources?.length" class="mt-4">
            <h4 class="font-medium mb-2">Resources</h4>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="resource in module.resources"
                :key="resource.id"
                class="text-blue-600 hover:underline cursor-pointer"
                @click="openResource(resource)"
              >
                {{ resource.title }}
              </li>
            </ul>
          </div>

          <!-- Module Quiz -->
          <div v-if="module.quiz" class="mt-4">
            <button
              class="btn btn-primary"
              @click="startQuiz(module.quiz)"
              :disabled="module.status === 'locked'"
            >
              Take Quiz
            </button>
          </div>

          <!-- Module Assignments -->
          <div v-if="module.assignments?.length" class="mt-4">
            <h4 class="font-medium mb-2">Assignments</h4>
            <ul class="space-y-2">
              <li
                v-for="assignment in module.assignments"
                :key="assignment.id"
                class="flex items-center justify-between"
              >
                <span>{{ assignment.title }}</span>
                <button
                  class="btn btn-secondary btn-sm"
                  @click="viewAssignment(assignment)"
                  :disabled="module.status === 'locked'"
                >
                  View
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modules: {
    type: Array,
    required: true
  },
  showProgress: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const expandedModules = ref({})

// Calculate overall course progress
const courseProgress = computed(() => {
  const completedModules = props.modules.filter(m => m.status === 'completed').length
  return Math.round((completedModules / props.modules.length) * 100)
})

// Toggle module expansion
const toggleModule = (moduleId) => {
  expandedModules.value[moduleId] = !expandedModules.value[moduleId]
}

// Handle resource click
const openResource = (resource) => {
  if (resource.type === 'link') {
    window.open(resource.url, '_blank')
  } else if (resource.type === 'pdf') {
    // Handle PDF viewing
    router.push(`/resource/${resource.id}`)
  }
}

// Start quiz for a module
const startQuiz = (quiz) => {
  router.push(`/quiz/${quiz.id}`)
}

// View assignment details
const viewAssignment = (assignment) => {
  router.push(`/assignment/${assignment.id}`)
}
</script>

<style scoped>
.course-content {
  @apply max-w-4xl mx-auto p-4;
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}

.btn-sm {
  @apply px-3 py-1 text-sm;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
