import dbConnect from "@/lib/mongodb";
import Leave from "@/models/Leave";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Intern only" }, { status: 401 });
    }

    await dbConnect();
    const { startDate, endDate, reason } = await req.json();

    if (!startDate || !endDate || !reason) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset today's time to start of day for accurate past-date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const startCompare = new Date(start);
    startCompare.setHours(0, 0, 0, 0);

    if (startCompare < today) {
      return Response.json({ success: false, message: "Start date cannot be in the past" }, { status: 400 });
    }

    if (end < start) {
      return Response.json({ success: false, message: "End date cannot be before start date" }, { status: 400 });
    }

    // Check for overlapping leaves (either Pending or Approved)
    const existingLeave = await Leave.findOne({
      internId: decoded.id,
      status: { $in: ["Pending", "Approved"] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (existingLeave) {
      return Response.json({ success: false, message: "You already have a leave request overlapping these dates" }, { status: 400 });
    }

    const leave = await Leave.create({
      internId: decoded.id,
      startDate,
      endDate,
      reason,
      status: "Pending"
    });

    return Response.json({ success: true, leave });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    // Intern sees only their leaves, admin sees ALL pending/approved
    let query = {};
    if (decoded.role === "intern") {
      query.internId = decoded.id;
    }

    const leaves = await Leave.find(query).populate("internId", "name email").sort("-createdAt");
    return Response.json({ success: true, leaves });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
