"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { useToast } from "../providers/toast-provider";
import { CATEGORIES, DIFFICULTIES, DURATIONS, LANGUAGES } from "../constants";
import { generateCourse } from "../actions/course";

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1, "Please select a duration"),
  learningGoal: z.string().min(5, "Learning goal must be at least 5 characters"),
  language: z.string().min(1, "Please select a language"),
  category: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCourseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "Intermediate",
      duration: "8 Weeks",
      learningGoal: "",
      language: "English",
      category: "Software Engineering",
    },
  });

  const loadingMessages = [
    "Analyzing course topic & specifications...",
    "Drafting weekly modules and curriculum outline...",
    "Compiling detailed lessons structures...",
    "Pre-creating quizzes, projects, and assignments skeletons...",
    "Storing course in PostgreSQL DB...",
  ];

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setLoadingStep(0);

    // Dynamic messaging interval to keep user engaged
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 4500);

    try {
      const courseId = await generateCourse(values);
      clearInterval(interval);
      toast({
        title: "Course generated successfully!",
        description: "Your structured curriculum is ready.",
        type: "success",
      });
      setIsOpen(false);
      reset();
      router.push(`/course/${courseId}`);
    } catch (error: any) {
      clearInterval(interval);
      console.error(error);
      toast({
        title: "Generation failed",
        description: error.message || "An error occurred while compiling your course.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Sparkles className="h-4.5 w-4.5" />
        <span>Generate Course</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 z-10 overflow-hidden"
            >
              {isGenerating ? (
                /* Generating State */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative flex items-center justify-center">
                    {/* Ring animation */}
                    <div className="w-16 h-16 rounded-full border-4 border-zinc-100 border-t-zinc-900 animate-spin dark:border-zinc-800 dark:border-t-zinc-100" />
                    <Sparkles className="absolute h-6 w-6 text-yellow-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Generating Your Course</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs animate-pulse">
                      {loadingMessages[loadingStep]}
                    </p>
                  </div>
                </div>
              ) : (
                /* Form State */
                <>
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                      <span>Synthesize a New Course</span>
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Course Topic
                      </label>
                      <Input
                        placeholder="e.g. Next.js 15 App Router or Advanced Machine Learning"
                        {...register("topic")}
                        className="mt-1.5"
                      />
                      {errors.topic && (
                        <span className="text-xs text-red-500 mt-1 block">
                          {errors.topic.message}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Category"
                        options={CATEGORIES}
                        {...register("category")}
                      />
                      <Select
                        label="Difficulty"
                        options={DIFFICULTIES}
                        {...register("difficulty")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Duration"
                        options={DURATIONS}
                        {...register("duration")}
                      />
                      <Select
                        label="Language"
                        options={LANGUAGES}
                        {...register("language")}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Primary Learning Goal
                      </label>
                      <Input
                        placeholder="e.g. Build standard SaaS systems or pass tech interviews"
                        {...register("learningGoal")}
                        className="mt-1.5"
                      />
                      {errors.learningGoal && (
                        <span className="text-xs text-red-500 mt-1 block">
                          {errors.learningGoal.message}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Generate Course</Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
export default CreateCourseModal;
