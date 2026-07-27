import dbConnect from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Helper: get the start of today in UTC (midnight)
function getTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// GET — Returns today's attendance status for the calling intern
export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const today = getTodayUTC();

    const attendance = await Attendance.findOne({ 
      internId: decoded.id, 
      date: today 
    });

    // Check if intern has an approved leave today
    const approvedLeave = await Leave.findOne({
      internId: decoded.id,
      status: "Approved",
      startDate: { $lte: new Date() },
      endDate: { $gte: today }
    });

    return Response.json({ 
      success: true, 
      marked: !!attendance,
      markedAt: attendance?.markedAt || null,
      onApprovedLeave: !!approvedLeave,
      leaveReason: approvedLeave?.reason || null
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST — Intern marks themselves present (server-side time check)
export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Server-side time gate: strictly 9:00 AM to 11:00 AM (IST = UTC+5:30)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (330 * 60000));
    const totalMinutes = istTime.getHours() * 60 + istTime.getMinutes();
    
    if (totalMinutes < 9 * 60) {
      return Response.json({ 
        success: false, 
        message: "Attendance marking opens at 9:00 AM" 
      }, { status: 403 });
    }
    if (totalMinutes >= 11 * 60) {
      return Response.json({ 
        success: false, 
        message: "Attendance marking closed at 11:00 AM" 
      }, { status: 403 });
    }

    await dbConnect();
    const today = getTodayUTC();

    // Check if already marked
    const existing = await Attendance.findOne({ internId: decoded.id, date: today });
    if (existing) {
      return Response.json({ 
        success: false, 
        message: "Already marked present today" 
      }, { status: 409 });
    }

    const attendance = await Attendance.create({
      internId: decoded.id,
      date: today,
      markedAt: now
    });

    return Response.json({ success: true, attendance });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ success: false, message: "Already marked present today" }, { status: 409 });
    }
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
