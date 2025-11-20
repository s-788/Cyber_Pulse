import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Misinformation from "../models/Misinformation.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log("Loaded GROQ KEY:", process.env.GROQ_API_KEY);

/* ────────────────────────────────────────────────
   ✅ POST — Verify Claim + Save in MongoDB
   ──────────────────────────────────────────────── */
router.post("/", async (req, res) => {
  try {
    const { claim, sourceUrl } = req.body;

    // ---------------------------
    // 1️⃣ Validate
    // ---------------------------
    if (!claim || claim.trim() === "") {
      return res.status(400).json({ error: "Claim text is required." });
    }

    // ---------------------------
    // 2️⃣ Ask AI to analyze the claim
    // ---------------------------
    const prompt = `
You are a misinformation detection expert.
Analyze the following claim and return:

1. Truthfulness score (0–100)
2. Verdict (True, False, or Misleading)
3. Short explanation

Claim: "${claim}"
Source: "${sourceUrl || "Not provided"}"
    `;

    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const aiOutput = aiResponse.choices[0].message.content;

    // ---------------------------
    // 3️⃣ Extract Score + Status
    // ---------------------------
    // Extract the first number (0–100)
    const scoreMatch = aiOutput.match(/\b(\d{1,3})\b/);
    const score = scoreMatch ? Number(scoreMatch[1]) : 0;

    // Detect verdict
    let verdict = "unverified";
    const lower = aiOutput.toLowerCase();

    if (lower.includes("true")) verdict = "verified";
    if (lower.includes("false")) verdict = "false";
    if (lower.includes("misleading")) verdict = "false";

    // ---------------------------
    // 4️⃣ Save to MongoDB (matches schema)
    // ---------------------------
    const record = new Misinformation({
      inputType: "text",           // required
      content: claim,              // required
      status: verdict,             // required
      credibility: score / 100,    // required → convert to 0–1
      message: aiOutput,           // required
      sources: sourceUrl ? [sourceUrl] : []
    });

    const saved = await record.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving misinformation:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────────────────────
   ✅ GET — Retrieve saved records
   ──────────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const records = await Misinformation.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────────────────────
   ✅ DELETE — Delete record by ID
   ──────────────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Misinformation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
