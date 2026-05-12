import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  education: { type: String, required: true },
  skills: { type: String, required: true },
  project: { type: String, required: true },
  hasExperience: { type: Boolean, default: false },
  experienceDetails: { type: String },
  resumeLink: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Applied", "Round 1", "Round 2", "Selected", "Declined"], 
    default: "Applied" 
  },
  currentRound: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
