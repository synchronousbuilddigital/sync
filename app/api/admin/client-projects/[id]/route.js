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
    if (body.status) update.status = body.status;
    if (body.projectName) update.projectName = body.projectName;
    if (body.description) update.description = body.description;
    if (body.googleDriveLink !== undefined) update.googleDriveLink = body.googleDriveLink;
    if (body.credentials) update.credentials = body.credentials;
    if (body.requirements) update.requirements = body.requirements;
    if (body.features) update.features = body.features;
    if (body.projectType) update.projectType = body.projectType;
    if (body.sop !== undefined) update.sop = body.sop;
    if (body.estimatedCompletionDate) update.estimatedCompletionDate = body.estimatedCompletionDate;
    if (body.assignedIntern !== undefined) update.assignedIntern = body.assignedIntern || null;
    if (body.systemAccessEmail) update.systemAccessEmail = body.systemAccessEmail;
    if (body.systemAccessPassword) update.systemAccessPassword = body.systemAccessPassword;
    
    // Handle message/discussion update
    if (body.message) {
      const project = await ClientProject.findById(id);
      if (!project) return Response.json({ success: false, message: "Project not found" }, { status: 404 });
      
      project.discussions.push({
        sender: "admin",
        content: body.message,
        timestamp: new Date()
      });
      await project.save();
      return Response.json({ success: true, project });
    }

    // Handle feed update
    if (body.feed) {
      const project = await ClientProject.findById(id);
      if (!project) return Response.json({ success: false, message: "Project not found" }, { status: 404 });
      
      project.feeds.push({
        sender: "admin",
        content: body.feed,
        timestamp: new Date()
      });
      await project.save();
      return Response.json({ success: true, project });
    }

    const project = await ClientProject.findByIdAndUpdate(id, update, { returnDocument: 'after' });
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
    return Response.json({ success: true, message: "Project purged from matrix." });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
