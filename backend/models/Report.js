const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true }, // Optional custom ID
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Failed'], 
    default: 'Pending' 
  },
  assignedTo: {
    type: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String
    },
    default: null
  },
  region: { type: String },
  location: { type: String, required: true },
  damageType: { type: String },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  priority: { type: String },
  description: { type: String },
  action: { type: String },
  image: { type: String }, // Path or reference to image file
  createdAt: { type: Date, default: Date.now }
});

// Generate reportId if not provided
reportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    this.reportId = `RPT-${this._id.toString().slice(-6)}`;
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);