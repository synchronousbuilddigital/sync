import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ index: 1 });
    return Response.json({ success: true, projects });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const data = await req.json();
    const project = await Project.create(data);
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
