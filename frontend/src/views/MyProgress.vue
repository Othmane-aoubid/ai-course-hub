<template>
  <div class="py-6">
    <Toast ref="toast" />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">My Learning Progress</h1>
      
      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Progress Overview -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Overall Progress</h2>
          <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ overallProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div class="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" :style="{ width: `${overallProgress}%` }"></div>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-4">
            <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Completed</h3>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ completedCourses }}</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Courses</h3>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ activeCourses }}</p>
            </div>
          </div>
        </div>

        <!-- Learning Streak -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Learning Streak</h2>
          <div class="mt-4 flex items-center space-x-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ currentStreak }} days</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div class="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" :style="{ width: `${(currentStreak/30)*100}%` }"></div>
              </div>
            </div>
            <div class="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
              <i class="fas fa-fire text-2xl text-green-600 dark:text-green-500"></i>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-7 gap-2">
            <div v-for="(day, index) in lastSevenDays" 
                 :key="index" 
                 :class="['h-8 rounded-md', day.active ? 'bg-green-500 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-700']"
                 :title="day.date">
            </div>
          </div>
        </div>

        <!-- Course Progress -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Course Progress</h2>
          </div>
          <div class="p-6">
            <div v-if="enrolledCourses.length === 0" class="text-center py-8">
              <i class="fas fa-book-reader text-gray-400 dark:text-gray-500 text-4xl mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400">No courses in progress. Start learning today!</p>
              <router-link to="/browse-courses" class="mt-4 btn btn-primary">
                Browse Courses
              </router-link>
            </div>
            <div v-else class="space-y-6">
              <div v-for="course in enrolledCourses" :key="course.id" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ course.title }}</h3>
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ course.progress }}%</span>
                </div>
                <div class="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div class="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" :style="{ width: `${course.progress}%` }"></div>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-clock text-gray-400 dark:text-gray-500"></i>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ Math.round(course.timeSpent / 60) }} hours spent
                    </span>
                  </div>
                  <router-link :to="`/course/${course.id}`" class="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-700">
                    Continue Learning
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Achievements</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div v-for="achievement in achievements" 
                   :key="achievement.id" 
                   class="text-center">
                <div :class="['mx-auto w-16 h-16 rounded-full flex items-center justify-center', 
                             achievement.unlocked ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-900']">
                  <i :class="['text-2xl', achievement.unlocked ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-400 dark:text-gray-500', achievement.icon]"></i>
                </div>
                <p class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ achievement.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ achievement.description }}</p>
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
import { useCourseStore } from '../stores/courses'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'

const router = useRouter()
const courseStore = useCourseStore()
const userStore = useUserStore()
const toast = ref(null)

const enrolledCourses = ref([])
const currentStreak = ref(0)
const lastSevenDays = ref([])
const achievements = ref([
  {
    id: 1,
    name: 'First Course',
    description: 'Complete your first course',
    icon: 'fas fa-award',
    unlocked: false
  },
  {
    id: 2,
    name: '7-Day Streak',
    description: 'Learn for 7 days in a row',
    icon: 'fas fa-fire',
    unlocked: false
  },
  {
    id: 3,
    name: 'Speed Learner',
    description: 'Complete a course in under a week',
    icon: 'fas fa-bolt',
    unlocked: false
  },
  {
    id: 4,
    name: 'Knowledge Seeker',
    description: 'Enroll in 5 different categories',
    icon: 'fas fa-book',
    unlocked: false
  }
])

// Computed properties
const activeCourses = computed(() => {
  // Get unique courses by ID
  const uniqueCourses = new Set(courseStore.enrolledCourses.map(course => course.id))
  return uniqueCourses.size
})

const completedCourses = computed(() => {
  // Filter unique completed courses
  const uniqueCompletedCourses = new Set(
    courseStore.enrolledCourses
      .filter(course => course.progress === 100)
      .map(course => course.id)
  )
  return uniqueCompletedCourses.size
})

const overallProgress = computed(() => {
  if (courseStore.enrolledCourses.length === 0) return 0
  
  // Calculate progress only for unique courses
  const uniqueCourses = new Map()
  courseStore.enrolledCourses.forEach(course => {
    if (!uniqueCourses.has(course.id) || course.progress > uniqueCourses.get(course.id)) {
      uniqueCourses.set(course.id, course.progress || 0)
    }
  })
  
  const totalProgress = Array.from(uniqueCourses.values()).reduce((sum, progress) => sum + progress, 0)
  return Math.round(totalProgress / uniqueCourses.size)
})

// Initialize learning streak data
const initializeLastSevenDays = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString(),
      active: false // Will be updated with actual user activity data
    })
  }
  lastSevenDays.value = days
}

const calculateTimeSpent = (course) => {
  if (!course.completedLessons) return 0
  // Temporary: Using estimation until we implement real time tracking
  return Math.round((course.completedLessons?.length || 0) * 30 / 60)
}

const processEnrolledCourses = (courses) => {
  return courses.map(course => ({
    ...course,
    progress: course.completedLessons ? 
      Math.round((course.completedLessons.length / course.totalLessons) * 100) : 0,
    timeSpent: calculateTimeSpent(course)
  }))
}

// Check and update achievements
const updateAchievements = () => {
  // First Course Achievement
  if (completedCourses.value > 0) {
    achievements.value[0].unlocked = true
  }

  // 7-Day Streak Achievement
  if (currentStreak.value >= 7) {
    achievements.value[1].unlocked = true
  }

  // Speed Learner Achievement
  const speedLearner = enrolledCourses.value.some(course => {
    const enrollDate = new Date(course.enrolledAt)
    const completionDate = new Date(course.completedAt)
    return course.completedLessons?.length === course.totalLessons &&
           (completionDate - enrollDate) / (1000 * 60 * 60 * 24) < 7
  })
  achievements.value[2].unlocked = speedLearner

  // Knowledge Seeker Achievement
  const uniqueCategories = new Set(enrolledCourses.value.map(course => course.category))
  if (uniqueCategories.size >= 5) {
    achievements.value[3].unlocked = true
  }
}

onMounted(async () => {
  try {
    if (!userStore.user?.uid) {
      router.push('/login')
      return
    }

    await courseStore.fetchEnrolledCourses(userStore.user.uid)
    enrolledCourses.value = processEnrolledCourses(courseStore.getEnrolledCourses)
    
    // Initialize streak and last seven days
    initializeLastSevenDays()
    
    try {
      // Calculate current streak from user activity
      const streak = await courseStore.getUserStreak(userStore.user.uid)
      currentStreak.value = streak || 0
      console.log('Current streak:', currentStreak.value)
    } catch (streakError) {
      console.error('Error getting user streak:', streakError)
      currentStreak.value = 0
    }
    
    // Update achievements based on current progress
    updateAchievements()
  } catch (error) {
    console.error('Error fetching enrolled courses:', error)
    if (toast.value) {
      toast.value.error('Failed to load progress data')
    }
  }
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}
</style>
