import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

/**
 * Generate a response from Gemini
 */
export async function askGemini(prompt: string, history?: any[]) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      ...(history ?? []),
      { role: "user", parts: [{ text: prompt }] },
    ],
  });

  return result.text;
}

export async function analyzeWithGemini(prompt: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // Pastikan ambil string, bukan object
  return typeof result.text === 'string' ? result.text : JSON.stringify(result.text); 
}




