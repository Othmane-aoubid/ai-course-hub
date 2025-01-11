import { defineStore } from 'pinia'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async initializeAuth() {
      if (this.initialized) return
      
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL
            }
          } else {
            this.user = null
          }
          this.initialized = true
          unsubscribe()
          resolve()
        })
      })
    },

    async initializeUserCollections(uid) {
      const collections = {
        userProgress: {
          dailyStudyLogs: [],
          weeklyStats: {
            startDate: new Date().toISOString(),
            totalTime: 0,
            coursesProgress: []
          }
        },
        userActivities: {
          activities: []
        },
        studyStats: {
          totalHours: 0,
          activeDays: [],
          lastStudySession: null,
          averageDailyTime: 0,
          completedCourses: []
        }
      }

      // Only create collections if they don't exist
      for (const [collName, data] of Object.entries(collections)) {
        const docRef = doc(db, collName, uid)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
          await setDoc(docRef, data)
        }
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL
        }
      } catch (error) {
        this.error = this.formatError(error.code)
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async register(email, password, displayName) {
      this.loading = true
      this.error = null
      
      try {
        // 1. Create auth user
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        
        // 2. Update profile
        await updateProfile(user, { displayName })
        
        // 3. Create user document
        const userData = {
          email,
          displayName,
          createdAt: new Date().toISOString(),
          role: 'student'
        }
        
        try {
          await setDoc(doc(db, 'users', user.uid), userData)
        } catch (error) {
          console.error('Error creating user document:', error)
          // Continue even if Firestore fails
        }
        
        // Initialize study collections for new user
        await this.initializeUserCollections(user.uid)

        // 4. Update local state
        this.user = {
          uid: user.uid,
          ...userData
        }
        
        return user
      } catch (error) {
        this.error = this.formatError(error.code)
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle() {
      this.loading = true
      this.error = null
      
      try {
        const provider = new GoogleAuthProvider()
        const { user } = await signInWithPopup(auth, provider)
        
        try {
          const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            role: 'student'
          }
          await setDoc(doc(db, 'users', user.uid), userData, { merge: true })
        } catch (error) {
          console.error('Error updating user document:', error)
          // Continue even if Firestore fails
        }

        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      } catch (error) {
        this.error = this.formatError(error.code)
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async loginWithGithub() {
      this.loading = true
      this.error = null
      
      try {
        const provider = new GithubAuthProvider()
        const { user } = await signInWithPopup(auth, provider)
        
        try {
          const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            role: 'student'
          }
          await setDoc(doc(db, 'users', user.uid), userData, { merge: true })
        } catch (error) {
          console.error('Error updating user document:', error)
          // Continue even if Firestore fails
        }

        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      } catch (error) {
        this.error = this.formatError(error.code)
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        this.error = this.formatError(error.code)
        throw new Error(this.error)
      }
    },

    formatError(code) {
      switch (code) {
        case 'auth/user-not-found':
          return 'No account found with this email'
        case 'auth/wrong-password':
          return 'Incorrect password'
        case 'auth/email-already-in-use':
          return 'Email already registered'
        case 'auth/weak-password':
          return 'Password should be at least 6 characters'
        case 'auth/invalid-email':
          return 'Invalid email address'
        case 'auth/popup-closed-by-user':
          return 'Sign in was cancelled'
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection'
        case 'auth/too-many-requests':
          return 'Too many attempts. Please try again later'
        case 'auth/operation-not-allowed':
          return 'This sign-in method is not enabled'
        default:
          return 'An error occurred. Please try again'
      }
    }
  },

  persist: true
})
