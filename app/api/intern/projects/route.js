import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Find projects where intern is assigned to project OR assigned to any step in workflow
    const projects = await ClientProject.find({ 
      $or: [
        { assignedIntern: decoded.id },
        { "workflow.assignedIntern": decoded.id }
      ]
    });
    return Response.json({ success: true, projects });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
