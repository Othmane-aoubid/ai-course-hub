const Course = require('../models/Course');
const User = require('../models/User');
const Activity = require('../models/Activity');
const VideoProgress = require('../models/VideoProgress');

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

// Track video progress
exports.trackVideoProgress = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const { currentTime, duration, playbackRate, watchedSegments, completed } = req.body;

    let progress = await VideoProgress.findOne({
      user: req.user.id,
      course: courseId,
      video: videoId
    });

    if (!progress) {
      progress = new VideoProgress({
        user: req.user.id,
        course: courseId,
        video: videoId,
        watchedSegments: [],
        playbackRates: []
      });
    }

    // Update watched segments
    if (watchedSegments && watchedSegments.length > 0) {
      progress.watchedSegments = mergeTimeRanges([...progress.watchedSegments, ...watchedSegments]);
    }

    // Update playback rate
    if (playbackRate) {
      progress.playbackRates.push({
        timestamp: new Date(),
        rate: playbackRate
      });
    }

    // Update completion status
    if (completed && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    progress.lastPosition = currentTime;
    progress.lastUpdated = new Date();

    // Calculate total watch time
    progress.totalWatchTime = progress.watchedSegments.reduce(
      (total, segment) => total + (segment.end - segment.start),
      0
    );

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Error tracking video progress:', error);
    res.status(500).json({ message: 'Failed to track video progress' });
  }
};

// Get video analytics
exports.getVideoAnalytics = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const analytics = await VideoProgress.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
          video: mongoose.Types.ObjectId(videoId)
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          completions: { $sum: { $cond: ['$completed', 1, 0] } },
          averageWatchTime: { $avg: '$totalWatchTime' },
          playbackRates: { $push: '$playbackRates' }
        }
      }
    ]);

    // Get drop-off points
    const dropOffPoints = await VideoProgress.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
          video: mongoose.Types.ObjectId(videoId)
        }
      },
      {
        $group: {
          _id: { $floor: '$lastPosition' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const result = analytics[0] || {
      totalViews: 0,
      completions: 0,
      averageWatchTime: 0
    };

    res.json({
      ...result,
      dropOffPoints: dropOffPoints.map(point => ({
        time: point._id,
        count: point.count
      }))
    });
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    res.status(500).json({ message: 'Failed to fetch video analytics' });
  }
};

// Get course completion stats
exports.getCourseCompletionStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate('content');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalContent = course.content.length;
    const enrolledStudents = await User.countDocuments({
      enrolledCourses: courseId
    });

    const completionStats = await VideoProgress.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
          completed: true
        }
      },
      {
        $group: {
          _id: '$user',
          completedVideos: { $sum: 1 }
        }
      },
      {
        $project: {
          completionPercentage: {
            $multiply: [{ $divide: ['$completedVideos', totalContent] }, 100]
          }
        }
      }
    ]);

    const completionRates = {
      0: 0,  // 0-20%
      20: 0, // 21-40%
      40: 0, // 41-60%
      60: 0, // 61-80%
      80: 0  // 81-100%
    };

    completionStats.forEach(stat => {
      const bracket = Math.floor(stat.completionPercentage / 20) * 20;
      completionRates[bracket]++;
    });

    res.json({
      totalStudents: enrolledStudents,
      totalContent,
      completionRates,
      averageCompletion: completionStats.length > 0
        ? completionStats.reduce((acc, curr) => acc + curr.completionPercentage, 0) / completionStats.length
        : 0
    });
  } catch (error) {
    console.error('Error fetching completion stats:', error);
    res.status(500).json({ message: 'Failed to fetch completion stats' });
  }
};

// Get engagement metrics
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

// Helper function to merge time ranges
function mergeTimeRanges(ranges) {
  if (!ranges.length) return [];

  const sorted = ranges.sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (const range of sorted.slice(1)) {
    const last = merged[merged.length - 1];
    if (range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push(range);
    }
  }

  return merged;
}
