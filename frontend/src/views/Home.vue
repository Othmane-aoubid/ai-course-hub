<template>
  <div class="bg-white homeview">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white overflow-hidden">
      <div class="container mx-auto px-6 py-20">
        <div class="flex flex-col lg:flex-row items-center">
          <div class="lg:w-1/2 lg:pr-12 z-10">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your Knowledge with AI-Powered Learning
            </h1>
            <p class="text-lg md:text-xl mb-8 text-blue-100">
              Create, share, and learn from interactive courses enhanced by artificial intelligence. Join our community of learners and educators today.
            </p>
            <div class="flex gap-4">
              <router-link to="/register" class="px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg hover:shadow-xl">Get Started</router-link>
              <router-link to="/courses" class="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">Browse Courses</router-link>
            </div>
          </div>
          <div class="lg:w-1/2 mt-12 lg:mt-0 relative z-10">
            <div class="bg-gradient-to-r from-blue-600 to-blue-500 p-8 rounded-2xl shadow-xl">
              <div class="aspect-video bg-blue-200/20 rounded-lg flex items-center justify-center">
                <i class="fas fa-graduation-cap text-6xl text-white/90"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-1/3 h-full bg-blue-500/20 transform rotate-12 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-1/3 h-full bg-blue-500/20 transform -rotate-12 -translate-x-1/2"></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Why Choose Our Platform?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- AI-Powered Learning -->
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <i class="fas fa-brain text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-900">AI-Powered Learning</h3>
            <p class="text-gray-700">Personalized learning paths and content recommendations tailored to your needs.</p>
          </div>
          
          <!-- Interactive Community -->
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <i class="fas fa-users text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-900">Interactive Community</h3>
            <p class="text-gray-700">Connect with learners and experts from around the world.</p>
          </div>

          <!-- Expert Instructors -->
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <i class="fas fa-chalkboard-teacher text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-900">Expert Instructors</h3>
            <p class="text-gray-700">Learn from industry professionals and experienced educators.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-blue-700 text-white">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold mb-2">10K+</div>
            <div class="text-blue-100">Active Students</div>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">500+</div>
            <div class="text-blue-100">Courses</div>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">100+</div>
            <div class="text-blue-100">Expert Instructors</div>
          </div>
          <div>
            <div class="text-4xl font-bold mb-2">95%</div>
            <div class="text-blue-100">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses Section -->
    <section class="py-20">
      <div class="container mx-auto px-6">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold">Popular Courses</h2>
          <router-link to="/courses" class="text-blue-600 hover:text-blue-700 font-medium">View All Courses →</router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="course in popularCourses" :key="course.id" class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <img :src="course.image" :alt="course.title" class="w-full h-48 object-cover">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ course.title }}</h3>
              <p class="text-gray-600 mb-4">{{ course.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-blue-600 font-medium">${{ course.price }}</span>
                <router-link :to="'/course/' + course.id" class="btn btn-blue">Learn More</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">What Our Students Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="bg-white p-8 rounded-lg shadow-sm">
            <div class="flex items-center mb-6">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="w-12 h-12 rounded-full">
              <div class="ml-4">
                <h4 class="font-semibold">{{ testimonial.name }}</h4>
                <p class="text-gray-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 mb-4">"{{ testimonial.content }}"</p>
            <div class="flex text-yellow-400">
              <i v-for="n in 5" :key="n" class="fas fa-star"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-700 text-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-8">Ready to Start Your Learning Journey?</h2>
        <p class="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of learners who are already transforming their careers with our AI-powered courses.
        </p>
        <router-link to="/register" class="px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg hover:shadow-xl">
          Get Started for Free
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const popularCourses = ref([
  {
    id: 1,
    title: 'Machine Learning Fundamentals',
    description: 'Learn the basics of machine learning with hands-on projects.',
    price: 49.99,
    image: 'https://placehold.co/600x400/png'
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    description: 'Master modern web development with practical examples.',
    price: 59.99,
    image: 'https://placehold.co/600x400/png'
  },
  {
    id: 3,
    title: 'Data Science Essentials',
    description: 'Get started with data analysis and visualization.',
    price: 39.99,
    image: 'https://placehold.co/600x400/png'
  }
])

const testimonials = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Developer',
    content: 'The AI-powered learning experience was incredible. I learned more in 2 months than I did in a year of self-study.',
    avatar: 'https://placehold.co/100x100/png'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Data Scientist',
    content: 'The course content is top-notch and the community support is amazing. Highly recommended!',
    avatar: 'https://placehold.co/100x100/png'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    content: 'I love how the platform adapts to my learning style. The interactive exercises are particularly helpful.',
    avatar: 'https://placehold.co/100x100/png'
  }
])

onMounted(() => {
  // If user is already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
</style>
