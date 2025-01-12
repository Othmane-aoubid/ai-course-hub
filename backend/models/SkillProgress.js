const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema({
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
  skill: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  assessments: [{
    type: {
      type: String,
      enum: ['quiz', 'assignment', 'project'],
      required: true
    },
    score: Number,
    maxScore: Number,
    completedAt: Date
  }],
  lastAssessed: Date,
  trend: {
    type: String,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable'
  }
}, {
  timestamps: true
});

// Indexes
skillProgressSchema.index({ user: 1, course: 1, skill: 1 });
skillProgressSchema.index({ course: 1, skill: 1, level: -1 });

module.exports = mongoose.model('SkillProgress', skillProgressSchema);
