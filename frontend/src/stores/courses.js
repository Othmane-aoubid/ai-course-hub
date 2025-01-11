import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
  arrayUnion,
  increment
} from 'firebase/firestore'
import { db } from '../firebase'
import { aiService } from '../api/ai'
import { useAuthStore } from './auth'
import { useStudyStatsStore } from './studyStats'

export const useCourseStore = defineStore('courses', () => {
  // State
  const userCourses = ref([])
  const enrolledCourses = ref([])
  const allCourses = ref([])
  const currentCourse = ref(null)
  const loading = ref(false)

  // Getters
  const getAllCourses = computed(() => allCourses.value)
  const getUserCourses = computed(() => userCourses.value)
  const getEnrolledCourses = computed(() => enrolledCourses.value)
  const getCurrentCourse = computed(() => currentCourse.value)

  // Check if user is enrolled in a specific course
  const isEnrolled = (courseId) => {
    return enrolledCourses.value.some(course => course.id === courseId)
  }

  // Actions
  const fetchUserCourses = async (userId) => {
    try {      
      if (!userId) {
        console.error('No user ID provided')
        return []
      }

      // Create queries for authorId, createdBy, and instructor.id
      const queries = [
        // Author query
        query(collection(db, 'courses'), where('authorId', '==', userId)),
        // Creator query
        query(collection(db, 'courses'), where('createdBy', '==', userId)),
        // Instructor query - check both string and object format
        query(collection(db, 'courses'), where('instructor.id', '==', userId)),
        // Enrolled query
        query(collection(db, 'courses'), where('enrolledStudents', 'array-contains', userId))
      ]
      
      // Execute all queries
      const snapshots = await Promise.all(queries.map(q => getDocs(q)))
      
      // Create a Map to store unique courses by ID
      const uniqueCourses = new Map()
      
      // Process all snapshots
      snapshots.forEach((snapshot, index) => {
        const queryType = ['author', 'creator', 'instructor', 'enrolled'][index]
        
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          
          if (!uniqueCourses.has(doc.id)) {
            uniqueCourses.set(doc.id, {
              id: doc.id,
              ...data
            })
          }
        })
      })
      
      // Convert Map to array
      userCourses.value = Array.from(uniqueCourses.values())
      
      return userCourses.value
    } catch (error) {
      console.error('Error fetching user courses:', error)
      throw error
    }
  }

  const fetchAllCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'))
      allCourses.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching all courses:', error)
      throw error
    }
  }

  const fetchEnrolledCourses = async (userId) => {
    try {
      // Get all enrollments for the user
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('userId', '==', userId)
      )
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      
      // Create a Set to track unique course IDs
      const uniqueCourseIds = new Set()
      const coursePromises = []
      
      // Collect all unique course IDs
      enrollmentsSnapshot.forEach((docSnap) => {
        const enrollmentData = docSnap.data()
        if (enrollmentData.courseId && !uniqueCourseIds.has(enrollmentData.courseId)) {
          uniqueCourseIds.add(enrollmentData.courseId)
          const courseRef = doc(db, 'courses', enrollmentData.courseId)
          coursePromises.push(getDoc(courseRef))
        }
      })
      
      // Fetch all courses in parallel
      const courseDocs = await Promise.all(coursePromises)
      
      // Process and store the courses
      enrolledCourses.value = courseDocs
        .filter(doc => doc.exists())
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          enrolled: true // Mark as enrolled
        }))

      console.log('Fetched enrolled courses:', enrolledCourses.value)
      return enrolledCourses.value
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      throw error
    }
  }

  const fetchCourseById = async (courseId) => {
    try {
      const docRef = doc(db, 'courses', courseId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const courseData = docSnap.data()
        
        // Ensure modules array exists and has proper structure
        if (!Array.isArray(courseData.modules)) {
          console.warn('Course has no modules array, initializing empty array')
          courseData.modules = []
        }
        // Validate and fix module structure
        courseData.modules = courseData.modules.map((module, moduleIndex) => {
          // Ensure module has required properties
          const validatedModule = {
            title: module.title || `Module ${moduleIndex + 1}`,
            description: module.description || '',
            duration: module.duration || 0,
            order: module.order || moduleIndex + 1,
            completed: !!module.completed,
            lessons: Array.isArray(module.lessons) ? module.lessons : []
          }
          
          // Validate lessons
          validatedModule.lessons = validatedModule.lessons.map((lesson, lessonIndex) => ({
            title: lesson.title || `Lesson ${lessonIndex + 1}`,
            content: lesson.content || '',
            duration: lesson.duration || 0,
            completed: !!lesson.completed
          }))
          
          return validatedModule
        })
        console.log("courseData: ", courseData);
        currentCourse.value = {
          id: docSnap.id,
          ...courseData
        }
        return currentCourse.value
      }
      
      console.warn('Course not found:', courseId)
      return null
    } catch (error) {
      console.error('Error fetching course:', error)
      throw error
    }
  }

  const initializeDefaultModules = async (courseData) => {
    try {
      // Map the fields from Firestore data to what the AI service expects
      const topic = courseData.title || courseData.topic
      const difficulty = courseData.difficulty || 'intermediate'
      const targetAudience = courseData.targetAudience || courseData.audience || 'developers'
      
      if (!topic) {
        throw new Error('Course title/topic is required')
      }
      
      // Generate course outline with comprehensive content
      const { sections } = await aiService.generateCourseContent({
        topic,
        difficulty,
        targetAudience
      })

      // Convert sections to modules
      const modules = sections.map(section => ({
        title: section.title,
        description: section.content.split('\n')[0] || '', // Use first line as description
        content: section.content,
        introduction: section.content,
        concepts: section.content,
        examples: section.content,
        codeSamples: [],
        bestPractices: section.content,
        exercises: section.content,
        summary: section.content,
        lessons: section.lessons || [],
        quiz: null,
        completed: false,
        order: section.order,
        duration: section.duration || 45
      }))
      
      return modules
    } catch (error) {
      console.error('Error initializing default modules:', error)
      throw error
    }
  }

  const createCourse = async (courseData) => {
    try {
      const authStore = useAuthStore()
      const user = authStore.user
      if (!user) throw new Error('User must be authenticated to create a course')

      // Generate course content using AI if description is provided
      let generatedContent = {}
      let shortDescription = ''
      
      if (courseData.description) {
        // Extract first 2-3 sentences for short description
        shortDescription = courseData.description.split('.').slice(0, 2).join('.') + '.'
        
        try {
          generatedContent = await aiService.generateCourseContent(courseData.description)
        } catch (error) {
          console.error('Error generating course content:', error)
        }
      }

      // Process the image URL if it exists
      let processedData = { ...courseData }
      if (processedData.imageUrl) {
        if (processedData.imageUrl.startsWith('blob:')) {
          delete processedData.imageUrl
        }
      }

      const now = serverTimestamp()
      const courseWithMetadata = {
        ...processedData,
        ...generatedContent,
        shortDescription,
        fullDescription: courseData.description,
        instructor: {
          id: user.uid,
          name: user.displayName || 'Unknown Instructor',
          avatar: user.photoURL || null
        },
        authorId: user.uid,
        createdBy: user.uid,
        createdAt: now,
        updatedAt: now,
        lastUpdated: now,
        modules: processedData.modules || generatedContent.modules || await initializeDefaultModules(courseData),
        resources: processedData.resources || [],
        quizzes: processedData.quizzes || generatedContent.quizzes || [],
        enrolledStudents: [],
        enrolledCount: 0,
        rating: 0,
        reviews: [],
        status: courseData.status || 'draft',
        isPublished: courseData.status === 'published',
        publishDate: courseData.status === 'published' ? now : null,
        totalModules: (processedData.modules || generatedContent.modules || await initializeDefaultModules(courseData)).length,
        estimatedHours: processedData.estimatedHours || 8,
        moduleProgress: {},
        completionCriteria: {
          minQuizScore: 70,
          requiredModules: true,
          requiredAssignments: false
        },
        settings: {
          allowSkipModules: false,
          showProgressBar: true,
          enableDiscussions: true,
          enablePeerReview: false
        }
      }

      // Add the course to Firestore
      const docRef = await addDoc(collection(db, 'courses'), courseWithMetadata)
      
      // Update local state
      userCourses.value.push({
        id: docRef.id,
        ...courseWithMetadata
      })

      return {
        id: docRef.id,
        ...courseWithMetadata
      }
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  }

  const updateCourse = async (courseId, courseData) => {
    try {
      const courseRef = doc(db, 'courses', courseId)
      await updateDoc(courseRef, {
        ...courseData,
        updatedAt: serverTimestamp()
      })
      
      // Update both user courses and all courses
      const updateInArray = (array) => {
        const index = array.findIndex(c => c.id === courseId)
        if (index !== -1) {
          array[index] = {
            ...array[index],
            ...courseData
          }
        }
      }
      
      updateInArray(userCourses.value)
      updateInArray(allCourses.value)
      
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    }
  }

  const deleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId))
      userCourses.value = userCourses.value.filter(c => c.id !== courseId)
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    }
  }

  const enrollInCourse = async (courseId) => {
    try {
      const auth = useAuthStore()
      if (!auth.user) throw new Error('User must be logged in to enroll')

      // Get the course data first
      const courseRef = doc(db, 'courses', courseId)
      const courseDoc = await getDoc(courseRef)
      
      if (!courseDoc.exists()) {
        throw new Error('Course not found')
      }

      // Get all course data
      const courseData = courseDoc.data()
      console.log('Course data from courses collection:', courseData)

      // Create enrollment document with entire course data
      const enrollmentRef = collection(db, 'enrollments')
      const enrollmentData = {
        userId: auth.user.uid,
        courseId: courseId,
        enrolledAt: serverTimestamp(),
        status: 'active',
        progress: 0,
        ...courseData  // Copy all course data directly
      }
      
      console.log('Data being saved to enrollments:', enrollmentData)
      
      await addDoc(enrollmentRef, enrollmentData)

      // Fetch updated enrolled courses
      await fetchEnrolledCourses(auth.user.uid)
      
      return true
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw error
    }
  }

  const updateProgress = async (courseId, userId, progress) => {
    try {
      const studyStatsStore = useStudyStatsStore()
      
      // Update existing progress
      const enrollmentRef = doc(db, 'enrollments', `${userId}_${courseId}`)
      await updateDoc(enrollmentRef, {
        progress: progress,
        lastAccessed: serverTimestamp()
      })

      // Log activity
      await studyStatsStore.logActivity(userId, {
        type: progress === 100 ? 'completion' : 'progress',
        courseId,
        progress,
        timestamp: new Date().toISOString()
      })

      // If course completed, update completed courses
      if (progress === 100) {
        await studyStatsStore.updateCompletedCourse(userId, courseId)
      }

      // Refresh user courses
      await fetchUserCourses(userId)
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  const generateCourseOutline = async (topic, difficulty, targetAudience) => {
    try {
      loading.value = true
      const response = await aiService.generateCourseContent({
        topic,
        difficulty,
        targetAudience
      })

      // Transform the sections into modules with lessons
      const courseData = {
        title: topic,
        difficulty,
        targetAudience,
        modules: response.sections.map((section, index) => ({
          title: section.title,
          description: section.content,
          duration: section.duration || 30,
          order: index + 1,
          completed: false,
          lessons: [
            {
              title: section.title,
              content: section.content,
              duration: section.duration || 30,
              completed: false
            }
          ]
        }))
      }

      return courseData
    } catch (error) {
      console.error('Error generating course outline:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getUserStreak = async (userId) => {
    try {
      // Query enrollments collection for user's activity
      const q = query(
        collection(db, 'enrollments'),
        where('userId', '==', userId),
        orderBy('enrolledAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) return 0

      // Get the most recent activity
      const activities = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        enrolledAt: doc.data().enrolledAt?.toDate() || new Date()
      }))

      // Calculate streak based on continuous daily activity
      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < activities.length; i++) {
        const activityDate = new Date(activities[i].enrolledAt)
        activityDate.setHours(0, 0, 0, 0)
        
        if (i === 0) {
          // Check if the most recent activity was today or yesterday
          const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24))
          if (daysDiff > 1) break // Streak is broken
          streak = 1
        } else {
          // Check if this activity was the day before the previous one
          const prevDate = new Date(activities[i - 1].enrolledAt)
          prevDate.setHours(0, 0, 0, 0)
          const daysDiff = Math.floor((prevDate - activityDate) / (1000 * 60 * 60 * 24))
          if (daysDiff === 1) streak++
          else break // Streak is broken
        }
      }

      return streak
    } catch (error) {
      console.error('Error getting user streak:', error)
      return 0
    }
  }

  const startLesson = async (courseId, lessonId, userId) => {
    try {
      const timeTrackingRef = await addDoc(collection(db, 'timeTracking'), {
        courseId,
        lessonId,
        userId,
        startTime: serverTimestamp(),
        endTime: null
      })
      return timeTrackingRef.id
    } catch (error) {
      console.error('Error starting lesson:', error)
      throw error
    }
  }

  const endLesson = async (timeTrackingId) => {
    try {
      const studyStatsStore = useStudyStatsStore()
      const timeTrackingRef = doc(db, 'timeTracking', timeTrackingId)
      const timeTrackingDoc = await getDoc(timeTrackingRef)
      
      if (!timeTrackingDoc.exists()) {
        console.warn('Time tracking document not found:', timeTrackingId)
        return 0 // Return 0 hours if document doesn't exist
      }

      const data = timeTrackingDoc.data()
      await updateDoc(timeTrackingRef, {
        endTime: serverTimestamp()
      })

      // Calculate time spent in hours
      const startTime = data.startTime.toDate()
      const endTime = new Date()
      const timeSpentHours = (endTime - startTime) / (1000 * 60 * 60)

      // Update study stats
      if (data.userId && data.courseId) {
        await studyStatsStore.updateStudySession(data.userId, data.courseId, timeSpentHours)
      }

      return timeSpentHours
    } catch (error) {
      console.error('Error ending lesson:', error)
      return 0 // Return 0 hours on error
    }
  }

  const getTimeSpentOnCourse = async (courseId, userId) => {
    try {
      const q = query(
        collection(db, 'timeTracking'),
        where('courseId', '==', courseId),
        where('userId', '==', userId),
        where('endTime', '!=', null)
      )
      const timeSnapshot = await getDocs(q)
      
      const totalMinutes = timeSnapshot.docs.reduce((total, doc) => {
        return total + (doc.data().timeSpentMinutes || 0)
      }, 0)

      return totalMinutes
    } catch (error) {
      console.error('Error getting time spent:', error)
      return 0
    }
  }

  const fixExistingCourses = async () => {
    try {
      const coursesRef = collection(db, 'courses')
      const snapshot = await getDocs(coursesRef)
      
      const updates = []
      
      for (const doc of snapshot.docs) {
        const courseData = doc.data()
        if (!courseData.modules || courseData.modules.length === 0) {
          // Ensure we have all required fields
          if (!courseData.topic || !courseData.difficulty || !courseData.targetAudience) {
            continue;
          }

          const modules = await initializeDefaultModules({
            topic: courseData.topic,
            difficulty: courseData.difficulty,
            targetAudience: courseData.targetAudience
          })

          updates.push(updateDoc(doc.ref, {
            modules,
            totalModules: modules.length,
            updatedAt: serverTimestamp()
          }))
        }
      }
      
      await Promise.all(updates)
    } catch (error) {
      console.error('Error fixing existing courses:', error)
      throw error
    }
  }

  return {
    // State
    userCourses,
    enrolledCourses,
    allCourses,
    currentCourse,
    loading,

    // Getters
    getAllCourses,
    getUserCourses,
    getEnrolledCourses,
    getCurrentCourse,
    isEnrolled,

    // Actions
    fetchUserCourses,
    fetchAllCourses,
    fetchEnrolledCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    updateProgress,
    generateCourseOutline,
    getUserStreak,
    startLesson,
    endLesson,
    getTimeSpentOnCourse,
    fixExistingCourses
  }
})
