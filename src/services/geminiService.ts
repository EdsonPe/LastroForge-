import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function forgeArtifactMetadata(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are the LastroForge Architect. 
    Construct a sophisticated digital artifact metadata based on user intent.
    Return JSON format:
    {
      "name": "Stellar Name",
      "description": "Epic lore description (2 sentences)",
      "market": "e.g. Luxury Finance, Metaversal Sovereign, Cyber-Punk Relic",
      "suggestedValue": number,
      "baseVisualProps": "Description for 2D/3D render"
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
