import { GoogleGenAI } from "@google/genai";
import { CourseGeneratorInput, CourseOutline, LessonDetails, ProjectDetails, QuizDetails } from "../types";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Reusable system instructions for high quality, strict JSON generation
const SYSTEM_INSTRUCTION = `You are a Senior Full Stack Engineer, Architect, and expert Educator. 
Generate comprehensive, high-quality course material. 
Avoid placeholders, comments saying "add code here", or summaries. 
Ensure code is production-ready, typed in TypeScript or standard language, and follows modern best practices.
Output must be STRICT, valid JSON. Never return markdown formatting inside the JSON except where standard text fields allow markdown formatting.`;

/**
 * Generate course outline (Title, Description, outcomes, and modules with lesson titles)
 */
export async function generateCourseOutline(input: CourseGeneratorInput): Promise<CourseOutline> {
  const prompt = `Generate a comprehensive course curriculum outline for a course about: "${input.topic}".
Category: ${input.category}
Difficulty Level: ${input.difficulty}
Total Duration: ${input.duration}
Learning Goal: ${input.learningGoal}
Language: ${input.language}

Return a JSON object conforming exactly to this structure:
{
  "title": "Course Title",
  "description": "Short summary of what this course covers",
  "learningOutcomes": ["List of 4-6 specific, measurable learning outcomes"],
  "prerequisites": ["List of 2-4 prerequisite knowledge or setups needed"],
  "estimatedCompletionTime": "Estimated total hours (e.g. 40 hours)",
  "careerOpportunities": ["List of 3-4 potential jobs or opportunities"],
  "modules": [
    {
      "weekNumber": 1,
      "title": "Week 1 Module Title",
      "description": "Short description of this week's focus",
      "duration": "e.g., 5 hours",
      "lessons": [
        {
          "orderNumber": 1,
          "title": "Lesson 1 Title",
          "description": "Short description of what the lesson covers"
        }
      ]
    }
  ]
}

Make sure modules are spread logically across the duration (${input.duration}). Each week must have 2-4 lessons.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response received from Gemini.");
  return JSON.parse(text) as CourseOutline;
}

/**
 * Generate detailed content for a single lesson
 */
export async function generateLessonDetails(
  courseTitle: string,
  moduleTitle: string,
  lessonTitle: string,
  lessonDescription: string
): Promise<LessonDetails> {
  const prompt = `Generate detailed lesson content for:
Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson Title: "${lessonTitle}"
Description: ${lessonDescription}

Return a JSON object conforming exactly to this structure:
{
  "explanation": "Detailed explanation of the concept (approx. 500-1000 words in markdown format, with clear sections, headings, bold text, etc.)",
  "examples": "Interactive or clear examples demonstrating the concept (e.g. code examples or diagrams in markdown format)",
  "code": "A fully functional, complete code snippet demonstrating the concept (optional, only if relevant, else null or empty)",
  "bestPractices": "A bulleted list of 4-6 best practices, clean code recommendations, or performance tips",
  "interviewQuestions": [
    {
      "question": "A typical interview question about this lesson topic",
      "answer": "Detailed professional answer to the interview question"
    },
    {
      "question": "Another interview question",
      "answer": "Detailed professional answer"
    }
  ],
  "practiceTask": "A comprehensive practice task, exercise, or lab description for the student to build/write themselves to demonstrate understanding (approx 100-200 words)",
  "summary": "A concise paragraph summarizing the key takeaways of the lesson"
}

Do not use placeholders. Provide fully written explanations and code.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response received from Gemini.");
  return JSON.parse(text) as LessonDetails;
}

/**
 * Generate real-world project details for a course
 */
export async function generateProjectDetails(
  courseTitle: string,
  difficulty: string,
  learningGoal: string
): Promise<ProjectDetails> {
  const prompt = `Generate a detailed, real-world capstone project for the course: "${courseTitle}".
Difficulty Level: ${difficulty}
Learning Goal: ${learningGoal}

Return a JSON object conforming exactly to this structure:
{
  "title": "Project Title",
  "description": "Comprehensive explanation of what the user will build, its purpose, and business value",
  "techStack": ["List of modern libraries, frameworks, databases, and deployment options to use"],
  "architecture": "Describe the architectural pattern (e.g., Client-Server, MVC, Serverless, Microservices, Event-Driven) and components interaction",
  "folderStructure": "Text diagram showing the recommended folder structure (e.g., standard next.js or node structure)",
  "tasks": ["List of 5-8 concrete coding tasks/features to implement"],
  "milestones": [
    {
      "title": "Milestone 1 Title",
      "description": "Details of what should be completed and validated in this milestone"
    },
    {
      "title": "Milestone 2 Title",
      "description": "Details of milestone 2"
    }
  ],
  "deploymentGuide": "Step-by-step instructions on how to deploy this application to production (e.g., Vercel, Netlify, Docker, Fly.io, etc.)"
}

Provide complete instructions and high-quality specifications.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response received from Gemini.");
  return JSON.parse(text) as ProjectDetails;
}

/**
 * Generate a comprehensive quiz for a course
 */
export async function generateQuizDetails(
  courseTitle: string,
  difficulty: string
): Promise<QuizDetails> {
  const prompt = `Generate a comprehensive exam quiz with 5 questions to assess understanding of the course: "${courseTitle}".
Difficulty: ${difficulty}

Return a JSON object conforming exactly to this structure:
{
  "questions": [
    {
      "question": "The question prompt text",
      "type": "mcq",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A", 
      "difficulty": "Easy"
    },
    {
      "question": "A coding-based question (e.g. 'What is the output of...' or 'Complete the function')",
      "type": "coding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "difficulty": "Medium"
    },
    {
      "question": "A fill in the blank question. Provide the question with an empty blank indicated by _____",
      "type": "blank",
      "options": [],
      "answer": "exact_word_to_fill_in",
      "difficulty": "Easy"
    }
  ]
}

Generate exactly 5 high-quality, testing questions containing a mixture of MCQ, coding, and blank types.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response received from Gemini.");
  return JSON.parse(text) as QuizDetails;
}
