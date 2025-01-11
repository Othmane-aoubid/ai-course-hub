import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
    initialized: false,
    profileImage: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userProfile: (state) => state.user
  },

  actions: {
    async initializeAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.user = user
          if (user) {
            // Fetch user profile data from Firestore
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                this.profileImage = userData.profileImage || null
              }
            } catch (error) {
              console.error('Error fetching user profile:', error)
            }
          } else {
            this.profileImage = null
          }
          this.loading = false
          this.initialized = true
          resolve(user)
        })
      })
    },

    async updateProfileImage(imageUrl) {
      this.profileImage = imageUrl
    },

    async login(email, password) {
      try {
        this.loading = true
        this.error = null
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return userCredential.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(email, password) {
      try {
        this.loading = true
        this.error = null
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return userCredential.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    setUser(user) {
      this.user = user
    },

    clearError() {
      this.error = null
    }
  }
})
