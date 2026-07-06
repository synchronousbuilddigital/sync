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

    if (!data.contentId && !data.taskId) {
      return Response.json({ success: false, message: "Content ID or Task ID is required to update post tracker" }, { status: 400 });
    }

    let query = {};
    if (data.taskId && data.contentId) {
      query = { $or: [{ _id: data.taskId }, { contentId: data.contentId }] };
    } else if (data.taskId) {
      query = { _id: data.taskId };
    } else {
      query = { contentId: data.contentId };
    }

    const setFields = {
      "marketingData.postTracker.postingTime": data.postingTime !== undefined ? data.postingTime : "",
      "marketingData.postTracker.finalLink": data.finalLink !== undefined ? data.finalLink : "",
      "marketingData.postTracker.postedLink": data.postedLink !== undefined ? data.postedLink : "",
      "marketingData.postTracker.status": data.status !== undefined ? data.status : "",
      "marketingData.postTracker.clientRemarks": data.clientRemarks !== undefined ? data.clientRemarks : ""
    };
    if (data.postedLink) {
      setFields["marketingData.postedLink"] = data.postedLink;
      setFields["liveLink"] = data.postedLink;
    }

    const updatedTask = await Task.findOneAndUpdate(
      query,
      { $set: setFields },
      { new: true }
    );

    if (!updatedTask) {
      return Response.json({ success: false, message: `No task found with ID: ${data.contentId || data.taskId}` }, { status: 404 });
    }

    return Response.json({ success: true, message: "Post tracker updated natively successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
