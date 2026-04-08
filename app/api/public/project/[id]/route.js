import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Find project by publicId
    const project = await ClientProject.findOne({ publicId: id }).populate("clientId", "name");
    
    if (!project) {
      return Response.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
