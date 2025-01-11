<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">Generated Course Preview</h3>
      <button
        @click="$emit('use-outline')"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Use This Outline
      </button>
    </div>
    
    <div class="space-y-6">
      <!-- Course Overview -->
      <div v-if="course.overview" class="prose max-w-none">
        <h4 class="text-md font-medium text-gray-900">Course Overview</h4>
        <div class="mt-2 p-4 bg-white rounded-lg border border-gray-200">
          <p class="text-gray-600 whitespace-pre-line">{{ course.overview }}</p>
        </div>
      </div>

      <!-- Course Sections -->
      <div class="space-y-4">
        <h4 class="text-md font-medium text-gray-900">Course Sections</h4>
        <div v-for="(section, index) in course.sections" 
             :key="index"
             class="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-300 transition-colors duration-200">
          <div class="flex items-center space-x-3 mb-4">
            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold">
              {{ index + 1 }}
            </span>
            <h5 class="font-medium text-gray-900">{{ section.title }}</h5>
          </div>
          
          <!-- Section Content -->
          <div class="pl-11"> <!-- Aligned with section title -->
            <!-- Overview -->
            <div v-if="section.overview" class="mb-4">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Overview:</h6>
              <p class="text-gray-600">{{ section.overview }}</p>
            </div>
            
            <!-- Learning Objectives -->
            <div v-if="section.objectives?.length" class="mb-4">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h6>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="objective in section.objectives" 
                    :key="objective" 
                    class="text-gray-600">
                  {{ objective }}
                </li>
              </ul>
            </div>
            
            <!-- Content -->
            <div v-if="section.content" class="mb-4">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Key Topics:</h6>
              <div class="pl-4">
                <template v-if="Array.isArray(section.content)">
                  <ul class="list-disc space-y-1">
                    <li v-for="(item, i) in section.content" 
                        :key="i" 
                        class="text-gray-600">
                      {{ item }}
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <p class="text-gray-600 whitespace-pre-line">{{ section.content }}</p>
                </template>
              </div>
            </div>

            <!-- Resources -->
            <div v-if="section.resources?.length" class="mb-4">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Additional Resources:</h6>
              <ul class="space-y-2">
                <li v-for="resource in section.resources" 
                    :key="resource.id"
                    class="flex items-center space-x-2 text-gray-600">
                  <i class="fas fa-external-link-alt text-primary-500"></i>
                  <a :href="resource.url" 
                     target="_blank"
                     class="text-primary-600 hover:text-primary-800">
                    {{ resource.title }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Key Terms -->
            <div v-if="section.keyTerms?.length">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Key Terms:</h6>
              <div class="grid grid-cols-1 gap-3">
                <div v-for="term in section.keyTerms" 
                     :key="term.term"
                     class="bg-gray-50 p-3 rounded-lg">
                  <span class="font-medium text-gray-900">{{ term.term }}:</span>
                  <span class="text-gray-600 ml-2">{{ term.definition }}</span>
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
defineProps({
  course: {
    type: Object,
    required: true
  }
})

defineEmits(['use-outline'])
</script>

<style scoped>
.prose {
  max-width: none;
}
</style>
