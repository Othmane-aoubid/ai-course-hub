import { defineStore } from 'pinia'
import axios from 'axios'
import { activityTrackingService } from '@/services/activityTracking'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    courseEngagement: {
      loading: false,
      error: null,
      data: {
        totalStudents: 0,
        activeStudents: 0,
        completionRate: 0,
        dailyEngagement: [],
        weeklyEngagement: [],
        monthlyEngagement: []
      }
    },
    studentActivity: {
      loading: false,
      error: null,
      recentActivities: [], 
      activitySummary: {
        courseAccess: 0,
        contentInteractions: 0,
        assessmentAttempts: 0,
        discussionPosts: 0
      }
    }
  }),

  getters: {
    isLoadingEngagement: (state) => state.courseEngagement.loading,
    engagementError: (state) => state.courseEngagement.error,
    engagementData: (state) => state.courseEngagement.data,
    
    activeStudentRate: (state) => {
      const { totalStudents, activeStudents } = state.courseEngagement.data
      return totalStudents ? (activeStudents / totalStudents) * 100 : 0
    },
    
    engagementChartData: (state) => {
      return {
        daily: state.courseEngagement.data.dailyEngagement || [],
        weekly: state.courseEngagement.data.weeklyEngagement || [],
        monthly: state.courseEngagement.data.monthlyEngagement || []
      }
    },

    isLoadingActivity: (state) => state.studentActivity.loading,
    activityError: (state) => state.studentActivity.error,
    recentActivities: (state) => state.studentActivity.recentActivities || [], 
    activitySummary: (state) => state.studentActivity.activitySummary
  },

  actions: {
    async fetchCourseEngagement(courseId = null) {
      this.courseEngagement.loading = true
      this.courseEngagement.error = null
      
      try {
        const endpoint = courseId 
          ? `/api/analytics/engagement/${courseId}`
          : '/api/analytics/engagement'
        
        const response = await axios.get(endpoint)
        
        this.courseEngagement.data = {
          ...this.courseEngagement.data,
          ...response.data
        }
      } catch (error) {
        this.courseEngagement.error = error.response?.data?.message || 'Failed to fetch engagement data'
        console.error('Error fetching course engagement:', error)
      } finally {
        this.courseEngagement.loading = false
      }
    },

    async fetchStudentActivity(courseId = null) {
      this.studentActivity.loading = true
      this.studentActivity.error = null
      
      try {
        const endpoint = courseId 
          ? `/api/analytics/activity/${courseId}`
          : '/api/analytics/activity'
        
        const response = await axios.get(endpoint)
        
        this.studentActivity.recentActivities = response.data.recentActivities || []
        this.studentActivity.activitySummary = {
          ...this.studentActivity.activitySummary,
          ...response.data.summary
        }
      } catch (error) {
        this.studentActivity.error = error.response?.data?.message || 'Failed to fetch student activity'
        console.error('Error fetching student activity:', error)
      } finally {
        this.studentActivity.loading = false
      }
    },

    async trackCourseAccess(courseId) {
      try {
        await activityTrackingService.trackCourseAccess(courseId)
        await this.fetchStudentActivity(courseId)
      } catch (error) {
        console.error('Error tracking course access:', error)
      }
    },

    async trackContentInteraction(courseId, contentId, contentType, action) {
      try {
        await activityTrackingService.trackContentInteraction(courseId, contentId, contentType, action)
        await this.fetchStudentActivity(courseId)
      } catch (error) {
        console.error('Error tracking content interaction:', error)
      }
    },

    async trackAssessmentActivity(courseId, assessmentId, assessmentType, action) {
      try {
        await activityTrackingService.trackAssessmentActivity(courseId, assessmentId, assessmentType, action)
        await this.fetchStudentActivity(courseId)
      } catch (error) {
        console.error('Error tracking assessment activity:', error)
      }
    },

    async trackDiscussionActivity(courseId, discussionId, action) {
      try {
        await activityTrackingService.trackDiscussionActivity(courseId, discussionId, action)
        await this.fetchStudentActivity(courseId)
      } catch (error) {
        console.error('Error tracking discussion activity:', error)
      }
    }
  }
})
