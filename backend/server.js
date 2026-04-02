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
const reportRoutes = require("./routes/reports");


const sendSeverityAlert = require("./mailer").sendSeverityAlert;
const sendResolvedEmail = require("./mailer").sendResolvedEmail;

const Analysis = require("./models/Analysis");
const Report = require("./models/Report");
const Repair = require("./models/Repair");

const authRoutes = require("./routes/auth");
const adminAuthRoutes = require("./routes/adminAuth");

dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/reports", reportRoutes);
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/auth", adminAuthRoutes);
app.use("/api/reports", require("./routes/reportRoutes"));

console.log("✅ Auth routes mounted");

/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

/* ===================== CONSTANTS ===================== */
const CLASS_LABELS = [
  "Longitudinal Crack",
  "Transverse Crack",
  "Alligator Crack",
  "Pothole"
];

const SEVERITY_LABELS = ["Low", "Medium", "High"];

/* ===================== MULTER ===================== */
const memoryUpload = multer({ storage: multer.memoryStorage() });
const diskUpload = multer({ dest: "uploads/" });

/* ===================== TEST ROUTE ===================== */
app.get("/", (req, res) => {
  res.send("🚀 SafeStreet Backend Running");
});

/* ===================== UPLOAD & ANALYZE ===================== */
app.post(
  "/upload-and-analyze",
  memoryUpload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const readableStream = new stream.PassThrough();
    readableStream.end(req.file.buffer);

    const form1 = new FormData();
    form1.append("image", readableStream, {
      filename: req.file.originalname || "upload.jpg",
      contentType: req.file.mimetype || "image/jpeg",
    });

    try {
      const imageResponse = await axios.post(
        "http://localhost:5000/analyze/annotate",
        form1,
        {
          headers: form1.getHeaders(),
          responseType: "stream",
          timeout: 15000,
        }
      );

      const filename = `annotated_${Date.now()}.png`;
      const savePath = path.join(__dirname, "public/uploads", filename);
      const writer = fs.createWriteStream(savePath);

      imageResponse.data.pipe(writer);

      writer.on("finish", async () => {
        const form2 = new FormData();
        form2.append("image", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });

        try {
          const jsonResponse = await axios.post(
            "http://localhost:5000/analyze/json",
            form2,
            {
              headers: form2.getHeaders(),
              timeout: 50000,
            }
          );

          const { type, severity, bbox, summary } = jsonResponse.data;

          const predictedClass = CLASS_LABELS.indexOf(type);
          const severityIndex = SEVERITY_LABELS.indexOf(severity);

          if (predictedClass === -1 || severityIndex === -1) {
            return res
              .status(400)
              .json({ error: "Invalid model output" });
          }

          const annotatedImageBuffer = fs.readFileSync(savePath);
          const email = req.body.email || "user@example.com";

          const report = await Report.create({
            reportId: `rep_${uuidv4()}`,
            email,
            damageType: type,
            severity,
            priority:
              severity === "High"
                ? "High"
                : severity === "Medium"
                ? "Medium"
                : "Low",
            description:
              summary || `Detected ${type} with ${severity} severity.`,
            imageData: annotatedImageBuffer,
            contentType: "image/png",
            createdAt: new Date(),
          });

          await Repair.create({
            reportId: report._id,
            email,
            status: "pending",
          });

          try {
            await sendSeverityAlert({
              damageType: type,
              severityLabel: severity,
              file: {
                buffer: annotatedImageBuffer,
                filename,
                contentType: "image/png",
              },
            });
          } catch (mailErr) {
            console.error("❌ Email error:", mailErr.message);
          }

          res.json({
            predicted_class: predictedClass,
            damage_type: type,
            severity: severityIndex,
            severity_label: severity,
            bbox,
            summary:
              summary || `Detected ${type} with ${severity} severity.`,
            image_url: `/reports/${report._id}/image`,
          });
        } catch (err) {
          console.error("❌ JSON analysis error:", err.message);
          res.status(500).json({ error: "JSON analysis failed" });
        }
      });
    } catch (err) {
      console.error("❌ Annotation error:", err.message);
      res.status(500).json({ error: "Annotation failed" });
    }
  }
);

/* ===================== SERVE IMAGE ===================== */
app.get("/reports/:id/image", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.imageData) {
      return res.status(404).send("Image not found");
    }
    res.set("Content-Type", report.contentType);
    res.send(report.imageData);
  } catch {
    res.status(500).send("Server error");
  }
});

/* ===================== REPORT LIST ===================== */
app.get("/api/images/reports", async (req, res) => {
  try {
    const reports = await Report.find().lean();
    res.json(
      reports.map(r => ({
        id: r._id,
        email: r.email,
        damageType: r.damageType,
        severity: r.severity,
        priority: r.priority,
        createdAt: r.createdAt,
        image: `/reports/${r._id}/image`,
        description: r.description,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

/* ===================== REPAIRS ===================== */
app.get("/api/repairs", async (req, res) => {
  const repairs = await Repair.find().sort({ createdAt: -1 });
  res.json(repairs);
});

app.patch("/api/repairs/:id/complete", async (req, res) => {
  const repair = await Repair.findByIdAndUpdate(
    req.params.id,
    { status: "completed", completedAt: new Date() },
    { new: true }
  );

  if (!repair) return res.status(404).json({ message: "Repair not found" });

  await sendResolvedEmail(repair.email, repair.reportId);
  res.json(repair);
});

/* ===================== ANALYZE ONLY ===================== */
app.post("/analyze-only", diskUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Image uploaded successfully",
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Please upload a valid road image." });
  }
});

/* ===================== 404 HANDLER ===================== */
app.use((req, res) => {
  res.status(404).send("❌ Route not found");
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
