import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  scheduledAt: { type: Date, required: true },
  roomName: { type: String, required: true, unique: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["Scheduled", "Active", "Completed", "Cancelled"],
    default: "Scheduled"
  }
}, { timestamps: true });

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
