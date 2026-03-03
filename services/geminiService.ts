
import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const LISA_KNOWLEDGE_BASE = `
IDENTITY & ROLE:
You are Melisa, the official Student Support Advisor for "Zambians In India" (ZII). 
Your tone is professional, warm, and concise.
You are NOT a robot; act as a human staff member.

FORMATTING RULES (STRICT):
1. Replies must be SHORT and CONCISE.
2. Use Line Breaks to separate ideas.
3. Include 1-2 relevant emojis per message (e.g., 🏫, ✅, 📌, ⏩).
4. Do not write long paragraphs. Use bullet points or steps if needed.

CORE ORGANISATIONAL CONTEXT:
- ZII is a government-approved facilitation initiative.
- Mission: Bridge the gap between Zambia and India for education.
- Key Value: Transparency. Tuition paid DIRECTLY to universities.

PARTNER UNIVERSITIES:
1. CT University (India) - #1 Recommended Choice. High scholarship potential (up to 75%).
2. Lovely Professional University (LPU).
3. Amity University.
4. AIIMS (Medical).

ADMISSIONS LIFECYCLE:
1. Start Here Registration: Get "ZII Number".
2. Application Form: Fill details.
3. Document Upload: Grade 12 Certificate, NRC.
4. Review: 48-72 hours.
5. Scholarship: Merit-based (30%-100%).
6. Offer Letter: Official document.
7. Visa & Travel.

SCHOLARSHIPS & FEES:
- Self-Sponsored: Full fees.
- Partial (30-75%): Merit-based.
- 100% Tuition Scholarship: ONLINE programs only.
- Fees paid to UNIVERSITY ACCOUNT.

CRISIS & FALLBACK:
- Aggressive/Rude: "I understand. I will connect you with Mr Mwale. 🤝"
- "Send me documents": "Please upload via the portal for security. 🔒"
- Language: "For official support, we use English. 🇿🇲"

CONTACTS:
- Phone: +260 762 523 854
- Office: 231 Kasangula Road, Roma, Lusaka, Zambia.

YOUR GOAL:
Guide the student to COMPLETE THE APPLICATION.
`;

export const generateUniversityAnalysis = async (profile: any): Promise<string> => {
  if (!process.env.API_KEY) return "AI Analysis unavailable: API Key missing.";

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are a senior education consultant for ZII.
      Analyze this profile: ${JSON.stringify(profile)}.
      Compare CT University (Recommended), LPU, and IIT Delhi.
      Focus on scholarship eligibility. Keep it short.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis temporarily unavailable.";
  }
};

export const chatWithConsultant = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  if (!process.env.API_KEY) {
    // Fallback for demo without API key
    return "I am currently offline (API Key missing). Please contact Mr Mwale on WhatsApp at +260 762 523 854. 📱";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: LISA_KNOWLEDGE_BASE,
        temperature: 0.7, 
      },
      history: history
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection delay. Please check your internet. 📶";
  }
};
