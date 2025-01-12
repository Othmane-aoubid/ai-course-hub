const express = require('express');
const router = express.Router();
const { getEngagementMetrics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Base route: /api/analytics

// Get engagement metrics (for all courses or specific course)
router.get('/engagement', protect, authorize('instructor', 'admin'), getEngagementMetrics);
router.get('/engagement/:courseId', protect, authorize('instructor', 'admin'), getEngagementMetrics);

module.exports = router;
