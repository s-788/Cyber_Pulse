import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["Citizen", "NGO", "Admin"], default: "Citizen" },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema, "volunteers");
export default Volunteer;
