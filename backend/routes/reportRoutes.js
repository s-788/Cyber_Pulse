import express from "express";
import multer from "multer";
import path from "path";
import Report from "../models/Report.js";

const router = express.Router();

// ===============
// 📂 File Upload
// ===============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to store evidence files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// =============================
// 📤 POST — Submit Crime Report
// =============================
router.post("/", upload.array("evidence", 5), async (req, res) => {
  try {
    const { incidentType, description, dateTime, location, anonymous } = req.body;

    const evidenceFiles =
      req.files?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      })) || [];

    const newReport = new Report({
      incidentType,
      description,
      dateTime,
      location,
      anonymous: anonymous === "true" || anonymous === true,
      evidenceFiles,
      status: "Submitted", // ensures analytics/status has valid data
    });

    await newReport.save();

    res.status(201).json({
      message: "Report submitted successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ message: "Error submitting report", error });
  }
});

// ========================================
// 📥 GET — Fetch All Reports (Admin Panel)
// ========================================
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// ======================================
// 📊 GET — Dynamic Status Distribution
// ======================================
router.get("/analytics/status", async (req, res) => {
  try {
    const statusData = await Report.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);

    res.json(statusData);
  } catch (error) {
    console.error("Error fetching status distribution:", error);
    res.status(500).json({ message: "Error fetching status distribution" });
  }
});

// ======================================
// 📊 GET — Reports per Incident Category
// ======================================
router.get("/analytics/category", async (req, res) => {
  try {
    const categoryData = await Report.aggregate([
      { $group: { _id: "$incidentType", count: { $sum: 1 } } },
      { $project: { _id: 0, incidentType: "$_id", count: 1 } },
    ]);

    res.json(categoryData);
  } catch (error) {
    console.error("Error fetching category data:", error);
    res.status(500).json({ message: "Error fetching category data" });
  }
});

// ================================
// ✏️ PUT — Update Report by ID
// ================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReport = await Report.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Error updating report", error });
  }
});

// ================================
// 🗑️ DELETE — Delete Report by ID
// ================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      message: "Report deleted successfully",
      report: deletedReport,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Error deleting report", error });
  }
});

export default router;
