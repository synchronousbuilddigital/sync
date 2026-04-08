import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const projects = await ClientProject.find().populate("clientId", "name email");
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
    
    // Predefined default advanced workflow
    if (!data.workflow || data.workflow.length === 0) {
      data.workflow = [
        { title: "Infrastructure Provisioning", description: "Spinning up secure server nodes, database clusters, and SSL distribution gateways.", status: "Complete" },
        { title: "Archetype Development", description: "Establishing the core design language, typography grid, and functional UX wireframes.", status: "In Progress" },
        { title: "frontend - Visual layer", description: "Engineering the high-velocity visual components with Framer Motion and sleek CSS dynamics.", status: "Pending" },
        { title: "backend - API Matrix", description: "Constructing the secure RESTful logic layer and Mongoose schema orchestration.", status: "Pending" },
        { title: "Payment Integration Gateway", description: "Implementing military-grade encryption for payment processing and invoice automation.", status: "Pending" },
        { title: "Quality assurance & stress test", description: "Simulating high-traffic loads and cross-browser reliability protocols.", status: "Pending" },
        { title: "Final Production Deployment", description: "Global CDN distribution and official brand rollout.", status: "Pending" }
      ];
    }

    data.publicId = crypto.randomBytes(6).toString("hex");

    const project = await ClientProject.create(data);
    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
