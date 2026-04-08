import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  index: { type: String }, // e.g. "01"
  category: { type: String, default: "Verified Partner" },
  description: { type: String },
  strategyTitle: { type: String, default: "Strategy" },
  strategyDetail: { type: String, default: "Step: Design & Build" },
  happinessTitle: { type: String, default: "Happiness" },
  happinessDetail: { type: String, default: "100% Success" },
  tags: [{ type: String }], // e.g. ["Custom 3D Shop", "Easy Ordering"]
  impact: { type: String, default: "" }, // e.g. "Increased SEO visibility, captured market share"
  imageUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
