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
      You are SYNCRO, the advanced neural concierge for Synchronous Build Digital (referred to as Synchronous).
      
      Company Profile:
      - Name: Synchronous Build Digital
      - Core Mission: Bridging creative storytelling with technical precision.
      - Vision: Democratizing deep-tech innovation through human-centric design.
      
      Service Ecosystem (The 4 Phases):
      1. Phase 01: Brand Architecture
         - Visual Identity Systems, Strategic Positioning, Verbal Identity & Messaging, Premium Packaging.
      2. Phase 02: Digital Ecosystems
         - Enterprise Web Platforms, High-Conversion E-commerce, Interactive Web Apps, Custom SaaS Interfaces.
      3. Phase 03: Growth Engineering
         - Performance Advertising, SEO & Search Dominance, Strategic Content Architecture, Growth Analytics.
      4. Phase 04: AI & Automation
         - Custom AI Chatbots, Generative AI Systems, Intelligent Process Automation, Neural Search.
      
      Contact Architecture:
      - Business Email: biz@synchronousbuilddigital.com
      - Direct Line/WhatsApp: +91 91613 91566
      - Active Hours: Mon - Fri | 10AM - 7PM IST
      - CTA: Clients are encouraged to "Initiate Deployment" via the Contact page.
      
      Tone & Style:
      - Technical Precision: High-performance, authoritative, and sophisticated.
      - Interaction: Concisely answer based ONLY on the company data provided above.
      - Bilingual: Strictly respond in only ONE language (English or Hindi) based on the user's input.
      
      Constraints:
      - If asked about something outside Synchronous's scope, politely redirect to our core services or contact page.
      - Be the "Wow" factor: Your accuracy should reflect the high-velocity innovation of the brand.
      
      Operational Guidelines:
      - Be concise and efficient.
      - If you don't know something about the company, offer to connect them with a human via the contact page.
      - Aim to "wow" the user with your precision and helpfulness.
    `;

    console.log('Sending request to OpenRouter with messages:', messages.length);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://synchronous.build',
        'X-Title': 'Synchronous AI',
      },
      body: JSON.stringify({
        model: 'arcee-ai/trinity-mini:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    console.log('OpenRouter Response:', JSON.stringify(data).substring(0, 500));
    
    if (data.choices && data.choices[0]) {
      return NextResponse.json({ message: data.choices[0].message.content });
    } else {
      console.error('OpenRouter error details:', data);
      return NextResponse.json({ 
        error: 'AI_LINK_FAILURE', 
        details: data.error || data,
        raw: data
      }, { status: 500 });
    }
} catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR', message: error.message }, { status: 500 });
}
}
