// models/Admin.js
import mongoose from "mongoose";

const AdminCaseSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true },
    userEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-review", "resolved"],
      default: "pending",
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    platform: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AdminCase", AdminCaseSchema);
