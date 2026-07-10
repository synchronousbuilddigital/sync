import mongoose from "mongoose";

const PartnerLogoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  index: { type: Number, default: 0 },
  videoUrl: { type: String },
  thumbnailUrl: { type: String },
  description: { type: String }
}, { timestamps: true });

PartnerLogoSchema.index({ index: 1, createdAt: -1 });

export default mongoose.models.PartnerLogo || mongoose.model("PartnerLogo", PartnerLogoSchema);
