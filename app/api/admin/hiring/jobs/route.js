import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  const user = verifyToken(req);
  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const jobs = await Job.find().sort({ createdAt: -1 });
    return Response.json({ success: true, jobs });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  const user = verifyToken(req);
  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const job = await Job.create(data);
    return Response.json({ success: true, job });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to create job" }, { status: 500 });
  }
}

export async function PUT(req) {
  const user = verifyToken(req);
  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, ...updateData } = await req.json();
    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    return Response.json({ success: true, job });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const user = verifyToken(req);
  if (!user || user.role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Job.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Job deleted" });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to delete job" }, { status: 500 });
  }
}
