const Report = require('../models/Report');
const path = require('path');
const fs = require('fs');

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { title, description, location, region, damageType, severity, priority, action } = req.body;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const report = new Report({
      title,
      description,
      location,
      region,
      damageType,
      severity,
      priority,
      action,
      image: req.file ? req.file.path : null // Assuming multer for file upload
    });

    await report.save();
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get report image
exports.getReportImage = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imagePath = path.resolve(report.image);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Get report image error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};