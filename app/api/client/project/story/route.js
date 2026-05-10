import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { generateAIResponse, getFallbackStory } from "@/lib/ai";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || !["admin", "client"].includes(decoded.role)) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { projectId } = await req.json();
    
    const project = await ClientProject.findById(projectId);
    if (!project) return Response.json({ success: false, message: "Project not found" }, { status: 404 });

    const tasks = await Task.find({ clientProjectId: projectId });
    
    // Construct Prompt for AI Storyteller
    const completedTasks = tasks.filter(t => t.status === "Complete");
    const pendingTasks = tasks.filter(t => t.status !== "Complete");
    
    const prompt = `
      Project: ${project.projectName}
      Description: ${project.description}
      Completed Objectives: ${completedTasks.map(t => t.title).join(", ")}
      Current Focus: ${pendingTasks.slice(0, 3).map(t => t.title).join(", ")}
      
      Generate a professional, high-end "Operational Progress Narrative" (max 3 sentences) that sounds like a elite mission briefing. 
      Avoid generic corporate speak. Use terms like "Mission Intelligence", "Tactical Deployment", "Neutralised Objectives".
    `;

    let story = await generateAIResponse(prompt, "You are the Synchronous AI Storyteller.");
    
    if (!story) {
      story = getFallbackStory(project, tasks);
    }

    project.aiStory = story;
    await project.save();

    return Response.json({ success: true, story });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
