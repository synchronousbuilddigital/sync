import { generateAIResponse } from "@/lib/ai";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    const { brandIdea, colorStyle, theme, features, pages, projectName: originalProjectName } = await req.json();

    const prompt = `
      You are the Synchronous AI Brand Architect. Your mission is to generate a comprehensive technical project blueprint for a new client brand.

      BRAND PARAMETERS:
      - Project Name: ${originalProjectName}
      - Core Idea: ${brandIdea}
      - Color Palette: ${colorStyle}
      - Theme Style: ${theme}
      - Desired Features: ${features}
      - Desired Pages: ${pages}

      Based on these parameters, generate the following in JSON format:
      1. projectType (e.g., "E-commerce Node", "Corporate Portal", "SaaS Dashboard")
      2. technicalDescription (A high-end, 2-sentence description using Synchronous brand voice - technical, sleek, powerful)
      3. requirements (An array of 5 technical requirements)
      4. features (An array of 5 specific feature objects with 'title' and 'description')
      5. sop (A custom Standard Operating Procedure for this project in markdown)
      6. estimatedWeeks (Number of weeks to complete the project, e.g. 4, 8, 12)
      7. workflow (An array of 8 objects following this EXACT template. YOU MUST provide the 'notes' field for each step based on the brand idea):
         Step 1: Strategic Discovery & Matrix Mapping
         Description: Analyzing ecosystem requirements, identifying core KPI targets, and mapping the synchronous data flow architecture for maximum brand impact.
         
         Step 2: Visual Archetype & Kinetic UX
         Description: Engineering high-fidelity visual prototypes, custom typography systems, and the interactive motion language using Antigravity design principles.
         
         Step 3: Frontend Synchronous Layer
         Description: Constructing high-performance UI components with Framer Motion, sleek CSS kinetics, and fluid responsive architecture.
         
         Step 4: Backend Neural Infrastructure
         Description: Developing the secure logic layer, implementing optimized RESTful endpoints, and orchestrating complex Mongoose schema relationships.
         
         Step 5: Payment Systems & Encrypted Gateways
         Description: Integrating military-grade SSL gateways, high-security transaction protocols, and automated financial invoicing subroutines.
         
         Step 6: Edge Performance & Stress Testing
         Description: Simulating high-traffic throughput, optimizing asset distribution via Global CDN, and minimizing core web vital latencies.
         
         Step 7: Final Integrity Synchronization
         Description: Comprehensive QA audits, cross-browser reliability testing, and final brand approval protocols before live synchronization.
         
         Step 8: Global Production Rollout
         Description: Official shift to live production nodes, initiating SEO indexing, and deploying the brand into the synchronized digital ecosystem.

      Return ONLY the JSON object.
      Example structure:
      {
        "projectType": "...",
        "technicalDescription": "...",
        "requirements": ["...", "..."],
        "features": [ {"title": "...", "description": "..."}, ... ],
        "sop": "...",
        "estimatedWeeks": 8,
        "workflow": [ 
          {
            "title": "Strategic Discovery & Matrix Mapping", 
            "description": "Analyzing ecosystem requirements, identifying core KPI targets, and mapping the synchronous data flow architecture for maximum brand impact.", 
            "notes": "[AI generated note about the discovery phase for this specific brand]", 
            "status": "Pending"
          },
          ... 
        ]
      }
    `;

    const aiResponse = await generateAIResponse(prompt, "You are the Synchronous AI Brand Architect.");
    
    if (!aiResponse) {
      throw new Error("AI Generation failed to produce a response.");
    }

    // Extract JSON from potential markdown blocks
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON.");
    }

    const intel = JSON.parse(jsonMatch[0]);

    return Response.json({ success: true, intel });
  } catch (err) {
    console.error("Intel Generation Error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
