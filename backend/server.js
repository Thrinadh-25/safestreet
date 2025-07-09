




// const express = require("express");
// const multer = require("multer");
// const axios = require("axios");
// const FormData = require("form-data");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const sendSeverityAlert = require("./mailer");
// const Analysis = require("./models/Analysis");
// const authRoutes = require("./routes/auth");
// const reportRoutes = require("./routes/reportRoutes");

// // Utility to collect stream data and parse as JSON
// const streamToString = (stream) => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     stream.on("data", (chunk) => chunks.push(chunk));
//     stream.on("error", reject);
//     stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
//   });
// };

// // Labels for prediction
// const CLASS_LABELS = [
//   "Longitudinal Crack",
//   "Transverse Crack",
//   "Alligator Crack",
//   "Block Crack",
// ];
// const SEVERITY_LABELS = ["Low", "Medium", "High"];

// // Load environment variables
// dotenv.config();

// // Initialize express app
// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use('/api/damage-reports', reportRoutes);

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Create uploads directory
// const uploadDir = path.join(__dirname, "public/uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// app.use("/uploads", express.static(uploadDir));

// // Multer setup (in-memory storage for analysis, disk storage for reports)
// const upload = multer({ storage: multer.memoryStorage() });
// const reportUpload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public/uploads/");
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// // Upload and analyze endpoint
// app.post("/upload-and-analyze", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     console.log("❌ NO FILE RECEIVED");
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const stream = require("stream");
//   const readableStream = new stream.PassThrough();
//   readableStream.end(req.file.buffer);

//   const form1 = new FormData();
//   form1.append("image", readableStream, {
//     filename: req.file.originalname || "upload.jpg",
//     contentType: req.file.mimetype || "image/jpeg",
//   });

//   try {
//     console.log("📡 Sending image to Flask /analyze/annotate...");

//     const imageResponse = await axios.post("http://localhost:5000/analyze/annotate", form1, {
//       headers: form1.getHeaders(),
//       responseType: "stream",
//       timeout: 15000,
//     });

//     const filename = `annotated_${Date.now()}.png`;
//     const savePath = path.join(uploadDir, filename);
//     const writer = fs.createWriteStream(savePath);

//     imageResponse.data.pipe(writer);

//     writer.on("finish", async () => {
//       console.log("✅ Annotated image saved:", filename);

//       const form2 = new FormData();
//       form2.append("image", req.file.buffer, {
//         filename: req.file.originalname,
//         contentType: req.file.mimetype,
//       });

//       try {
//         console.log("📡 Sending image to Flask /analyze/json...");
//         const jsonResponse = await axios.post("http://localhost:5000/analyze/json", form2, {
//           headers: form2.getHeaders(),
//           timeout: 50000,
//         });

//         const { type, severity, bbox, summary } = jsonResponse.data;
//         const predicted_class = CLASS_LABELS.indexOf(type);
//         const severityIndex = SEVERITY_LABELS.indexOf(severity);

//         if (predicted_class === -1 || severityIndex === -1) {
//           return res.status(400).json({ error: "Invalid class or severity label received from model" });
//         }

//         const annotatedImageBuffer = fs.readFileSync(savePath);

//         const newAnalysis = new Analysis({
//           predictedClass: predicted_class,
//           severity: severityIndex,
//           bbox,
//           imageData: annotatedImageBuffer,
//           contentType: "image/png",
//           damageType: type, // Add for web app compatibility
//           severityLabel: severity, // Add for web app compatibility
//           summary: summary || `A road damage of type "${type}" was detected with "${severity}" severity.`, // Add for web app
//           createdAt: new Date(), // Add timestamp for web app
//         });

//         await newAnalysis.save();
//         console.log("💾 Prediction saved to MongoDB");

//         try {
//           await sendSeverityAlert({
//             damageType: type,
//             severityLabel: severity,
//             file: {
//               buffer: annotatedImageBuffer,
//               filename,
//               contentType: "image/png",
//             },
//           });
//           console.log("✅ Email sent for severity:", severity);
//         } catch (emailErr) {
//           console.error("❌ Failed to send email:", emailErr.message);
//         }

//         return res.status(200).json({
//           predicted_class,
//           damage_type: type,
//           severity: severityIndex,
//           severity_label: severity,
//           bbox,
//           annotated_image: `/uploads/${filename}`,
//           summary: summary || `A road damage of type "${type}" was detected with "${severity}" severity.`,
//         });
//       } catch (jsonErr) {
//         console.error("❌ Error during JSON analysis:", jsonErr.message, jsonErr.response?.data);
//         if (jsonErr.response?.data?.error) {
//           return res.status(400).json({ error: jsonErr.response.data.error });
//         }
//         return res.status(500).json({ error: "JSON analysis failed" });
//       }
//     });

//     writer.on("error", (err) => {
//       console.error("❌ Failed to save annotated image:", err.message);
//       return res.status(500).json({ error: "Image saving failed" });
//     });

//   } catch (err) {
//     console.error("❌ Error during annotate analysis:", err.message, err.response?.data);
//     if (err.response?.status === 400) {
//       try {
//         const data = await streamToString(err.response.data);
//         const parsedData = JSON.parse(data);
//         if (parsedData.error) {
//           return res.status(400).json({ error: parsedData.error });
//         }
//       } catch (parseErr) {
//         console.error("❌ Failed to parse error response:", parseErr.message);
//       }
//     }
//     return res.status(500).json({ error: "Image annotation failed" });
//   }
// });

// // Endpoint to serve image from MongoDB
// app.get("/analysis/:id/image", async (req, res) => {
//   try {
//     const analysis = await Analysis.findById(req.params.id);
//     if (!analysis || !analysis.imageData) {
//       return res.status(404).send("Image not found");
//     }

//     res.set("Content-Type", analysis.contentType);
//     res.send(analysis.imageData);
//   } catch (err) {
//     console.error("Error serving image:", err.message);
//     res.status(500).send("Server error");
//   }
// });

// // New report route to fetch all analyses for the web app
// app.get("/api/images/reports", async (req, res) => {
//   try {
//     const reports = await Analysis.find().lean(); // Get all analyses as plain objects
//     const formattedReports = reports.map(report => ({
//       id: report._id,
//       damageType: report.damageType,
//       severity: SEVERITY_LABELS[report.severity],
//       priority: report.severity >= 2 ? "High" : report.severity === 1 ? "Medium" : "Low", // Simple priority logic
//       createdAt: report.createdAt,
//       annotatedImage: `/analysis/${report._id}/image`, // URL to fetch annotated image
//       summary: report.summary,
//     }));
//     res.json(formattedReports);
//   } catch (err) {
//     console.error("❌ Error fetching reports:", err.message);
//     res.status(500).json({ error: "Failed to fetch reports" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Node server running on port ${PORT}`);
// });




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

const sendSeverityAlert = require("./mailer");
const Analysis = require("./models/Analysis");
const Report = require("./models/Report"); // ✅ Add this
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reportRoutes");

// Labels
const CLASS_LABELS = ["Longitudinal Crack", "Transverse Crack", "Alligator Crack", "Block Crack"];
const SEVERITY_LABELS = ["Low", "Medium", "High"];

// Setup
dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/damage-reports', reportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Uploads
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

const upload = multer({ storage: multer.memoryStorage() });
const reportUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  })
});

// Convert stream to string
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

// Main Upload + Analyze + Save Route
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
    const savePath = path.join(uploadDir, filename);
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
        console.log("✅ Analysis saved");

        const newReport = new Report({
          location: "Unknown", // You can pass this from frontend if needed
          damageType: type,
          severity: severity,
          priority: severity === "High" ? "High" : severity === "Medium" ? "Medium" : "Low",
          description: summary || `Detected ${type} with ${severity} severity.`,
          image: `/uploads/${filename}`,
          createdAt: new Date()
        });

        await newReport.save();
        console.log("✅ Report saved");

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
          console.log("✅ Email sent");
        } catch (emailErr) {
          console.error("❌ Email error:", emailErr.message);
        }

        return res.status(200).json({
          predicted_class,
          damage_type: type,
          severity: severityIndex,
          severity_label: severity,
          bbox,
          summary: summary || `Detected ${type} with ${severity} severity.`,
          annotated_image: `/uploads/${filename}`
        });

      } catch (jsonErr) {
        console.error("❌ JSON error:", jsonErr.message);
        return res.status(500).json({ error: "JSON analysis failed" });
      }
    });

    writer.on("error", (err) => {
      console.error("❌ Image save error:", err.message);
      return res.status(500).json({ error: "Image save failed" });
    });

  } catch (err) {
    console.error("❌ Annotate error:", err.message);
    return res.status(500).json({ error: "Annotation failed" });
  }
});

// Serve image from MongoDB
app.get("/analysis/:id/image", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis || !analysis.imageData) return res.status(404).send("Image not found");

    res.set("Content-Type", analysis.contentType);
    res.send(analysis.imageData);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// List all saved reports
app.get("/api/images/reports", async (req, res) => {
  try {
    const reports = await Analysis.find().lean();
    const formatted = reports.map(r => ({
      id: r._id,
      damageType: r.damageType,
      severity: SEVERITY_LABELS[r.severity],
      priority: r.severity >= 2 ? "High" : r.severity === 1 ? "Medium" : "Low",
      createdAt: r.createdAt,
      annotatedImage: `/analysis/${r._id}/image`,
      summary: r.summary
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on ${PORT}`);
});
