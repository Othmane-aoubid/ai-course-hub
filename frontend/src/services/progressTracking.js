import axios from 'axios'

class ProgressTrackingService {
  // Track video progress
  async trackVideoProgress(courseId, videoId, data) {
    return axios.post(`/api/analytics/video-progress/${courseId}/${videoId}`, {
      currentTime: data.currentTime,
      duration: data.duration,
      playbackRate: data.playbackRate,
      watchedSegments: data.watchedSegments,
      completed: data.completed
    })
  }

  // Track content completion
  async markContentComplete(courseId, contentId, contentType) {
    return axios.post(`/api/analytics/content-completion/${courseId}`, {
      contentId,
      contentType,
      completedAt: new Date().toISOString()
    })
  }

  // Get video analytics
  async getVideoAnalytics(courseId, videoId) {
    return axios.get(`/api/analytics/video-analytics/${courseId}/${videoId}`)
  }

  // Get course completion stats
  async getCourseCompletionStats(courseId) {
    return axios.get(`/api/analytics/completion-stats/${courseId}`)
  }

  // Get student progress
  async getStudentProgress(courseId, studentId = null) {
    const url = studentId 
      ? `/api/analytics/student-progress/${courseId}/${studentId}`
      : `/api/analytics/student-progress/${courseId}`
    return axios.get(url)
  }
}

export const progressTrackingService = new ProgressTrackingService()
