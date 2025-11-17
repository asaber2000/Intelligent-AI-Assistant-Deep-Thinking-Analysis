import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = "You are an advanced AI assistant with exceptional analytical and creative skills. Take your time to think carefully before responding. Consider multiple perspectives, analyze potential implications, and provide a clear, structured, and detailed answer. If the question is complex, break it down into smaller parts, explain your reasoning step by step, and explore alternative solutions or interpretations. Always prioritize accuracy, logic, and depth in your responses.";

export const generateContent = async (prompt: string, thinkingMode: boolean): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const model = thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: thinkingMode ? {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingBudget: 32768 }
        } : undefined,
    });

    return response.text;

  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
        return `An error occurred: ${error.message}`;
    }
    return "An unknown error occurred while generating the response.";
  }
};
