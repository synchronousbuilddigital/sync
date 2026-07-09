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
        const sheetRows = Object.values(postTrackerData);
        let sheetData = postTrackerData[cid] || postTrackerData[taskObj.contentId] || sheetRows.find(s => s.contentId && s.contentId.replace(/^#/, "").trim().toLowerCase() === cid.toLowerCase());
        
        if (!sheetData && (taskObj.marketingData?.editedLink || taskObj.marketingData?.rawLink || taskObj.marketingData?.postedLink)) {
          const edited = (taskObj.marketingData.editedLink || "").trim();
          const raw = (taskObj.marketingData.rawLink || "").trim();
          const posted = (taskObj.marketingData.postedLink || "").trim();
          sheetData = sheetRows.find(s => {
            const sheetFinal = (s.finalLink || "").trim();
            const sheetPosted = (s.postedLink || "").trim();
            return (edited && sheetFinal === edited) || (raw && sheetFinal === raw) || (posted && sheetPosted === posted) || (raw && sheetPosted === raw);
          });
        }

        taskObj.marketingData = taskObj.marketingData || {};
        const nativePT = taskObj.marketingData.postTracker || {};
        taskObj.marketingData.postTracker = {
          ...nativePT,
          ...(sheetData || {}),
          scheduledDate: sheetData?.scheduledDate || nativePT.scheduledDate || taskObj.dueDate || "",
          postingTime: sheetData?.postingTime || nativePT.postingTime || "",
          month: sheetData?.month || nativePT.month || "",
          day: sheetData?.day || nativePT.day || "",
          postType: sheetData?.postType || nativePT.postType || taskObj.taskType || "",
          status: sheetData?.status || nativePT.status || taskObj.status || "Pending",
          finalLink: sheetData?.finalLink || nativePT.finalLink || taskObj.marketingData.editedLink || taskObj.marketingData.rawLink || "",
          postedLink: sheetData?.postedLink || nativePT.postedLink || taskObj.marketingData.postedLink || "",
          clientRemarks: sheetData?.clientRemarks || nativePT.clientRemarks || "",
        };
      return taskObj;
    });

    return Response.json({ success: true, tasks: tasksWithTracker });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
