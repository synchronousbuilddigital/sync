import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { taskId } = await params;
    const { message } = await req.json();

    const decoded = verifyToken(req);
    if (!decoded) return Response.json({ success: false, message: "Invalid or missing token" }, { status: 401 });

    const task = await Task.findById(taskId);
    if (!task) return Response.json({ success: false, message: "Task not found" }, { status: 404 });

    task.discussion.push({
      sender: decoded.role === 'admin' ? 'admin' : 'intern',
      content: message,
      timestamp: new Date()
    });

    await task.save();

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
