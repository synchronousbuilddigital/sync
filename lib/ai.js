/**
 * Synchronous AI Core
 * Handles intelligent processing for Storytelling, Allocation, and Risk Analysis.
 */

const API_KEY = process.env.APIKEY;

export async function generateAIResponse(prompt, systemPrompt = "You are the Synchronous AI Command Center.") {
  if (!API_KEY) {
    console.warn("AI_KEY not found. Using fallback logic.");
    return null;
  }

  try {
    // Attempt to use OpenRouter or similar if the key matches that pattern
    // Otherwise fallback to a simulated response that is data-driven
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("AI Generation Error:", err);
    return null;
  }
}

/**
 * Fallback Storyteller Logic (Data-Driven)
 */
export function getFallbackStory(project, tasks) {
  const completed = project.workflow.filter(s => s.status === "Complete");
  const inProgress = project.workflow.filter(s => s.status === "In Progress");
  const lastCompleted = completed[completed.length - 1];

  if (completed.length === 0) {
    return `Mission Initialised. We are currently in the ${inProgress[0]?.title || 'Initiation'} phase, setting up the core project architecture.`;
  }

  if (progress === 100) {
    return `Mission Accomplished. All objectives have been finalized and the system is ready for production deployment.`;
  }

  return `Objective "${lastCompleted.title}" has been successfully neutralized. The team is now accelerating into "${inProgress[0]?.title || 'the next phase'}" to maintain tactical momentum.`;
}
