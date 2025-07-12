const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const stream = require("stream");
const { v4: uuidv4 } = require("uuid");

const sendSeverityAlert = require("./mailer").sendSeverityAlert;
const sendResolvedEmail = require("./mailer").sendResolvedEmail;
const Analysis = require("./models/Analysis");
const Report = require("./models/Report");
const Repair = require("./models/Repair");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

const CLASS_LABELS = ["Longitudinal Crack", "Transverse Crack", "Alligator Crack", "Block Crack"];
const SEVERITY_LABELS = ["Low", "Medium", "High"];

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Upload and Analyze
app.post("/upload-and-analyze", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const readableStream = new stream.PassThrough();
  readableStream.end(req.file.buffer);

  const form1 = new FormData();
  form1.append("image", readableStream, {
    filename: req.file.originalname || "upload.jpg",
    contentType: req.file.mimetype || "image/jpeg"
  });

  try {
    const imageResponse = await axios.post("http://localhost:5000/analyze/annotate", form1, {
      headers: form1.getHeaders(),
      responseType: "stream",
      timeout: 15000
    });

    const filename = `annotated_${Date.now()}.png`;
    const savePath = path.join(__dirname, "public/uploads", filename);
    const writer = fs.createWriteStream(savePath);
    imageResponse.data.pipe(writer);

    writer.on("finish", async () => {
      const form2 = new FormData();
      form2.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      try {
        const jsonResponse = await axios.post("http://localhost:5000/analyze/json", form2, {
          headers: form2.getHeaders(),
          timeout: 50000
        });

        const { type, severity, bbox, summary } = jsonResponse.data;
        const predicted_class = CLASS_LABELS.indexOf(type);
        const severityIndex = SEVERITY_LABELS.indexOf(severity);

        if (predicted_class === -1 || severityIndex === -1) {
          return res.status(400).json({ error: "Invalid class or severity label received from model" });
        }

        const annotatedImageBuffer = fs.readFileSync(savePath);
        const email = req.body.email || "user@example.com";
        const reportId = `rep_${uuidv4()}`;

        // Save to Analysis
        const newAnalysis = new Analysis({
          predictedClass: predicted_class,
          severity: severityIndex,
          bbox,
          imageData: annotatedImageBuffer,
          contentType: "image/png",
          damageType: type,
          severityLabel: severity,
          summary: summary || `Detected ${type} with ${severity} severity.`,
          createdAt: new Date()
        });
        await newAnalysis.save();

        // Save to Report
        const newReport = new Report({
          reportId,
          location: "Unknown",
          email,
          damageType: type,
          severity,
          priority: severity === "High" ? "High" : severity === "Medium" ? "Medium" : "Low",
          description: summary || `Detected ${type} with ${severity} severity.`,
          imageData: annotatedImageBuffer,
          contentType: "image/png",
          createdAt: new Date()
        });
        await newReport.save();

        // Create Repair entry
        await Repair.create({
          reportId: newReport._id,
          email,
          status: "pending"
        });

        // Send alert email
        try {
          await sendSeverityAlert({
            damageType: type,
            severityLabel: severity,
            file: {
              buffer: annotatedImageBuffer,
              filename,
              contentType: "image/png"
            }
          });
        } catch (emailErr) {
          console.error("❌ Alert email error:", emailErr.message);
        }

        res.status(200).json({
          predicted_class,
          damage_type: type,
          severity: severityIndex,
          severity_label: severity,
          bbox,
          summary: summary || `Detected ${type} with ${severity} severity.`,
          image_url: `/reports/${newReport._id}/image`
          report_id: reportId
        });

      } catch (jsonErr) {
        console.error("❌ JSON error:", jsonErr.message);
        res.status(500).json({ error: "JSON analysis failed" });
      }
    });

    writer.on("error", (err) => {
      console.error("❌ Image save error:", err.message);
      res.status(500).json({ error: "Image save failed" });
    });

  } catch (err) {
    console.error("❌ Annotate error:", err.message);
    res.status(500).json({ error: "Annotation failed" });
  }
});

// Serve image
app.get("/reports/:id/image", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.imageData) return res.status(404).send("Image not found");

    res.set("Content-Type", report.contentType);
    res.send(report.imageData);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// List all reports
app.get("/api/images/reports", async (req, res) => {
  try {
    const reports = await Report.find().lean();
    const formatted = reports.map(r => ({
      id: r._id,
      email: r.email,
      damageType: r.damageType,
      severity: r.severity,
      priority: r.priority,
      createdAt: r.createdAt,
      image: `/reports/${r._id}/image`,
      description: r.description
    }));
    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching reports:", err.message);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// === 🔧 REPAIRS ROUTES ===

// Get all repairs
app.get("/api/repairs", async (req, res) => {
  try {
    const repairs = await Repair.find().sort({ createdAt: -1 });
    res.status(200).json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark repair as completed + send email
app.patch("/api/repairs/:id/complete", async (req, res) => {
  try {
    const repair = await Repair.findByIdAndUpdate(
      req.params.id,
      { status: "completed", completedAt: new Date() },
      { new: true }
    );

    if (!repair) return res.status(404).json({ message: "Repair not found" });

    await sendResolvedEmail(repair.email, repair.reportId);
    res.status(200).json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
