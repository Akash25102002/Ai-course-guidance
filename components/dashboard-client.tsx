"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Flame, BookOpen, Award, Bookmark, Trash2, ShieldAlert, Trophy, ExternalLink, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { DashboardSidebar } from "./dashboard-sidebar";
import { CreateCourseModal } from "./create-course-modal";
import { useToast } from "../providers/toast-provider";
import { deleteCourseAction } from "../actions/course";
import { CATEGORIES, DIFFICULTIES } from "../constants";

interface DashboardClientProps {
  initialData: {
    streak: number;
    generatedCount: number;
    completedCount: number;
    bookmarksCount: number;
    certificatesCount: number;
    recentlyGenerated: any[];
    bookmarks: any[];
    certificates: any[];
  };
  role: string;
}

export function DashboardClient({ initialData, role }: DashboardClientProps) {
  const { user } = useUser();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"courses" | "bookmarks" | "certificates">("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const [coursesList, setCoursesList] = useState(initialData.recentlyGenerated);
  const [bookmarksList, setBookmarksList] = useState(initialData.bookmarks);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters My Courses
  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || c.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [coursesList, searchQuery, selectedCategory, selectedDifficulty]);

  // Filters Bookmarked Courses
  const filteredBookmarks = useMemo(() => {
    return bookmarksList.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [bookmarksList, searchQuery]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    setDeletingId(courseId);
    try {
      await deleteCourseAction(courseId);
      toast({
        title: "Course deleted",
        description: "Your course was deleted successfully.",
        type: "success",
      });
      // Remove from state
      setCoursesList((prev) => prev.filter((c) => c.id !== courseId));
      setBookmarksList((prev) => prev.filter((b) => b.courseId !== courseId));
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "An error occurred.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <DashboardSidebar isAdmin={role === "admin"} />

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header bar */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex items-center justify-between px-8 sticky top-0 z-30 backdrop-blur-md">
          <div>
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Welcome back, {user?.firstName || "Learner"}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {/* Streak count */}
            <div className="flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-1 rounded-full dark:border-zinc-800 dark:bg-zinc-900/60" title="Daily Streak">
              <Flame className="h-4.5 w-4.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {initialData.streak} Day Streak
              </span>
            </div>
            <CreateCourseModal />
          </div>
        </header>

        {/* Inner Content */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* Stats Summary Widget Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Generated Courses</p>
                  <h3 className="text-2xl font-bold">{coursesList.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                  <BookOpen className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Completed Courses</p>
                  <h3 className="text-2xl font-bold">{initialData.completedCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Bookmarked</p>
                  <h3 className="text-2xl font-bold">{bookmarksList.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Bookmark className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Certificates Earned</p>
                  <h3 className="text-2xl font-bold">{initialData.certificatesCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Award className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subnavigation Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6">
            <button
              onClick={() => setActiveTab("courses")}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "courses"
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              My Courses
              {activeTab === "courses" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "bookmarks"
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              Bookmarked
              {activeTab === "bookmarks" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "certificates"
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              Certificates
              {activeTab === "certificates" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
          </div>

          {/* Search and filter row (visible on Courses and Bookmarks tabs) */}
          {activeTab !== "certificates" && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              {activeTab === "courses" && (
                <div className="flex gap-3 w-full md:w-auto items-center">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex h-10 w-44 rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="flex h-10 w-36 rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                  >
                    <option value="all">All Difficulties</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Grid Renderers */}
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col justify-between group overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="secondary">{course.difficulty}</Badge>
                      </div>
                      <CardTitle className="line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 py-0">
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-zinc-500">Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-4 flex gap-3">
                      <Link href={`/course/${course.id}`} className="flex-1">
                        <Button className="w-full" variant="outline">
                          View Curriculum
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === course.id}
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-zinc-400 hover:text-red-500 p-2.5 h-10 w-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/30">
                  <BookOpen className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                  <h4 className="font-semibold text-sm">No courses found</h4>
                  <p className="text-xs text-zinc-400 mt-1">Create one using the button above.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.length > 0 ? (
                filteredBookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="flex flex-col justify-between overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{bookmark.category}</Badge>
                        <Badge variant="secondary">{bookmark.difficulty}</Badge>
                      </div>
                      <CardTitle className="line-clamp-1">{bookmark.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {bookmark.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-6 pt-4">
                      <Link href={`/course/${bookmark.id}`} className="w-full">
                        <Button className="w-full" variant="outline">
                          View Course
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/30">
                  <Bookmark className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                  <h4 className="font-semibold text-sm">No bookmarked courses</h4>
                  <p className="text-xs text-zinc-400 mt-1">Bookmark courses to access them quickly here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialData.certificates.length > 0 ? (
                initialData.certificates.map((cert) => (
                  <Card key={cert.id} className="border border-amber-200 bg-amber-50/20 dark:border-amber-900/50 dark:bg-amber-950/5 overflow-hidden flex flex-col justify-between">
                    <CardHeader className="p-6">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                        <Award className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-amber-950 dark:text-amber-200">
                        Certificate of Achievement
                      </CardTitle>
                      <CardDescription className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                        This document verifies that you have successfully completed all lessons, quizzes, and project guidelines for the curriculum:
                        <br />
                        <strong className="text-zinc-900 dark:text-zinc-100 mt-1 block">
                          {cert.courseTitle}
                        </strong>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-6 pt-0 flex justify-between items-center">
                      <span className="text-xs text-zinc-400">
                        Issued on: {new Date(cert.issuedAt).toLocaleDateString()}
                      </span>
                      <Link href={`/course/${cert.courseId}#certificate`} className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline">
                        <span>View Certificate</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/30">
                  <Award className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                  <h4 className="font-semibold text-sm">No certificates earned yet</h4>
                  <p className="text-xs text-zinc-400 mt-1">Complete 100% of any course to earn a certificate.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export default DashboardClient;
