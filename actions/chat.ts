"use server";

import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askTutor(
  courseTitle: string,
  lessonTitle: string,
  lessonDescription: string,
  userMessage: string
) {
  const systemInstruction = `You are an expert AI Tutor helping a student learn "${courseTitle}".
Currently, the student is studying the lesson: "${lessonTitle}".
Description of current lesson: "${lessonDescription}".
Your goal is to answer their questions about this lesson topic. 
Be concise, clear, and provide practical code snippets where helpful.
Focus solely on the academic topic and code design patterns.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    config: {
      systemInstruction,
      temperature: 0.4,
    },
  });

  return response.text || "I apologize, I could not generate a response. Please try again.";
}
