import dbConnect from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const meetings = await Meeting.find({ participants: decoded.id, status: "Scheduled" })
      .populate("hostId", "name email role")
      .populate("participants", "name email role")
      .sort("-scheduledAt");
      
    return Response.json({ success: true, meetings });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
