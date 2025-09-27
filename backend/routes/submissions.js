const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createSubmission,
  getSubmissions
} = require('../controllers/submissionController');

const router = express.Router();

// Validation rules
const submissionValidation = [
  body('problemId')
    .isMongoId()
    .withMessage('Valid problem ID is required'),
  body('code')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Code is required'),
  body('language')
    .isIn(['c', 'cpp', 'java', 'python', 'javascript'])
    .withMessage('Valid language is required')
];

// Routes
router.post('/', auth, submissionValidation, handleValidationErrors, createSubmission);
router.get('/', auth, getSubmissions);

module.exports = router;