const Submission = require('../models/Submission');

// Create submission
const createSubmission = async (req, res) => {
  try {
    const { problemId, examId, code, language } = req.body;

    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      exam: examId,
      code,
      language,
      status: 'pending'
    });

    // TODO: Add code execution logic here

    res.status(201).json({
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user submissions
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title')
      .populate('exam', 'title')
      .sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSubmission,
  getSubmissions
};