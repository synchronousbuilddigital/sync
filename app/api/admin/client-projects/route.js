import ClientProject from "@/models/ClientProject";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import { sendBrandProjectEmail } from "@/lib/mail";

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
        { 
          title: "Strategic Discovery & Matrix Mapping", 
          description: "Analyzing ecosystem requirements, identifying core KPI targets, and mapping the synchronous data flow architecture for maximum brand impact.", 
          status: "Complete" 
        },
        { 
          title: "Visual Archetype & Kinetic UX", 
          description: "Engineering high-fidelity visual prototypes, custom typography systems, and the interactive motion language using Antigravity design principles.", 
          status: "In Progress" 
        },
        { 
          title: "Frontend Synchronous Layer", 
          description: "Constructing high-performance UI components with Framer Motion, sleek CSS kinetics, and fluid responsive architecture.", 
          status: "Pending" 
        },
        { 
          title: "Backend Neural Infrastructure", 
          description: "Developing the secure logic layer, implementing optimized RESTful endpoints, and orchestrating complex Mongoose schema relationships.", 
          status: "Pending" 
        },
        { 
          title: "Payment Systems & Encrypted Gateways", 
          description: "Integrating military-grade SSL gateways, high-security transaction protocols, and automated financial invoicing subroutines.", 
          status: "Pending" 
        },
        { 
          title: "Edge Performance & Stress Testing", 
          description: "Simulating high-traffic throughput, optimizing asset distribution via Global CDN, and minimizing core web vital latencies.", 
          status: "Pending" 
        },
        { 
          title: "Final Integrity Synchronization", 
          description: "Comprehensive QA audits, cross-browser reliability testing, and final brand approval protocols before live synchronization.", 
          status: "Pending" 
        },
        { 
          title: "Global Production Rollout", 
          description: "Official shift to live production nodes, initiating SEO indexing, and deploying the brand into the synchronized digital ecosystem.", 
          status: "Pending" 
        }
      ];
    }

    data.publicId = crypto.randomBytes(6).toString("hex");

    const project = await ClientProject.create(data);

    // Send project tracking email
    try {
      const client = await User.findById(data.clientId);
      if (client) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const trackingLink = `${baseUrl}/brands/${project.publicId}`;
        await sendBrandProjectEmail(client.email, client.name, project.projectName, trackingLink);
      }
    } catch (mailErr) {
      console.error("Failed to send project mail:", mailErr);
    }

    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
