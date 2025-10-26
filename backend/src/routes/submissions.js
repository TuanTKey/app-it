const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.post('/', authenticate, submissionController.submitSolution);
router.get('/my', authenticate, submissionController.getUserSubmissions);
router.get('/:id', authenticate, submissionController.getSubmissionStatus);

// Admin route
router.get('/all/admin', authenticate, isAdmin, submissionController.getAllSubmissions);

module.exports = router;