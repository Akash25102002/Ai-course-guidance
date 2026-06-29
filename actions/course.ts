"use server";

import { db } from "../lib/db";
import {
  courses,
  modules,
  lessons,
  projects,
  quizzes,
  assignments,
  progress,
  bookmarks,
  certificates,
  users,
} from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  generateCourseOutline,
  generateLessonDetails,
  generateProjectDetails,
  generateQuizDetails,
} from "../lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { CourseGeneratorInput, LessonDetails, ProjectDetails, QuizDetails } from "../types";
import { revalidatePath } from "next/cache";

/**
 * Generate a new course and save skeleton to DB
 */
export async function generateCourse(input: CourseGeneratorInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Call Gemini to generate the Course Outline
  const outline = await generateCourseOutline(input);

  // Insert into DB
  const [newCourse] = await db
    .insert(courses)
    .values({
      userId,
      title: outline.title,
      description: outline.description,
      difficulty: input.difficulty,
      duration: input.duration,
      language: input.language,
      learningGoal: input.learningGoal,
      category: input.category,
      prerequisites: outline.prerequisites,
      learningOutcomes: outline.learningOutcomes,
      estimatedCompletionTime: outline.estimatedCompletionTime,
      careerOpportunities: outline.careerOpportunities,
    })
    .returning();

  // Create Modules and Lessons
  for (const mod of outline.modules) {
    const [newMod] = await db
      .insert(modules)
      .values({
        courseId: newCourse.id,
        title: mod.title,
        description: mod.description,
        weekNumber: mod.weekNumber,
        duration: mod.duration,
      })
      .returning();

    for (const les of mod.lessons) {
      await db.insert(lessons).values({
        moduleId: newMod.id,
        title: les.title,
        description: les.description,
        orderNumber: les.orderNumber,
      });
    }
  }

  // Pre-generate a capstone project outline (will generate detailed version on-demand)
  await db.insert(projects).values({
    courseId: newCourse.id,
    title: `${outline.title} - Capstone Project`,
    description: `Complete hands-on project to validate skills acquired in this course.`,
    techStack: [],
    architecture: "Pending generation",
    folderStructure: "Pending generation",
    tasks: [],
    milestones: [],
    deploymentGuide: "Pending generation",
  });

  // Pre-generate a quiz outline (will generate detailed version on-demand)
  await db.insert(quizzes).values({
    courseId: newCourse.id,
    questions: [],
  });

  // Pre-generate an assignment outline
  await db.insert(assignments).values({
    courseId: newCourse.id,
    title: `${outline.title} - Course Assignment`,
    description: `Demonstrate your learning by completing this practical assignment.`,
    instructions: `Implement the tasks outlined and write details about your architectural choices.`,
    submissionGuidelines: `Submit your work via the dashboard link.`,
  });

  revalidatePath("/dashboard");
  return newCourse.id;
}

/**
 * Fetch a complete course structure including modules, lessons, completed status
 */
export async function getCourse(courseId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch course
  const courseRecord = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });
  if (!courseRecord) throw new Error("Course not found");

  // Fetch modules
  const moduleRecords = await db.query.modules.findMany({
    where: eq(modules.courseId, courseId),
    orderBy: [modules.weekNumber],
  });

  // Fetch all lessons under modules
  const modulesWithLessons = [];
  for (const mod of moduleRecords) {
    const lessonRecords = await db.query.lessons.findMany({
      where: eq(lessons.moduleId, mod.id),
      orderBy: [lessons.orderNumber],
    });

    // Check progress for each lesson
    const lessonsWithProgress = [];
    for (const les of lessonRecords) {
      const isCompleted = await db.query.progress.findFirst({
        where: and(
          eq(progress.userId, userId),
          eq(progress.lessonId, les.id)
        ),
      });

      lessonsWithProgress.push({
        ...les,
        isCompleted: !!isCompleted,
      });
    }

    modulesWithLessons.push({
      ...mod,
      lessons: lessonsWithProgress,
    });
  }

  // Fetch project
  const projectRecord = await db.query.projects.findFirst({
    where: eq(projects.courseId, courseId),
  });

  // Fetch quiz
  const quizRecord = await db.query.quizzes.findFirst({
    where: eq(quizzes.courseId, courseId),
  });

  // Fetch assignment
  const assignmentRecord = await db.query.assignments.findFirst({
    where: eq(assignments.courseId, courseId),
  });

  // Fetch bookmark state
  const bookmarkRecord = await db.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.courseId, courseId)
    ),
  });

  // Fetch certificate status
  const certificateRecord = await db.query.certificates.findFirst({
    where: and(
      eq(certificates.userId, userId),
      eq(certificates.courseId, courseId)
    ),
  });

  return {
    ...courseRecord,
    modules: modulesWithLessons,
    project: projectRecord,
    quiz: quizRecord,
    assignment: assignmentRecord,
    isBookmarked: !!bookmarkRecord,
    certificate: certificateRecord || null,
  };
}

/**
 * Fetch detailed content for a lesson, generating it on-demand if missing
 */
export async function getLessonDetailsAction(lessonId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const lessonRecord = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });
  if (!lessonRecord) throw new Error("Lesson not found");

  // If detailed content already generated, return it
  if (lessonRecord.content) {
    return lessonRecord;
  }

  // Fetch parent module & course to build prompt context
  const mod = await db.query.modules.findFirst({
    where: eq(modules.id, lessonRecord.moduleId),
  });
  if (!mod) throw new Error("Module not found");

  const courseRecord = await db.query.courses.findFirst({
    where: eq(courses.id, mod.courseId),
  });
  if (!courseRecord) throw new Error("Course not found");

  // Call Gemini to generate detailed content
  const details = await generateLessonDetails(
    courseRecord.title,
    mod.title,
    lessonRecord.title,
    lessonRecord.description
  );

  // Update in DB
  const [updatedLesson] = await db
    .update(lessons)
    .set({
      content: details.explanation,
      practiceTask: details.practiceTask,
      codingPractice: details.code
        ? {
            question: details.practiceTask,
            starterCode: details.code,
            testCases: [],
          }
        : null,
      interviewQuestions: details.interviewQuestions,
    })
    .where(eq(lessons.id, lessonId))
    .returning();

  return updatedLesson;
}

/**
 * Fetch detailed project configuration, generating it on-demand if missing
 */
export async function getProjectDetailsAction(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const proj = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  if (!proj) throw new Error("Project not found");

  if (proj.techStack && proj.techStack.length > 0) {
    return proj as ProjectDetails & { id: string; courseId: string };
  }

  const courseRecord = await db.query.courses.findFirst({
    where: eq(courses.id, proj.courseId),
  });
  if (!courseRecord) throw new Error("Course not found");

  const generated = await generateProjectDetails(
    courseRecord.title,
    courseRecord.difficulty,
    courseRecord.learningGoal
  );

  const [updated] = await db
    .update(projects)
    .set({
      title: generated.title,
      description: generated.description,
      techStack: generated.techStack,
      architecture: generated.architecture,
      folderStructure: generated.folderStructure,
      tasks: generated.tasks,
      milestones: generated.milestones,
      deploymentGuide: generated.deploymentGuide,
    })
    .where(eq(projects.id, projectId))
    .returning();

  return updated;
}

/**
 * Fetch quiz, generating questions on-demand if missing
 */
export async function getQuizDetailsAction(quizId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const quizRecord = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, quizId),
  });
  if (!quizRecord) throw new Error("Quiz not found");

  if (quizRecord.questions && quizRecord.questions.length > 0) {
    return quizRecord;
  }

  const courseRecord = await db.query.courses.findFirst({
    where: eq(courses.id, quizRecord.courseId),
  });
  if (!courseRecord) throw new Error("Course not found");

  const generated = await generateQuizDetails(courseRecord.title, courseRecord.difficulty);

  const [updated] = await db
    .update(quizzes)
    .set({
      questions: generated.questions,
    })
    .where(eq(quizzes.id, quizId))
    .returning();

  return updated;
}

/**
 * Toggle lesson completion state and issue certificate if course is completed
 */
export async function markLessonCompleteAction(courseId: string, lessonId: string, complete: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (complete) {
    await db
      .insert(progress)
      .values({
        userId,
        courseId,
        lessonId,
      })
      .onConflictDoNothing();
  } else {
    await db
      .delete(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.lessonId, lessonId)
        )
      );
  }

  // Calculate course completion
  const modRecords = await db.query.modules.findMany({
    where: eq(modules.courseId, courseId),
  });
  const moduleIds = modRecords.map((m) => m.id);

  const allLessons = await db.query.lessons.findMany({
    where: sql`${lessons.moduleId} IN (${sql.join(moduleIds, sql`, `)})`,
  });
  const totalLessons = allLessons.length;

  const completedProgress = await db.query.progress.findMany({
    where: and(
      eq(progress.userId, userId),
      eq(progress.courseId, courseId)
    ),
  });
  const completedCount = completedProgress.length;

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  let certificateIssued = false;
  if (percentage === 100) {
    // Check if certificate already exists
    const cert = await db.query.certificates.findFirst({
      where: and(
        eq(certificates.userId, userId),
        eq(certificates.courseId, courseId)
      ),
    });

    if (!cert) {
      await db.insert(certificates).values({
        userId,
        courseId,
      });
      certificateIssued = true;
    }
  }

  revalidatePath(`/course/${courseId}`);
  revalidatePath("/dashboard");

  return {
    completedCount,
    totalLessons,
    percentage,
    certificateIssued,
  };
}

/**
 * Toggle bookmark status of a course
 */
export async function toggleBookmarkAction(courseId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await db.query.bookmarks.findFirst({
    where: and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.courseId, courseId)
    ),
  });

  if (existing) {
    await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.courseId, courseId)
        )
      );
    return { bookmarked: false };
  } else {
    await db.insert(bookmarks).values({
      userId,
      courseId,
    });
    return { bookmarked: true };
  }
}

/**
 * Duplicate an existing course
 */
export async function duplicateCourseAction(courseId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const courseRecord = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });
  if (!courseRecord) throw new Error("Course not found");

  // Create new duplicated course
  const [newCourse] = await db
    .insert(courses)
    .values({
      userId,
      title: `${courseRecord.title} (Copy)`,
      description: courseRecord.description,
      difficulty: courseRecord.difficulty,
      duration: courseRecord.duration,
      language: courseRecord.language,
      learningGoal: courseRecord.learningGoal,
      category: courseRecord.category,
      prerequisites: courseRecord.prerequisites,
      learningOutcomes: courseRecord.learningOutcomes,
      estimatedCompletionTime: courseRecord.estimatedCompletionTime,
      careerOpportunities: courseRecord.careerOpportunities,
    })
    .returning();

  // Duplicate modules and lessons
  const modRecords = await db.query.modules.findMany({
    where: eq(modules.courseId, courseId),
    orderBy: [modules.weekNumber],
  });

  for (const mod of modRecords) {
    const [newMod] = await db
      .insert(modules)
      .values({
        courseId: newCourse.id,
        title: mod.title,
        description: mod.description,
        weekNumber: mod.weekNumber,
        duration: mod.duration,
      })
      .returning();

    const lessonRecords = await db.query.lessons.findMany({
      where: eq(lessons.moduleId, mod.id),
      orderBy: [lessons.orderNumber],
    });

    for (const les of lessonRecords) {
      await db.insert(lessons).values({
        moduleId: newMod.id,
        title: les.title,
        description: les.description,
        content: les.content,
        orderNumber: les.orderNumber,
        codingPractice: les.codingPractice,
        practiceTask: les.practiceTask,
        interviewQuestions: les.interviewQuestions,
      });
    }
  }

  // Duplicate capstone project
  const proj = await db.query.projects.findFirst({
    where: eq(projects.courseId, courseId),
  });
  if (proj) {
    await db.insert(projects).values({
      courseId: newCourse.id,
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack,
      architecture: proj.architecture,
      folderStructure: proj.folderStructure,
      tasks: proj.tasks,
      milestones: proj.milestones,
      deploymentGuide: proj.deploymentGuide,
    });
  }

  // Duplicate quiz
  const qz = await db.query.quizzes.findFirst({
    where: eq(quizzes.courseId, courseId),
  });
  if (qz) {
    await db.insert(quizzes).values({
      courseId: newCourse.id,
      questions: qz.questions,
    });
  }

  // Duplicate assignment
  const asg = await db.query.assignments.findFirst({
    where: eq(assignments.courseId, courseId),
  });
  if (asg) {
    await db.insert(assignments).values({
      courseId: newCourse.id,
      title: asg.title,
      description: asg.description,
      instructions: asg.instructions,
      submissionGuidelines: asg.submissionGuidelines,
    });
  }

  revalidatePath("/dashboard");
  return newCourse.id;
}

/**
 * Fetch statistical dashboard summaries for the user
 */
export async function getUserDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch User profile to get streak
  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // Generated courses
  const generatedCourses = await db.query.courses.findMany({
    where: eq(courses.userId, userId),
    orderBy: [desc(courses.createdAt)],
  });

  // For each course, calculate progress
  const coursesWithProgress = [];
  let completedCount = 0;

  for (const course of generatedCourses) {
    const modRecords = await db.query.modules.findMany({
      where: eq(modules.courseId, course.id),
    });
    const moduleIds = modRecords.map((m) => m.id);

    let progressPercent = 0;
    if (moduleIds.length > 0) {
      const allLessons = await db.query.lessons.findMany({
        where: sql`${lessons.moduleId} IN (${sql.join(moduleIds, sql`, `)})`,
      });
      const totalLessonsCount = allLessons.length;

      const completedProgress = await db.query.progress.findMany({
        where: and(
          eq(progress.userId, userId),
          eq(progress.courseId, course.id)
        ),
      });

      progressPercent = totalLessonsCount > 0
        ? Math.round((completedProgress.length / totalLessonsCount) * 100)
        : 0;

      if (progressPercent === 100) {
        completedCount++;
      }
    }

    coursesWithProgress.push({
      ...course,
      progress: progressPercent,
    });
  }

  // Bookmarks
  const bookmarkedCoursesList = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      category: courses.category,
      difficulty: courses.difficulty,
    })
    .from(bookmarks)
    .innerJoin(courses, eq(bookmarks.courseId, courses.id))
    .where(eq(bookmarks.userId, userId));

  // Certificates
  const certificatesList = await db
    .select({
      id: certificates.id,
      courseTitle: courses.title,
      issuedAt: certificates.issuedAt,
    })
    .from(certificates)
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.userId, userId));

  return {
    streak: userRecord?.streak || 0,
    generatedCount: generatedCourses.length,
    completedCount,
    bookmarksCount: bookmarkedCoursesList.length,
    certificatesCount: certificatesList.length,
    recentlyGenerated: coursesWithProgress.slice(0, 5),
    bookmarks: bookmarkedCoursesList,
    certificates: certificatesList,
  };
}

/**
 * Fetch public streak leaderboard
 */
export async function getLeaderboard() {
  return await db.query.users.findMany({
    orderBy: [desc(users.streak)],
    limit: 10,
  });
}

/**
 * Delete a course
 */
export async function deleteCourseAction(courseId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify ownership or admin role
  const courseRecord = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });
  if (!courseRecord) throw new Error("Course not found");

  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (courseRecord.userId !== userId && userRecord?.role !== "admin") {
    throw new Error("Forbidden");
  }

  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Fetch administrative dashboard metrics (Admin only)
 */
export async function getAdminStats() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!userRecord || userRecord.role !== "admin") {
    throw new Error("Forbidden");
  }

  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });

  const allCourses = await db.query.courses.findMany({
    orderBy: [desc(courses.createdAt)],
  });

  const allCertificates = await db.query.certificates.findMany();

  return {
    totalUsers: allUsers.length,
    totalCourses: allCourses.length,
    totalCertificates: allCertificates.length,
    usersList: allUsers,
    coursesList: allCourses,
  };
}
