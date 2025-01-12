<template>
  <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">Video Analytics</h3>
      <select 
        v-model="selectedVideo"
        class="bg-[#2a3241] text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Video</option>
        <option v-for="video in courseVideos" :key="video.id" :value="video.id">
          {{ video.title }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="h-64 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="h-64 flex items-center justify-center text-red-400">
      <font-awesome-icon icon="exclamation-circle" class="mr-2" />
      {{ error }}
    </div>

    <!-- No Video Selected -->
    <div v-else-if="!selectedVideo" class="h-64 flex items-center justify-center text-gray-400">
      Select a video to view analytics
    </div>

    <!-- Data Display -->
    <div v-else class="space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Total Views</p>
          <p class="text-2xl font-bold text-white mt-1">{{ analytics.totalViews }}</p>
        </div>
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Completion Rate</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ ((analytics.completions / analytics.totalViews) * 100).toFixed(1) }}%
          </p>
        </div>
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Avg. Watch Time</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ formatTime(analytics.averageWatchTime) }}
          </p>
        </div>
      </div>

      <!-- Drop-off Chart -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-400">Viewer Drop-off Points</h4>
        <div class="h-48">
          <canvas ref="dropOffChart"></canvas>
        </div>
      </div>

      <!-- Playback Speed Distribution -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-400">Playback Speed Distribution</h4>
        <div class="grid grid-cols-5 gap-2">
          <div 
            v-for="(count, speed) in playbackDistribution" 
            :key="speed"
            class="bg-[#2a3241] rounded-lg p-3 text-center"
          >
            <p class="text-sm text-gray-400">{{ speed }}x</p>
            <p class="text-lg font-semibold text-white">{{ count }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { progressTrackingService } from '@/services/progressTracking'
import Chart from 'chart.js/auto'

export default {
  name: 'VideoAnalyticsCard',
  
  props: {
    courseId: {
      type: String,
      required: true
    },
    courseVideos: {
      type: Array,
      required: true
    }
  },

  setup(props) {
    const selectedVideo = ref('')
    const loading = ref(false)
    const error = ref(null)
    const analytics = ref({
      totalViews: 0,
      completions: 0,
      averageWatchTime: 0,
      dropOffPoints: [],
      playbackRates: []
    })
    const dropOffChart = ref(null)
    const chartInstance = ref(null)

    const playbackDistribution = ref({
      '0.5': 0,
      '1.0': 0,
      '1.5': 0,
      '2.0': 0,
      '2.5': 0
    })

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const updateChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      const ctx = dropOffChart.value.getContext('2d')
      const data = analytics.value.dropOffPoints

      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(point => formatTime(point.time)),
          datasets: [{
            label: 'Viewers',
            data: data.map(point => point.count),
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
                color: '#9CA3AF',
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      })
    }

    const calculatePlaybackDistribution = () => {
      const distribution = {
        '0.5': 0,
        '1.0': 0,
        '1.5': 0,
        '2.0': 0,
        '2.5': 0
      }

      analytics.value.playbackRates.flat().forEach(rate => {
        const speed = rate.rate.toFixed(1)
        if (distribution[speed] !== undefined) {
          distribution[speed]++
        }
      })

      playbackDistribution.value = distribution
    }

    const fetchAnalytics = async () => {
      if (!selectedVideo.value) return

      loading.value = true
      error.value = null

      try {
        const response = await progressTrackingService.getVideoAnalytics(
          props.courseId,
          selectedVideo.value
        )
        analytics.value = response.data
        calculatePlaybackDistribution()
        updateChart()
      } catch (err) {
        error.value = 'Failed to fetch video analytics'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    watch(selectedVideo, fetchAnalytics)

    return {
      selectedVideo,
      loading,
      error,
      analytics,
      dropOffChart,
      playbackDistribution,
      formatTime
    }
  }
}
</script>
