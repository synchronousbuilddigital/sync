import dbConnect from "@/lib/mongodb";
import StoredFileChunk from "@/models/StoredFileChunk";

export async function GET(req, { params }) {
  try {
    const { filename } = await params;

    // Security check to prevent path traversal
    if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
      return new Response("Invalid filename", { status: 400 });
    }

    await dbConnect();

    // Fetch chunks from database
    const chunks = await StoredFileChunk.find({ filename }).sort({ chunkIndex: 1 });
    if (chunks.length === 0) {
      return new Response("File not found", { status: 404 });
    }

    // Assemble file content from chunks
    const fileBuffer = Buffer.concat(chunks.map(c => c.data));

    // MIME type mapping
    const ext = filename.split(".").pop().toLowerCase();
    const mimeTypes = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      mov: "video/quicktime",
      mp3: "audio/mpeg",
      pdf: "application/pdf"
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (err) {
    console.error("Serve file error:", err);
    return new Response("File not found", { status: 404 });
  }
}
