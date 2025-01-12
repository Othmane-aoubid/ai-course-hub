const Course = require('../models/Course');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Helper function to get date range
const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

// Helper to generate engagement data
const generateEngagementData = async (courseId = null, range) => {
  const query = courseId ? { course: courseId } : {};
  const { start, end } = range;
  
  const activities = await Activity.find({
    ...query,
    timestamp: { $gte: start, $lte: end }
  }).sort('timestamp');

  return activities.reduce((acc, activity) => {
    const date = activity.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
};

exports.getEngagementMetrics = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Get total and active students
    const totalStudentsQuery = courseId ? { enrolledCourses: courseId } : {};
    const totalStudents = await User.countDocuments({ 
      ...totalStudentsQuery, 
      role: 'student' 
    });

    // Get active students (active in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeStudents = await Activity.distinct('user', {
      ...(courseId && { course: courseId }),
      timestamp: { $gte: thirtyDaysAgo }
    }).count();

    // Calculate completion rate
    let completionRate = 0;
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        const completedStudents = await User.countDocuments({
          enrolledCourses: courseId,
          'courseProgress.courseId': courseId,
          'courseProgress.completed': true
        });
        completionRate = totalStudents ? (completedStudents / totalStudents) * 100 : 0;
      }
    }

    // Generate engagement data for different time periods
    const dailyRange = getDateRange(7);  // Last 7 days
    const weeklyRange = getDateRange(28); // Last 4 weeks
    const monthlyRange = getDateRange(90); // Last 3 months

    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      generateEngagementData(courseId, dailyRange),
      generateEngagementData(courseId, weeklyRange),
      generateEngagementData(courseId, monthlyRange)
    ]);

    // Format the data for frontend
    const formatEngagementData = (data, format) => {
      return Object.entries(data).map(([date, value]) => ({
        label: format === 'daily' ? date : date.split('-')[0] + '-' + date.split('-')[1],
        value
      }));
    };

    res.json({
      totalStudents,
      activeStudents,
      completionRate: Math.round(completionRate * 10) / 10, // Round to 1 decimal
      dailyEngagement: formatEngagementData(dailyData, 'daily'),
      weeklyEngagement: formatEngagementData(weeklyData, 'weekly'),
      monthlyEngagement: formatEngagementData(monthlyData, 'monthly')
    });

  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    res.status(500).json({ message: 'Failed to fetch engagement metrics' });
  }
};
