import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();

    if (!data.contentId) {
      return Response.json({ success: false, message: "Content ID is required" }, { status: 400 });
    }

    // Auto-calculate Day and Month if scheduledDate is provided but day/month are empty
    if (data.scheduledDate) {
      try {
        const dateObj = new Date(data.scheduledDate);
        if (!isNaN(dateObj.getTime())) {
          if (!data.day) {
            data.day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          }
          if (!data.month) {
            data.month = dateObj.toLocaleDateString('en-US', { month: 'long' });
          }
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }

    // Update the native MongoDB Task directly
    const updatedTask = await Task.findOneAndUpdate(
      { contentId: data.contentId },
      {
        $set: {
          "marketingData.postTracker.companyName": data.company || "",
          "marketingData.postTracker.scheduledDate": data.scheduledDate || "",
          "marketingData.postTracker.day": data.day || "",
          "marketingData.postTracker.month": data.month || "",
          "marketingData.postTracker.postType": data.postType || "",
          "marketingData.postTracker.postingTime": data.postingTime || "",
          "marketingData.postTracker.status": data.status || "Pending",
        }
      },
      { new: true }
    );

    if (!updatedTask) {
      return Response.json({ success: false, message: `No task found with Content ID: ${data.contentId}` }, { status: 404 });
    }

    return Response.json({ success: true, message: "Post added to native tracker successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
