import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Leave from "@/models/Leave";
import User from "@/models/User";
import Company from "@/models/Company";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";
import { sendTaskAssignmentEmail } from "@/lib/mail";
import { fetchPostTrackerData } from "@/lib/googleSheets";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const tasks = await Task.find()
      .populate("internId", "name email department")
      .populate("clientProjectId", "projectName")
      .populate({ path: "marketingData.companyId", model: "Company", select: "name departments", strictPopulate: false })
      .lean();
      
    // Manually map department
    const postTrackerData = await fetchPostTrackerData();
    const formattedTasks = JSON.parse(JSON.stringify(tasks)).map(taskObj => {
       if (taskObj.marketingData?.companyId && taskObj.marketingData?.departmentId) {
          const dept = taskObj.marketingData.companyId.departments?.find(d => d._id === taskObj.marketingData.departmentId);
          if (dept) {
             taskObj.marketingData.departmentId = dept;
          }
       }
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

    return Response.json({ success: true, tasks: formattedTasks });
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { title, description, internId, priority, dueDate, taskType, estimatedHours, clientProjectId, marketingData, contentId } = await req.json();

    const intern = await User.findById(internId);
    if (!intern) return Response.json({ success: false, message: "Intern not found" }, { status: 404 });

    if (dueDate) {
      const targetDate = new Date(dueDate);
      const leaveConflict = await Leave.findOne({
        internId,
        status: "Approved",
        startDate: { $lte: targetDate },
        endDate: { $gte: targetDate }
      });

      if (leaveConflict) {
        return Response.json({ 
          success: false, 
          message: `Cannot assign task. Intern has an approved holiday on this day (${targetDate.toLocaleDateString()}).` 
        }, { status: 400 });
      }
    }

    const taskData = {
      title,
      description,
      internId,
      priority: priority || "Medium",
      taskType: taskType || "General",
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 2,
      clientProjectId: clientProjectId || null,
      status: "Pending",
      marketingData: marketingData || undefined,
    };
    if (contentId && contentId.trim() !== '') {
      taskData.contentId = contentId.trim();
    }
    const task = await Task.create(taskData);

    // Send task assignment email
    try {
      await sendTaskAssignmentEmail(intern.email, intern.name, {
        title,
        description,
        priority: priority || "Medium",
        taskType: taskType || "General",
        dueDate
      });
    } catch (mailErr) {
       console.error("Failed to send task assignment email:", mailErr);
       // We don't return error here because the task was already created successfully
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

