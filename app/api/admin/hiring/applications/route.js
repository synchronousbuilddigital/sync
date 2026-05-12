import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  const user = verifyToken(req);
  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    
    const query = jobId ? { jobId } : {};
    const applications = await Application.find(query).populate("jobId").sort({ createdAt: -1 });
    return Response.json({ success: true, applications });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const user = verifyToken(req);
  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, status, currentRound } = await req.json();
    
    const update = {};
    if (status) update.status = status;
    if (currentRound) update.currentRound = currentRound;

    const application = await Application.findByIdAndUpdate(id, update, { new: true });
    return Response.json({ success: true, application });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to update application" }, { status: 500 });
  }
}
