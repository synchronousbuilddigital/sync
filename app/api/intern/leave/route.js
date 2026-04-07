import dbConnect from "@/lib/mongodb";
import Leave from "@/models/Leave";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Intern only" }, { status: 401 });
    }

    await dbConnect();
    const { startDate, endDate, reason } = await req.json();

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
