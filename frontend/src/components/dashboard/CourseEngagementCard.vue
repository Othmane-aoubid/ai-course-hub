<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Course Engagement
      </h3>
      <div class="relative">
        <select 
          v-model="selectedTimeRange" 
          class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          @change="updateMetrics"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p class="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeStudents }}</p>
        <p class="text-xs" :class="activeStudentsChange > 0 ? 'text-green-500' : 'text-red-500'">
          {{ activeStudentsChange > 0 ? '+' : '' }}{{ activeStudentsChange }}% from last period
        </p>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p class="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ completionRate }}%</p>
        <p class="text-xs" :class="completionRateChange > 0 ? 'text-green-500' : 'text-red-500'">
          {{ completionRateChange > 0 ? '+' : '' }}{{ completionRateChange }}% from last period
        </p>
      </div>
    </div>

    <div class="h-48">
      <!-- Chart will be added here in next iteration -->
      <div class="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-gray-400 dark:text-gray-500">Engagement Chart Coming Soon</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseEngagementCard',
  data() {
    return {
      selectedTimeRange: 'week',
      activeStudents: 0,
      activeStudentsChange: 0,
      completionRate: 0,
      completionRateChange: 0,
      mockData: {
        week: {
          activeStudents: 150,
          activeStudentsChange: 5,
          completionRate: 75,
          completionRateChange: 2
        },
        month: {
          activeStudents: 450,
          activeStudentsChange: 8,
          completionRate: 70,
          completionRateChange: 3
        },
        year: {
          activeStudents: 1200,
          activeStudentsChange: 15,
          completionRate: 68,
          completionRateChange: -1
        }
      }
    }
  },
  methods: {
    updateMetrics() {
      const data = this.mockData[this.selectedTimeRange]
      this.activeStudents = data.activeStudents
      this.activeStudentsChange = data.activeStudentsChange
      this.completionRate = data.completionRate
      this.completionRateChange = data.completionRateChange
    }
  },
  mounted() {
    this.updateMetrics()
  }
}
</script>
