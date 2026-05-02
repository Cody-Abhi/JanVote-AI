import { GoogleGenAI } from "@google/genai";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const getAI = () => {
  const apiKey = GEMINI_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI Assistant will not function.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function getGeminiResponse(prompt: string, history: any[] = [], language: string = 'english') {
  const ai = getAI();
  if (!ai) {
    throw new Error("AI Assistant is not configured. Please set the GEMINI_API_KEY.");
  }

  const systemInstruction = `
    You are JanVote AI, a highly intelligent and helpful election assistant for Indian voters.
    Your goal is to provide accurate information about election processes, registration, polling booths, and voter rights.
    
    STRICT LANGUAGE RULE:
    - If the user speaks in English, respond ONLY in English.
    - If the user speaks in Hindi, respond ONLY in Hindi.
    - If the user speaks in Hinglish (Hindi written in Roman script), respond in Hinglish.
    - Current detected/preferred language: ${language}.
    
    Keep responses concise, professional, and easy to understand for the average citizen.
    Avoid taking political sides or recommending specific candidates.

    At the very end of your response, you MUST search for 2-3 logical follow-up questions that the user might want to ask based on your current answer.
    Format these follow-up questions strictly like this:
    FOLLOW_UPS: ["Question 1?", "Question 2?", "Question 3?"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function* streamGeminiResponse(prompt: string, history: any[] = [], language: string = 'english') {
  const ai = getAI();
  if (!ai) {
    throw new Error("AI Assistant is not configured. Please set the GEMINI_API_KEY.");
  }

  const systemInstruction = `
    You are JanVote AI, a highly intelligent and helpful election assistant for Indian voters.
    Your goal is to provide accurate information about election processes, registration, polling booths, and voter rights.
    
    STRICT LANGUAGE RULE:
    - If the user speaks in English, respond ONLY in English.
    - If the user speaks in Hindi, respond ONLY in Hindi.
    - If the user speaks in Hinglish (Hindi written in Roman script), respond in Hinglish.
    - Current detected/preferred language: ${language}.
    
    Keep responses concise, professional, and easy to understand for the average citizen.
    Avoid taking political sides or recommending specific candidates.

    At the very end of your response, you MUST search for 2-3 logical follow-up questions that the user might want to ask based on your current answer.
    Format these follow-up questions strictly like this:
    FOLLOW_UPS: ["Question 1?", "Question 2?", "Question 3?"]
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function getRealTimeStats() {
  const ai = getAI();
  if (!ai) {
    throw new Error("AI Assistant is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: 'Search Google for the most recent numbers and numerical statistics regarding the Indian Election Commission or ongoing Indian Elections (like number of booths, total voters registered, voter turnout percentages, etc.). Format the output STRICTLY as a JSON object with keys: "voters" (number), "booths" (number), "waitTime" (number in minutes, estimate if needed), "onlineRegistrations" (number). Return ONLY the valid JSON object string. If accurate real-time numbers cannot be found, provide historically accurate typical scale numbers for India.' }] }
      ],
      config: {
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("Gemini API Realtime Stats Error:", error);
    return null;
  }
}

export async function getRealTimeElectionNews() {
  const ai = getAI();
  if (!ai) {
    throw new Error("AI Assistant is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: 'Search Google for the latest real-time, current factual news headlines and short summaries about the Indian Elections, Indian Politics, or Election Commission of India. Ensure this reflects the extremely latest real-world developments. Format the output STRICTLY as a JSON array of objects with keys: "headline", "summary", "source", "time". Return ONLY the valid JSON array string.' }] }
      ],
      config: {
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Gemini API Realtime News Error:", error);
    return [];
  }
}

export async function detectLanguageAndLocale(text: string): Promise<{ language: string; locale: string; langName: string }> {
  const ai = getAI();
  if (!ai) return { language: 'english', locale: 'en-IN', langName: 'English' };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: `Detect the language of this text: "${text}"\n\nRespond ONLY with a JSON object like this (no markdown, no explanation):\n{"language": "hindi", "locale": "hi-IN", "langName": "Hindi"}\n\nFor locale, use one of these EXACT values based on the language detected:\nEnglish → en-IN\nHindi → hi-IN\nTamil → ta-IN\nTelugu → te-IN\nMarathi → mr-IN\nBengali → bn-IN\nGujarati → gu-IN\nKannada → kn-IN\nMalayalam → ml-IN\nPunjabi → pa-IN\nOdia → or-IN\nAssamese → as-IN\nUrdu → ur-IN\nHinglish → hi-IN\nFor any other language detected, default to en-IN.` }] }],
      config: { temperature: 0 }
    });

    const raw = response.text || '{}';
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { language: 'english', locale: 'en-IN', langName: 'English' };
  } catch {
    return { language: 'english', locale: 'en-IN', langName: 'English' };
  }
}

export async function getVoterReadinessReport(answers: Record<string, string>): Promise<{
  status: 'ready' | 'almost' | 'notready';
  statusLabel: string;
  headline: string;
  summary: string;
  actions: { priority: 'urgent' | 'soon' | 'done'; task: string; link?: string }[];
  motivationalQuote: string;
}> {
  const ai = getAI();
  if (!ai) throw new Error('AI not configured');

  const prompt = `
You are India's Election Commission voter readiness checker.
A voter answered these questions:
- Age 18 or above: ${answers.age}
- Has Aadhaar Card: ${answers.aadhaar}
- Has Voter ID (EPIC): ${answers.epic}
- Name is on Electoral Roll: ${answers.roll}
- Knows their polling booth location: ${answers.booth}
- State: ${answers.state}

Based on these answers, generate a voter readiness report.
Respond ONLY with a valid JSON object (no markdown, no explanation):
{
  "status": "ready" | "almost" | "notready",
  "statusLabel": "Voter-Ready! ✅" | "Almost There! ⚡" | "Action Needed! 🚨",
  "headline": "One powerful sentence about their status",
  "summary": "2-3 sentences explaining their situation and what it means",
  "actions": [
    { "priority": "urgent" | "soon" | "done", "task": "What to do", "link": "optional URL" }
  ],
  "motivationalQuote": "A short inspiring quote about voting in India (can be in Hindi or English)"
}
Provide 3-5 actions. For anything that is already done, mark priority as "done".
For urgent items that block voting, mark "urgent". For optional improvements, mark "soon".
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.4 }
  });

  const text = response.text || '{}';
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('Failed to parse readiness report');
}

export async function getPartyComparison(partyA: string, partyB: string): Promise<{
  topic: string;
  partyA: string;
  partyB: string;
  stances: {
    category: string;
    emoji: string;
    aStance: string;
    bStance: string;
    aDifferentiator: 'stronger' | 'weaker' | 'neutral';
  }[];
  verdict: string;
  disclaimer: string;
}> {
  const ai = getAI();
  if (!ai) throw new Error('AI not configured');

  const prompt = `
Search Google for the most recent, factual information about the political stances, policies, and positions of "${partyA}" and "${partyB}" in India.

Then generate an unbiased, factual side-by-side comparison.

Respond ONLY with a valid JSON object (no markdown fences, no explanation):
{
  "topic": "${partyA} vs ${partyB}",
  "partyA": "${partyA}",
  "partyB": "${partyB}",
  "stances": [
    {
      "category": "Economy",
      "emoji": "💰",
      "aStance": "2-3 sentence factual stance of ${partyA}",
      "bStance": "2-3 sentence factual stance of ${partyB}",
      "aDifferentiator": "stronger" | "weaker" | "neutral"
    }
  ],
  "verdict": "One neutral, balanced sentence summarising the core philosophical difference between the two parties.",
  "disclaimer": "This comparison is AI-generated for educational purposes only. JanVote AI does not endorse any political party."
}

Include EXACTLY these 6 categories in this order:
1. Economy (💰)
2. Agriculture (🌾)
3. Education (📚)
4. Healthcare (🏥)
5. National Security (🛡️)
6. Youth & Employment (👥)

For each category, set "aDifferentiator" to "stronger" if ${partyA}'s stance is more developed/specific, "weaker" if less, or "neutral" if comparable.
Be strictly unbiased. Present facts only. Do not recommend voting for either party.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      temperature: 0.2,
      tools: [{ googleSearch: {} }],
    }
  });

  const text = response.text || '{}';
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('Failed to parse comparison');
}
