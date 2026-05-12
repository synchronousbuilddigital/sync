import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";

export async function GET(req) {
  try {
    await dbConnect();
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    return Response.json({ success: true, jobs });
  } catch (error) {
    console.error("GET jobs error:", error);
    return Response.json({ success: false, message: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // Basic validation
    const requiredFields = ["jobId", "name", "phone", "email", "education", "skills", "project", "resumeLink"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return Response.json({ success: false, message: `${field} is required` }, { status: 400 });
      }
    }

    const application = await Application.create(data);
    return Response.json({ success: true, application });
  } catch (error) {
    console.error("POST application error:", error);
    return Response.json({ success: false, message: "Failed to submit application" }, { status: 500 });
  }
}
