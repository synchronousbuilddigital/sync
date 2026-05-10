import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "intern") {
      return Response.json({ success: false, message: "Intern only" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const task = await Task.findById(id);
    
    if (!task) return Response.json({ success: false, message: "Task not found" }, { status: 404 });
    if (!["Blocked", "Need Credentials", "Need Meeting"].includes(task.status)) {
       return Response.json({ success: false, message: "Task is not blocked" });
    }

    const project = await ClientProject.findById(task.clientProjectId);
    
    // Construct Prompt for AI Blocker Resolver
    const prompt = `
      Task: ${task.title}
      Issue: ${task.status} - ${task.note || 'No additional notes'}
      
      Project Intelligence (Tech Vault):
      - Github: ${project?.credentials?.github || 'Unknown'}
      - Vercel: ${project?.credentials?.vercel?.email || 'Unknown'}
      - ENV: ${project?.credentials?.env ? 'Available' : 'Missing'}
      - Domain: ${project?.credentials?.domain || 'Unknown'}
      
      Based on this intelligence, provide a tactical suggestion (1-2 sentences) to resolve the blocker. 
      If credentials seem missing, suggest requesting them from HQ.
    `;

    const suggestion = await generateAIResponse(prompt, "You are the Synchronous AI Tactical Support.");
    
    return Response.json({ 
      success: true, 
      suggestion: suggestion || "Check the Tech Vault for missing credentials or request a briefing from HQ." 
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
