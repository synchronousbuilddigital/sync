import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth";
import { fetchPostTrackerData } from "@/lib/googleSheets";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "brand_manager") {
      return Response.json({ success: false, message: "Brand Manager only" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user || !user.companyId) {
      return Response.json({ success: false, message: "Client not linked to a company" }, { status: 400 });
    }

    const tasks = await Task.find({
      "marketingData.companyId": user.companyId
    }).populate("internId", "name department");

    // Since departmentId is a subdocument inside Company, we can't directly populate it with ref: "Company.departments"
    // We'll fetch the Company to get department names manually.
    const company = await mongoose.model("Company").findById(user.companyId);
    const departmentMap = {};
    if (company && company.departments) {
      company.departments.forEach(dept => {
        departmentMap[dept._id.toString()] = dept.name;
      });
    }

    const postTrackerData = await fetchPostTrackerData();

    const tasksWithDeptName = tasks.map(task => {
      const taskObj = task.toObject();
      if (taskObj.marketingData && taskObj.marketingData.departmentId) {
        const deptIdStr = taskObj.marketingData.departmentId.toString();
        taskObj.marketingData.departmentId = {
          _id: deptIdStr,
          name: departmentMap[deptIdStr] || "Uncategorized"
        };
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

    return Response.json({ success: true, tasks: tasksWithDeptName, companyName: company?.name || "Unknown Company" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
