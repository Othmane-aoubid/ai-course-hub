import axios from 'axios'

class StudentProgressService {
  // Get individual student progress
  async getStudentProgress(courseId, studentId = null) {
    const url = studentId 
      ? `/api/analytics/student-progress/${courseId}/${studentId}`
      : `/api/analytics/student-progress/${courseId}`
    return axios.get(url)
  }

  // Get class performance metrics
  async getClassMetrics(courseId) {
    return axios.get(`/api/analytics/class-metrics/${courseId}`)
  }

  // Get achievement milestones
  async getAchievements(courseId, studentId = null) {
    const url = studentId
      ? `/api/analytics/achievements/${courseId}/${studentId}`
      : `/api/analytics/achievements/${courseId}`
    return axios.get(url)
  }

  // Get learning path progress
  async getLearningPathProgress(courseId, studentId) {
    return axios.get(`/api/analytics/learning-path/${courseId}/${studentId}`)
  }

  // Get skill acquisition data
  async getSkillAcquisition(courseId, studentId) {
    return axios.get(`/api/analytics/skills/${courseId}/${studentId}`)
  }

  // Get comparative analysis
  async getComparativeAnalysis(courseId, studentId) {
    return axios.get(`/api/analytics/comparative/${courseId}/${studentId}`)
  }
}

export const studentProgressService = new StudentProgressService()
