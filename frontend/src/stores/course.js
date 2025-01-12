import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useCourseStore = defineStore('course', () => {
  const db = getFirestore()
  const storage = getStorage()
  
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch instructor's courses
  const fetchInstructorCourses = async (instructorId) => {
    loading.value = true
    error.value = null
    try {
      const q = query(collection(db, 'courses'), where('instructorId', '==', instructorId))
      const querySnapshot = await getDocs(q)
      courses.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching courses:', err)
    } finally {
      loading.value = false
    }
  }

  // Create new course
  const createCourse = async (courseData) => {
    loading.value = true
    error.value = null
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error creating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update existing course
  const updateCourse = async (courseId, courseData) => {
    loading.value = true
    error.value = null
    try {
      const courseRef = doc(db, 'courses', courseId)
      await updateDoc(courseRef, {
        ...courseData,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      error.value = err.message
      console.error('Error updating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Upload course media
  const uploadMedia = async (file, courseId) => {
    loading.value = true
    error.value = null
    try {
      const fileRef = storageRef(storage, `courses/${courseId}/${file.name}`)
      await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(fileRef)
      return downloadURL
    } catch (err) {
      error.value = err.message
      console.error('Error uploading media:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get single course
  const getCourse = async (courseId) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'courses', courseId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      throw new Error('Course not found')
    } catch (err) {
      error.value = err.message
      console.error('Error fetching course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    fetchInstructorCourses,
    createCourse,
    updateCourse,
    uploadMedia,
    getCourse
  }
}, {
  persist: true
})
