<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Quick Access
    </h3>

    <!-- Recent Activities -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Activities</h4>
      <div class="space-y-3">
        <div v-for="activity in recentActivities" :key="activity.id" 
             class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex-shrink-0">
            <font-awesome-icon :icon="activity.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900 dark:text-white truncate">
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ activity.time }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Important Notifications -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Notifications</h4>
      <div class="space-y-3">
        <div v-for="notification in notifications" :key="notification.id"
             :class="['p-3 rounded-lg', 
                      notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                      notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 
                      'bg-gray-50 dark:bg-gray-700']">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <font-awesome-icon :icon="notification.icon" 
                        :class="['w-5 h-5',
                                notification.type === 'warning' ? 'text-yellow-400' :
                                notification.type === 'success' ? 'text-green-400' :
                                'text-gray-400']" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ notification.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div>
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Links</h4>
      <div class="grid grid-cols-2 gap-3">
        <button v-for="link in quickLinks" :key="link.id"
                @click="navigateTo(link.route)"
                class="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <font-awesome-icon :icon="link.icon" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ link.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faFile, 
  faComment, 
  faVideo, 
  faExclamationTriangle,
  faCheckCircle,
  faPlusCircle,
  faInbox,
  faChartBar,
  faCog
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'QuickAccessCard',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      recentActivities: [
        {
          id: 1,
          description: 'Updated "Web Development Basics" course',
          time: '2 hours ago',
          icon: ['fas', 'file']
        },
        {
          id: 2,
          description: 'Responded to student question',
          time: '4 hours ago',
          icon: ['fas', 'comment']
        },
        {
          id: 3,
          description: 'Published new lecture',
          time: 'Yesterday',
          icon: ['fas', 'video']
        }
      ],
      notifications: [
        {
          id: 1,
          type: 'warning',
          message: 'Course review pending for "Advanced JavaScript"',
          time: '1 hour ago',
          icon: ['fas', 'exclamation-triangle']
        },
        {
          id: 2,
          type: 'success',
          message: 'New student enrollment in "Python Basics"',
          time: '3 hours ago',
          icon: ['fas', 'check-circle']
        }
      ],
      quickLinks: [
        {
          id: 1,
          name: 'Create Course',
          route: '/instructor/courses/new',
          icon: ['fas', 'plus-circle']
        },
        {
          id: 2,
          name: 'Messages',
          route: '/instructor/messages',
          icon: ['fas', 'inbox']
        },
        {
          id: 3,
          name: 'Analytics',
          route: '/instructor/analytics',
          icon: ['fas', 'chart-bar']
        },
        {
          id: 4,
          name: 'Settings',
          route: '/instructor/settings',
          icon: ['fas', 'cog']
        }
      ]
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    }
  }
}
</script>
