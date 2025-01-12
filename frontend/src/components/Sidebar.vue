<template>
  <div>
    <!-- Mobile Menu Button -->
    <div class="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 lg:hidden z-50">
      <button 
        @click="$emit('toggleSidebar')"
        class="text-gray-400 hover:text-white focus:outline-none focus:text-white"
      >
        <i class="fas fa-bars text-xl"></i>
      </button>
    </div>

    <!-- Sidebar -->
    <div 
      :key="key"
      class="h-screen bg-gray-900 text-white w-64 fixed top-0 left-0 overflow-y-auto transition-all duration-300 transform lg:translate-x-0"
      :class="[isOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-4">
        <router-link to="/" class="text-xl font-bold">
          AI Course Hub
        </router-link>
        <button 
          @click="$emit('closeSidebar')"
          class="lg:hidden text-gray-400 hover:text-white focus:outline-none focus:text-white"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <!-- Navigation -->
      <nav class="px-4 py-4">
        <!-- Dashboard -->
        <router-link 
          to="/dashboard"
          :class="getLinkClass('/dashboard')"
        >
          <i class="fas fa-home mr-4 text-lg"></i>
          Dashboard
        </router-link>
        <!-- Instructor Menu -->
        <div v-if="userStore.user?.role === 'instructor'" class="mt-4">
          <p class="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">Instructor Menu</p>
          <router-link 
            to="/instructor/dashboard"
            :class="getLinkClass('/instructor/dashboard')"
          >
            <i class="fas fa-chalkboard-teacher mr-4 text-lg"></i>
            Instructor Dashboard
          </router-link>

          <router-link 
            to="/instructor/courses/new"
            :class="getLinkClass('/instructor/courses/new')"
          >
            <i class="fas fa-plus-circle mr-4 text-lg"></i>
            Create Course
          </router-link>
        </div>

        <!-- Regular Menu Items -->
        <router-link 
          v-for="route in regularRoutes" 
          :key="route.path"
          :to="route.path"
          :class="getLinkClass(route.path)"
        >
          <i :class="['mr-4 text-lg', route.icon]"></i>
          {{ route.name }}
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img 
              :src="userPhotoURL" 
              class="h-8 w-8 rounded-full object-cover"
              alt="Profile"
            >
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white truncate max-w-[150px]">
              {{ userDisplayName }}
            </p>
            <p class="text-xs text-gray-400">
              Role: {{ userStore.user?.role || 'No role' }}
            </p>
            <button 
              @click="handleLogout" 
              class="text-xs text-gray-400 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'

export default {
  name: 'Sidebar',
  
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },

  emits: ['closeSidebar', 'toggleSidebar'],

  setup() {
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)
    return { user }
  },

  data() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const router = useRouter()

    return {
      isDev: true, // Set to true to always show debug info
      authStore,
      userStore,
      router,
      key: 0,
      regularRoutes: [
        { path: '/my-courses', name: 'My Courses', icon: 'fas fa-graduation-cap' },
        { path: '/browse-courses', name: 'Browse Courses', icon: 'fas fa-search' },
        { path: '/my-progress', name: 'My Progress', icon: 'fas fa-tasks' },
        { path: '/settings', name: 'Settings', icon: 'fas fa-cog' }
      ]
    }
  },

  computed: {
    isInstructor() {
      console.log('Computing isInstructor')
      console.log('User role:', this.userStore.user?.role)
      return this.userStore.user?.role === 'instructor'
    },

    userPhotoURL() {
      return this.authStore.user?.photoURL || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userDisplayName)}`
    },

    userDisplayName() {
      return this.authStore.user?.displayName || this.authStore.user?.email || 'User'
    }
  },

  watch: {
    'userStore.user': {
      handler(newUser) {
        console.log('User changed:', newUser)
        console.log('New role:', newUser?.role)
        this.key++
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    getLinkClass(path) {
      return [
        'group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1',
        this.$route.path === path
          ? 'bg-gray-800 dark:bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
      ]
    },

    async handleLogout() {
      try {
        await this.authStore.logout()
        this.router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>
