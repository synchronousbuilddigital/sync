import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { taskId } = await params;
    const decoded = verifyToken(req);
    if (!decoded) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const updateField = decoded.role === "admin" ? { hasUnreadAdminChat: false } : { hasUnreadInternChat: false };
    const task = await Task.findByIdAndUpdate(taskId, { $set: updateField }, { new: true })
      .populate("clientProjectId", "projectName workflow credentials requirements sop")
      .populate({ path: "marketingData.companyId", model: "Company", select: "name", strictPopulate: false });
    if (!task) return Response.json({ success: false, message: "Task not found" }, { status: 404 });

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
