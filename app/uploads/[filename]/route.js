import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req, { params }) {
  try {
    const { filename } = await params;

    // Security check to prevent path traversal
    if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
      return new Response("Invalid filename", { status: 400 });
    }

    const uploadsDir = (process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV)
      ? "/tmp/uploads"
      : join(process.cwd(), "public", "uploads");

    const filePath = join(uploadsDir, filename);
    const fileBuffer = await readFile(filePath);

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
    return new Response("File not found", { status: 404 });
  }
}
