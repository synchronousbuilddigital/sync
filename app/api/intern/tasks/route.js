import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { fetchPostTrackerData } from "@/lib/googleSheets";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const tasks = await Task.find({ internId: decoded.id })
      .populate("clientProjectId", "projectName workflow credentials requirements sop")
      .populate({ path: "marketingData.companyId", model: "Company", select: "name", strictPopulate: false });

    const postTrackerData = await fetchPostTrackerData();
    const tasksWithTracker = tasks.map(task => {
      const taskObj = task.toObject();
       if (taskObj.contentId) {
         taskObj.marketingData = taskObj.marketingData || {};
         const nativePT = taskObj.marketingData.postTracker;
         const hasNativeData = nativePT && (nativePT.scheduledDate || nativePT.postType || nativePT.status);
         
         if (!hasNativeData && postTrackerData[taskObj.contentId]) {
            taskObj.marketingData.postTracker = postTrackerData[taskObj.contentId];
         }
       }
      return taskObj;
    });

    return Response.json({ success: true, tasks: tasksWithTracker });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
