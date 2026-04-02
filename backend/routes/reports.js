const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

/* ===================== GET ALL REPORTS ===================== */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    const formattedReports = reports.map((r) => ({
      id: r.reportId,          // 🔥 frontend-safe ID
      location: r.location,
      email: r.email,
      damageType: r.damageType,
      severity: r.severity,
      priority: r.priority,
      description: r.description,
      createdAt: r.createdAt,
      status: r.status || "Pending",
    }));

    res.json(formattedReports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});


/* ===================== GET REPORT IMAGE ===================== */
router.get("/:reportId/image", async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.reportId });

    if (!report || !report.imageData) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", report.contentType);
    res.send(report.imageData);
  } catch (err) {
    res.status(500).send("Error fetching image");
  }
});

/* ===================== UPDATE STATUS ===================== */
router.put("/:reportId/status", async (req, res) => {
  try {
    const { status } = req.body;

    const report = await Report.findOneAndUpdate(
      { reportId: req.params.reportId },
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
