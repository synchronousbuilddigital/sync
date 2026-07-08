import mongoose from "mongoose";

const ProductionItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  description: { type: String },
  index: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.ProductionItem || mongoose.model("ProductionItem", ProductionItemSchema);
