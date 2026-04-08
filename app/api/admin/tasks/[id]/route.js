import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendTaskAssignmentEmail } from "@/lib/mail";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { internId, priority, dueDate, title, description } = await req.json();

    const updateData = {};
    if (internId) updateData.internId = internId;
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = dueDate;
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!task) return Response.json({ success: false, message: "Task not found" }, { status: 404 });

    // If reassigned, notify the new intern
    if (internId) {
       try {
          const intern = await User.findById(internId);
          if (intern) {
             await sendTaskAssignmentEmail(intern.email, intern.name, { 
                title: task.title, 
                description: task.description, 
                priority: task.priority, 
                dueDate: task.dueDate 
             });
          }
       } catch (mailErr) {
          console.error("Failed to notify reassigned intern:", mailErr);
       }
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) return Response.json({ success: false, message: "Task not found" }, { status: 404 });

    return Response.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
