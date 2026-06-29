export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CourseGeneratorInput {
  topic: string;
  difficulty: Difficulty;
  duration: string; // e.g., '4 Weeks', '8 Weeks'
  learningGoal: string;
  language: string;
  category: string;
}

export interface LessonOutline {
  orderNumber: number;
  title: string;
  description: string;
}

export interface ModuleOutline {
  weekNumber: number;
  title: string;
  description: string;
  duration: string;
  lessons: LessonOutline[];
}

export interface CourseOutline {
  title: string;
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  estimatedCompletionTime: string;
  careerOpportunities: string[];
  modules: ModuleOutline[];
}

// Detailed Lesson Content
export interface CodingPractice {
  question: string;
  starterCode: string;
  testCases: { input: string; output: string }[];
}

export interface InterviewQuestion {
  question: string;
  answer: string;
}

export interface LessonDetails {
  explanation: string;
  examples: string; // Markdown code example block or real-life analogy
  code?: string;
  bestPractices: string;
  interviewQuestions: InterviewQuestion[];
  practiceTask: string;
  summary: string;
}

// Project Details
export interface ProjectMilestone {
  title: string;
  description: string;
}

export interface ProjectDetails {
  title: string;
  description: string;
  techStack: string[];
  architecture: string;
  folderStructure: string;
  tasks: string[];
  milestones: ProjectMilestone[];
  deploymentGuide: string;
}

// Quiz Details
export interface QuizQuestion {
  question: string;
  type: "mcq" | "coding" | "blank";
  options: string[]; // Empty for coding or blank questions
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface QuizDetails {
  questions: QuizQuestion[];
}

// Assignment Details
export interface AssignmentDetails {
  title: string;
  description: string;
  instructions: string;
  submissionGuidelines: string;
}
