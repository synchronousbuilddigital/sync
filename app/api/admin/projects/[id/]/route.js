import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const project = await Project.findByIdAndUpdate(id, data, { new: true });
    if (!project) return Response.json({ success: false, message: "Project not found" }, { status: 404 });
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    await Project.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Project purged from records" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
