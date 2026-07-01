import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  contentId: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientProjectId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProject" },
  status: { 
    type: String, 
    enum: ["Pending", "Complete", "Need Credentials", "Need Meeting", "Blocked"], 
    default: "Pending" 
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  taskType: {
    type: String,
    enum: ["General", "Bug Fix", "Feature", "Design", "Content", "Research", "Meeting"],
    default: "General"
  },
  dueDate: { type: Date },
  estimatedHours: { type: Number, default: 2 },
  isApproved: { type: Boolean, default: false },
  note: { type: String, default: "" }, // Intern's final note on completion
  meetingLink: { type: String, default: "" }, // Auto-generated meeting link
  marketingData: {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Company.departments", default: null },
    topic: { type: String, default: "" },
    rawLink: { type: String, default: "" },
    editedLink: { type: String, default: "" },
    platforms: [{ type: String }],
    editorStatus: { type: String, enum: ["Editing in process", "1st Edit Completed", "Completed", ""], default: "" },
    reviewStatus: { type: String, enum: ["Approved", "Review Pending", "Changes in color", "Text visibility, and visual adjustment", "Text, and visuals", "Colors and visuals", "No changes", ""], default: "" },
    reviewRemarks: { type: String, default: "" },
    brandManagerReviewStatus: { type: String, enum: ["Approved", "Changes Requested", "Pending", ""], default: "" },
    brandManagerRemarks: { type: String, default: "" },
    postTracker: {
      scheduledDate: { type: String, default: "" },
      day: { type: String, default: "" },
      month: { type: String, default: "" },
      postType: { type: String, default: "" },
      postingTime: { type: String, default: "" },
      finalLink: { type: String, default: "" },
      status: { type: String, default: "" },
      postedLink: { type: String, default: "" },
      clientRemarks: { type: String, default: "" },
      companyName: { type: String, default: "" }
    }
  },
  discussion: [{
    sender: { type: String }, // 'admin' or 'intern'
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  hasUnreadAdminChat: { type: Boolean, default: false },
  hasUnreadInternChat: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
