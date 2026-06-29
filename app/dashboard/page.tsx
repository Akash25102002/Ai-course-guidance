import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "../../actions/user";
import { getUserDashboardData } from "../../actions/course";
import { DashboardClient } from "../../components/dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Sync user profile and streak count in DB on load
  const dbUser = await syncUser();
  if (!dbUser) {
    redirect("/sign-in");
  }

  // Get user dashboard data
  const dashboardData = await getUserDashboardData();

  return (
    <DashboardClient
      initialData={dashboardData}
      role={dbUser.role}
    />
  );
}
