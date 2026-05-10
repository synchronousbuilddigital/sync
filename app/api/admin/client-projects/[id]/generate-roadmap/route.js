import dbConnect from "@/lib/mongodb";
import ClientProject from "@/models/ClientProject";
import { verifyToken } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") return Response.json({ success: false, message: "Admin only" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const project = await ClientProject.findById(id);

    if (!project) return Response.json({ success: false, message: "Project not found" }, { status: 404 });

    // AI LOGIC SIMULATION: Generate Roadmap based on features and requirements
    const features = project.features || [];
    const requirements = project.requirements || [];
    const type = project.projectType || "Custom Web App";

    let roadmap = [
      { title: "Project Initiation", description: `Setting up infrastructure for ${type}.`, status: "Complete" },
      { title: "Requirement Approval", description: `Finalizing ${requirements.length} core project requirements.`, status: "In Progress" }
    ];

    // Add steps based on features
    if (features.length > 0) {
      roadmap.push({ 
        title: "Feature Architectural Design", 
        description: `Mapping out technical implementation for: ${features.map(f => f.title).join(", ")}.`, 
        status: "Pending" 
      });
      
      roadmap.push({ 
        title: "Core Feature Development", 
        description: `Developing primary functionality: ${features.slice(0, 3).map(f => f.title).join(", ")}.`, 
        status: "Pending" 
      });

      if (features.length > 3) {
        roadmap.push({ 
          title: "Advanced Feature Integration", 
          description: `Integrating remaining features: ${features.slice(3).map(f => f.title).join(", ")}.`, 
          status: "Pending" 
        });
      }
    }

    roadmap.push({ title: "UI/UX Polishing", description: "Enhancing visual aesthetics and interaction states.", status: "Pending" });
    roadmap.push({ title: "Quality Assurance", description: "Rigorous testing across multiple devices and environments.", status: "Pending" });
    roadmap.push({ title: "Production Deployment", description: "Final launch to production servers.", status: "Pending" });

    // Estimate Completion Date (Mock Logic: 1 week per 2 features + 2 weeks base)
    const weeksNeeded = Math.ceil(features.length / 2) + 2;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (weeksNeeded * 7));

    project.workflow = roadmap;
    project.estimatedCompletionDate = estimatedDate;
    
    // Auto-generate SOP template if empty
    if (!project.sop) {
        project.sop = `# SOP: ${project.projectName}\n\n1. **Daily Sync**: Update status of ${type} components.\n2. **Feature Deployment**: All ${features.length} features must be tested in staging.\n3. **Communication**: All discussion must happen in the Sync Matrix.`;
    }

    await project.save();

    return Response.json({ success: true, project });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
