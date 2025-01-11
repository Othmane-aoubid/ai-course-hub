<template>
  <div>
    <!-- Mobile Menu Button -->
    <div class="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 lg:hidden z-50">
      <button 
        @click="$emit('toggleSidebar')" 
        class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg 
          class="h-6 w-6" 
          :class="{ 'hidden': isOpen, 'block': !isOpen }" 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg 
          class="h-6 w-6" 
          :class="{ 'block': isOpen, 'hidden': !isOpen }" 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div class="text-white text-lg font-bold">AI Course Hub</div>
      <div class="w-10"></div> <!-- Spacer for alignment -->
    </div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 dark:bg-gray-950 transition-transform duration-300 ease-in-out transform',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 bg-gray-800 dark:bg-gray-900">
        <router-link to="/" class="flex items-center">
          <img class="h-8 w-8" src="/logo.png" alt="AI Course Hub">
          <span class="ml-2 text-white text-lg font-semibold">AI Course Hub</span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="mt-5 px-2">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.path"
          :to="item.path"
          :class="[
            'group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1',
            $route.path === item.path
              ? 'bg-gray-800 dark:bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
          ]"
        >
          <i :class="['mr-4 text-lg', item.icon, $route.path === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white']"></i>
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="absolute bottom-0 w-full">
        <div class="px-4 py-4 bg-gray-800">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img 
                :src="authStore.user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(authStore.user?.displayName || 'User')" 
                class="h-8 w-8 rounded-full object-cover"
                alt="Profile"
              >
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white truncate max-w-[150px]">
                {{ authStore.user?.displayName || authStore.user?.email }}
              </p>
              <button 
                @click="handleLogout" 
                class="text-xs font-medium text-gray-300 hover:text-white transition-colors duration-150"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay -->
    <div 
      v-if="isOpen" 
      @click="$emit('closeSidebar')"
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { defineProps, defineEmits } from 'vue'


defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['closeSidebar', 'toggleSidebar'])

const router = useRouter()
const authStore = useAuthStore()

const navigationItems = [
  {
    name: 'My Courses',
    path: '/my-courses',
    icon: 'fas fa-graduation-cap'
  },
  {
    name: 'Create Course',
    path: '/create-course',
    icon: 'fas fa-plus-circle'
  },
  {
    name: 'Browse Courses',
    path: '/browse-courses',
    icon: 'fas fa-search'
  },
  {
    name: 'My Progress',
    path: '/my-progress',
    icon: 'fas fa-tasks'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'fas fa-cog'
  }
]

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
