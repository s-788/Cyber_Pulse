import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  inputType: { type: String, enum: ["text", "url", "image"], required: true },
  content: { type: String, required: true },

  // AI-driven fields
  credibility: { type: Number, required: true },      // 0.0 - 1.0
  status: { type: Boolean, required: true },          // true = credible, false = misinformation
  message: { type: String, required: true },          // short explanation
  explanation: { type: String },                      // detailed reasoning
  sources: [{ type: String }],                        // references
  confidenceScore: { type: Number },                  // optional AI confidence
  analysisRaw: { type: String },                      // full raw AI output for debugging

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Verification", verificationSchema);
