import dbConnect from "@/lib/mongodb";
import StoredFileChunk from "@/models/StoredFileChunk";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file");
    if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
      return Response.json({ success: false, message: "Invalid or empty file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define unique file name
    const ext = (file.name || "bin").split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    await dbConnect();
    
    // Save to database
    await StoredFileChunk.create({
      filename,
      chunkIndex: 0,
      data: buffer
    });

    const url = `/uploads/${filename}`;
    return Response.json({ success: true, url });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
