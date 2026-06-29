import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Flame, Trophy, Award, Calendar } from "lucide-react";
import { syncUser } from "../../../actions/user";
import { getLeaderboard } from "../../../actions/course";
import { DashboardSidebar } from "../../../components/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default async function LeaderboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await syncUser();
  if (!dbUser) {
    redirect("/sign-in");
  }

  const leaderboardUsers = await getLeaderboard();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <DashboardSidebar isAdmin={dbUser.role === "admin"} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>Streak Leaderboard</span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Top global learners maintaining consecutive daily study streaks.
            </p>
          </div>
        </header>

        {/* Current user streak banner */}
        <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-zinc-950 border-none text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Your Position</p>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>Keep studying daily to stay on top!</span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-white">{dbUser.streak} Days</h4>
                <p className="text-xs text-zinc-400">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table List */}
        <Card>
          <CardHeader>
            <CardTitle>Top Learners</CardTitle>
            <CardDescription>Rankings based on active streaks</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {leaderboardUsers.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = user.id === dbUser.id;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-6 py-4.5 transition-colors ${
                      isCurrentUser
                        ? "bg-zinc-50/80 dark:bg-zinc-900/60"
                        : "hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Indicator */}
                      <div className="w-8 flex justify-center text-sm font-bold">
                        {rank === 1 && <span className="text-xl">🥇</span>}
                        {rank === 2 && <span className="text-xl">🥈</span>}
                        {rank === 3 && <span className="text-xl">🥉</span>}
                        {rank > 3 && <span className="text-zinc-400 dark:text-zinc-500">{rank}</span>}
                      </div>

                      {/* User Info */}
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <span>{user.name || "Anonymous Learner"}</span>
                          {isCurrentUser && (
                            <Badge variant="secondary" className="text-[10px]">
                              You
                            </Badge>
                          )}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Flame className="h-4.5 w-4.5 text-orange-500 fill-orange-500" />
                      <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                        {user.streak} Days
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
