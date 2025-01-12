const Course = require('../models/Course');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const SkillProgress = require('../models/SkillProgress');
const VideoProgress = require('../models/VideoProgress');
const Activity = require('../models/Activity');

// Get individual student progress
exports.getStudentProgress = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const userId = studentId || req.user.id;

    // Get course details
    const course = await Course.findById(courseId).populate('content');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get content completion
    const completedContent = await VideoProgress.countDocuments({
      user: userId,
      course: courseId,
      completed: true
    });

    // Get achievements
    const achievements = await Achievement.find({
      user: userId,
      course: courseId
    }).sort('order');

    // Get skill progress
    const skills = await SkillProgress.find({
      user: userId,
      course: courseId
    });

    // Calculate overall progress
    const totalContent = course.content.length;
    const progressPercentage = totalContent > 0 
      ? (completedContent / totalContent) * 100 
      : 0;

    // Get recent activities
    const recentActivities = await Activity.find({
      user: userId,
      course: courseId
    })
    .sort('-timestamp')
    .limit(5);

    res.json({
      overallProgress: Math.round(progressPercentage * 10) / 10,
      completedContent,
      totalContent,
      achievements: achievements.map(a => ({
        title: a.title,
        type: a.type,
        progress: a.progress,
        achieved: a.achieved,
        achievedAt: a.achievedAt,
        icon: a.icon
      })),
      skills: skills.map(s => ({
        name: s.skill,
        category: s.category,
        level: s.level,
        trend: s.trend
      })),
      recentActivities: recentActivities.map(a => ({
        type: a.type,
        action: a.action,
        timestamp: a.timestamp
      }))
    });

  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ message: 'Failed to fetch student progress' });
  }
};

// Get class metrics
exports.getClassMetrics = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get enrolled students
    const enrolledStudents = await User.countDocuments({
      enrolledCourses: courseId
    });

    // Get completion statistics
    const completionStats = await VideoProgress.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId)
        }
      },
      {
        $group: {
          _id: '$user',
          completedVideos: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);

    // Calculate performance metrics
    const performanceData = await SkillProgress.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId)
        }
      },
      {
        $group: {
          _id: '$skill',
          averageLevel: { $avg: '$level' },
          distribution: {
            $push: '$level'
          }
        }
      }
    ]);

    // Process performance data
    const skillMetrics = performanceData.map(skill => ({
      skill: skill._id,
      averageLevel: Math.round(skill.averageLevel * 10) / 10,
      distribution: calculateDistribution(skill.distribution)
    }));

    res.json({
      enrolledStudents,
      completionStats: {
        totalStudents: enrolledStudents,
        completedCount: completionStats.length,
        averageCompletion: calculateAverageCompletion(completionStats)
      },
      skillMetrics,
      trends: await calculateTrends(courseId)
    });

  } catch (error) {
    console.error('Error fetching class metrics:', error);
    res.status(500).json({ message: 'Failed to fetch class metrics' });
  }
};

// Helper function to calculate distribution
function calculateDistribution(values) {
  const distribution = {
    0: 0,  // 0-20
    20: 0, // 21-40
    40: 0, // 41-60
    60: 0, // 61-80
    80: 0  // 81-100
  };

  values.forEach(value => {
    const bracket = Math.floor(value / 20) * 20;
    distribution[bracket]++;
  });

  return distribution;
}

// Helper function to calculate average completion
function calculateAverageCompletion(stats) {
  if (!stats.length) return 0;
  const total = stats.reduce((sum, stat) => sum + stat.completedVideos, 0);
  return Math.round((total / stats.length) * 10) / 10;
}

// Helper function to calculate trends
async function calculateTrends(courseId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activities = await Activity.aggregate([
    {
      $match: {
        course: mongoose.Types.ObjectId(courseId),
        timestamp: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$timestamp'
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return activities.map(day => ({
    date: day._id,
    activityCount: day.count
  }));
}
