const express = require('express');
const { body, validationResult } = require('express-validator');
const Upload = require('../models/Upload');
const { authenticateToken } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const locationValidation = [
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('location.accuracy')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Accuracy must be a positive number'),
];

// POST /api/uploads
router.post('/', upload, handleUploadError, locationValidation, async (req, res) => {
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
    }

    const { location } = req.body;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    // Create upload record
    const uploadData = {
      userId: req.user._id,
      imageUri: `/uploads/${req.file.filename}`,
      imageMetadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        dimensions: {
          width: 0, // TODO: Get actual dimensions
          height: 0,
        },
      },
      location: {
        latitude: parseFloat(parsedLocation.latitude),
        longitude: parseFloat(parsedLocation.longitude),
        accuracy: parsedLocation.accuracy ? parseFloat(parsedLocation.accuracy) : undefined,
        timestamp: parsedLocation.timestamp ? new Date(parsedLocation.timestamp) : new Date(),
        address: parsedLocation.address,
      },
      status: 'pending',
    };

    const newUpload = new Upload(uploadData);
    await newUpload.save();

    // Process with AI in background (simulate)
    setTimeout(async () => {
      try {
        await newUpload.processWithAI();
        console.log(`✅ AI processing completed for upload ${newUpload._id}`);
      } catch (error) {
        console.error(`❌ AI processing failed for upload ${newUpload._id}:`, error);
        newUpload.status = 'failed';
        await newUpload.save();
      }
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'Upload created successfully',
      data: {
        upload: newUpload,
      },
    });
  } catch (error) {
    console.error('Upload creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create upload',
    });
  }
});

// GET /api/uploads
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      severity,
      damageType,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    // Build query
    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (severity) query['aiAnalysis.severity'] = severity;
    if (damageType) query['aiAnalysis.damageType'] = damageType;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get uploads with pagination
    const uploads = await Upload.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'fullName email');

    // Get total count
    const totalItems = await Upload.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      data: uploads,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get uploads',
    });
  }
});

// GET /api/uploads/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findOne({
      _id: id,
      userId: req.user._id,
    }).populate('user', 'fullName email');

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found',
      });
    }

    res.json({
      success: true,
      data: {
        upload,
      },
    });
  } catch (error) {
    console.error('Get upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload',
    });
  }
});

// PUT /api/uploads/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { repairStatus } = req.body;

    const validStatuses = ['Reported', 'In Progress', 'Completed', 'Rejected'];
    if (repairStatus && !validStatuses.includes(repairStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repair status',
      });
    }

    const upload = await Upload.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { repairStatus },
      { new: true, runValidators: true }
    ).populate('user', 'fullName email');

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found',
      });
    }

    res.json({
      success: true,
      message: 'Upload updated successfully',
      data: {
        upload,
      },
    });
  } catch (error) {
    console.error('Update upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update upload',
    });
  }
});

// DELETE /api/uploads/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found',
      });
    }

    // TODO: Delete actual image file from storage

    res.json({
      success: true,
      message: 'Upload deleted successfully',
    });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete upload',
    });
  }
});

module.exports = router;