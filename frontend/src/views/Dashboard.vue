<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Welcome Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <i class="fas fa-chart-pie text-blue-600 text-xl"></i>
            </div>
            <div class="ml-5">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back, {{ authStore.user?.displayName || authStore.user?.email }}</h2>
              <p class="mt-1 text-gray-500 dark:text-gray-400">Here's what's happening with your courses</p>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Courses -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
                <i class="fas fa-book text-blue-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ courseStore.userCourses.length }}</p>
              </div>
            </div>
          </div>

          <!-- Course Progress -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
                <i class="fas fa-chart-line text-green-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Average Progress</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ averageProgress }}%</p>
              </div>
            </div>
          </div>

          <!-- Total Learning Hours -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                <i class="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Hours</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalLearningHours }}</p>
              </div>
            </div>
          </div>

          <!-- Completed Courses -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-full p-3">
                <i class="fas fa-check-circle text-purple-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ completedCourses }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Learning Progress -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Learning Progress</h3>
            <div class="space-y-4">
              <!-- Current Week Progress -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">This Week's Progress</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ weeklyProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: weeklyProgress + '%' }"></div>
                </div>
              </div>

              <!-- Course Completion Rate -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ completionRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: completionRate + '%' }"></div>
                </div>
              </div>

              <!-- Active Learning Days -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Learning Days</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ activeLearningDays }} days</span>
              </div>

              <!-- Average Daily Study Time -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Daily Study Time</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ avgDailyStudyTime }} hours</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div v-for="(activity, index) in recentActivities" :key="index" class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 mt-2 rounded-full" :class="getActivityColor(activity.type)"></div>
                </div>
                <div>
                  <p class="text-sm text-gray-900 dark:text-white">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatActivityTime(activity.timestamp) }}</p>
                </div>
              </div>
              <div v-if="recentActivities.length === 0" class="text-center py-4">
                <p class="text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Progress Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Learning Progress</h3>
            <!-- Add your chart component here -->
            <div class="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg"></div>
          </div>

          <!-- Activity Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <!-- Add your chart component here -->
            <div class="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>

        <!-- Recent Courses -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Courses</h3>
              <router-link
                to="/browse-courses"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 text-sm font-medium"
              >
                View all
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="courseStore.userCourses.length === 0" class="text-center py-8">
              <i class="fas fa-book-open text-gray-400 dark:text-gray-600 text-4xl mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400">No courses yet. Start learning by enrolling in a course!</p>
              <router-link
                to="/browse-courses"
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-900"
              >
                Browse Courses
              </router-link>
            </div>
            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="course in courseStore.userCourses.slice(0, 5)"
                :key="course.id"
                class="py-4 flex items-center justify-between"
              >
                <div class="flex items-center">
                  <img
                    :src="course.thumbnail || '/default-course.png'"
                    class="h-12 w-12 rounded-lg object-cover"
                    alt="Course thumbnail"
                  >
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ course.title }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Progress: {{ course.progress || 0 }}%</p>
                  </div>
                </div>
                <router-link
                  :to="'/course/' + course.id"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500"
                >
                  <i class="fas fa-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCourseStore } from '../stores/courses'
import { useStudyStatsStore } from '../stores/studyStats'

const authStore = useAuthStore()
const courseStore = useCourseStore()
const studyStatsStore = useStudyStatsStore()

const averageProgress = computed(() => {
  if (courseStore.userCourses.length === 0) return 0
  const total = courseStore.userCourses.reduce((acc, course) => acc + (course.progress || 0), 0)
  return Math.round(total / courseStore.userCourses.length)
})

const completedCourses = computed(() => {
  return courseStore.userCourses.filter(course => course.progress === 100).length
})

const totalLearningHours = computed(() => {
  return studyStatsStore.totalLearningHours || 0
})

const weeklyProgress = computed(() => {
  const weeklyStats = studyStatsStore.weeklyProgress
  if (!weeklyStats || weeklyStats.length === 0) return 0
  
  return Math.round(weeklyStats.reduce((sum, stat) => sum + (stat.progress || 0), 0) / weeklyStats.length)
})

const activeLearningDays = computed(() => {
  return studyStatsStore.activeLearningDays || 0
})

const avgDailyStudyTime = computed(() => {
  if (activeLearningDays.value === 0) return 0
  return Math.round((totalLearningHours.value / activeLearningDays.value) * 10) / 10
})

const recentActivities = computed(() => {
  return studyStatsStore.recentActivities || []
})

const getActivityColor = (type) => {
  const colors = {
    progress: 'bg-blue-500',
    completion: 'bg-green-500',
    enrollment: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const formatActivityTime = (timestamp) => {
  if (!timestamp) return ''
  const now = new Date()
  const activityDate = new Date(timestamp)
  const diff = now - activityDate
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} minutes ago`
    }
    return `${hours} hours ago`
  } else if (days === 1) {
    return 'Yesterday'
  }
  return `${days} days ago`
}

onMounted(async () => {
  try {
    await Promise.all([
      courseStore.fetchUserCourses(authStore.user.uid),
      studyStatsStore.initializeStudyStats(authStore.user.uid)
    ])
  } catch (error) {
    console.error('Error initializing dashboard:', error)
  }
})
</script>
