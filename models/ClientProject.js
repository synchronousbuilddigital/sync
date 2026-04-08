import mongoose from "mongoose";

const ClientProjectSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  publicId: { type: String, unique: true }, // For shared link access
  projectName: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "In Prep" }, // e.g., "Active", "Completed"
  
  // The detailed checklist/workflow
  workflow: [{
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["Pending", "In Progress", "Complete"], default: "Pending" },
    adminNote: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now }
  }],

  // Direct messaging between Admin and Client
  discussions: [{
    sender: { type: String, enum: ["admin", "client"] },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.ClientProject || mongoose.model("ClientProject", ClientProjectSchema);
