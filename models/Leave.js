import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  },
  adminNote: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model("Leave", LeaveSchema);
