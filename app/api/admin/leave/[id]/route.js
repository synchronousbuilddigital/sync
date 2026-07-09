import dbConnect from "@/lib/mongodb";
import Leave from "@/models/Leave";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendLeaveStatusEmail } from "@/lib/mail";
import { sendPushToOneUser } from "@/lib/webpush";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
       return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { status, adminNote } = await req.json();

    if (!["Approved", "Rejected"].includes(status)) {
       return Response.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const leave = await Leave.findByIdAndUpdate(
      id, 
      { status, adminNote }, 
      { returnDocument: 'after' }
    ).populate("internId", "name email");

    if (!leave) return Response.json({ success: false, message: "Leave request not found" }, { status: 404 });

    try {
      await sendLeaveStatusEmail(leave.internId.email, leave.internId.name, status, adminNote);
    } catch (mailErr) {
      console.error("Failed to send leave update email", mailErr);
    }

    // Send Web Push to intern (works even when app is closed)
    try {
      const internWithSubs = await User.findById(leave.internId._id).select('pushSubscriptions');
      await sendPushToOneUser(internWithSubs, {
        title: `Leave ${status}`,
        body: `Your leave request for ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()} by Admin HQ.`,
        url: `/intern?notif_section=leave`,
        tag: `leave-${id}-${status}`
      });
    } catch (pushErr) {
      console.error("Failed to send push for leave:", pushErr);
    }

    return Response.json({ success: true, leave });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
