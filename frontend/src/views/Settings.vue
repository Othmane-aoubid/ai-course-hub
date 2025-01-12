<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Profile Settings</h3>
            
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-6">
                <div class="flex items-center">
                  <div class="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      :src="profileImage || defaultAvatar"
                      alt="Profile"
                      class="h-full w-full object-cover"
                    >
                  </div>
                  <div class="ml-5">
                    <input
                      type="file"
                      @change="uploadImage"
                      class="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
                    >
                  </div>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="displayName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Name
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    id="displayName"
                    v-model="userProfile.displayName"
                    class="block w-full px-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-gray-900 text-sm transition duration-150 ease-in-out"
                    placeholder="Enter your display name"
                  >
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div class="mt-1">
                  <input
                    type="email"
                    id="email"
                    v-model="userProfile.email"
                    disabled
                    class="block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                  >
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <div class="mt-1">
                  <textarea
                    id="bio"
                    v-model="userProfile.bio"
                    rows="4"
                    class="block w-full px-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-gray-900 text-sm transition duration-150 ease-in-out"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Learning Preferences</h3>
            
            <div class="mt-6 space-y-6">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Learning Time</label>
                <div class="mt-2 grid grid-cols-3 gap-3">
                  <button
                    v-for="time in learningTimes"
                    :key="time"
                    type="button"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-md',
                      userProfile.preferredTime === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    ]"
                    @click="userProfile.preferredTime = time"
                  >
                    {{ time }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Learning Goal</label>
                <div class="mt-2">
                  <select v-model="userProfile.weeklyGoal" class="block w-full px-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-gray-900 text-sm transition duration-150 ease-in-out">
                    <option value="1">1 hour per week</option>
                    <option value="3">3 hours per week</option>
                    <option value="5">5 hours per week</option>
                    <option value="10">10 hours per week</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Categories</label>
                <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  <div
                    v-for="category in categories"
                    :key="category"
                    class="relative flex items-start"
                  >
                    <div class="flex items-center h-5">
                      <input
                        :id="category"
                        type="checkbox"
                        v-model="userProfile.preferredCategories"
                        :value="category"
                        class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition duration-150 ease-in-out"
                      >
                    </div>
                    <div class="ml-3 text-sm">
                      <label :for="category" class="font-medium text-gray-700 dark:text-gray-300">{{ category }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Notification Settings</h3>
            
            <div class="mt-6 space-y-6">
              <div v-for="notification in notifications" :key="notification.id" class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    :id="notification.id"
                    type="checkbox"
                    v-model="userProfile.notifications[notification.id]"
                    class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                </div>
                <div class="ml-3">
                  <label :for="notification.id" class="font-medium text-gray-700 dark:text-gray-300">{{ notification.title }}</label>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Theme Settings</h3>
            
            <div class="mt-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                  <button
                    type="button"
                    :class="[
                      themeStore.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    ]"
                    @click="themeStore.toggleDarkMode()"
                  >
                    <span
                      :class="[
                        themeStore.darkMode ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-800 shadow ring-0 transition duration-200 ease-in-out'
                      ]"
                    >
                      <span
                        :class="[
                          themeStore.darkMode ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                          'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                        ]"
                      >
                        <i class="fas fa-sun text-yellow-400 text-xs"></i>
                      </span>
                      <span
                        :class="[
                          themeStore.darkMode ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                          'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                        ]"
                      >
                        <i class="fas fa-moon text-gray-400 text-xs"></i>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Debug Information</h3>
            <div class="mt-6 space-y-4">
              <div class="text-sm text-gray-600 dark:text-gray-300">
                <p>Current Role: <span class="font-medium">{{ userStore.user?.role || 'No role set' }}</span></p>
                <p>Is Instructor: <span class="font-medium">{{ userStore.isInstructor ? 'Yes' : 'No' }}</span></p>
                <p>User ID: <span class="font-medium">{{ userStore.user?.id }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Role Management</h3>
            <div class="mt-6 space-y-4">
              <div class="flex space-x-4">
                <button
                  @click="setRole('instructor')"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    userStore.user?.role === 'instructor'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  Set as Instructor
                </button>
                <button
                  @click="setRole('student')"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    userStore.user?.role === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  Set as Student
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="btn btn-primary"
            @click="saveSettings"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save Settings' }}
          </button>
          <button
            type="button"
            class="btn btn-secondary ml-2"
            @click="refreshUserSession"
          >
            Refresh Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default {
  name: 'Settings',

  data() {
    return {
      loading: false,
      defaultAvatar: '/default-avatar.png',
      profileImage: '',
      userProfile: {
        displayName: '',
        email: '',
        bio: '',
        preferredTime: 'Morning',
        weeklyGoal: '3',
        preferredCategories: [],
        notifications: {
          courseUpdates: true,
          newContent: true,
          reminders: true,
          newsletter: false
        }
      },
      learningTimes: ['Morning', 'Afternoon', 'Evening'],
      categories: ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'AI'],
      notifications: [
        { id: 'courseUpdates', title: 'Course Updates', description: 'Get notified about updates to your enrolled courses' },
        { id: 'newContent', title: 'New Content', description: 'Receive notifications about new courses and content' },
        { id: 'reminders', title: 'Learning Reminders', description: 'Get reminded about your learning schedule' },
        { id: 'newsletter', title: 'Newsletter', description: 'Receive our weekly newsletter with learning tips' }
      ],
      unsubscribe: null
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    },
    
    themeStore() {
      return useThemeStore()
    },
    
    router() {
      return useRouter()
    },
    
    toast() {
      return useToast()
    }
  },

  methods: {
    async uploadImage(event) {
      try {
        this.loading = true
        const file = event.target.files[0]
        if (!file) return

        // Convert image to base64
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const base64Image = e.target.result
            const userId = this.userStore.user.uid
            
            // Store image directly in Firestore
            await setDoc(doc(db, 'users', userId), {
              profileImage: base64Image,
              updatedAt: new Date().toISOString()
            }, { merge: true })
            
            this.profileImage = base64Image
            this.toast.success('Profile image updated successfully')
          } catch (error) {
            console.error('Error saving image to Firestore:', error)
            this.toast.error('Failed to upload image')
          } finally {
            this.loading = false
          }
        }
        
        reader.onerror = (error) => {
          console.error('Error reading file:', error)
          this.toast.error('Failed to read image file')
          this.loading = false
        }
        
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error handling image:', error)
        this.toast.error('Failed to handle image')
        this.loading = false
      }
    },

    async saveSettings() {
      try {
        this.loading = true
        const userId = this.userStore.user.uid
        const userDocRef = doc(db, 'users', userId)
        
        await setDoc(userDocRef, {
          ...this.userProfile,
          profileImage: this.profileImage,
          updatedAt: new Date().toISOString()
        }, { merge: true })
        
        this.toast.success('Settings saved successfully')
      } catch (error) {
        console.error('Error saving settings:', error)
        this.toast.error('Failed to save settings')
      } finally {
        this.loading = false
      }
    },

    async loadUserSettings() {
      try {
        const userId = this.userStore.user.uid
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          const data = userDoc.data()
          Object.assign(this.userProfile, data)
          this.profileImage = data.profileImage || ''
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        this.toast.error('Failed to load settings')
      }
    },

    async refreshUserSession() {
      try {
        this.loading = true
        await this.userStore.initializeAuth()
        this.toast.success('Session refreshed')
      } catch (error) {
        console.error('Error refreshing session:', error)
        this.toast.error('Failed to refresh session')
      } finally {
        this.loading = false
      }
    },

    async setRole(role) {
      try {
        this.loading = true
        const userId = this.userStore.user.uid
        const userDocRef = doc(db, 'users', userId)

        console.log('Setting role to:', role)
        console.log('Current user state:', this.userStore.user)

        // Create/Update the document
        const updateData = {
          role: role,
          email: this.userStore.user.email,
          updatedAt: new Date().toISOString()
        }
        console.log('Updating with data:', updateData)
        
        await setDoc(userDocRef, updateData, { merge: true })

        // Verify the update
        const updatedDoc = await getDoc(userDocRef)
        const updatedData = updatedDoc.data()
        console.log('Updated user document:', updatedData)
        console.log('New role from Firestore:', updatedData.role)

        // Update local state
        this.userStore.user = {
          ...this.userStore.user,
          role: role
        }
        console.log('Updated local user state:', this.userStore.user)
        
        this.toast.success(`Role updated to ${role}`)
        await this.refreshUserSession()
      } catch (error) {
        console.error('Error setting role:', error)
        this.toast.error('Failed to set role')
      } finally {
        this.loading = false
      }
    }
  },

  async mounted() {
    await this.loadUserSettings()
    
    // Set up real-time updates
    const userId = this.userStore.user.uid
    const userDocRef = doc(db, 'users', userId)
    
    this.unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        Object.assign(this.userProfile, data)
        this.profileImage = data.profileImage || ''
      }
    })
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<style scoped>
.input {
  @apply block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}
</style>
