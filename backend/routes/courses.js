const express = require('express');
const router = express.Router();
const { getCourseStudents } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// Base route: /api/courses

// Get students enrolled in a course
router.get('/:courseId/students', protect, authorize('instructor', 'admin'), getCourseStudents);

module.exports = router;
