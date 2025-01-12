<template>
  <header class="bg-[#0B1120] fixed w-full top-0 z-50 shadow">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-blue-400">
            AI Course Hub
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/courses" class="nav-link">Courses</router-link>
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
        </div>

        <!-- Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="text-gray-400 hover:text-gray-200 px-3 py-2 text-sm font-medium">Sign in</router-link>
            <router-link to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Get Started</router-link>
          </template>
          <template v-else>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <div class="relative ml-3">
              <button
                @click="toggleDropdown"
                class="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-primary-100 dark:bg-gray-800 flex items-center justify-center">
                  <span class="text-primary-700 dark:text-gray-200 font-medium">
                    {{ authStore.user?.displayName?.[0] || authStore.user?.email?.[0] || 'U' }}
                  </span>
                </div>
              </button>

              <!-- Dropdown menu -->
              <div
                v-if="showDropdown"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Your Profile
                </router-link>
                <router-link
                  to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-400 hover:text-gray-200">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="mobile-nav-link">Home</router-link>
          <router-link to="/courses" class="mobile-nav-link">Courses</router-link>
          <a href="#features" class="mobile-nav-link">Features</a>
          <a href="#pricing" class="mobile-nav-link">Pricing</a>
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="mobile-nav-link">Sign in</router-link>
            <router-link to="/register" class="mobile-nav-link">Get Started</router-link>
          </template>
          <template v-else>
            <router-link to="/profile" class="mobile-nav-link">Your Profile</router-link>
            <router-link to="/dashboard" class="mobile-nav-link">Dashboard</router-link>
            <button @click="handleLogout" class="w-full text-left mobile-nav-link">Sign out</button>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const showMobileMenu = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = async () => {
  await authStore.logout()
  showDropdown.value = false
  showMobileMenu.value = false
  router.push('/')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Add click outside listener
window.addEventListener('click', handleClickOutside)
</script>

<style scoped>
.nav-link {
  @apply text-gray-400 hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200;
}

.mobile-nav-link {
  @apply block px-3 py-2 text-base font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800;
}
</style>
