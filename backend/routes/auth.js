const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  register,
  login,
  refreshToken,
  getMe,
  logout
} = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'judge', 'admin'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/refresh-token', refreshToken);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;