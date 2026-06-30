import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { fetchPostTrackerData } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

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
       if (taskObj.contentId && postTrackerData[taskObj.contentId]) {
          taskObj.marketingData = taskObj.marketingData || {};
          const sheetData = postTrackerData[taskObj.contentId];
          const nativePT = taskObj.marketingData.postTracker || {};
          taskObj.marketingData.postTracker = {
            ...sheetData,
            ...nativePT,
            scheduledDate: nativePT.scheduledDate || sheetData.scheduledDate || "",
            month: nativePT.month || sheetData.month || "",
            day: nativePT.day || sheetData.day || "",
            postType: nativePT.postType || sheetData.postType || "",
            status: nativePT.status || sheetData.status || "Pending",
            finalLink: nativePT.finalLink || sheetData.finalLink || "",
            postedLink: nativePT.postedLink || sheetData.postedLink || "",
            clientRemarks: nativePT.clientRemarks || sheetData.clientRemarks || "",
          };
       }
      return taskObj;
    });

    return Response.json({ success: true, tasks: tasksWithTracker });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
