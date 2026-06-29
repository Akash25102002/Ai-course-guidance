"use client";

import React, { useState, useMemo } from "react";
import { Users, BookOpen, Award, Trash2, Search, Calendar, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useToast } from "../providers/toast-provider";
import { deleteCourseAction } from "../actions/course";

interface AdminClientProps {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalCertificates: number;
    usersList: any[];
    coursesList: any[];
  };
}

export function AdminClient({ stats }: AdminClientProps) {
  const { toast } = useToast();
  const [userQuery, setUserQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [coursesList, setCoursesList] = useState(stats.coursesList);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return stats.usersList.filter((u) => {
      return (
        (u.name && u.name.toLowerCase().includes(userQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userQuery.toLowerCase()))
      );
    });
  }, [stats.usersList, userQuery]);

  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      return (
        c.title.toLowerCase().includes(courseQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(courseQuery.toLowerCase())
      );
    });
  }, [coursesList, courseQuery]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course as an Admin?")) return;
    setDeletingId(courseId);
    try {
      await deleteCourseAction(courseId);
      toast({
        title: "Course deleted",
        description: "The course was successfully deleted from the platform database.",
        type: "success",
      });
      setCoursesList((prev) => prev.filter((c) => c.id !== courseId));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <DashboardSidebar isAdmin={true} />

      <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
              <span>Admin Control Center</span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Oversee users, examine platform analytics, and manage course assets.
            </p>
          </div>
        </header>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Users</p>
                <h3 className="text-3xl font-extrabold mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Courses Synthesized</p>
                <h3 className="text-3xl font-extrabold mt-1">{coursesList.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <BookOpen className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Certificates Issued</p>
                <h3 className="text-3xl font-extrabold mt-1">{stats.totalCertificates}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <Award className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Split Screen Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User management list */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-2 p-6">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage user profiles and streaks</CardDescription>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Filter users..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-x-auto p-0">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-semibold uppercase">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Streak</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {u.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-zinc-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-bold">{u.streak} Days</td>
                      <td className="px-6 py-4 text-xs text-zinc-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Course management list */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-col gap-2 p-6">
              <div>
                <CardTitle>Global Courses</CardTitle>
                <CardDescription>Review and prune synthesized curricula</CardDescription>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Filter courses..."
                  value={courseQuery}
                  onChange={(e) => setCourseQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-x-auto p-0">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-semibold uppercase">
                    <th className="px-6 py-3">Course Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Difficulty</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {c.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">ID: {c.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{c.category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{c.difficulty}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          disabled={deletingId === c.id}
                          onClick={() => handleDeleteCourse(c.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 h-8 w-8 p-0"
                          title="Delete Course as Admin"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
export default AdminClient;
