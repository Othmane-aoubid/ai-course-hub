import { defineStore } from 'pinia'
import { db } from '../firebase'
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, increment } from 'firebase/firestore'

export const useStudyStatsStore = defineStore('studyStats', {
  state: () => ({
    userProgress: null,
    userActivities: {
      activities: []
    },
    studyStats: null,
    loading: false,
    error: null
  }),

  getters: {
    totalLearningHours: (state) => state.studyStats?.totalHours || 0,
    activeLearningDays: (state) => state.studyStats?.activeDays?.length || 0,
    weeklyProgress: (state) => state.userProgress?.weeklyStats?.coursesProgress || [],
    recentActivities: (state) => state.userActivities?.activities?.slice(0, 5) || []
  },

  actions: {
    async initializeStudyStats(userId) {
      try {
        this.loading = true
        
        // Initialize documents if they don't exist
        const docs = {
          userProgress: {
            dailyStudyLogs: [],
            weeklyStats: {
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
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

        // Check and create documents if they don't exist
        const collections = ['userProgress', 'userActivities', 'studyStats']
        await Promise.all(collections.map(async (collName) => {
          const docRef = doc(db, collName, userId)
          const docSnap = await getDoc(docRef)
          
          if (!docSnap.exists()) {
            await setDoc(docRef, docs[collName])
          }
          
          // Update state with either existing or new data
          this[collName === 'userActivities' ? 'userActivities' : collName] = 
            docSnap.exists() ? docSnap.data() : docs[collName]
        }))

      } catch (error) {
        console.error('Error initializing study stats:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async updateStudySession(userId, courseId, timeSpent) {
      if (!timeSpent || timeSpent <= 0) return

      try {
        const now = new Date().toISOString()
        const statsRef = doc(db, 'studyStats', userId)
        const progressRef = doc(db, 'userProgress', userId)
        
        // Update study stats
        const statsUpdate = {
          totalHours: increment(timeSpent),
          lastStudySession: now,
          activeDays: arrayUnion(now.split('T')[0]),
          averageDailyTime: increment(timeSpent)
        }
        
        await updateDoc(statsRef, statsUpdate)

        // Update daily study logs
        const todayLog = {
          date: now,
          timeSpent: timeSpent,
          coursesAccessed: [courseId]
        }

        await updateDoc(progressRef, {
          dailyStudyLogs: arrayUnion(todayLog)
        })

        // Update local state
        if (this.studyStats) {
          this.studyStats = {
            ...this.studyStats,
            totalHours: (this.studyStats.totalHours || 0) + timeSpent,
            lastStudySession: now,
            activeDays: [...new Set([...(this.studyStats.activeDays || []), now.split('T')[0]])],
            averageDailyTime: ((this.studyStats.averageDailyTime || 0) + timeSpent)
          }
        }
      } catch (error) {
        console.error('Error updating study session:', error)
        this.error = error.message
      }
    },

    async logActivity(userId, activity) {
      try {
        const activitiesRef = doc(db, 'userActivities', userId)
        const newActivity = {
          ...activity,
          timestamp: new Date().toISOString()
        }

        const currentActivities = this.userActivities
        await updateDoc(activitiesRef, {
          activities: [newActivity, ...currentActivities.activities]
        })

        this.userActivities = {
          activities: [newActivity, ...currentActivities.activities]
        }
      } catch (error) {
        console.error('Error logging activity:', error)
        this.error = error.message
      }
    },

    async updateCompletedCourse(userId, courseId) {
      try {
        const statsRef = doc(db, 'studyStats', userId)
        await updateDoc(statsRef, {
          completedCourses: arrayUnion(courseId)
        })

        // Update local state
        if (this.studyStats) {
          this.studyStats.completedCourses = [...(this.studyStats.completedCourses || []), courseId]
        }
      } catch (error) {
        console.error('Error updating completed courses:', error)
        this.error = error.message
      }
    }
  }
})
