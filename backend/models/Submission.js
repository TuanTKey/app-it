const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  code: {
    type: String,
    required: [true, 'Code is required']
  },
  language: {
    type: String,
    enum: ['c', 'cpp', 'java', 'python', 'javascript'],
    required: [true, 'Language is required']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'compilation_error', 'runtime_error'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  passedTestCases: {
    type: Number,
    default: 0
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  results: [{
    testCase: {
      type: mongoose.Schema.Types.ObjectId
    },
    status: {
      type: String,
      enum: ['passed', 'failed', 'error']
    },
    output: String,
    expectedOutput: String,
    executionTime: Number
  }]
}, {
  timestamps: true
});

// Index for better query performance
submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);