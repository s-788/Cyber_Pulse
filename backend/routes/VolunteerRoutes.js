import express from "express";
import Volunteer from "../models/VolunteerModel.js";

const router = express.Router();

// GET all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new volunteer
router.post("/", async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    res.json(newVolunteer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update volunteer
router.put("/:id", async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE volunteer
router.delete("/:id", async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
