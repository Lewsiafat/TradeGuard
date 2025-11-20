import { GoogleGenAI, Type } from "@google/genai";
import { ChecklistItem } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateChecklistFromStrategy = async (strategyDescription: string): Promise<ChecklistItem[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a professional crypto trading risk manager.
    Create a specific pre-trade checklist based on the user's trading strategy.
    Strategy Description: "${strategyDescription}"
    
    Return a list of 5-8 specific, actionable items that the trader must check before entering a trade.
    Focus on risk management, technical confirmation, and psychology.
    Return JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The checklist item text" },
                  importance: { type: Type.STRING, description: "Why this is important (brief)" }
                },
                required: ["text"]
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{ "items": [] }');
    
    return result.items.map((item: any, index: number) => ({
      id: `gen_${Date.now()}_${index}`,
      text: item.text,
      isRequired: true
    }));

  } catch (error) {
    console.error("Gemini generation failed", error);
    throw error;
  }
};