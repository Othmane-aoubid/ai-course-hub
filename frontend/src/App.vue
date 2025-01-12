<template>
  <div class="min-h-screen !dark:bg-gray-900">
    <div v-if="isAuthenticated" class="min-h-screen !bg-white !dark:bg-gray-900 !text-gray-900 !dark:text-white">
      <main>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>
    </div>
    <div v-else class="min-h-screen !bg-white !dark:bg-gray-900 !text-gray-900 !dark:text-white">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showFooter = computed(() => !['login', 'register'].includes(route.name) && !isAuthenticated.value)
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')

// Initialize authentication state from localStorage
onMounted(async () => {
  await authStore.initializeAuth()
  themeStore.initializeTheme()
})

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
@import '@fortawesome/fontawesome-free/css/all.css';

:root {
  --color-primary-50: rgb(236 253 245);
  --color-primary-100: rgb(209 250 229);
  --color-primary-200: rgb(167 243 208);
  --color-primary-300: rgb(110 231 183);
  --color-primary-400: rgb(52 211 153);
  --color-primary-500: rgb(16 185 129);
  --color-primary-600: rgb(5 150 105);
  --color-primary-700: rgb(4 120 87);
  --color-primary-800: rgb(6 95 70);
  --color-primary-900: rgb(6 78 59);
}

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.btn-secondary {
  @apply bg-white text-primary-600 hover:bg-gray-50 border border-primary-600;
}

.card {
  @apply bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200;
}

.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.nav-link {
  @apply text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium;
}

.nav-link.active {
  @apply bg-primary-50 text-primary-700;
}
</style>
