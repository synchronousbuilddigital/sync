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
    const projects = await ClientProject.find({ assignedIntern: decoded.id });
    return Response.json({ success: true, projects });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
