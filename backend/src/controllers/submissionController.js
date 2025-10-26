const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');
const judgeService = require('../services/judgeService');

// Submit solution
exports.submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Validate
    if (!problemId || !code || !language) {
      return res.status(400).json({ 
        error: 'Problem ID, code and language are required' 
      });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Get all test cases for this problem
    const testCases = await TestCase.find({ problemId });

    if (testCases.length === 0) {
      return res.status(400).json({ 
        error: 'No test cases available for this problem' 
      });
    }

    // Create submission
    const submission = await Submission.create({
      userId: req.user.id,
      problemId,
      code,
      language,
      status: 'pending',
      totalTestCases: testCases.length
    });

    // Run judge asynchronously
    judgeService.judgeSubmission(submission._id, problem, testCases, code, language);

    res.status(201).json({
      message: 'Submission received',
      submissionId: submission._id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get submission status
exports.getSubmissionStatus = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId', 'title slug')
      .populate('userId', 'username');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user owns this submission or is admin
    if (submission.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's submissions
exports.getUserSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, problemId, status } = req.query;
    
    const query = { userId: req.user.id };
    
    if (problemId) {
      query.problemId = problemId;
    }
    
    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all submissions (admin only)
exports.getAllSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const submissions = await Submission.find()
      .populate('userId', 'username')
      .populate('problemId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Submission.countDocuments();

    res.json({
      submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};