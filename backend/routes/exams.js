const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createExam,
  getExams,
  getExam
} = require('../controllers/examController');

const router = express.Router();

// Validation rules
const examValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid date'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid date'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer')
];

// Routes
router.post('/', auth, authorize('admin', 'judge'), examValidation, handleValidationErrors, createExam);
router.get('/', auth, getExams);
router.get('/:id', auth, getExam);

module.exports = router;