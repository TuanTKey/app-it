const Exam = require('../models/Exam');
const Problem = require('../models/Problem');

// Create exam
const createExam = async (req, res) => {
  try {
    const { title, description, startTime, endTime, duration, maxSubmissions } = req.body;
    
    const exam = await Exam.create({
      title,
      description,
      startTime,
      endTime,
      duration,
      maxSubmissions,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('createdBy', 'name email')
      .populate('problems', 'title difficulty')
      .sort({ createdAt: -1 });

    res.json({ exams });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single exam
const getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('problems');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({ exam });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createExam,
  getExams,
  getExam
};