import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', {
  state: () => {
    console.log('Initializing user store state')
    return {
      user: null,
      loading: true,
      error: null,
      initialized: false,
      profileImage: null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isInstructor: (state) => {
      console.log('Store - Checking isInstructor')
      console.log('Store - User:', state.user)
      console.log('Store - User role:', state.user?.role)
      const result = state.user?.role === 'instructor'
      console.log('Store - Is instructor?', result)
      return result
    },
    userProfile: (state) => state.user
  },

  actions: {
    async initializeAuth() {
      console.log('Initializing auth...')
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          console.log('Auth state changed:', user?.email)
          if (user) {
            // Fetch user profile data from Firestore
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid))
              const userData = userDoc.data()
              console.log('Firestore user data:', userData)
              
              if (userDoc.exists()) {
                // Check if role exists, if not add it
                if (!userData.role) {
                  console.log('No role found, setting default role')
                  await setDoc(doc(db, 'users', user.uid), {
                    role: 'student'
                  }, { merge: true })
                  userData.role = 'student'
                }
                
                // Merge auth user with Firestore data
                const mergedUser = {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  ...userData
                }
                console.log('Merged user data with role:', mergedUser)
                console.log('Current role:', mergedUser.role)
                this.user = mergedUser
                this.profileImage = userData.profileImage || null
              } else {
                // Create default user document if it doesn't exist
                const defaultUser = {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  role: 'student', // Default role
                  createdAt: new Date().toISOString()
                }
                console.log('Creating default user with role:', defaultUser)
                await setDoc(doc(db, 'users', user.uid), defaultUser)
                this.user = defaultUser
              }
            } catch (error) {
              console.error('Error fetching/creating user profile:', error)
              this.user = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'student' // Default role on error
              }
            }
          } else {
            console.log('No user signed in')
            this.user = null
            this.profileImage = null
          }
          this.loading = false
          this.initialized = true
          resolve()
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
