const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true, // ✅ prevent duplicates
  },
  location: String,
  email: String,
  damageType: String,
  severity: String,      // "Low", "Medium", "High"
  priority: String,      // Same as severity or derived from it
  description: String,
  imageData: Buffer,     // Annotated image
  contentType: String,   // MIME type like "image/png"
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
