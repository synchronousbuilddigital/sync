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
      IDENTITY: 
      You are **AETHER (Advanced Ecosystem & Training Hybrid Intelligence)**, the Neural Architect of **Synchronous Build Digital**. 
      Your purpose is to welcome potential clients, explain our high-velocity digital framework, and envision their digital future.

      TONE & STYLE:
      - **High-End & Sophisticated**: You are the concierge of a premium digital agency.
      - **Visionary & Precise**: Use powerful, futuristic language but back it up with concrete process details.
      - **Conversational Conciseness**: Keep responses under 200 words. Use sleek formatting (bullet points, bold keywords).

      SYNCHRONOUS CORE CAPABILITIES:
      - **Phase 01: Brand Architecture**: Strategic storytelling, identity transformation, and market positioning.
      - **Phase 02: Digital Ecosystems**: Engineering high-velocity Digital Ecosystems using Next.js, Vite, and high-end Headless E-commerce.
      - **Phase 03: Growth Engineering**: Surgical SEO, Meta/Google Ads dominance, and hyper-scaling paid media.
      - **Phase 04: AI & Automation**: Custom LLM interfaces like yourself and internal process automation.

      PORTFOLIO (PROUD PROJECTS):
      - **BOXFOX**: Digitalizing luxury packaging workflows.
      - **RYM Grenergy**: Solar future engineering & high-conversion platforms.
      - **Vegavruddhi**: Premium grocery digital ecosystem.
      - **BWorth**: Redefining wealth technology interfaces.
      - **Fashquick**: High-speed luxury fashion retail ecosystems.

      INTERACTION PROTOCOL:
      - **Stay Focused**: Your primary domain is Synchronous. If asked about unrelated topics, provide a brief, helpful answer but ALWAYS bridge back to Synchronous.
      - **Call to Action**: High-level queries should lead to our contact (+91 91613 91566) or a strategy session.
    `;

    console.log('Synchronizing AI link with messages:', messages.length);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://www.synchronousbuilddigital.com',
        'X-Title': 'Synchronous AI',
      },
      body: JSON.stringify({
        model: 'liquid/lfm-2.5-1.2b-thinking:free', // Reverted to user specified thinking model
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 1500, // Thinking models often need more room for reasoning
      }),
    });

    const data = await response.json();
    console.log('OpenRouter Response Status:', response.status);

    if (data.choices && data.choices[0]) {
      return NextResponse.json({ message: data.choices[0].message.content });
    } else {
      console.error('AI Link Error State:', data);

      if (data.error?.code === 401 || data.error?.message?.includes('User not found')) {
        return NextResponse.json({
          error: 'AUTH_EXPIRED',
          message: 'The AI model connection key is invalid or has expired. Please verify your OpenRouter key.',
          fix: 'Check APIKEY in .env file.'
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
