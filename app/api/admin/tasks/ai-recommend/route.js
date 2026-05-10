import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
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
    const { taskTitle, taskDescription } = await req.json();
    
    const interns = await User.find({ role: "intern" });
    const allTasks = await Task.find({ status: { $ne: "Complete" } });

    // Aggregate intern data
    const internStats = interns.map(intern => {
      const pendingTasks = allTasks.filter(t => t.internId?.toString() === intern._id.toString());
      const load = pendingTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 2), 0);
      return {
        id: intern._id,
        name: intern.name,
        currentLoad: load,
        taskCount: pendingTasks.length
      };
    });

    const prompt = `
      Task to Assign: ${taskTitle}
      Description: ${taskDescription}
      
      Team Availability:
      ${internStats.map(i => `- ${i.name}: ${i.currentLoad}h load, ${i.taskCount} tasks`).join("\n")}
      
      Recommend the best intern for this task based on load balancing. 
      Provide a brief tactical justification (e.g. "Intern X has the lowest operational load").
      Return JSON format: { "recommendedInternId": "id", "justification": "text" }
    `;

    const rawResponse = await generateAIResponse(prompt, "You are the Synchronous AI Operations Officer.");
    
    // Extract JSON from response if possible
    let recommendation = { recommendedInternId: internStats.sort((a, b) => a.currentLoad - b.currentLoad)[0]?.id, justification: "Manual load balancing: lowest current operational hours." };
    
    try {
      if (rawResponse) {
        const jsonMatch = rawResponse.match(/\{.*\}/s);
        if (jsonMatch) {
          recommendation = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.error("Failed to parse AI recommendation:", e);
    }

    return Response.json({ success: true, recommendation });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
