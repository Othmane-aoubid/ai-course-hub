<template>
  <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">Student Activity</h3>
      <div class="flex space-x-2">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="[
            'px-3 py-1 rounded-lg text-sm transition-all duration-200',
            currentFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-[#2a3241] text-gray-400 hover:bg-[#313b4d]'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingActivity" class="h-64 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="activityError" class="h-64 flex items-center justify-center text-red-400">
      <font-awesome-icon icon="exclamation-circle" class="mr-2" />
      {{ activityError }}
    </div>

    <!-- Data Display -->
    <div v-else class="space-y-6">
      <!-- Activity Summary -->
      <div class="grid grid-cols-2 gap-4">
        <div 
          v-for="(value, key) in activitySummary" 
          :key="key"
          class="bg-[#2a3241] rounded-lg p-4"
        >
          <p class="text-sm text-gray-400">{{ formatSummaryKey(key) }}</p>
          <p class="text-2xl font-bold text-white mt-1">{{ value }}</p>
          <p class="text-sm text-blue-400 mt-1">
            Last 30 days
          </p>
        </div>
      </div>

      <!-- Recent Activities List -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-400">Recent Activities</h4>
        <div class="space-y-3">
          <div 
            v-for="activity in filteredActivities" 
            :key="activity.id"
            class="bg-[#2a3241] rounded-lg p-4 flex items-start space-x-4"
          >
            <!-- Activity Icon -->
            <div class="rounded-full bg-[#313b4d] p-2">
              <font-awesome-icon 
                :icon="getActivityIcon(activity.type)"
                class="text-blue-400"
              />
            </div>
            
            <!-- Activity Details -->
            <div class="flex-1">
              <p class="text-white">{{ formatActivityTitle(activity) }}</p>
              <p class="text-sm text-gray-400 mt-1">{{ formatActivityTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { storeToRefs } from 'pinia'
import { formatDistanceToNow } from 'date-fns'

export default {
  name: 'StudentActivityCard',
  
  setup() {
    const analyticsStore = useAnalyticsStore()
    const { isLoadingActivity, activityError, recentActivities, activitySummary } = storeToRefs(analyticsStore)
    
    const currentFilter = ref('all')
    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Course', value: 'course_access' },
      { label: 'Content', value: 'content_interaction' },
      { label: 'Assessment', value: 'assessment' },
      { label: 'Discussion', value: 'discussion' }
    ]

    const filteredActivities = computed(() => {
      if (!recentActivities.value) return []
      return currentFilter.value === 'all'
        ? recentActivities.value
        : recentActivities.value.filter(activity => activity.type === currentFilter.value)
    })

    const getActivityIcon = (type) => {
      const icons = {
        course_access: 'book',
        content_interaction: 'play-circle',
        assessment: 'tasks',
        discussion: 'comments'
      }
      return icons[type] || 'circle'
    }

    const formatActivityTitle = (activity) => {
      if (!activity) return 'Unknown activity'
      
      switch (activity.type) {
        case 'course_access':
          return `Accessed ${activity.courseName || 'course'}`
        case 'content_interaction':
          return `${activity.action || 'Interacted with'} ${activity.contentType || 'content'} in ${activity.courseName || 'course'}`
        case 'assessment':
          return `${activity.action || 'Attempted'} ${activity.assessmentType || 'assessment'} in ${activity.courseName || 'course'}`
        case 'discussion':
          return `${activity.action || 'Participated'} in discussion forum`
        default:
          return 'Unknown activity'
      }
    }

    const formatActivityTime = (timestamp) => {
      if (!timestamp) return ''
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    }

    const formatSummaryKey = (key) => {
      if (!key) return ''
      return key
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    // Fetch initial data
    onMounted(() => {
      analyticsStore.fetchStudentActivity()
    })

    return {
      currentFilter,
      filters,
      isLoadingActivity,
      activityError,
      activitySummary: computed(() => activitySummary.value || {}),
      filteredActivities,
      getActivityIcon,
      formatActivityTitle,
      formatActivityTime,
      formatSummaryKey
    }
  }
}
</script>
