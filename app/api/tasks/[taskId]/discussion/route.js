import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { sendPushToOneUser, sendPushToAdmins } from "@/lib/webpush";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { taskId } = await params;
    const { message } = await req.json();

    const decoded = verifyToken(req);
    if (!decoded) return Response.json({ success: false, message: "Invalid or missing token" }, { status: 401 });

    const task = await Task.findById(taskId).populate('internId', 'name pushSubscriptions');
    if (!task) return Response.json({ success: false, message: "Task not found" }, { status: 404 });

    const isSenderAdmin = decoded.role === 'admin';
    const senderName = decoded.name || (isSenderAdmin ? 'Admin HQ' : 'Intern');

    task.discussion.push({
      sender: isSenderAdmin ? 'admin' : 'intern',
      senderName,
      content: message,
      timestamp: new Date()
    });

    if (isSenderAdmin) {
      task.hasUnreadInternChat = true;
      task.hasUnreadAdminChat = false;
    } else {
      task.hasUnreadAdminChat = true;
      task.hasUnreadInternChat = false;
    }

    await task.save();

    // Send Web Push to the other party (works even when app is closed)
    try {
      const shortMsg = message.length > 80 ? message.slice(0, 80) + '...' : message;
      if (isSenderAdmin) {
        // Admin sent a message → push to intern
        await sendPushToOneUser(task.internId, {
          title: '💬 New Message from Admin HQ',
          body: `Mission Log: "${shortMsg}"`,
          url: `/intern?notif_task=${taskId}&notif_action=chat`,
          tag: `chat-${taskId}-admin`
        });
      } else {
        // Intern sent a message → push to all admins
        const internName = task.internId?.name || 'An intern';
        await sendPushToAdmins(User, {
          title: `💬 Mission Log: ${internName}`,
          body: `"${shortMsg}"`,
          url: `/admin?notif_task=${taskId}&notif_action=chat`,
          tag: `chat-${taskId}-intern`
        });
      }
    } catch (pushErr) {
      console.error('[WebPush] Chat push failed:', pushErr);
    }

    return Response.json({ success: true, task });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
