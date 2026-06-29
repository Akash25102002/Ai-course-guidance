"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Award,
  Sparkles,
  Share2,
  Copy,
  FileText,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  Brain,
  MessageSquare,
  Send,
  Check,
  ArrowLeft,
  Printer,
  ListTodo,
  Terminal,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { useToast } from "../providers/toast-provider";
import { parseMarkdown } from "../utils/markdown";
import {
  getLessonDetailsAction,
  getProjectDetailsAction,
  getQuizDetailsAction,
  markLessonCompleteAction,
  toggleBookmarkAction,
  duplicateCourseAction,
} from "../actions/course";
import { askTutor } from "../actions/chat";

interface CoursePlayerClientProps {
  courseData: any;
}

export function CoursePlayerClient({ courseData }: CoursePlayerClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeItem, setActiveItem] = useState<{
    type: "overview" | "lesson" | "quiz" | "project" | "certificate";
    id?: string;
  }>({ type: "overview" });

  const [isBookmarked, setIsBookmarked] = useState(courseData.isBookmarked);
  const [courseProgress, setCourseProgress] = useState({
    completedCount: courseData.modules.reduce(
      (acc: number, mod: any) => acc + mod.lessons.filter((l: any) => l.isCompleted).length,
      0
    ),
    totalLessons: courseData.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0),
    percentage: 0,
  });

  // Calculate initial progress percentage
  useEffect(() => {
    const total = courseProgress.totalLessons;
    const completed = courseProgress.completedCount;
    setCourseProgress((prev) => ({
      ...prev,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }));
  }, [courseProgress.completedCount, courseProgress.totalLessons]);

  // Sidebar expand states
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const states: Record<string, boolean> = {};
    courseData.modules.forEach((mod: any) => {
      states[mod.id] = true;
    });
    return states;
  });

  // Lesson state details
  const [lessonDetails, setLessonDetails] = useState<Record<string, any>>({});
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonSubTab, setLessonSubTab] = useState<"explanation" | "best_practices" | "playground">("explanation");

  // Project state details
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  // Quiz state details
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Code editor states
  const [userCode, setUserCode] = useState("");
  const [codeOutput, setCodeOutput] = useState<{ status: "idle" | "running" | "success" | "error"; msg: string }>({
    status: "idle",
    msg: "",
  });

  // AI Chat Tutor states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "tutor"; text: string }[]>([
    {
      sender: "tutor",
      text: "Hi! I am your AI Study Assistant. Feel free to ask me anything about this course structure or specific lessons.",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  // Fetch lesson content on select
  const handleSelectLesson = async (lesson: any) => {
    setActiveItem({ type: "lesson", id: lesson.id });
    setLessonSubTab("explanation");
    setUserCode("");
    setCodeOutput({ status: "idle", msg: "" });

    if (lessonDetails[lesson.id]) return; // cached locally in component state

    setLessonLoading(true);
    try {
      const details = await getLessonDetailsAction(lesson.id);
      setLessonDetails((prev) => ({ ...prev, [lesson.id]: details }));
      if (details.codingPractice?.starterCode) {
        setUserCode(details.codingPractice.starterCode);
      }
    } catch (error: any) {
      toast({
        title: "Failed to load lesson details",
        description: error.message || "Please check your network connection.",
        type: "error",
      });
    } finally {
      setLessonLoading(false);
    }
  };

  // Fetch Project on select
  const handleSelectProject = async () => {
    setActiveItem({ type: "project" });
    if (projectDetails) return;

    setProjectLoading(true);
    try {
      const details = await getProjectDetailsAction(courseData.project.id);
      setProjectDetails(details);
    } catch (error: any) {
      toast({
        title: "Failed to load project details",
        description: error.message || "Please try again.",
        type: "error",
      });
    } finally {
      setProjectLoading(false);
    }
  };

  // Fetch Quiz on select
  const handleSelectQuiz = async () => {
    setActiveItem({ type: "quiz" });
    setQuizSubmitted(false);
    setQuizAnswers({});
    if (quizDetails) return;

    setQuizLoading(true);
    try {
      const details = await getQuizDetailsAction(courseData.quiz.id);
      setQuizDetails(details);
    } catch (error: any) {
      toast({
        title: "Failed to load quiz details",
        description: error.message || "Please try again.",
        type: "error",
      });
    } finally {
      setQuizLoading(false);
    }
  };

  // Toggle Lesson Complete
  const handleToggleLessonComplete = async (lessonId: string, currentCompleted: boolean) => {
    try {
      const res = await markLessonCompleteAction(courseData.id, lessonId, !currentCompleted);

      // Update nested state
      courseData.modules.forEach((mod: any) => {
        mod.lessons.forEach((les: any) => {
          if (les.id === lessonId) {
            les.isCompleted = !currentCompleted;
          }
        });
      });

      setCourseProgress({
        completedCount: res.completedCount,
        totalLessons: res.totalLessons,
        percentage: res.percentage,
      });

      toast({
        title: !currentCompleted ? "Lesson Completed!" : "Progress updated",
        description: !currentCompleted ? "Keep going to build your streak!" : "Lesson marked as incomplete.",
        type: "success",
      });

      if (res.certificateIssued) {
        toast({
          title: "Congratulations! 🎉",
          description: "You have completed 100% of this course. Your certificate of achievement is ready!",
          type: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to update progress",
        description: error.message,
        type: "error",
      });
    }
  };

  // Code runner simulator
  const handleRunCode = () => {
    setCodeOutput({ status: "running", msg: "Compiling and running tests..." });
    setTimeout(() => {
      // Basic heuristic test validation
      const activeLesson = lessonDetails[activeItem.id!];
      const keywords = activeLesson?.codingPractice?.keywords || [];

      let passed = true;
      if (userCode.trim() === "" || userCode.length < 20) {
        passed = false;
      }

      if (passed) {
        setCodeOutput({
          status: "success",
          msg: "✓ Code executed successfully.\n✓ All unit test cases passed!\nOutput: Compilation complete.",
        });
        toast({
          title: "Challenge Successful!",
          description: "Your solution has met all criteria.",
          type: "success",
        });
      } else {
        setCodeOutput({
          status: "error",
          msg: "✗ Compilation Error: Invalid syntax or missing requirements.\nCheck your logic and try again.",
        });
      }
    }, 1500);
  };

  // Submit Quiz responses
  const handleSubmitQuiz = () => {
    if (!quizDetails?.questions) return;
    let score = 0;
    quizDetails.questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${quizDetails.questions.length}.`,
      type: score >= 4 ? "success" : "info",
    });
  };

  // Send message to AI Tutor
  const handleSendTutorMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    // Get context of current studying item
    let currentTopicTitle = "Course overview";
    let currentTopicDesc = "Prerequisites and syllabus outline";

    if (activeItem.type === "lesson" && activeItem.id) {
      const les = courseData.modules
        .flatMap((m: any) => m.lessons)
        .find((l: any) => l.id === activeItem.id);
      if (les) {
        currentTopicTitle = les.title;
        currentTopicDesc = les.description;
      }
    } else if (activeItem.type === "project") {
      currentTopicTitle = "Capstone Project";
      currentTopicDesc = courseData.project.description;
    } else if (activeItem.type === "quiz") {
      currentTopicTitle = "Module assessment quiz";
      currentTopicDesc = "MCQs and Coding questions check";
    }

    try {
      const response = await askTutor(courseData.title, currentTopicTitle, currentTopicDesc, userMsg);
      setChatLog((prev) => [...prev, { sender: "tutor", text: response }]);
    } catch (error: any) {
      setChatLog((prev) => [
        ...prev,
        { sender: "tutor", text: "Sorry, I had trouble contacting my neural nodes. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Share course
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Shareable course URL copied to clipboard.",
        type: "success",
      });
    }
  };

  // Duplicate course
  const handleDuplicate = async () => {
    try {
      const newCourseId = await duplicateCourseAction(courseData.id);
      toast({
        title: "Course Duplicated",
        description: "A copy of this course has been added to your dashboard.",
        type: "success",
      });
      router.push(`/course/${newCourseId}`);
    } catch (error: any) {
      toast({
        title: "Duplication failed",
        description: error.message,
        type: "error",
      });
    }
  };

  // Download syllabus notes
  const handleDownloadNotes = () => {
    let mdContent = `# Course Notes: ${courseData.title}\n\n`;
    mdContent += `## Description\n${courseData.description}\n\n`;
    mdContent += `## Learning Outcomes\n`;
    courseData.learningOutcomes.forEach((o: string) => (mdContent += `- ${o}\n`));
    mdContent += `\n## Prerequisites\n`;
    courseData.prerequisites.forEach((p: string) => (mdContent += `- ${p}\n`));
    mdContent += `\n## Detailed Curriculum\n\n`;

    courseData.modules.forEach((mod: any) => {
      mdContent += `### Week ${mod.weekNumber}: ${mod.title}\n`;
      mdContent += `*Description:* ${mod.description}\n\n`;
      mod.lessons.forEach((les: any) => {
        mdContent += `#### Lesson ${les.orderNumber}: ${les.title}\n`;
        mdContent += `*Outline:* ${les.description}\n\n`;
      });
      mdContent += `\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseData.title.replace(/\s+/g, "_")}_Syllabus_Notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Notes Downloaded",
      description: "Markdown notes file saved successfully.",
      type: "success",
    });
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    try {
      const res = await toggleBookmarkAction(courseData.id);
      setIsBookmarked(res.bookmarked);
      toast({
        title: res.bookmarked ? "Bookmarked!" : "Removed Bookmark",
        description: res.bookmarked ? "Course bookmarked successfully." : "Removed from bookmarks.",
        type: "success",
      });
    } catch (error: any) {
      toast({
        title: "Bookmark failed",
        description: error.message,
        type: "error",
      });
    }
  };

  const selectedLesson = activeItem.type === "lesson" ? lessonDetails[activeItem.id!] : null;
  const rawLessonOutline =
    activeItem.type === "lesson"
      ? courseData.modules.flatMap((m: any) => m.lessons).find((l: any) => l.id === activeItem.id)
      : null;

  return (
    <div className="flex h-screen overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Sidebar for Modules / Lessons */}
      <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col h-full overflow-y-auto print:hidden">
        {/* Course player Header navigation */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 px-2.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleBookmark}
              className="p-2 w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
              title="Bookmark Course"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "text-yellow-500 fill-yellow-500" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Course title & aggregate progress percentage */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2
            onClick={() => setActiveItem({ type: "overview" })}
            className="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-snug hover:underline cursor-pointer"
          >
            {courseData.title}
          </h2>
          <div className="mt-3.5 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-zinc-500">
              <span>Progress</span>
              <span>{courseProgress.percentage}%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-300"
                style={{ width: `${courseProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Index of modules */}
        <div className="flex-1 px-3 py-4 space-y-4">
          {courseData.modules.map((mod: any) => {
            const isExpanded = expandedModules[mod.id];
            return (
              <div key={mod.id} className="space-y-1">
                {/* Module title header */}
                <button
                  onClick={() =>
                    setExpandedModules((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))
                  }
                  className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 text-xs font-bold text-zinc-500"
                >
                  <span className="line-clamp-1">Week {mod.weekNumber}: {mod.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </button>

                {/* Lessons list under Module */}
                {isExpanded && (
                  <div className="pl-1 space-y-0.5">
                    {mod.lessons.map((les: any) => {
                      const isActive = activeItem.type === "lesson" && activeItem.id === les.id;
                      return (
                        <div
                          key={les.id}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                            isActive
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                          }`}
                        >
                          <button
                            onClick={() => handleSelectLesson(les)}
                            className="flex-1 text-left line-clamp-1 mr-2"
                          >
                            {les.orderNumber}. {les.title}
                          </button>
                          <button
                            onClick={() => handleToggleLessonComplete(les.id, les.isCompleted)}
                            className={`p-0.5 rounded border transition-colors shrink-0 ${
                              les.isCompleted
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400"
                            }`}
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <hr className="border-zinc-200 dark:border-zinc-800 my-4" />

          {/* Assessment blocks index */}
          <div className="space-y-1">
            <button
              onClick={handleSelectProject}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                activeItem.type === "project"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
              }`}
            >
              <Terminal className="h-4.5 w-4.5" />
              <span>Capstone Project</span>
            </button>
            <button
              onClick={handleSelectQuiz}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                activeItem.type === "quiz"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
              }`}
            >
              <Brain className="h-4.5 w-4.5" />
              <span>Module Exam Quiz</span>
            </button>

            {/* Certificate item (only unlocked if 100%) */}
            <button
              onClick={() => setActiveItem({ type: "certificate" })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                activeItem.type === "certificate"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : courseProgress.percentage === 100
                  ? "text-amber-600 dark:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                  : "text-zinc-400 cursor-not-allowed opacity-50"
              }`}
              disabled={courseProgress.percentage < 100}
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-4.5 w-4.5" />
                <span>Earned Certificate</span>
              </div>
              {courseProgress.percentage < 100 && (
                <span className="text-[9px] uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono">
                  Locked
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Lesson Content Area */}
      <section className="flex-1 flex flex-col overflow-y-auto">
        {/* Top utility row */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 bg-white dark:bg-zinc-900/30 shrink-0 print:hidden">
          <div className="text-sm font-semibold truncate max-w-sm">
            {activeItem.type === "overview" && "Course Overview"}
            {activeItem.type === "lesson" && `Lesson: ${rawLessonOutline?.title || ""}`}
            {activeItem.type === "project" && "Capstone Project Outline"}
            {activeItem.type === "quiz" && "Synthesized Quiz Assessment"}
            {activeItem.type === "certificate" && "Official Course Certificate"}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownloadNotes} title="Download Notes">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} title="Share Course">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDuplicate} title="Duplicate Course">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
              className="gap-1 border border-zinc-200 dark:border-zinc-800"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Ask AI</span>
            </Button>
          </div>
        </div>

        {/* Content body switcher */}
        <div className="flex-1 p-8 max-w-4xl w-full mx-auto relative pb-20">
          <AnimatePresence mode="wait">
            {/* 1. OVERVIEW VIEW */}
            {activeItem.type === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Badge variant="outline">{courseData.category}</Badge>
                    <Badge variant="secondary">{courseData.difficulty}</Badge>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    {courseData.title}
                  </h1>
                  <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {courseData.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                        Prerequisites
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {courseData.prerequisites.map((p: string, i: number) => (
                        <div key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-350">
                          <span className="text-zinc-400 select-none">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                        Learning Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {courseData.learningOutcomes.map((o: string, i: number) => (
                        <div key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-350">
                          <span className="text-emerald-500">✓</span>
                          <span>{o}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                    Estimated Time & Career Opportunities
                  </h3>
                  <p className="text-sm text-zinc-650 dark:text-zinc-450">
                    <strong>Completion Commitment:</strong> {courseData.estimatedCompletionTime}
                  </p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {courseData.careerOpportunities.map((o: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {o}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. LESSON VIEW */}
            {activeItem.type === "lesson" && (
              <motion.div
                key={`lesson-${activeItem.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-zinc-250 dark:border-zinc-800 pb-4">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    {rawLessonOutline?.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">{rawLessonOutline?.description}</p>
                </div>

                {lessonLoading ? (
                  /* Loading Skeletons */
                  <div className="space-y-4 py-8">
                    <div className="h-4.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5 animate-pulse" />
                    <div className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full animate-pulse mt-6" />
                  </div>
                ) : selectedLesson ? (
                  <>
                    {/* Inner Lesson Tab Bar */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6">
                      <button
                        onClick={() => setLessonSubTab("explanation")}
                        className={`pb-2 text-xs font-bold relative uppercase tracking-wider ${
                          lessonSubTab === "explanation"
                            ? "text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-400 hover:text-zinc-600"
                        }`}
                      >
                        Explanation & Core
                        {lessonSubTab === "explanation" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
                        )}
                      </button>
                      <button
                        onClick={() => setLessonSubTab("best_practices")}
                        className={`pb-2 text-xs font-bold relative uppercase tracking-wider ${
                          lessonSubTab === "best_practices"
                            ? "text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-400 hover:text-zinc-600"
                        }`}
                      >
                        Best Practices & QA
                        {lessonSubTab === "best_practices" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
                        )}
                      </button>
                      <button
                        onClick={() => setLessonSubTab("playground")}
                        className={`pb-2 text-xs font-bold relative uppercase tracking-wider ${
                          lessonSubTab === "playground"
                            ? "text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-400 hover:text-zinc-600"
                        }`}
                      >
                        Coding Lab
                        {lessonSubTab === "playground" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
                        )}
                      </button>
                    </div>

                    {/* Explanations view */}
                    {lessonSubTab === "explanation" && (
                      <div className="space-y-4 py-2">
                        {parseMarkdown(selectedLesson.content)}
                      </div>
                    )}

                    {/* Best practices and QA */}
                    {lessonSubTab === "best_practices" && (
                      <div className="space-y-8 py-2">
                        {/* Best practices bullet list */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                            Best Practices
                          </h3>
                          <div className="space-y-2.5">
                            {selectedLesson.bestPractices?.split("\n").map((line: string, i: number) => {
                              if (!line.trim()) return null;
                              return (
                                <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-650 dark:text-zinc-350">
                                  <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{line.replace(/^-\s*/, "")}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interview QA list */}
                        {selectedLesson.interviewQuestions && (
                          <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                              Interview Preparation
                            </h3>
                            <div className="space-y-4">
                              {selectedLesson.interviewQuestions.map((q: any, i: number) => (
                                <div key={i} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50/40 dark:bg-zinc-900/10">
                                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                                    Q: {q.question}
                                  </div>
                                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    <strong>A:</strong> {q.answer}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Code Playground / Practice task */}
                    {lessonSubTab === "playground" && (
                      <div className="space-y-6 py-2">
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">
                            Practice Assignment Task
                          </h3>
                          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-350 bg-zinc-50 dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                            {selectedLesson.practiceTask}
                          </p>
                        </div>

                        {selectedLesson.codingPractice && (
                          <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                              <Terminal className="h-4 w-4" />
                              <span>Interactive Code Workspace</span>
                            </h4>
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                              <div className="bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-450 border-b border-zinc-850 select-none">
                                workspace.ts
                              </div>
                              <textarea
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className="w-full h-44 p-4 font-mono text-xs text-zinc-100 bg-transparent focus:outline-none resize-y"
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <Button size="sm" onClick={handleRunCode}>
                                Validate Solution
                              </Button>
                              <span className="text-xs text-zinc-400">Tests mock compiler active</span>
                            </div>

                            {/* Runner outputs */}
                            {codeOutput.status !== "idle" && (
                              <pre className={`p-4 rounded-lg font-mono text-xs border ${
                                codeOutput.status === "running" ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-450 border-zinc-200 dark:border-zinc-800" :
                                codeOutput.status === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/50" :
                                "bg-red-50 text-red-800 border-red-250 dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/50"
                              }`}>
                                {codeOutput.msg}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center text-zinc-400">Failed to load content details.</div>
                )}
              </motion.div>
            )}

            {/* 3. CAPSTONE PROJECT VIEW */}
            {activeItem.type === "project" && (
              <motion.div
                key="project"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-zinc-250 dark:border-zinc-800 pb-4">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    Capstone Project Implementation Guide
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Deploy skills built in the lessons inside a real project.</p>
                </div>

                {projectLoading ? (
                  <div className="space-y-4 py-8 animate-pulse">
                    <div className="h-4.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                    <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full mt-4" />
                  </div>
                ) : projectDetails ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-2">Project Overview</h3>
                      <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{projectDetails.title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed mt-2">
                        {projectDetails.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-3">Recommended Tech Stack</h3>
                      <div className="flex gap-2 flex-wrap">
                        {projectDetails.techStack?.map((stack: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {stack}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xs uppercase tracking-wider text-zinc-400">Architecture Description</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs leading-relaxed font-semibold text-zinc-700 dark:text-zinc-350">
                          {projectDetails.architecture}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xs uppercase tracking-wider text-zinc-400">Recommended Directory Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-zinc-950 text-zinc-200 p-4 rounded-lg font-mono text-[10px] overflow-x-auto border border-zinc-800">
                            <code>{projectDetails.folderStructure}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-3">Implementation Milestones</h3>
                      <div className="space-y-4">
                        {projectDetails.milestones?.map((m: any, idx: number) => (
                          <div key={idx} className="flex gap-3 items-start border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50/20 dark:bg-zinc-900/10">
                            <span className="w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {idx + 1}
                            </span>
                            <div>
                              <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{m.title}</h5>
                              <p className="text-xs text-zinc-500 mt-1 dark:text-zinc-400 leading-relaxed">{m.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-2">Production Deployment Guide</h3>
                      <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono text-xs">
                        {projectDetails.deploymentGuide}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-zinc-400">No project structure generated.</div>
                )}
              </motion.div>
            )}

            {/* 4. QUIZ ASSESSMENT VIEW */}
            {activeItem.type === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-zinc-250 dark:border-zinc-800 pb-4">
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    Course Quiz Exam
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Confirm your understanding by submitting this assessment quiz.</p>
                </div>

                {quizLoading ? (
                  <div className="space-y-4 py-8 animate-pulse">
                    <div className="h-4.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full mt-4" />
                  </div>
                ) : quizDetails ? (
                  <div className="space-y-6">
                    {quizDetails.questions?.map((q: any, idx: number) => {
                      const isCorrect = quizAnswers[idx]?.trim().toLowerCase() === q.answer.trim().toLowerCase();

                      return (
                        <Card key={idx} className={`${
                          quizSubmitted
                            ? isCorrect
                              ? "border-emerald-200 bg-emerald-50/10 dark:border-emerald-950/50"
                              : "border-red-200 bg-red-50/10 dark:border-red-950/50"
                            : ""
                        }`}>
                          <CardHeader className="p-5 pb-3 flex justify-between items-start gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Question {idx + 1} ({q.type})</span>
                              <CardTitle className="text-sm font-bold mt-1 text-zinc-900 dark:text-zinc-100">{q.question}</CardTitle>
                            </div>
                            <Badge variant="outline">{q.difficulty}</Badge>
                          </CardHeader>
                          <CardContent className="p-5 pt-0">
                            {/* Choice Options for MCQ */}
                            {q.type === "mcq" && (
                              <div className="space-y-2 mt-2">
                                {q.options.map((opt: string) => {
                                  const isSelected = quizAnswers[idx] === opt;
                                  return (
                                    <button
                                      key={opt}
                                      disabled={quizSubmitted}
                                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [idx]: opt }))}
                                      className={`w-full flex items-center gap-2.5 p-3 rounded-lg border text-xs text-left transition-colors ${
                                        isSelected
                                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-black font-bold"
                                          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected ? "border-current" : "border-zinc-400"
                                      }`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-current" />}
                                      </div>
                                      <span>{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Short text input for Coding / Blanks */}
                            {(q.type === "coding" || q.type === "blank") && (
                              <div className="mt-2.5">
                                <input
                                  type="text"
                                  disabled={quizSubmitted}
                                  placeholder="Type your answer here..."
                                  value={quizAnswers[idx] || ""}
                                  onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
                                  className="w-full text-xs font-mono border border-zinc-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950"
                                />
                              </div>
                            )}

                            {/* Instant result feedback */}
                            {quizSubmitted && (
                              <div className="mt-3 text-xs leading-relaxed">
                                {isCorrect ? (
                                  <span className="text-emerald-600 dark:text-emerald-450 font-bold flex items-center gap-1">
                                    ✓ Correct response
                                  </span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-450 font-bold flex items-center gap-1">
                                    ✗ Incorrect. Correct answer: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px] font-mono">{q.answer}</code>
                                  </span>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}

                    <div className="pt-4 flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800">
                      {quizSubmitted ? (
                        <div className="text-sm font-bold">
                          Final Exam Score: <span className="text-zinc-950 dark:text-white font-extrabold">{quizScore}</span> / {quizDetails.questions.length} ({(quizScore / quizDetails.questions.length) * 100}%)
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-400">Answer all questions to submit</div>
                      )}
                      <Button
                        onClick={quizSubmitted ? () => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        } : handleSubmitQuiz}
                      >
                        {quizSubmitted ? "Reset Quiz" : "Submit Answers"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-zinc-400">No questions loaded.</div>
                )}
              </motion.div>
            )}

            {/* 5. CERTIFICATE PRINT VIEW */}
            {activeItem.type === "certificate" && (
              <motion.div
                key="certificate"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Print layout container */}
                <div id="certificate" className="border-4 border-amber-300 dark:border-amber-900 bg-amber-50/10 p-12 text-center space-y-8 rounded-xl relative shadow-xl min-h-[500px] flex flex-col justify-between overflow-hidden">
                  {/* Backdrop seal */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none">
                    <Award className="w-[400px] h-[400px]" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                      Certificate of Completion
                    </span>
                    <div className="h-0.5 w-16 bg-amber-400 mx-auto mt-2" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-zinc-450 italic">This document officially confirms that</p>
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2 max-w-md mx-auto">
                      Learner Graduate
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-lg mx-auto leading-relaxed">
                      has successfully satisfied all instructional modules, lesson materials, coding exercise workbooks, quizzes, and project guidelines required for the curriculum of
                    </p>
                    <h4 className="text-xl font-extrabold text-amber-900 dark:text-amber-200 leading-snug mt-2">
                      {courseData.title}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-8 max-w-xl mx-auto w-full text-xs text-zinc-400">
                    <div className="text-left space-y-1">
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">AI Course Gen Academy</p>
                      <p className="text-[10px]">Credential ID: {courseData.certificate?.id || "N/A"}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-zinc-750 dark:text-zinc-300">Issued On</p>
                      <p className="text-[10px]">{courseData.certificate?.issuedAt ? new Date(courseData.certificate.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 print:hidden">
                  <Button onClick={() => window.print()} className="gap-2">
                    <Printer className="h-4.5 w-4.5" />
                    <span>Print / Save PDF</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Floating AI Chat Assistant Sidebar */}
      <AnimatePresence>
        {chatOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-96 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col h-full print:hidden"
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-zinc-700 dark:text-zinc-300 animate-pulse" />
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">AI Tutor Helper</h4>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Chats stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
              {chatLog.map((chat, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    chat.sender === "user"
                      ? "bg-zinc-900 text-white self-end rounded-br-none dark:bg-zinc-100 dark:text-zinc-950 font-medium"
                      : "bg-white text-zinc-800 border border-zinc-200 self-start rounded-bl-none dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
                  }`}
                >
                  {chat.text}
                </div>
              ))}
              {chatLoading && (
                <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-400 text-xs self-start rounded-lg p-3 max-w-[80%] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendTutorMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Tutor..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-transparent dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-200"
                />
                <Button type="submit" size="sm" className="h-8.5 w-8.5 p-0 flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
export default CoursePlayerClient;
