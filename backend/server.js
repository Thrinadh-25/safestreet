
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

// // Labels
// const CLASS_LABELS = [
//   "Longitudinal Crack",
//   "Transverse Crack",
//   "Alligator Crack",
//   "Block Crack",
// ];

// const SEVERITY_LABELS = ["Low", "Medium", "High"];

// // Load environment variables
// dotenv.config();

// // Init express app
// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json());
// app.use("/api/auth", authRoutes);

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Uploads directory
// const uploadDir = path.join(__dirname, "public/uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// app.use("/uploads", express.static(uploadDir));

// // Multer config
// const upload = multer({ storage: multer.memoryStorage() });

// // Upload and analyze
// app.post("/upload-and-analyze", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     console.log("❌ NO FILE RECEIVED");
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const imageBuffer = Buffer.from(req.file.buffer);
//   const form1 = new FormData();
//   form1.append("image", imageBuffer, {
//     filename: req.file.originalname,
//     contentType: req.file.mimetype,
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
//       form2.append("image", imageBuffer, {
//         filename: req.file.originalname,
//         contentType: req.file.mimetype,
//       });

//       try {
//         console.log("📡 Sending image to Flask /analyze/json...");
//         const jsonResponse = await axios.post("http://localhost:5000/analyze/json", form2, {
//           headers: form2.getHeaders(),
//           timeout: 50000,
//         });

//         let { type, severity, bbox, summary } = jsonResponse.data;

//         // Convert string labels to index
//         const predicted_class = CLASS_LABELS.indexOf(type);
//         const severityIndex = SEVERITY_LABELS.indexOf(severity);

//         if (predicted_class === -1 || severityIndex === -1) {
//           return res.status(400).json({ error: "Invalid class or severity label received from model" });
//         }
//         const annotatedImageBuffer = fs.readFileSync(savePath);  // ✅ read actual image bytes

//         const newAnalysis = new Analysis({
//           predictedClass: predicted_class,
//           severity: severityIndex,
//           bbox: bbox,
//           imageData: annotatedImageBuffer,     // ✅ actual image data
//           contentType: "image/png",
//         });

//         // const newAnalysis = new Analysis({
//         //   predictedClass: predicted_class,
//         //   severity: severityIndex,
//         //   bbox: bbox,
//         //   imagePath: `/uploads/${filename}`,
//         // });

//         await newAnalysis.save();
//         console.log("💾 Prediction saved to MongoDB");

//         const damageType = type;
//         const severityLabel = severity;

//         console.log(`📧 Sending email alert for ${severityLabel} severity...`);
//         try {
//           const annotatedImageBuffer = fs.readFileSync(savePath);
//           await sendSeverityAlert({
//             damageType,
//             severityLabel,
//             file: {
//               buffer: annotatedImageBuffer,
//               filename,
//               contentType: "image/png",
//             },
//           });
//           console.log("✅ Email sent for severity:", severityLabel);
//         } catch (emailErr) {
//           console.error("❌ Failed to send email:", emailErr.message);
//         }

//         res.status(200).json({
//           predicted_class,
//           damage_type: damageType,
//           severity: severityIndex,
//           severity_label: severityLabel,
//           bbox,
//           annotated_image: `/uploads/${filename}`,
//           summary: summary || `A road damage of type "${damageType}" was detected with "${severityLabel}" severity.`,
//         });
//       } catch (jsonErr) {
//         console.error("❌ Error during JSON analysis:", jsonErr.message);
//         res.status(500).json({ error: "JSON analysis failed" });
//       }
//     });

//     writer.on("error", (err) => {
//       console.error("❌ Failed to save annotated image:", err.message);
//       res.status(500).json({ error: "Image saving failed" });
//     });

//   } catch (err) {
//   console.error("❌ Error during annotate analysis:", err.message);

//   if (err.response && err.response.data && err.response.data.error) {
//     // Forward the actual error from Flask (e.g. "Image is not a road photo...")
//     return res.status(400).json({ error: err.response.data.error });
//   }

//   res.status(500).json({ error: "Image annotation failed" });
// }
// });


// // 📌 Add this just before `app.listen(...)`

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

// // ✅ Already in your code



// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
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
const sendSeverityAlert = require("./mailer");
const Analysis = require("./models/Analysis");
const authRoutes = require("./routes/auth");

// Utility to collect stream data and parse as JSON
const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

// Labels for prediction
const CLASS_LABELS = [
  "Longitudinal Crack",
  "Transverse Crack",
  "Alligator Crack",
  "Block Crack",
];
const SEVERITY_LABELS = ["Low", "Medium", "High"];

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Create uploads directory
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// Multer setup (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Upload and analyze endpoint
app.post("/upload-and-analyze", upload.single("image"), async (req, res) => {
  if (!req.file) {
    console.log("❌ NO FILE RECEIVED");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const stream = require("stream");
  const readableStream = new stream.PassThrough();
  readableStream.end(req.file.buffer);

  const form1 = new FormData();
  form1.append("image", readableStream, {
    filename: req.file.originalname || "upload.jpg",
    contentType: req.file.mimetype || "image/jpeg",
  });

  try {
    console.log("📡 Sending image to Flask /analyze/annotate...");

    const imageResponse = await axios.post("http://localhost:5000/analyze/annotate", form1, {
      headers: form1.getHeaders(),
      responseType: "stream",
      timeout: 15000,
    });

    const filename = `annotated_${Date.now()}.png`;
    const savePath = path.join(uploadDir, filename);
    const writer = fs.createWriteStream(savePath);

    imageResponse.data.pipe(writer);

    writer.on("finish", async () => {
      console.log("✅ Annotated image saved:", filename);

      const form2 = new FormData();
      form2.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      try {
        console.log("📡 Sending image to Flask /analyze/json...");
        const jsonResponse = await axios.post("http://localhost:5000/analyze/json", form2, {
          headers: form2.getHeaders(),
          timeout: 50000,
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
        });

        await newAnalysis.save();
        console.log("💾 Prediction saved to MongoDB");

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
          console.log("✅ Email sent for severity:", severity);
        } catch (emailErr) {
          console.error("❌ Failed to send email:", emailErr.message);
        }

        return res.status(200).json({
          predicted_class,
          damage_type: type,
          severity: severityIndex,
          severity_label: severity,
          bbox,
          annotated_image: `/uploads/${filename}`,
          summary: summary || `A road damage of type "${type}" was detected with "${severity}" severity.`,
        });
      } catch (jsonErr) {
        console.error("❌ Error during JSON analysis:", jsonErr.message, jsonErr.response?.data);
        if (jsonErr.response?.data?.error) {
          return res.status(400).json({ error: jsonErr.response.data.error });
        }
        return res.status(500).json({ error: "JSON analysis failed" });
      }
    });

    writer.on("error", (err) => {
      console.error("❌ Failed to save annotated image:", err.message);
      return res.status(500).json({ error: "Image saving failed" });
    });

  } catch (err) {
    console.error("❌ Error during annotate analysis:", err.message, err.response?.data);
    if (err.response?.status === 400) {
      // Parse the stream to extract the JSON error message
      try {
        const data = await streamToString(err.response.data);
        const parsedData = JSON.parse(data);
        if (parsedData.error) {
          return res.status(400).json({ error: parsedData.error });
        }
      } catch (parseErr) {
        console.error("❌ Failed to parse error response:", parseErr.message);
      }
    }
    return res.status(500).json({ error: "Image annotation failed" });
  }
});

// Endpoint to serve image from MongoDB
app.get("/analysis/:id/image", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis || !analysis.imageData) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", analysis.contentType);
    res.send(analysis.imageData);
  } catch (err) {
    console.error("Error serving image:", err.message);
    res.status(500).send("Server error");
  }
});

// Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Node server running on port ${PORT}`);
// });
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Node server running on port ${PORT}`);
});
