import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "../../../actions/user";
import { getAdminStats } from "../../../actions/course";
import { AdminClient } from "../../../components/admin-client";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await syncUser();
  if (!dbUser || dbUser.role !== "admin") {
    redirect("/dashboard"); // Redirect regular users to dashboard
  }

  const adminStats = await getAdminStats();

  return <AdminClient stats={adminStats} />;
}
