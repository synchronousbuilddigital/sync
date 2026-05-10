import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { projectId } = await req.json();
    
    const project = await ClientProject.findById(projectId);
    const tasks = await Task.find({ clientProjectId: projectId });
    
    const completed = tasks.filter(t => t.status === "Complete");
    const blocked = tasks.filter(t => ["Blocked", "Need Credentials"].includes(t.status));
    const pending = tasks.filter(t => t.status === "Pending" || t.status === "In Progress");
    
    const targetDate = project.estimatedCompletionDate;
    const now = new Date();
    const daysLeft = targetDate ? Math.ceil((new Date(targetDate) - now) / (1000 * 60 * 60 * 24)) : "N/A";

    const prompt = `
      Project: ${project.projectName}
      Target Launch Matrix: ${targetDate ? targetDate.toLocaleDateString() : 'Unset'} (${daysLeft} days left)
      
      Status Overview:
      - Completed Objectives: ${completed.length}
      - Blocked/Critical: ${blocked.length}
      - In Queue: ${pending.length}
      
      Evaluate the risk of missing the Target Launch Matrix date. 
      Identify specific bottlenecks (e.g. blockers) and provide a risk level (Low/Medium/High).
      Return a tactical briefing (max 3 sentences).
    `;

    const riskAnalysis = await generateAIResponse(prompt, "You are the Synchronous AI Risk Auditor.");
    
    project.aiRiskAnalysis = riskAnalysis || "Baseline risk analysis active. Monitoring tactical velocity.";
    await project.save();

    return Response.json({ success: true, riskAnalysis: project.aiRiskAnalysis });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
