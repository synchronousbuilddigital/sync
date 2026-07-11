import dbConnect from "@/lib/mongodb";
import StoredFileChunk from "@/models/StoredFileChunk";
import { verifyToken } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file");
    const chunkIndex = parseInt(data.get("chunkIndex"));
    const totalChunks = parseInt(data.get("totalChunks"));
    const sessionId = data.get("sessionId");
    const filename = data.get("filename");

    if (!file || isNaN(chunkIndex) || isNaN(totalChunks) || !sessionId || !filename) {
      return Response.json({ success: false, message: "Missing required chunk parameters" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = filename.split(".").pop();
    const finalFilename = `${sessionId}.${ext}`;

    await dbConnect();

    // Save chunk to MongoDB
    await StoredFileChunk.create({
      filename: finalFilename,
      chunkIndex,
      data: buffer
    });

    // Check if all chunks are uploaded
    const chunksCount = await StoredFileChunk.countDocuments({ filename: finalFilename });

    if (chunksCount === totalChunks) {
      // Retrieve all chunks sorted by index
      const chunks = await StoredFileChunk.find({ filename: finalFilename }).sort({ chunkIndex: 1 });
      
      // Concatenate the chunks into one single Buffer
      const fileBuffer = Buffer.concat(chunks.map(c => c.data));

      // Upload the assembled buffer to Cloudinary
      const uploadResult = await uploadToCloudinary(fileBuffer, finalFilename);
      const url = uploadResult.secure_url;

      // Clean up the temporary chunks from the database
      await StoredFileChunk.deleteMany({ filename: finalFilename });

      return Response.json({ success: true, url });
    }

    return Response.json({ success: true, message: `Chunk ${chunkIndex + 1} of ${totalChunks} uploaded` });
  } catch (err) {
    console.error("Chunk upload error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
