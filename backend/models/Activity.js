const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  type: {
    type: String,
    enum: ['course_access', 'content_interaction', 'assessment', 'discussion'],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  contentType: String,
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },
  assessmentType: String,
  discussionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
activitySchema.index({ user: 1, course: 1, timestamp: -1 });
activitySchema.index({ course: 1, type: 1, timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);
