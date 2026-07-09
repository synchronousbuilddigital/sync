import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import Company from "@/models/Company";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth";
import { fetchPostTrackerData } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

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

    const targetCompany = (company && company.name) ? company.name.trim().toLowerCase() : "";

    const tasksWithDeptName = tasks.map(task => {
      const taskObj = task.toObject();
      if (taskObj.marketingData && taskObj.marketingData.departmentId) {
        const deptIdStr = taskObj.marketingData.departmentId.toString();
        taskObj.marketingData.departmentId = {
          _id: deptIdStr,
          name: departmentMap[deptIdStr] || "Uncategorized"
        };
      }
      const cid = (taskObj.contentId || "").replace(/^#/, "").trim();
      const sheetData = postTrackerData[cid] || postTrackerData[taskObj.contentId] || Object.values(postTrackerData).find(s => s.contentId && s.contentId.replace(/^#/, "").trim().toLowerCase() === cid.toLowerCase());
      if (sheetData) {
        // If Sheet explicitly assigns this content ID to a DIFFERENT company, exclude it!
        if (targetCompany && sheetData.companyName) {
          const sheetCompany = sheetData.companyName.trim().toLowerCase();
          if (sheetCompany && sheetCompany !== targetCompany && !targetCompany.includes(sheetCompany) && !sheetCompany.includes(targetCompany)) {
            return null;
          }
        }
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
    }).filter(Boolean);

    // Also include any historical or future Post Tracker items directly from the Google Sheet that don't have a MongoDB task entry yet
    const existingIds = new Set(tasksWithDeptName.map(t => t.contentId?.replace(/^#/, "").trim().toLowerCase()).filter(Boolean));
    if (targetCompany) {
      Object.entries(postTrackerData).forEach(([contentId, sheetData]) => {
        const sheetCompany = (sheetData.companyName || "").trim().toLowerCase();
        const isMatch = sheetCompany && (
          targetCompany === sheetCompany ||
          (sheetCompany.length >= 4 && targetCompany.includes(sheetCompany)) ||
          (targetCompany.length >= 4 && sheetCompany.includes(targetCompany))
        );
        const cleanCid = contentId.replace(/^#/, "").trim().toLowerCase();
        if (!existingIds.has(cleanCid) && isMatch) {
          tasksWithDeptName.push({
            _id: `sheet_pt_${cleanCid}`,
            contentId: cleanCid,
            title: `${sheetData.postType || 'Social Post'} (#${cleanCid})`,
            description: `Post Tracker item from sheet (${sheetData.postType || 'Social Post'})`,
            status: sheetData.status?.toLowerCase().includes('posted') ? 'Complete' : 'Working',
            createdAt: sheetData.scheduledDate || new Date().toISOString(),
            dueDate: sheetData.scheduledDate || "",
            marketingData: {
              companyId: user.companyId,
              departmentId: { _id: "pt_sheet", name: "Social Media" },
              postTracker: {
                ...sheetData,
                companyName: sheetData.companyName || company.name
              }
            }
          });
        }
      });
    }

    return Response.json({ success: true, tasks: tasksWithDeptName, companyName: company?.name || "Unknown Company" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
