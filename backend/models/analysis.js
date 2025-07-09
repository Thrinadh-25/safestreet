const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  predictedClass: Number,
  severity: Number,
  bbox: [Number],
  imageData: Buffer,             
  contentType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ THIS exports a usable Mongoose model (a constructor)
module.exports = mongoose.model("Analysis", analysisSchema);
