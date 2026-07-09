import mongoose from "mongoose";

const ProductionGalleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["photo", "video"],
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProductionGalleryItem || mongoose.model("ProductionGalleryItem", ProductionGalleryItemSchema);
