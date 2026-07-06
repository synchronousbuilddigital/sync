import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function PUT(req) {
  try {
    await dbConnect();
    const decoded = verifyToken(req);
    
    // We allow interns to hit this, so decoded.role should be intern (or admin, brand_manager)
    if (!decoded) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    if (!data.contentId) {
      return Response.json({ success: false, message: "Content ID is required to update post tracker" }, { status: 400 });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { contentId: data.contentId },
      {
        $set: {
          "marketingData.postTracker.postingTime": data.postingTime !== undefined ? data.postingTime : "",
          "marketingData.postTracker.finalLink": data.finalLink !== undefined ? data.finalLink : "",
          "marketingData.postTracker.postedLink": data.postedLink !== undefined ? data.postedLink : "",
          "marketingData.postTracker.status": data.status !== undefined ? data.status : "",
          "marketingData.postTracker.clientRemarks": data.clientRemarks !== undefined ? data.clientRemarks : ""
        }
      },
      { new: true }
    );

    if (!updatedTask) {
      return Response.json({ success: false, message: `No task found with Content ID: ${data.contentId}` }, { status: 404 });
    }

    return Response.json({ success: true, message: "Post tracker updated natively successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
