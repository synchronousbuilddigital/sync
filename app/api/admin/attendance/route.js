import dbConnect from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET — Returns a full daily roster for a given date (default: today)
// Query param: ?date=YYYY-MM-DD
export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();

    // Parse date from query or default to today UTC midnight
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    let targetDate;
    if (dateParam) {
      const [y, m, d] = dateParam.split("-").map(Number);
      targetDate = new Date(Date.UTC(y, m - 1, d));
    } else {
      const now = new Date();
      targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }

    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    // Fetch all interns
    const interns = await User.find({ role: "intern" }).select("name email department").lean();

    // Fetch all attendance records for the target date
    const attendanceRecords = await Attendance.find({
      date: { $gte: targetDate, $lt: nextDate }
    }).lean();

    // Fetch all approved leaves that cover the target date
    const approvedLeaves = await Leave.find({
      status: "Approved",
      startDate: { $lte: nextDate },
      endDate: { $gte: targetDate }
    }).populate("internId", "name email").lean();

    // Build roster
    const attendanceMap = {};
    attendanceRecords.forEach(a => {
      attendanceMap[a.internId.toString()] = a;
    });

    const leaveMap = {};
    approvedLeaves.forEach(l => {
      if (l.internId) {
        leaveMap[l.internId._id.toString()] = l;
      }
    });

    const elevenAmUtc = targetDate.getTime() + (5.5 * 60 * 60 * 1000); // 11:00 AM IST
    const isPastCutoff = Date.now() >= elevenAmUtc;

    const roster = interns.map(intern => {
      const internIdStr = intern._id.toString();
      const attendanceRecord = attendanceMap[internIdStr];
      const leaveRecord = leaveMap[internIdStr];

      let status = isPastCutoff ? "Absent" : "Pending";
      let markedAt = null;
      let leaveReason = null;

      if (attendanceRecord) {
        status = "Present";
        markedAt = attendanceRecord.markedAt;
      } else if (leaveRecord) {
        status = "On Leave";
        leaveReason = leaveRecord.reason;
      }

      return {
        _id: intern._id,
        name: intern.name,
        email: intern.email,
        department: intern.department || "Tech",
        status,
        markedAt,
        leaveReason
      };
    });

    const summary = {
      total: roster.length,
      present: roster.filter(r => r.status === "Present").length,
      onLeave: roster.filter(r => r.status === "On Leave").length,
      absent: roster.filter(r => r.status === "Absent").length,
      pending: roster.filter(r => r.status === "Pending").length
    };

    return Response.json({ 
      success: true, 
      date: targetDate.toISOString().split("T")[0],
      roster, 
      summary 
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
