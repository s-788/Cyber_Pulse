// routes/AdminRoutes.js
import express from "express";
import AdminCase from "../models/Admin.js";

const router = express.Router();

// ✅ GET all cases
router.get("/", async (req, res) => {
  try {
    const cases = await AdminCase.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cases", error: err.message });
  }
});

// ✅ CREATE new case
router.post("/", async (req, res) => {
  try {
    const newCase = new AdminCase(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: "Error creating case", error: err.message });
  }
});

// ✅ UPDATE case by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedCase = await AdminCase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCase) return res.status(404).json({ message: "Case not found" });
    res.json(updatedCase);
  } catch (err) {
    res.status(500).json({ message: "Error updating case", error: err.message });
  }
});

// ✅ DELETE case by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCase = await AdminCase.findByIdAndDelete(req.params.id);
    if (!deletedCase) return res.status(404).json({ message: "Case not found" });
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting case", error: err.message });
  }
});

export default router;
