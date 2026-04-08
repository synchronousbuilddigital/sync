import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Leave from "@/models/Leave";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendTaskAssignmentEmail } from "@/lib/mail";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const tasks = await Task.find().populate("internId", "name email");
    return Response.json({ success: true, tasks });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { title, description, internId, priority, dueDate } = await req.json();

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

    const task = await Task.create({
      title,
      description,
      internId,
      priority: priority || "Medium",
      dueDate: dueDate || null,
      status: "Pending",
    });

    // Send task assignment email
    try {
      await sendTaskAssignmentEmail(intern.email, intern.name, { title, description, priority: priority || "Medium", dueDate });
    } catch (mailErr) {
       console.error("Failed to send task assignment email:", mailErr);
       // We don't return error here because the task was already created successfully
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

