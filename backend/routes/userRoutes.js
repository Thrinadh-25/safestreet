const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Upload = require('../models/Upload');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
];

// GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
});

// PUT /api/user/profile
router.put('/profile', updateProfileValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { fullName, phone, profileImage } = req.body;
    const userId = req.user._id;

    // Update user
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
});

// DELETE /api/user/delete
router.delete('/delete', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user uploads to delete associated files
    const uploads = await Upload.find({ userId });

    // TODO: Delete actual image files from storage
    // For now, we'll just delete from database
    
    // Delete all uploads from database
    await Upload.deleteMany({ userId });

    // Soft delete user account
    await req.user.softDelete();

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
    });
  }
});

// GET /api/user/stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    const totalUploads = await Upload.countDocuments({ userId });
    const pendingUploads = await Upload.countDocuments({ userId, status: 'pending' });
    const completedRepairs = await Upload.countDocuments({ userId, repairStatus: 'Completed' });
    const criticalIssues = await Upload.countDocuments({ 
      userId, 
      'aiAnalysis.severity': 'Critical' 
    });

    res.json({
      success: true,
      data: {
        totalUploads,
        pendingUploads,
        completedRepairs,
        criticalIssues,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics',
    });
  }
});

module.exports = router;