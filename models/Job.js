import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String }, // Optional
  location: { type: String, required: true }, // e.g. "Remote", "Bangalore"
  requirements: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  rounds: { type: Number, default: 2 }, 
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
