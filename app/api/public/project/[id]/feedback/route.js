import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { category, content } = await req.json();

    if (!content) {
      return Response.json({ success: false, message: "Content is required" }, { status: 400 });
    }

    const project = await ClientProject.findOneAndUpdate(
      { publicId: id },
      { 
        $push: { 
          feedbacks: { 
            category: category || "Feedback", 
            content, 
            timestamp: new Date(),
            isRead: false
          } 
        } 
      },
      { new: true }
    );

    if (!project) {
      return Response.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Feedback synchronized" });
  } catch (error) {
    console.error("Feedback API error:", error);
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
