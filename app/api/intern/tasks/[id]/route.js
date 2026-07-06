import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendMeetingRequestEmail } from "@/lib/mail";
import { sendPushToAdmins } from "@/lib/webpush";

export async function PATCH(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { status, note, isApproved, marketingData } = await req.json();

    let query = { _id: id };
    if (decoded.role === "intern") {
      query.internId = decoded.id;
    }

    const updateData = { status, note };
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (marketingData !== undefined) {
      // Use dot notation to avoid overwriting the whole object if partial
      for (const [key, value] of Object.entries(marketingData)) {
        updateData[`marketingData.${key}`] = value;
      }
      if (marketingData.postedLink || marketingData.liveLink) {
        const pLink = marketingData.postedLink || marketingData.liveLink;
        updateData[`marketingData.postTracker.postedLink`] = pLink;
        updateData[`marketingData.postedLink`] = pLink;
        updateData[`liveLink`] = pLink;
      }
    }

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

    // Send Web Push to admins for important status updates (works even when app is closed)
    try {
      const intern = await User.findById(decoded.id).select('name');
      const internName = intern?.name || 'An intern';
      const statusEmojis = {
        'Complete': '🎉',
        'Need Meeting': '📅',
        'Need Credentials': '🔑',
        'Blocked': '🚫',
        'Pending': '⏳'
      };
      const emoji = statusEmojis[status] || '📋';
      const hasLinks = marketingData?.rawLink || marketingData?.editedLink || marketingData?.postedLink;

      if (['Complete', 'Need Meeting', 'Need Credentials', 'Blocked'].includes(status) || hasLinks) {
        await sendPushToAdmins(User, {
          title: `${emoji} ${internName}: Task ${status}`,
          body: hasLinks
            ? `Links submitted for "${task.title}"`
            : `"${task.title}" marked as ${status}`,
          url: `/admin?notif_task=${task._id}&notif_action=${status === 'Complete' ? 'update' : 'chat'}`,
          tag: `task-status-${task._id}-${status}`
        });
      }
    } catch (pushErr) {
      console.error("Failed to send push for task update:", pushErr);
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
