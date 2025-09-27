const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 1
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Problem description is required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number, // in seconds
    default: 2,
    min: [1, 'Time limit must be at least 1 second']
  },
  memoryLimit: {
    type: Number, // in MB
    default: 256,
    min: [16, 'Memory limit must be at least 16MB']
  },
  starterCode: {
    type: String,
    default: ''
  },
  languages: [{
    type: String,
    enum: ['c', 'cpp', 'java', 'python', 'javascript'],
    required: true
  }],
  testCases: [testCaseSchema],
  sampleTestCases: [{
    input: String,
    expectedOutput: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);