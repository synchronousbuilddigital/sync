import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Find the latest application for this email
    const application = await Application.findOne({ email })
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    if (!application) {
      return Response.json({ success: false, message: "No application found for this email." }, { status: 404 });
    }

    return Response.json({ success: true, application });
  } catch (error) {
    console.error("Public status check error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
