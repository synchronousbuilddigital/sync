import mongoose from "mongoose";

const ProductionCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: true, // category photo uploaded from file manager
    },
    index: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

ProductionCategorySchema.index({ index: 1, name: 1 });

export default mongoose.models.ProductionCategory || mongoose.model("ProductionCategory", ProductionCategorySchema);
