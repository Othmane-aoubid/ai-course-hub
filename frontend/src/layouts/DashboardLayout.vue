<template>
  <div class="h-screen flex bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-transform duration-300 ease-in-out',
        { '-translate-x-full': !isSidebarOpen }
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
        <router-link to="/dashboard" class="flex items-center space-x-2">
          <img src="../assets/aicoursehub.webp" alt="Logo" class="h-8 w-8">
          <span class="text-xl font-semibold text-gray-900 dark:text-white">AI Course Hub</span>
        </router-link>
        <button @click="toggleSidebar" class="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-4 px-4">
        <div class="space-y-1">
          <div v-for="item in navigation" :key="item.path">
            <!-- Instructor Section Header -->
            <p v-if="item.path === '/instructor/dashboard'" 
               class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4 mb-2">
              Instructor Menu
            </p>

            <router-link
              :to="item.path"
              :class="[
                isCurrentRoute(item.path)
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              ]"
            >
              <i :class="[item.icon, 'mr-3 text-lg']"></i>
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div :class="['flex-1', { 'lg:pl-64': isSidebarOpen }]">
      <!-- Top Navigation -->
      <div class="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div class="h-16 flex items-center justify-between px-4">
          <!-- Left side -->
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            >
              <i class="fas fa-bars"></i>
            </button>

            <!-- Search -->
            <div class="ml-4 lg:ml-8">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  class="w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                >
                <i class="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
              </div>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <i class="fas fa-bell text-xl"></i>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <!-- Profile dropdown -->
            <div class="relative" v-click-outside="closeProfileMenu">
              <button
                @click="isProfileMenuOpen = !isProfileMenuOpen"
                class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-400"
              >
                <img
                  :src="userStore.profileImage || '/default-avatar.png'"
                  :alt="userStore.user?.displayName || 'Profile'"
                  class="h-8 w-8 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
                  @error="handleImageError"
                >
                <span class="hidden lg:block">{{ userStore.user?.displayName || userStore.user?.email }}</span>
                <i class="fas fa-chevron-down text-sm"></i>
              </button>

              <!-- Profile Menu -->
              <div
                v-show="isProfileMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1"
              >
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Settings
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isSidebarOpen = ref(true)
const isProfileMenuOpen = ref(false)

// Base navigation items
const baseNavigation = [
  { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-home' },
  { name: 'My Courses', path: '/my-courses', icon: 'fas fa-book' },
  { name: 'Browse Courses', path: '/browse-courses', icon: 'fas fa-compass' },
  { name: 'My Progress', path: '/my-progress', icon: 'fas fa-chart-line' },
  { name: 'Settings', path: '/settings', icon: 'fas fa-cog' },
  { name: 'AI Assistant', path: '/chat', icon: 'fas fa-robot' }
]

// Instructor-specific navigation items
const instructorNavigation = [
  { name: 'Instructor Dashboard', path: '/instructor/dashboard', icon: 'fas fa-chalkboard-teacher' },
  { name: 'Create Course', path: '/instructor/courses/new', icon: 'fas fa-plus-circle' }
]

// Computed navigation that includes instructor routes when appropriate
const navigation = computed(() => {
  console.log('Computing navigation')
  console.log('User role:', userStore.user?.role)
  console.log('Is instructor?', userStore.user?.role === 'instructor')
  
  if (userStore.user?.role === 'instructor') {
    // Insert instructor items after Dashboard
    const result = [
      baseNavigation[0], // Dashboard
      ...instructorNavigation,
      ...baseNavigation.slice(1)
    ]
    console.log('Navigation with instructor items:', result)
    return result
  }
  
  console.log('Base navigation:', baseNavigation)
  return baseNavigation
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false
}

const isCurrentRoute = (path) => {
  return route.path === path
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

const handleImageError = (e) => {
  // If the profile image fails to load, fallback to default avatar
  e.target.src = '/default-avatar.png'
}

// Click outside directive
const vClickOutside = {
  mounted(el, { value }) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>
