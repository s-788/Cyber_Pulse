import mongoose from "mongoose";

const misinformationSchema = new mongoose.Schema(
  {
    inputType: { 
      type: String, 
      required: true,
      enum: ["text", "url", "image"] 
    },
    content: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["verified", "false", "unverified"], 
      required: true 
    },
    credibility: { 
      type: Number, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    sources: [
      { type: String }
    ],
  },
  { timestamps: true }
);

// Avoid model overwrite error during dev/hot reload
const Misinformation =
  mongoose.models.Misinformation ||
  mongoose.model("Misinformation", misinformationSchema);

export default Misinformation;
