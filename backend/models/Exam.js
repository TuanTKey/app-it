const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Exam description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  maxSubmissions: {
    type: Number,
    default: 3,
    min: [1, 'Max submissions must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
examSchema.index({ startTime: 1, endTime: 1 });
examSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Exam', examSchema);