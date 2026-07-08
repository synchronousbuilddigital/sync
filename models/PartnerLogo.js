import mongoose from "mongoose";

const PartnerLogoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  index: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.PartnerLogo || mongoose.model("PartnerLogo", PartnerLogoSchema);
