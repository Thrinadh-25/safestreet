const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  imageUri: {
    type: String,
    required: [true, 'Image URI is required'],
  },
  imageMetadata: {
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    dimensions: {
      width: Number,
      height: Number,
    },
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    accuracy: {
      type: Number,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed'],
    default: 'pending',
    index: true,
  },
  aiAnalysis: {
    damageType: {
      type: String,
      enum: ['Pothole', 'Surface Crack', 'Surface Wear', 'Edge Damage', 'Other'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    recommendations: [{
      type: String,
    }],
    processingTime: {
      type: Number, // in seconds
    },
    modelVersion: {
      type: String,
      default: '1.0.0',
    },
  },
  repairStatus: {
    type: String,
    enum: ['Reported', 'In Progress', 'Completed', 'Rejected'],
    default: 'Reported',
    index: true,
  },
  processedAt: {
    type: Date,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Compound indexes for efficient queries
uploadSchema.index({ userId: 1, status: 1 });
uploadSchema.index({ userId: 1, createdAt: -1 });
uploadSchema.index({ status: 1, createdAt: -1 });
uploadSchema.index({ repairStatus: 1, createdAt: -1 });
uploadSchema.index({ 'aiAnalysis.severity': 1, createdAt: -1 });
uploadSchema.index({ 'aiAnalysis.damageType': 1, createdAt: -1 });

// Geospatial index for location-based queries
uploadSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Virtual for populated user data
uploadSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtual fields are serialized
uploadSchema.set('toJSON', { virtuals: true });
uploadSchema.set('toObject', { virtuals: true });

// Static method to get uploads with user data
uploadSchema.statics.findWithUser = function(query = {}) {
  return this.find(query).populate('user', 'fullName email phone');
};

// Static method to get dashboard stats
uploadSchema.statics.getDashboardStats = async function() {
  const totalUploads = await this.countDocuments();
  const pendingReports = await this.countDocuments({ status: 'pending' });
  const completedRepairs = await this.countDocuments({ repairStatus: 'Completed' });
  const criticalIssues = await this.countDocuments({ 'aiAnalysis.severity': 'Critical' });
  
  return {
    totalUploads,
    pendingReports,
    completedRepairs,
    criticalIssues,
  };
};

// Instance method to simulate AI processing
uploadSchema.methods.processWithAI = async function() {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI analysis results
  const damageTypes = ['Pothole', 'Surface Crack', 'Surface Wear', 'Edge Damage'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const recommendations = {
    'Pothole': ['Immediate repair required', 'Traffic diversion recommended'],
    'Surface Crack': ['Schedule repair within 2 weeks', 'Monitor for expansion'],
    'Surface Wear': ['Plan resurfacing', 'Regular monitoring needed'],
    'Edge Damage': ['Repair edge structure', 'Check drainage system'],
  };
  
  const damageType = damageTypes[Math.floor(Math.random() * damageTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  this.status = 'success';
  this.aiAnalysis = {
    damageType,
    severity,
    confidence: 0.8 + Math.random() * 0.2, // 80-100% confidence
    recommendations: recommendations[damageType] || ['General repair needed'],
    processingTime: 1.5 + Math.random() * 2, // 1.5-3.5 seconds
    modelVersion: '1.0.0',
  };
  this.processedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Upload', uploadSchema);