<template>
  <header class="bg-white dark:bg-gray-900 shadow">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and primary nav -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              AI Course Hub
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'active': $route.path === '/' }"
            >
              Home
            </router-link>
            <router-link
              to="/courses"
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/courses') }"
            >
              Courses
            </router-link>
            <a href="#features" class="nav-link">Features</a>
            <a href="#pricing" class="nav-link">Pricing</a>
          </div>
        </div>

        <!-- Secondary nav -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="btn btn-secondary">
              Sign in
            </router-link>
            <router-link to="/register" class="btn btn-primary">
              Get Started
            </router-link>
          </template>
          <template v-else>
            <router-link to="/dashboard" class="nav-link">
              Dashboard
            </router-link>
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
        <div class="flex items-center sm:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400"
          >
            <span class="sr-only">Open main menu</span>
            <i class="fas fa-bars" v-if="!showMobileMenu"></i>
            <i class="fas fa-times" v-else></i>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            class="mobile-nav-link"
            :class="{ 'bg-primary-50 dark:bg-gray-700': $route.path === '/' }"
          >
            Home
          </router-link>
          <router-link
            to="/courses"
            class="mobile-nav-link"
            :class="{ 'bg-primary-50 dark:bg-gray-700': $route.path.startsWith('/courses') }"
          >
            Courses
          </router-link>
          <a href="#features" class="mobile-nav-link">Features</a>
          <a href="#pricing" class="mobile-nav-link">Pricing</a>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-600">
          <template v-if="!authStore.isAuthenticated">
            <div class="space-y-1">
              <router-link to="/login" class="mobile-nav-link">
                Sign in
              </router-link>
              <router-link to="/register" class="mobile-nav-link">
                Get Started
              </router-link>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-gray-800 flex items-center justify-center">
                  <span class="text-primary-700 dark:text-gray-200 font-medium text-lg">
                    {{ authStore.user?.displayName?.[0] || authStore.user?.email?.[0] || 'U' }}
                  </span>
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800 dark:text-gray-200">
                  {{ authStore.user?.displayName || authStore.user?.email }}
                </div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <router-link
                to="/profile"
                class="mobile-nav-link"
              >
                Your Profile
              </router-link>
              <router-link
                to="/dashboard"
                class="mobile-nav-link"
              >
                Dashboard
              </router-link>
              <button
                @click="handleLogout"
                class="w-full text-left mobile-nav-link"
              >
                Sign out
              </button>
            </div>
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
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600;
}

.nav-link.active {
  @apply border-primary-500 dark:border-primary-400 text-gray-900 dark:text-gray-100;
}

.mobile-nav-link {
  @apply block pl-3 pr-4 py-2 text-base font-medium text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700;
}
</style>
