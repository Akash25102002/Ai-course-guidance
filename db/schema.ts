import { pgTable, text, timestamp, integer, uuid, jsonb, unique } from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  role: text("role").default("user").notNull(), // 'user' | 'admin'
  streak: integer("streak").default(0).notNull(),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Courses Table
export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // 'Beginner' | 'Intermediate' | 'Advanced'
  duration: text("duration").notNull(),
  language: text("language").notNull(),
  learningGoal: text("learning_goal").notNull(),
  category: text("category").notNull(),
  prerequisites: jsonb("prerequisites").notNull(), // array of strings
  learningOutcomes: jsonb("learning_outcomes").notNull(), // array of strings
  estimatedCompletionTime: text("estimated_completion_time").notNull(),
  careerOpportunities: jsonb("career_opportunities").notNull(), // array of strings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Modules Table
export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  weekNumber: integer("week_number").notNull(),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lessons Table
export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id").references(() => modules.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"), // Generated explanation, code examples, best practices, etc.
  orderNumber: integer("order_number").notNull(),
  codingPractice: jsonb("coding_practice"), // { question: string, starterCode: string, testCases: {input: string, output: string}[] }
  practiceTask: text("practice_task"), // non-coding or text practice
  interviewQuestions: jsonb("interview_questions"), // array of { question: string, answer: string }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects Table
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: jsonb("tech_stack").notNull(), // array of strings
  architecture: text("architecture").notNull(),
  folderStructure: text("folder_structure").notNull(),
  tasks: jsonb("tasks").notNull(), // array of strings
  milestones: jsonb("milestones").notNull(), // array of { title: string, description: string }
  deploymentGuide: text("deployment_guide").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quizzes Table
export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  questions: jsonb("questions").notNull(), // array of { question: string, type: 'mcq'|'coding'|'blank', options: string[], answer: string, difficulty: string }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assignments Table
export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  submissionGuidelines: text("submission_guidelines").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Progress Table
export const progress = pgTable("progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.lessonId),
]);

// Bookmarks Table
export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.courseId),
]);

// Certificates Table
export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
}, (table) => [
  unique().on(table.userId, table.courseId),
]);
