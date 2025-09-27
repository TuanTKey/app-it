const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createProblem,
  getProblems
} = require('../controllers/problemController');

const router = express.Router();

// Validation rules
const problemValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description is required'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard')
];

// Routes
router.post('/', auth, authorize('admin', 'judge'), problemValidation, handleValidationErrors, createProblem);
router.get('/', auth, getProblems);

module.exports = router;