import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCourse } from "../../../actions/course";
import { CoursePlayerClient } from "../../../components/course-player-client";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const courseData = await getCourse(id);
    return <CoursePlayerClient courseData={courseData} />;
  } catch (error) {
    console.error("Error loading course:", error);
    redirect("/dashboard");
  }
}
