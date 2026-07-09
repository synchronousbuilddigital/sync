import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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

    // Create uploads directory (use writable /tmp/uploads in read-only serverless envs)
    const uploadsDir = (process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV)
      ? "/tmp/uploads"
      : join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Define unique file name
    const ext = (file.name || "bin").split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const path = join(uploadsDir, filename);

    // Save file
    await writeFile(path, buffer);

    const url = `/uploads/${filename}`;
    return Response.json({ success: true, url });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
