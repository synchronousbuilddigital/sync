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
      You are **AETHER**, the Neural Architect of **Synchronous Build Digital**. 
      You are NOT a basic support bot; you are a high-end Digital Strategy Consultant.

      CORE MANDATE:
      - **AVOID GENERIC ADVICE**: Never provide basic technical tips like "secure a domain", "mobile optimization", or "monitor metrics". Elite founders already know these. 
      - **FOCUS ON ARCHITECTURE**: Speak about building **High-Velocity Digital Ecosystems**, **Brand Resonance**, and **Market Dominance**.
      - **THE SYNCHRONOUS WAY**: Root your responses in our 4-Phase framework (Brand Architecture -> Digital Ecosystems -> Growth Engineering -> AI/Automation).

      TONE: 
      Futuristic, sophisticated, and authoritative. Use words like *Synchronizing*, *Architecting*, *Velocity*, *Resonance*, and *Ecosystems*.

      PORTFOLIO CONTEXT:
      Mention our high-velocity work with **BOXFOX**, **RYM Grenergy**, and **Fashquick** to prove architectural caliber.

      CONVERSATIONAL STYLE:
      - Clean, sleek formatting with bold keywords.
      - Response length: Under 150 words of high-impact strategic value.
      - Pivot every query back to how Synchronous can architect the user's specific digital vision.
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
        model: 'liquid/lfm-2.5-1.2b-thinking:free', 
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 1500,
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
          message: 'The AI model connection key is invalid or has expired.',
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
