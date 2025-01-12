const express = require('express');
const router = express.Router();
const { 
  getEngagementMetrics, 
  trackVideoProgress,
  getVideoAnalytics,
  getCourseCompletionStats
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Base route: /api/analytics

// Engagement metrics
router.get('/engagement', protect, authorize('instructor', 'admin'), getEngagementMetrics);
router.get('/engagement/:courseId', protect, authorize('instructor', 'admin'), getEngagementMetrics);

// Video progress tracking
router.post('/video-progress/:courseId/:videoId', protect, trackVideoProgress);
router.get('/video-analytics/:courseId/:videoId', protect, authorize('instructor', 'admin'), getVideoAnalytics);

// Course completion
router.get('/completion-stats/:courseId', protect, authorize('instructor', 'admin'), getCourseCompletionStats);

module.exports = router;
