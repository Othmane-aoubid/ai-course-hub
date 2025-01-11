import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import CourseLearn from '../views/CourseLearn.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'my-courses',
        name: 'my-courses',
        component: () => import('../views/MyCourses.vue')
      },
      {
        path: 'browse-courses',
        name: 'browse-courses',
        component: () => import('../views/BrowseCourses.vue')
      },
      {
        path: 'course/:id',
        name: 'view-course',
        component: () => import('../views/CourseView.vue')
      },
      {
        path: 'course/:id/learn',
        name: 'course-learn',
        component: CourseLearn,
        meta: { requiresAuth: true }
      },
      {
        path: 'create-course',
        name: 'create-course',
        component: () => import('../views/CreateCourse.vue')
      },
      {
        path: 'edit-course/:id',
        name: 'edit-course',
        component: () => import('../views/EditCourse.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/Settings.vue')
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('../views/Chat.vue')
      },
      {
        path: 'my-progress',
        name: 'my-progress',
        component: () => import('../views/MyProgress.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // Wait for auth to initialize
  if (!userStore.initialized) {
    await userStore.initializeAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const redirectIfAuth = to.matched.some(record => record.meta.redirectIfAuth)

  if (requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (redirectIfAuth && userStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
