const Problem = require('../models/Problem');

// Create problem
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      timeLimit,
      memoryLimit,
      starterCode,
      languages,
      testCases,
      sampleTestCases,
      examId
    } = req.body;

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      timeLimit,
      memoryLimit,
      starterCode,
      languages,
      testCases,
      sampleTestCases,
      exam: examId,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get problems
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate('createdBy', 'name email')
      .populate('exam', 'title')
      .sort({ createdAt: -1 });

    res.json({ problems });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProblem,
  getProblems
};