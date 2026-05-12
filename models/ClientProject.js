import mongoose from "mongoose";

const ClientProjectSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  publicId: { type: String, unique: true }, // For shared link access
  projectName: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "In Prep" }, // e.g., "Active", "Completed"
  assignedIntern: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // The detailed checklist/workflow
  workflow: [{
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["Pending", "In Progress", "Complete"], default: "Pending" },
    adminNote: { type: String, default: "" },
    assignedIntern: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now }
  }],

  // File Management
  googleDriveLink: { type: String, default: "" },

  // Credentials and Technical Access
  credentials: {
    env: { type: String, default: "" },
    gmail: { 
      email: { type: String, default: "" },
      password: { type: String, default: "" }
    },
    vercel: {
      email: { type: String, default: "" },
      password: { type: String, default: "" }
    },
    github: { type: String, default: "" },
    hosting: { type: String, default: "" },
    domain: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    devUrl: { type: String, default: "" },
    additional: { type: String, default: "" }
  },

  // System Access Parameters
  systemAccessEmail: { type: String, default: "intern@sync.com" },
  systemAccessPassword: { type: String, default: "SyncIntern123" },

  // Project Briefing
  projectType: { type: String, default: "Custom Web App" }, // Helps roadmap generation
  requirements: [{
    content: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "In Development"], default: "Pending" }
  }],
  features: [{
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Must-have", "Should-have", "Could-have"], default: "Must-have" }
  }],

  // Operational Strategy
  sop: { type: String, default: "" }, // Custom SOP for this specific project
  estimatedCompletionDate: { type: Date },

  // AI-Driven Insights
  aiStory: { type: String, default: "" }, // Human-readable progress summary
  aiRiskAnalysis: { type: String, default: "" }, // Flags for potential delays
  
  // Project Feed / Updates
  feeds: [{
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sender: { type: String, enum: ["admin", "client"], default: "client" }
  }],

  // Direct messaging between Admin and Client
  discussions: [{
    sender: { type: String, enum: ["admin", "client"] },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  // Client Feedback & Ideas
  feedbacks: [{
    category: { type: String, enum: ["Idea", "Feedback", "Bug", "Question"], default: "Feedback" },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// Force refresh model in dev to update schema
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.ClientProject;
}

export default mongoose.models.ClientProject || mongoose.model("ClientProject", ClientProjectSchema);
