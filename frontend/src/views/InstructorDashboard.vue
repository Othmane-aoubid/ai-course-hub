<template>
  <div class="min-h-screen bg-[#1a1f2b] p-6">
    <!-- Top Header -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-white">Instructor Dashboard</h1>
      </div>
      <button 
        @click="createNewCourse"
        class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
      >
        <font-awesome-icon icon="plus" class="mr-2" />
        Create Course
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.name" 
           class="p-6 rounded-xl bg-[#232936] hover:bg-[#2a3241] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">{{ stat.name }}</p>
            <p class="mt-2 text-3xl font-bold text-white">{{ stat.value }}</p>
          </div>
          <div :class="['p-4 rounded-lg', stat.bgColor]">
            <font-awesome-icon :icon="stat.icon" class="w-6 h-6 text-white" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="[
            'text-sm flex items-center',
            stat.change >= 0 ? 'text-green-400' : 'text-red-400'
          ]">
            <font-awesome-icon 
              :icon="stat.change >= 0 ? 'arrow-up' : 'arrow-down'" 
              class="mr-1 w-4 h-4" 
            />
            {{ Math.abs(stat.change) }}%
          </span>
          <span class="ml-2 text-sm text-gray-400">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Course Engagement Card -->
      <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Course Engagement</h3>
          <select 
            v-model="selectedPeriod"
            class="bg-[#2a3241] text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <!-- Chart will go here -->
        <div class="h-64 bg-[#2a3241] rounded-lg"></div>
      </div>

      <!-- Revenue Analytics Card -->
      <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Revenue</h3>
          <select 
            v-model="selectedPeriod"
            class="bg-[#2a3241] text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <!-- Chart will go here -->
        <div class="h-64 bg-[#2a3241] rounded-lg"></div>
      </div>

      <!-- Quick Access Card -->
      <div class="bg-[#232936] rounded-xl p-6 hover:shadow-2xl transition-all duration-300">
        <h3 class="text-lg font-semibold text-white mb-6">Quick Access</h3>
        <!-- Recent Activities -->
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id"
               class="flex items-start space-x-3 p-3 rounded-lg bg-[#2a3241] hover:bg-[#313b4f] transition-colors">
            <div :class="['p-2 rounded-lg', activity.iconBg]">
              <font-awesome-icon :icon="activity.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-sm text-white">{{ activity.title }}</p>
              <p class="text-xs text-gray-400">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Course Engagement Card -->
      <CourseEngagementCard />
      <!-- Student Activity Card -->
      <StudentActivityCard />
      <!-- Video Analytics Card -->
      <VideoAnalyticsCard 
        :courseId="selectedCourse"
        :courseVideos="courseVideos"
      />
      <!-- Student Progress Card -->
      <StudentProgressCard
        :courseId="selectedCourse"
        :students="students"
      />
    </div>

    <!-- Courses Section -->
    <div class="bg-[#232936] rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">Your Courses</h2>
        <div class="flex space-x-4">
          <div class="relative">
            <input 
              type="text"
              placeholder="Search courses..."
              class="w-64 px-4 py-2 pl-10 bg-[#2a3241] text-gray-300 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <font-awesome-icon icon="search" class="absolute left-3 top-3 text-gray-400" />
          </div>
          <button class="px-4 py-2 bg-[#2a3241] text-gray-300 rounded-lg hover:bg-[#313b4f] transition-colors">
            <font-awesome-icon icon="filter" class="mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in courses" :key="course.id"
             class="group bg-[#2a3241] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="relative">
            <img 
              :src="course.thumbnail" 
              :alt="course.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-4 right-4">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                course.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              ]">
                {{ course.status }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-white mb-2">{{ course.title }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ course.description }}</p>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <font-awesome-icon icon="users" class="w-4 h-4 text-blue-400 mr-2" />
                  <span class="text-sm text-gray-300">{{ course.students }}</span>
                </div>
                <div class="flex items-center">
                  <font-awesome-icon icon="star" class="w-4 h-4 text-yellow-400 mr-2" />
                  <span class="text-sm text-gray-300">{{ course.rating }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-400">
                <font-awesome-icon icon="clock" class="mr-2" />
                {{ formatDate(course.updatedAt) }}
              </span>
              <div class="flex space-x-2">
                <button 
                  @click="editCourse(course)"
                  class="p-2 text-gray-400 hover:text-white hover:bg-[#313b4f] rounded-lg transition-colors"
                >
                  <font-awesome-icon icon="edit" />
                </button>
                <button 
                  @click="previewCourse(course)"
                  class="p-2 text-gray-400 hover:text-white hover:bg-[#313b4f] rounded-lg transition-colors"
                >
                  <font-awesome-icon icon="eye" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'
import CourseEngagementCard from '@/components/dashboard/CourseEngagementCard.vue'
import StudentActivityCard from '@/components/dashboard/StudentActivityCard.vue'
import VideoAnalyticsCard from '@/components/dashboard/VideoAnalyticsCard.vue'
import StudentProgressCard from '@/components/dashboard/StudentProgressCard.vue'

export default {
  name: 'InstructorDashboard',
  components: {
    CourseEngagementCard,
    StudentActivityCard,
    VideoAnalyticsCard,
    StudentProgressCard
  },
  
  setup() {
    const students = ref([])
    const selectedCourse = ref(null)
    const selectedPeriod = ref('week')
    const stats = ref([
      {
        name: 'Total Students',
        value: '1,234',
        icon: 'users',
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        change: 12
      },
      {
        name: 'Active Courses',
        value: '15',
        icon: 'book',
        bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
        change: 8
      },
      {
        name: 'Total Revenue',
        value: '$12,345',
        icon: 'dollar-sign',
        bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
        change: -3
      },
      {
        name: 'Average Rating',
        value: '4.8',
        icon: 'star',
        bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        change: 5
      }
    ])
    const recentActivities = ref([
      {
        id: 1,
        title: 'Updated "Web Development Basics"',
        time: '2 hours ago',
        icon: 'edit',
        iconBg: 'bg-blue-500'
      },
      {
        id: 2,
        title: 'New student enrollment',
        time: '4 hours ago',
        icon: 'user-plus',
        iconBg: 'bg-green-500'
      },
      {
        id: 3,
        title: 'Course review received',
        time: 'Yesterday',
        icon: 'star',
        iconBg: 'bg-yellow-500'
      }
    ])
    const courses = ref([
      {
        id: 1,
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
        status: 'published',
        updatedAt: new Date().toISOString(),
        thumbnail: 'https://picsum.photos/400/300',
        students: 256,
        rating: 4.7
      },
      {
        id: 2,
        title: 'Advanced React Patterns',
        description: 'Master advanced React patterns and best practices for building scalable applications.',
        status: 'draft',
        updatedAt: new Date().toISOString(),
        thumbnail: 'https://picsum.photos/400/301',
        students: 128,
        rating: 4.9
      }
    ])

    // Fetch students for the selected course
    const fetchStudents = async (courseId) => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/students`)
        students.value = response.data
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    // Watch for course changes
    watch(selectedCourse, (newCourseId) => {
      if (newCourseId) {
        fetchStudents(newCourseId)
      }
    })

    return {
      students,
      selectedCourse,
      selectedPeriod,
      stats,
      recentActivities,
      courses
    }
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), 'MMM d, yyyy')
    },
    createNewCourse() {
      this.$router.push('/instructor/courses/new')
    },
    editCourse(course) {
      this.$router.push(`/instructor/courses/${course.id}/edit`)
    },
    previewCourse(course) {
      this.$router.push(`/instructor/courses/${course.id}/preview`)
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #232936;
}

::-webkit-scrollbar-thumb {
  background: #2a3241;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #313b4f;
}
</style>
