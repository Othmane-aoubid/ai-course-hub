const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
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
    enum: ['completion', 'engagement', 'performance', 'contribution'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  criteria: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  achieved: {
    type: Boolean,
    default: false
  },
  achievedAt: Date,
  icon: String,
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ user: 1, course: 1, type: 1 });
achievementSchema.index({ course: 1, type: 1, achieved: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
