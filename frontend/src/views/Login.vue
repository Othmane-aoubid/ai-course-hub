<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Left side - Image and branding -->
    <div class="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white items-center justify-center">
      <div class="max-w-md">
        <h1 class="text-4xl font-bold mb-6">Welcome Back!</h1>
        <p class="text-xl text-blue-100 mb-8">Continue your learning journey with our AI-powered courses and expert instructors.</p>
        <div class="flex space-x-6">
          <div class="flex items-center">
            <i class="fas fa-book-reader text-2xl mr-3 text-blue-200"></i>
            <div>
              <h3 class="font-semibold">Personalized</h3>
              <p class="text-sm text-blue-200">Learning path</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-certificate text-2xl mr-3 text-blue-200"></i>
            <div>
              <h3 class="font-semibold">Certified</h3>
              <p class="text-sm text-blue-200">Course completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Login form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-gray-50">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-gray-600">Welcome back to AI Power Course</p>
        </div>

        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-gray-400 hover:text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div class="flex">
              <i class="fas fa-exclamation-circle mt-1 mr-3"></i>
              <p>{{ error }}</p>
            </div>
          </div>

          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :class="{ 'opacity-75 cursor-not-allowed': loading }"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="handleGoogleLogin"
              class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i class="fab fa-google mr-2 text-red-500"></i>
              Google
            </button>
            <button
              type="button"
              @click="handleGithubLogin"
              class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i class="fab fa-github mr-2"></i>
              GitHub
            </button>
          </div>
        </form>

        <p class="text-center text-sm text-gray-600">
          New to AI Power Course?
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            Create an account
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}

const handleGithubLogin = async () => {
  try {
    await authStore.loginWithGithub()
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.from-blue-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(37 99 235 / 0));
}
.to-blue-800 {
  --tw-gradient-to: #1e40af;
}
</style>
