import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendMeetingRequestEmail } from "@/lib/mail";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { status, note, isApproved } = await req.json();

    let query = { _id: id };
    if (decoded.role === "intern") {
      query.internId = decoded.id;
    }

    const updateData = { status, note };
    if (isApproved !== undefined) updateData.isApproved = isApproved;

    if (status === "Need Meeting") {
      updateData.meetingLink = "https://meet.google.com/fvx-dgeh-dgb";
    }

    const task = await Task.findOneAndUpdate(
      query, 
      updateData, 
      { returnDocument: 'after' }
    );

    if (!task) {
      return Response.json({ success: false, message: "Task not found or access denied" }, { status: 404 });
    }

    // Notify Admin after successful DB update
    if (status === "Need Meeting") {
      try {
        const admins = await User.find({ role: "admin" }).select("email");
        const adminEmails = admins.map(a => a.email);
        const intern = await User.findById(decoded.id);
        if (adminEmails.length > 0 && intern) {
          await sendMeetingRequestEmail(adminEmails, intern.name, task.title, updateData.meetingLink);
        }
      } catch (err) {
        console.error("Failed to notify admin of meeting:", err);
      }
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
