const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById, getReportImage } = require('../controllers/reportController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/damage-reports
router.post('/damage-reports', upload.single('image'), createReport);

// GET /api/damage-reports
router.get('/damage-reports', getReports);

// GET /api/damage-reports/:id
router.get('/damage-reports/:id', getReportById);

// GET /api/damage-reports/report/:id/image/:type
router.get('/damage-reports/report/:id/image/:type', getReportImage);

module.exports = router;