<template>
  <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">Student Progress</h3>
      <select 
        v-if="students.length > 0"
        v-model="selectedStudent"
        class="bg-[#2a3241] text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Class Overview</option>
        <option v-for="student in students" :key="student.id" :value="student.id">
          {{ student.name }}
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

    <!-- Individual Student View -->
    <div v-else-if="selectedStudent && studentProgress" class="space-y-6">
      <!-- Overall Progress -->
      <div class="bg-[#2a3241] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Overall Progress</p>
            <p class="text-2xl font-bold text-white mt-1">
              {{ studentProgress.overallProgress }}%
            </p>
          </div>
          <div class="w-24 h-24">
            <canvas ref="progressChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-400">Recent Achievements</h4>
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="achievement in studentProgress.achievements.slice(0, 4)" 
            :key="achievement.title"
            class="bg-[#2a3241] rounded-lg p-4 flex items-center space-x-3"
          >
            <div class="rounded-full bg-[#313b4d] p-2">
              <font-awesome-icon 
                :icon="achievement.icon || 'trophy'"
                class="text-yellow-400"
              />
            </div>
            <div>
              <p class="text-white text-sm">{{ achievement.title }}</p>
              <p class="text-xs text-gray-400">{{ achievement.type }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Progress -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-400">Skills Development</h4>
        <div class="space-y-3">
          <div 
            v-for="skill in studentProgress.skills" 
            :key="skill.name"
            class="bg-[#2a3241] rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="text-white">{{ skill.name }}</p>
              <p class="text-sm" :class="getTrendColor(skill.trend)">
                <font-awesome-icon :icon="getTrendIcon(skill.trend)" class="mr-1" />
                {{ skill.trend }}
              </p>
            </div>
            <div class="w-full bg-[#313b4d] rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full"
                :style="{ width: `${skill.level}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Overview -->
    <div v-else-if="classMetrics" class="space-y-6">
      <!-- Class Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Students</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ classMetrics.completionStats.totalStudents }}
          </p>
        </div>
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Avg. Completion</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ classMetrics.completionStats.averageCompletion }}%
          </p>
        </div>
        <div class="bg-[#2a3241] rounded-lg p-4">
          <p class="text-sm text-gray-400">Active Today</p>
          <p class="text-2xl font-bold text-white mt-1">
            {{ getActiveTodayCount() }}
          </p>
        </div>
      </div>

      <!-- Skill Distribution -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-400">Class Skill Distribution</h4>
        <div class="space-y-4">
          <div 
            v-for="metric in classMetrics.skillMetrics" 
            :key="metric.skill"
            class="bg-[#2a3241] rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="text-white">{{ metric.skill }}</p>
              <p class="text-sm text-blue-400">
                Avg. Level: {{ metric.averageLevel }}
              </p>
            </div>
            <div class="grid grid-cols-5 gap-1 mt-2">
              <div 
                v-for="(count, level) in metric.distribution" 
                :key="level"
                class="h-20 flex flex-col items-center"
              >
                <div 
                  class="flex-1 w-full bg-[#313b4d] relative"
                  :style="{ height: `${getDistributionHeight(count, metric.distribution)}%` }"
                >
                  <div 
                    class="absolute bottom-0 w-full bg-blue-500"
                    :style="{ height: `${getDistributionHeight(count, metric.distribution)}%` }"
                  ></div>
                </div>
                <span class="text-xs text-gray-400 mt-1">{{ level }}-{{ parseInt(level) + 20 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Trends -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-gray-400">Activity Trends</h4>
        <div class="h-48">
          <canvas ref="trendChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed, nextTick, onUnmounted } from 'vue'
import { studentProgressService } from '@/services/studentProgress'
import Chart from 'chart.js/auto'

export default {
  name: 'StudentProgressCard',
  
  props: {
    courseId: {
      type: String,
      required: true
    },
    students: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    const selectedStudent = ref('')
    const loading = ref(false)
    const error = ref(null)
    const studentProgress = ref(null)
    const classMetrics = ref(null)
    const progressChart = ref(null)
    const trendChart = ref(null)
    const progressChartInstance = ref(null)
    const trendChartInstance = ref(null)

    const getTrendColor = (trend) => {
      const colors = {
        improving: 'text-green-400',
        stable: 'text-blue-400',
        declining: 'text-red-400'
      }
      return colors[trend] || 'text-gray-400'
    }

    const getTrendIcon = (trend) => {
      const icons = {
        improving: 'arrow-up',
        stable: 'equals',
        declining: 'arrow-down'
      }
      return icons[trend] || 'minus'
    }

    const getActiveTodayCount = () => {
      if (!classMetrics.value?.trends) return 0
      const today = new Date().toISOString().split('T')[0]
      const todayActivity = classMetrics.value.trends.find(t => t.date === today)
      return todayActivity?.activityCount || 0
    }

    const getDistributionHeight = (count, distribution) => {
      if (!distribution) return 0
      const max = Math.max(...Object.values(distribution))
      return max > 0 ? (count / max) * 100 : 0
    }

    const initializeProgressChart = async () => {
      if (!progressChart.value || !studentProgress.value) return

      await nextTick()

      const canvas = progressChart.value
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight

      if (progressChartInstance.value) {
        progressChartInstance.value.destroy()
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      progressChartInstance.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [
              studentProgress.value.overallProgress || 0,
              100 - (studentProgress.value.overallProgress || 0)
            ],
            backgroundColor: ['#60A5FA', '#313b4d']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '80%',
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    }

    const initializeTrendChart = async () => {
      if (!trendChart.value || !classMetrics.value?.trends) return

      await nextTick()

      const canvas = trendChart.value
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight

      if (trendChartInstance.value) {
        trendChartInstance.value.destroy()
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      trendChartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: classMetrics.value.trends.map(t => t.date || ''),
          datasets: [{
            label: 'Activity Count',
            data: classMetrics.value.trends.map(t => t.activityCount || 0),
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

    const fetchStudentProgress = async () => {
      if (!selectedStudent.value || !props.courseId) return
      
      loading.value = true
      error.value = null

      try {
        const response = await studentProgressService.getStudentProgress(
          props.courseId,
          selectedStudent.value
        )
        studentProgress.value = response.data || {
          overallProgress: 0,
          completedContent: 0,
          totalContent: 0,
          achievements: [],
          skills: []
        }
        nextTick(() => {
          initializeProgressChart()
        })
      } catch (err) {
        error.value = 'Failed to fetch student progress'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const fetchClassMetrics = async () => {
      if (!props.courseId) return
      
      loading.value = true
      error.value = null

      try {
        const response = await studentProgressService.getClassMetrics(props.courseId)
        classMetrics.value = response.data || {
          completionStats: {
            totalStudents: 0,
            completedCount: 0,
            averageCompletion: 0
          },
          skillMetrics: [],
          trends: []
        }
        nextTick(() => {
          initializeTrendChart()
        })
      } catch (err) {
        error.value = 'Failed to fetch class metrics'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    watch(selectedStudent, () => {
      if (selectedStudent.value) {
        fetchStudentProgress()
      } else {
        fetchClassMetrics()
      }
    })

    watch([progressChart, studentProgress], () => {
      if (progressChart.value && studentProgress.value) {
        nextTick(() => {
          initializeProgressChart()
        })
      }
    })

    watch([trendChart, classMetrics], () => {
      if (trendChart.value && classMetrics.value) {
        nextTick(() => {
          initializeTrendChart()
        })
      }
    })

    let progressResizeObserver
    let trendResizeObserver

    onMounted(() => {
      fetchClassMetrics()

      progressResizeObserver = new ResizeObserver(() => {
        if (progressChartInstance.value) {
          initializeProgressChart()
        }
      })

      trendResizeObserver = new ResizeObserver(() => {
        if (trendChartInstance.value) {
          initializeTrendChart()
        }
      })

      if (progressChart.value) {
        progressResizeObserver.observe(progressChart.value.parentElement)
      }
      if (trendChart.value) {
        trendResizeObserver.observe(trendChart.value.parentElement)
      }
    })

    onUnmounted(() => {
      if (progressChartInstance.value) {
        progressChartInstance.value.destroy()
      }
      if (trendChartInstance.value) {
        trendChartInstance.value.destroy()
      }
      if (progressResizeObserver) {
        progressResizeObserver.disconnect()
      }
      if (trendResizeObserver) {
        trendResizeObserver.disconnect()
      }
    })

    return {
      selectedStudent,
      loading,
      error,
      studentProgress: computed(() => studentProgress.value || {
        overallProgress: 0,
        completedContent: 0,
        totalContent: 0,
        achievements: [],
        skills: []
      }),
      classMetrics: computed(() => classMetrics.value || {
        completionStats: {
          totalStudents: 0,
          completedCount: 0,
          averageCompletion: 0
        },
        skillMetrics: [],
        trends: []
      }),
      progressChart,
      trendChart,
      getTrendColor,
      getTrendIcon,
      getActiveTodayCount,
      getDistributionHeight
    }
  }
}
</script>
