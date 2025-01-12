import axios from 'axios'

class ActivityTrackingService {
  // Track when student accesses a course
  async trackCourseAccess(courseId) {
    return this.trackActivity({
      type: 'course_access',
      courseId,
      action: 'view'
    })
  }

  // Track content interaction (videos, documents)
  async trackContentInteraction(courseId, contentId, contentType, action) {
    return this.trackActivity({
      type: 'content_interaction',
      courseId,
      contentId,
      contentType, // 'video', 'document', etc.
      action // 'play', 'pause', 'download', etc.
    })
  }

  // Track quiz/assignment attempts
  async trackAssessmentActivity(courseId, assessmentId, assessmentType, action) {
    return this.trackActivity({
      type: 'assessment',
      courseId,
      assessmentId,
      assessmentType, // 'quiz', 'assignment'
      action // 'start', 'submit', 'review'
    })
  }

  // Track discussion participation
  async trackDiscussionActivity(courseId, discussionId, action) {
    return this.trackActivity({
      type: 'discussion',
      courseId,
      discussionId,
      action // 'view', 'post', 'reply', 'like'
    })
  }

  // Base method to track any activity
  async trackActivity(activityData) {
    try {
      const response = await axios.post('/api/analytics/activity', {
        timestamp: new Date().toISOString(),
        ...activityData
      })
      return response.data
    } catch (error) {
      console.error('Error tracking activity:', error)
      throw error
    }
  }
}

export const activityTrackingService = new ActivityTrackingService()
