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

        <div class="flex justify-end">
          <button
            type="button"
            class="btn btn-primary"
            @click="saveSettings"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userStore = useUserStore()
const themeStore = useThemeStore()
const loading = ref(false)

const defaultAvatar = '/default-avatar.png'
const profileImage = ref('')

const userProfile = reactive({
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
})

const learningTimes = ['Morning', 'Afternoon', 'Evening']
const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'AI']
const notifications = [
  { id: 'courseUpdates', title: 'Course Updates', description: 'Get notified about updates to your enrolled courses' },
  { id: 'newContent', title: 'New Content', description: 'Receive notifications about new courses and content' },
  { id: 'reminders', title: 'Learning Reminders', description: 'Get reminded about your learning schedule' },
  { id: 'newsletter', title: 'Newsletter', description: 'Receive our weekly newsletter with learning tips' }
]

async function uploadImage(event) {
  try {
    loading.value = true
    const file = event.target.files[0]
    if (!file) return

    // Convert image to base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const base64Image = e.target.result
        const userId = userStore.user.uid
        
        // Store image directly in Firestore
        await setDoc(doc(db, 'users', userId), {
          profileImage: base64Image,
          updatedAt: new Date().toISOString()
        }, { merge: true })
        
        profileImage.value = base64Image
        toast.success('Profile image updated successfully')
      } catch (error) {
        console.error('Error saving image to Firestore:', error)
        toast.error('Failed to upload image')
      } finally {
        loading.value = false
      }
    }
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
      toast.error('Failed to read image file')
      loading.value = false
    }
    
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Error handling image:', error)
    toast.error('Failed to handle image')
    loading.value = false
  }
}

async function saveSettings() {
  try {
    loading.value = true
    const userId = userStore.user.uid
    const userDocRef = doc(db, 'users', userId)
    
    await setDoc(userDocRef, {
      ...userProfile,
      profileImage: profileImage.value,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    
    toast.success('Settings saved successfully')
  } catch (error) {
    console.error('Error saving settings:', error)
    toast.error('Failed to save settings')
  } finally {
    loading.value = false
  }
}

async function loadUserSettings() {
  try {
    const userId = userStore.user.uid
    const userDocRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      Object.assign(userProfile, data)
      profileImage.value = data.profileImage || defaultAvatar
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    toast.error('Failed to load settings')
  }
}

// Set up real-time updates
onMounted(async () => {
  await loadUserSettings()
  
  const userId = userStore.user.uid
  const userDocRef = doc(db, 'users', userId)
  
  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data()
      Object.assign(userProfile, data)
      profileImage.value = data.profileImage || defaultAvatar
    }
  })
  
  // Cleanup subscription on component unmount
  onUnmounted(() => unsubscribe())
})
</script>

<style scoped>
.input {
  @apply block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
}
</style>
