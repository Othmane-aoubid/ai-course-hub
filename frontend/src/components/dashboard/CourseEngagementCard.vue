<template>
  <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">Course Engagement</h3>
      <select 
        v-model="selectedPeriod"
        class="bg-[#2a3241] text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:ring-2 focus:ring-blue-500"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingEngagement" class="h-64 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="engagementError" class="h-64 flex items-center justify-center text-red-400">
      <font-awesome-icon icon="exclamation-circle" class="mr-2" />
      {{ engagementError }}
    </div>

    <!-- Data Display -->
    <div v-else class="space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Active Students</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ engagementData.activeStudents }}
            <span class="text-sm text-gray-400">/ {{ engagementData.totalStudents }}</span>
          </p>
          <p class="text-sm mt-1" :class="activeStudentRate >= 70 ? 'text-green-400' : 'text-yellow-400'">
            {{ activeStudentRate.toFixed(1) }}% Active
          </p>
        </div>
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Completion Rate</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ engagementData.completionRate }}%
          </p>
          <p class="text-sm text-blue-400 mt-1">
            Course Progress
          </p>
        </div>
      </div>

      <!-- Engagement Chart -->
      <div class="relative h-48">
        <div v-if="isLoadingEngagement" class="absolute inset-0 flex items-center justify-center bg-[#232936] bg-opacity-75">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <div v-else-if="engagementError" class="absolute inset-0 flex items-center justify-center">
          <p class="text-red-500">{{ engagementError }}</p>
        </div>
        <canvas
          ref="engagementChart"
          class="w-full h-full"
          :style="{ visibility: isLoadingEngagement ? 'hidden' : 'visible' }"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick, onUnmounted, computed } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { storeToRefs } from 'pinia'
import Chart from 'chart.js/auto'

export default {
  name: 'CourseEngagementCard',
  
  setup() {
    const analyticsStore = useAnalyticsStore()
    const { isLoadingEngagement, engagementError, engagementData, activeStudentRate, engagementChartData } = storeToRefs(analyticsStore)
    
    const selectedPeriod = ref('weekly')
    const engagementChart = ref(null)
    const chartInstance = ref(null)

    const initializeChart = async () => {
      if (!engagementChart.value || !engagementChartData.value) return

      // Wait for next tick to ensure canvas is in the DOM
      await nextTick()

      // Ensure the canvas has proper dimensions
      const canvas = engagementChart.value
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight

      // Destroy existing chart if it exists
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const data = engagementChartData.value[selectedPeriod.value] || []

      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d.label || ''),
          datasets: [{
            label: 'Engagement',
            data: data.map(d => d.value || 0),
            borderColor: '#60A5FA',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#9CA3AF'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#9CA3AF'
              }
            }
          }
        }
      })
    }

    // Watch for changes in period or data
    watch([selectedPeriod, engagementChartData], () => {
      if (engagementChartData.value) {
        initializeChart()
      }
    })

    // Watch for window resize
    let resizeObserver
    onMounted(() => {
      analyticsStore.fetchCourseEngagement()
      
      // Create ResizeObserver to handle canvas resizing
      resizeObserver = new ResizeObserver(() => {
        if (chartInstance.value) {
          initializeChart()
        }
      })

      // Observe the parent element
      if (engagementChart.value) {
        resizeObserver.observe(engagementChart.value.parentElement)
      }
    })

    // Cleanup
    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    })

    return {
      selectedPeriod,
      engagementChart,
      isLoadingEngagement,
      engagementError,
      engagementData: computed(() => engagementData.value || {
        totalStudents: 0,
        activeStudents: 0,
        completionRate: 0
      }),
      activeStudentRate: computed(() => activeStudentRate.value || 0)
    }
  }
}
</script>
