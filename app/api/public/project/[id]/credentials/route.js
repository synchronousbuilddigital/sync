import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await req.json();

    const project = await ClientProject.findOne({ publicId: id });
    if (!project) {
      return Response.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    // Update credentials
    project.credentials = {
      ...project.credentials.toObject(),
      ...data
    };

    // Also post an update to the mission feed so the team knows credentials were added
    project.feeds.push({
      content: "Technical access parameters updated by client unit.",
      sender: "client"
    });

    await project.save();

    return Response.json({ success: true, message: "Credentials synchronized with technical unit." });
  } catch (error) {
    console.error("POST project credentials error:", error);
    return Response.json({ success: false, message: "Sync failure" }, { status: 500 });
  }
}
