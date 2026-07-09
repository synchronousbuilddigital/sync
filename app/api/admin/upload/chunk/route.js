import { writeFile, mkdir, readFile, appendFile, unlink } from "fs/promises";
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
    const chunkIndex = parseInt(data.get("chunkIndex"));
    const totalChunks = parseInt(data.get("totalChunks"));
    const sessionId = data.get("sessionId");
    const filename = data.get("filename");

    if (!file || isNaN(chunkIndex) || isNaN(totalChunks) || !sessionId || !filename) {
      return Response.json({ success: false, message: "Missing required chunk parameters" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine uploads directory
    const isServerless = process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV;
    const baseDir = isServerless ? "/tmp" : join(process.cwd(), "public");
    const chunksDir = join(baseDir, "uploads", "_chunks", sessionId);
    await mkdir(chunksDir, { recursive: true });

    // Write chunk file
    const chunkPath = join(chunksDir, `chunk-${chunkIndex}`);
    await writeFile(chunkPath, buffer);

    // Check if all chunks are uploaded
    let allUploaded = true;
    const chunkPaths = [];
    for (let i = 0; i < totalChunks; i++) {
      const path = join(chunksDir, `chunk-${i}`);
      chunkPaths.push(path);
      try {
        await readFile(path);
      } catch (err) {
        allUploaded = false;
        break;
      }
    }

    if (allUploaded) {
      const finalUploadsDir = join(baseDir, "uploads");
      await mkdir(finalUploadsDir, { recursive: true });

      const ext = filename.split(".").pop();
      const finalFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const finalPath = join(finalUploadsDir, finalFilename);

      // Concatenate files
      const firstChunk = await readFile(chunkPaths[0]);
      await writeFile(finalPath, firstChunk);

      for (let i = 1; i < totalChunks; i++) {
        const nextChunk = await readFile(chunkPaths[i]);
        await appendFile(finalPath, nextChunk);
      }

      // Cleanup chunk files
      for (const path of chunkPaths) {
        await unlink(path).catch(() => {});
      }

      const url = `/uploads/${finalFilename}`;
      return Response.json({ success: true, url });
    }

    return Response.json({ success: true, message: `Chunk ${chunkIndex + 1} of ${totalChunks} uploaded` });
  } catch (err) {
    console.error("Chunk upload error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
