import dotenv from "dotenv";
dotenv.config();  

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Import routes
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import misinformationRoutes from "./routes/misinformationRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import VolunteerRoutes from "./routes/VolunteerRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ ES Module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/misinformations", misinformationRoutes);
app.use("/api/admin", AdminRoutes);           // Admin-specific routes
app.use("/api/volunteers", VolunteerRoutes); // NGO volunteer routes
app.use("/api/verifications", verificationRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 CyberPulse Backend is running and connected to MongoDB!");
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

