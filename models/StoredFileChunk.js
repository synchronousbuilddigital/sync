import mongoose from "mongoose";

const StoredFileChunkSchema = new mongoose.Schema({
  filename: { type: String, required: true, index: true },
  chunkIndex: { type: Number, required: true },
  data: { type: Buffer, required: true },
}, { timestamps: true });

StoredFileChunkSchema.index({ filename: 1, chunkIndex: 1 }, { unique: true });

export default mongoose.models.StoredFileChunk || mongoose.model("StoredFileChunk", StoredFileChunkSchema);
