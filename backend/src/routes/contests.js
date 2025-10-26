const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', contestController.getAllContests);
router.get('/:id', contestController.getContestById);
router.get('/:id/leaderboard', contestController.getContestLeaderboard);

// User routes
router.post('/:id/register', authenticate, contestController.registerContest);

// Admin routes
router.post('/', authenticate, isAdmin, contestController.createContest);

module.exports = router;