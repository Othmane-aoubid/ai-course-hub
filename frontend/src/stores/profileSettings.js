import { defineStore } from 'pinia'
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useAuthStore } from './auth'

export const useProfileSettingsStore = defineStore('profileSettings', {
  state: () => ({
    settings: {
      displayName: '',
      bio: '',
      preferredTime: 'morning',
      weeklyGoal: '3',
      preferredCategories: [],
      notifications: {
        courseUpdates: true,
        newCourses: true,
        achievements: true
      }
    },
    loading: false,
    error: null
  }),

  actions: {
    async initializeSettings() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      this.loading = true
      try {
        const settingsRef = doc(db, 'profileSettings', authStore.user.uid)
        const settingsDoc = await getDoc(settingsRef)

        if (settingsDoc.exists()) {
          this.settings = {
            ...this.settings,
            ...settingsDoc.data()
          }
        } else {
          // Create default settings document
          await setDoc(settingsRef, {
            displayName: authStore.user.displayName || '',
            bio: '',
            preferredTime: 'morning',
            weeklyGoal: '3',
            preferredCategories: [],
            notifications: {
              courseUpdates: true,
              newCourses: true,
              achievements: true
            },
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      } catch (error) {
        console.error('Error initializing settings:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async updateSettings(newSettings) {
      const authStore = useAuthStore()
      if (!authStore.user) return

      this.loading = true
      try {
        const settingsRef = doc(db, 'profileSettings', authStore.user.uid)
        await updateDoc(settingsRef, {
          ...newSettings,
          updatedAt: new Date()
        })
        
        this.settings = {
          ...this.settings,
          ...newSettings
        }

        return true
      } catch (error) {
        console.error('Error updating settings:', error)
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
