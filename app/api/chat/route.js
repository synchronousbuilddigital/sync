import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKeyRaw = process.env.APIKEY;
    const apiKey = apiKeyRaw?.trim();

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const systemPrompt = `
      CORE DIRECTIVES:
      - BALANCED HELPFULNESS: Always provide a descriptive and engaging answer before the word count. Max 150 words. Never respond with just the word count.
      - IDENTITY: Sophisticated Neural Concierge of Synchronous.
      - METRICS: Append the total word count at the very end of your response in parentheses: .
      - SCOPE: Answer ONLY Synchronous-related queries. Reject others with a brand-focused bridge.
      
      PHASED PROCESS (ALWAYS EXPLAIN WHEN ASKED):
      1. Phase 01: Brand Architecture (Strategic Storytelling & Identity)
      2. Phase 02: Digital Ecosystems (Enterprise Web & High-End E-commerce)
      3. Phase 03: Growth Engineering (Surgical SEO & Paid Dominance)
      4. Phase 04: AI & Automation (Neural Concierges & Process Intelligence)
      
      PROJECTS: BOXFOX, RYM Grenergy, Vegavruddhi, BWorth, Fashquick.
      CONTACT: +91 91613 91566
      
      Goal: Provide surgical accuracy with absolute minimal word count.
    `;

    console.log('Sending request to OpenRouter with messages:', messages.length);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://www.synchronousbuilddigital.com',
        'X-Title': 'Synchronous AI',
      },
      body: JSON.stringify({
        model: 'liquid/lfm-2.5-1.2b-thinking:free', // User-specified thinking model
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.6, // Adjusted for 'thinking' balance
        max_tokens: 1500, // Thinking models often need more room for reasoning
      }),
    });

    const data = await response.json();
    console.log('OpenRouter Response:', JSON.stringify(data).substring(0, 500));

    if (data.choices && data.choices[0]) {
      return NextResponse.json({ message: data.choices[0].message.content });
    } else {
      console.error('AI Link Error State:', data);

      // Specialized advice for 401 Authentication issues
      if (data.error?.code === 401 || data.error?.message?.includes('User not found')) {
        return NextResponse.json({
          error: 'AUTH_EXPIRED',
          message: 'The AI model connection key is invalid or has expired. Please verify your OpenRouter key in the .env file.',
          fix: 'Ensure the key starts with sk-or-v1- and that your OpenRouter account has active status.'
        }, { status: 401 });
      }

      return NextResponse.json({
        error: 'NEURAL_LINK_FAILED',
        details: data.error || data
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR', message: error.message }, { status: 500 });
  }
}
