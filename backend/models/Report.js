const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
  },
  location: String,
  email: String,
  damageType: String,
  severity: String,      // Low / Medium / High
  priority: String,
  description: String,

  imageData: Buffer,
  contentType: String,

  // ✅ ADD THIS (very important)
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
