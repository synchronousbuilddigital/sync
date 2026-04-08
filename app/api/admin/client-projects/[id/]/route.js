import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    let update = {};
    if (body.workflow) update.workflow = body.workflow;
    if (body.projectName) update.projectName = body.projectName;
    if (body.status) update.status = body.status;
    
    // Add discussion message if present
    let project;
    if (body.message) {
      project = await ClientProject.findByIdAndUpdate(id, {
        $push: { discussions: { sender: "admin", content: body.message } },
      }, { new: true });
    } else {
      project = await ClientProject.findByIdAndUpdate(id, update, { new: true });
    }

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
    await ClientProject.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
