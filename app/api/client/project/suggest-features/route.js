import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "client") {
      return Response.json({ success: false, message: "Client only" }, { status: 401 });
    }

    const { projectType, description } = await req.json();
    
    const prompt = `
      Project Type: ${projectType}
      Description: ${description}
      
      Suggest 5 core features for this project. 
      Return the response as a JSON array of objects with 'title' and 'description' fields.
      Example: [ { "title": "Secure Payments", "description": "Integrate Stripe for tactical transactions." } ]
    `;

    const rawResponse = await generateAIResponse(prompt, "You are the Synchronous AI Product Architect.");
    
    let suggestions = [];
    try {
      if (rawResponse) {
        const jsonMatch = rawResponse.match(/\[.*\]/s);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.error("Failed to parse AI suggestions:", e);
    }

    return Response.json({ success: true, suggestions });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
