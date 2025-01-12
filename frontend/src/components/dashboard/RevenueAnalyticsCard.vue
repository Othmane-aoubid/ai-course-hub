<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Revenue Analytics
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
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalRevenue }}</p>
        <p class="text-xs" :class="revenueChange > 0 ? 'text-green-500' : 'text-red-500'">
          {{ revenueChange > 0 ? '+' : '' }}{{ revenueChange }}% from last period
        </p>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p class="text-sm text-gray-500 dark:text-gray-400">Average Course Price</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ avgCoursePrice }}</p>
        <p class="text-xs text-gray-500">
          {{ totalSales }} sales
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Performing Courses</h4>
        <div class="space-y-2">
          <div v-for="course in topCourses" :key="course.id" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ course.name }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">${{ course.revenue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevenueAnalyticsCard',
  data() {
    return {
      selectedTimeRange: 'week',
      totalRevenue: 0,
      revenueChange: 0,
      avgCoursePrice: 0,
      totalSales: 0,
      topCourses: [],
      mockData: {
        week: {
          totalRevenue: 1250,
          revenueChange: 8,
          avgCoursePrice: 49.99,
          totalSales: 25,
          topCourses: [
            { id: 1, name: 'Web Development Basics', revenue: 499 },
            { id: 2, name: 'Advanced JavaScript', revenue: 399 },
            { id: 3, name: 'Python for Beginners', revenue: 352 }
          ]
        },
        month: {
          totalRevenue: 5250,
          revenueChange: 12,
          avgCoursePrice: 52.99,
          totalSales: 99,
          topCourses: [
            { id: 1, name: 'Web Development Basics', revenue: 1499 },
            { id: 2, name: 'Advanced JavaScript', revenue: 1299 },
            { id: 3, name: 'Python for Beginners', revenue: 1052 }
          ]
        },
        year: {
          totalRevenue: 62500,
          revenueChange: 25,
          avgCoursePrice: 54.99,
          totalSales: 1137,
          topCourses: [
            { id: 1, name: 'Web Development Basics', revenue: 15499 },
            { id: 2, name: 'Advanced JavaScript', revenue: 12999 },
            { id: 3, name: 'Python for Beginners', revenue: 10522 }
          ]
        }
      }
    }
  },
  methods: {
    updateMetrics() {
      const data = this.mockData[this.selectedTimeRange]
      this.totalRevenue = data.totalRevenue
      this.revenueChange = data.revenueChange
      this.avgCoursePrice = data.avgCoursePrice
      this.totalSales = data.totalSales
      this.topCourses = data.topCourses
    }
  },
  mounted() {
    this.updateMetrics()
  }
}
</script>
