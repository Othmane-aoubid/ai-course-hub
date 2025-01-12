const Course = require('../models/Course');
const User = require('../models/User');

// Get course students
exports.getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find students enrolled in the course
    const students = await User.find({
      enrolledCourses: courseId,
      role: 'student'
    })
    .select('_id name email avatar')
    .sort('name');

    res.json(students);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ message: 'Failed to fetch course students' });
  }
};
