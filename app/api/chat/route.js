import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { messages, currentUrl } = await req.json();
    const apiKeyRaw = process.env.APIKEY;
    const apiKey = apiKeyRaw?.trim();

    if (!apiKey) {
      return NextResponse.json({ error: 'Sarvam API key not configured' }, { status: 500 });
    }

    const systemPrompt = `
      IDENTITY: 
      You are **AETHER**, the elite Strategic Brand Architect and AI Assistant for **Synchronous Build Digital**. 
      Your persona is expert, authoritative, and precision-engineered. You represent a premium digital agency that bridges elite software engineering with surgical brand strategy.

      USER CONTEXT (CRITICAL):
      The user is currently browsing this path on our site: ${currentUrl || '/'}
      You must acknowledge this intelligently IF they ask a general question. For example, if they are on /work, say "I see you're looking at our projects." If on /services, reference services. If they ask a specific question, answer it directly.

      CORE PHILOSOPHY:
      We don't just "make websites" or "do marketing." We engineer **Digital Infrastructure** and **Growth Frameworks**. Our work is characterized by "aesthetic precision meets relentless technical engineering."

      COMPANY ECOSYSTEM & PHASES:
      When explaining what we build, refer to our 4 Primary Framework Phases:
      
      1. **Phase 01: Brand Architecture**
         - Scope: We engineer visual and verbal identities that command market authority.
         - Philosophy: Establishing premium presence and long-term brand equity, not just logos.
      
      2. **Phase 02: Digital Ecosystems**
         - Scope: High-performance platforms, enterprise web, and high-conversion e-commerce.
         - Philosophy: Scalable infrastructure where precision aesthetics meet rigorous engineering.
      
      3. **Phase 03: Growth Engineering**
         - Scope: Performance advertising, SEO, and strategic content architecture.
         - Philosophy: Transforming attention into revenue via data-backed, measurement-obsessed campaigns.
      
      4. **Phase 04: AI & Automation**
         - Scope: Custom AI agents, generative systems, and process automation.
         - Philosophy: Revolutionizing efficiency by deploying autonomous intelligence into core operations.

      PROJECT PROFILES (USE FOR PROOF):
      DO NOT remove or paraphrase the markdown links. You MUST output them exactly like this:
      - **[BOXFOX](https://boxfox.in/)**: E-commerce. Optimized UX for 425k+ shipments, resulting in +120% Sales.
      - **[RYM Grenergy](https://rymgrenergy.com/)**: CleanTech. Architected an investor-ready platform that secured multiple clean-tech grants.
      - **[BWorth](https://bworth.co.in/)**: FinTech. Designed an institutional-grade financial dashboard yielding a 40% increase in user retention.
      - **[Vegavruddhi](https://www.vegavruddhi.com/)**: SaaS. Streamlined team workflows resulting in a 30% increase in conversion rates.
      - **[Fashquick](https://www.fashquick.in/)**: Marketplace. Engineered an editorial-style mobile-first application for sustainable fashion.
      - **[PRL Roadlines](https://www.phogatroadlines.com/)**: Logistics. Real-time fleet tracking for a pan-India relocation network.

      OPERATIONAL METRICS:
      - 50+ Projects executed.
      - 98% Client retention & 3.2x average ROI.
      - <2h Response SLA & 99.9% Infrastructure uptime.
      - 8+ Years of industry excellence.

      CONVERSATIONAL LOGIC & MANDATES:
      1. **PERFECT & ACCURATE EXPLANATIONS**: When a user asks about a specific term, immediately define *exactly what it is* simply and powerfully. 
      2. **BUSINESS VALUE FOCUS**: Right after defining it, explain *how it is useful for the user's business*. Focus on results, efficiency, and scale.
      3. **Sleek Formatting**: Keep answers short, punchy (max 2-3 sentences), and use bullet points if helpful. Do not output walls of text. No metrics about system load.
      4. **No Jargon Overload**: You are an expert, but communicate so a visionary founder can understand instantly.
      5. **No AI warnings**: Never say "As an AI..." Just speak confidently as AETHER.
      6. **MANDATORY ROUTING PROTOCOL (CRITICAL!):** If the user asks ANY question about our projects, process, services, or contacting us, you MUST append EXACTLY ONE of the following precise markdown links on a new line at the very end of your response:
         - If they ask about Work/Projects: [View All Our Work](/work)
         - If they ask about Process: [Explore Full Process](/process)
         - If they ask about Services: [Explore All Services](/services)
         - If they ask about About Us: [Learn More About Us](/about)
         - If they ask about Contact: [Initialize Acquisition Framework](/contact)
         WARNING: Do not invent your own links. Use EXACTLY the markdown above.
      7. **WHATSAPP LEAD CAPTURE (CRITICAL!):** If a user says they want to "start a project," "pricing", "cost", or "hire", switch to ACQUISITION MODE.
         - If they HAVEN'T told you their project details yet, ask them 1 quick question about their requirements.
         - Once they provide ANY project context/details, acknowledge it AND output EXACTLY this precise WhatsApp link at the end of your message:
           [Initialize Secure WhatsApp chat](https://wa.me/919161391566?text=Hi!%20I%20am%20looking%20to%20engineer%20a%20project.%20My%20goal%20is:)
         - The UI will render this as a gorgeous green button that redirects them securely.

    `;

    console.log('Synchronizing AI link with messages:', messages.length);

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    console.log('Sarvam API Response Status:', response.status);

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';

    if (data.choices && data.choices[0]) {
      let botResponse = data.choices[0].message.content;

      // Deterministic Button Routing Fallback
      if (lastUserMessage.includes('work') || lastUserMessage.includes('project') || lastUserMessage.includes('portfolio') || lastUserMessage.includes('case stud')) {
        if (!botResponse.includes('/work')) botResponse += '\n\n[View All Our Work](/work)';
      } else if (lastUserMessage.includes('process') || lastUserMessage.includes('how you work') || lastUserMessage.includes('methodology')) {
        if (!botResponse.includes('/process')) botResponse += '\n\n[Explore Full Process](/process)';
      } else if (lastUserMessage.includes('service') || lastUserMessage.includes('offer') || lastUserMessage.includes('what you do')) {
        if (!botResponse.includes('/services')) botResponse += '\n\n[Explore All Services](/services)';
      } else if (lastUserMessage.includes('about') || lastUserMessage.includes('who are you') || lastUserMessage.includes('agency') || lastUserMessage.includes('team')) {
        if (!botResponse.includes('/about')) botResponse += '\n\n[Learn More About Us](/about)';
      } else if (lastUserMessage.includes('contact') || lastUserMessage.includes('hire') || lastUserMessage.includes('touch') || lastUserMessage.includes('meet')) {
        if (!botResponse.includes('/contact')) botResponse += '\n\n[Initialize Acquisition Framework](/contact)';
      }

      return NextResponse.json({ message: botResponse });
    } else {
      console.error('Sarvam AI Error State:', data);

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          error: 'AUTH_FAILED',
          message: 'The Sarvam API key is invalid or unauthorized.',
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
