const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
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
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  watchedSegments: [{
    start: Number,
    end: Number
  }],
  lastPosition: {
    type: Number,
    default: 0
  },
  playbackRates: [{
    timestamp: Date,
    rate: Number
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  totalWatchTime: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
videoProgressSchema.index({ user: 1, course: 1, video: 1 });
videoProgressSchema.index({ course: 1, video: 1, completed: 1 });

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
