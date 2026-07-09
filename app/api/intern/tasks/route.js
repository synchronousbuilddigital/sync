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
        const cid = (taskObj.contentId || "").replace(/^#/, "").trim();
        const sheetData = postTrackerData[cid] || postTrackerData[taskObj.contentId] || Object.values(postTrackerData).find(s => s.contentId && s.contentId.replace(/^#/, "").trim().toLowerCase() === cid.toLowerCase());
        if (sheetData) {
          taskObj.marketingData = taskObj.marketingData || {};
          const nativePT = taskObj.marketingData.postTracker || {};
          taskObj.marketingData.postTracker = {
            ...nativePT,
            ...sheetData,
            scheduledDate: sheetData.scheduledDate || nativePT.scheduledDate || "",
            postingTime: sheetData.postingTime || nativePT.postingTime || "",
            month: sheetData.month || nativePT.month || "",
            day: sheetData.day || nativePT.day || "",
            postType: sheetData.postType || nativePT.postType || "",
            status: sheetData.status || nativePT.status || "Pending",
            finalLink: sheetData.finalLink || nativePT.finalLink || "",
            postedLink: sheetData.postedLink || nativePT.postedLink || "",
            clientRemarks: sheetData.clientRemarks || nativePT.clientRemarks || "",
          };
        }
      return taskObj;
    });

    return Response.json({ success: true, tasks: tasksWithTracker });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
