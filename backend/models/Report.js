import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    incidentType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Submitted", "In Review", "Resolved"],
      default: "Submitted", // Default ensures analytics/status works
    },
    evidenceFiles: [
      {
        filename: String,
        path: String,
        mimetype: String,
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
