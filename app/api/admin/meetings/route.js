import dbConnect from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const meetings = await Meeting.find({})
      .populate("hostId", "name email role")
      .populate("participants", "name email role")
      .sort("-scheduledAt");
      
    return Response.json({ success: true, meetings });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { title, description, scheduledAt, participants } = await req.json();

    if (!title || !scheduledAt || !participants || participants.length === 0) {
      return Response.json({ success: false, message: "Title, scheduled time, and participants are required" }, { status: 400 });
    }

    // Generate a unique room name for Jitsi
    const roomName = `SyncHQ-${title.replace(/[^a-zA-Z0-9]/g, "")}-${uuidv4().substring(0, 8)}`;

    const meeting = await Meeting.create({
      title,
      description: description || "",
      scheduledAt: new Date(scheduledAt),
      roomName,
      hostId: decoded.id,
      participants,
      status: "Scheduled"
    });

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("hostId", "name email role")
      .populate("participants", "name email role");

    return Response.json({ success: true, meeting: populatedMeeting });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { meetingId, status } = await req.json();

    if (!meetingId || !status) {
      return Response.json({ success: false, message: "Missing meetingId or status" }, { status: 400 });
    }

    const meeting = await Meeting.findByIdAndUpdate(meetingId, { status }, { new: true })
      .populate("hostId", "name email role")
      .populate("participants", "name email role");

    return Response.json({ success: true, meeting });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const url = new URL(req.url);
    const meetingId = url.searchParams.get("meetingId");

    if (!meetingId) {
      return Response.json({ success: false, message: "Missing meetingId" }, { status: 400 });
    }

    await Meeting.findByIdAndDelete(meetingId);
    return Response.json({ success: true, message: "Meeting deleted successfully" });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
