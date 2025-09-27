const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, handleValidationErrors, updateProfile);
router.post('/change-password', changePasswordValidation, handleValidationErrors, changePassword);

module.exports = router;