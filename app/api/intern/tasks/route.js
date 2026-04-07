import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const tasks = await Task.find({ internId: decoded.id });
    return Response.json({ success: true, tasks });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
