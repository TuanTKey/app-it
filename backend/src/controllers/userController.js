const User = require('../models/User');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get statistics
    const totalSubmissions = await Submission.countDocuments({ 
      userId: user._id 
    });

    const acceptedSubmissions = await Submission.countDocuments({
      userId: user._id,
      status: 'accepted'
    });

    const solvedProblems = await Submission.distinct('problemId', {
      userId: user._id,
      status: 'accepted'
    });

    // Get difficulty breakdown
    const solvedProblemDetails = await Problem.find({
      _id: { $in: solvedProblems }
    }).select('difficulty');

    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    solvedProblemDetails.forEach(p => {
      difficultyBreakdown[p.difficulty]++;
    });

    // Get recent submissions
    const recentSubmissions = await Submission.find({
      userId: user._id
    })
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      statistics: {
        totalSubmissions,
        acceptedSubmissions,
        solvedProblems: solvedProblems.length,
        difficultyBreakdown,
        acceptanceRate: totalSubmissions > 0 
          ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
          : 0
      },
      recentSubmissions
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const users = await User.find()
      .select('username fullName rating solvedProblems avatar')
      .sort({ rating: -1, solvedProblems: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments();

    const leaderboard = users.map((user, index) => ({
      rank: (page - 1) * limit + index + 1,
      ...user.toObject()
    }));

    res.json({
      leaderboard,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};