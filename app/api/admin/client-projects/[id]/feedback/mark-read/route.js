import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";

export async function POST(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { id } = params;

    const project = await ClientProject.findById(id);
    if (!project) return Response.json({ success: false, message: "Project not found" }, { status: 404 });

    // Mark all feedbacks as read
    project.feedbacks.forEach(f => f.isRead = true);
    await project.save();

    return Response.json({ success: true, message: "Feedbacks marked as read" });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
