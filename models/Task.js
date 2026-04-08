import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Complete", "Need Credentials", "Need Meeting"], 
    default: "Pending" 
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  dueDate: { type: Date },
  isApproved: { type: Boolean, default: false },
  note: { type: String, default: "" }, // Intern's final note on completion
  meetingLink: { type: String, default: "" }, // Auto-generated meeting link
  discussion: [{
    sender: { type: String }, // 'admin' or 'intern'
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
