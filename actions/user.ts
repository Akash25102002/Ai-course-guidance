"use server";

import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

  // Find if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, clerkUser.id),
  });

  if (existingUser) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = existingUser.streak;
    const lastActive = existingUser.lastActiveAt;

    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      lastActiveDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastActiveDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active on consecutive day, increment streak
        streak += 1;
      } else if (diffDays > 1) {
        // Broke streak, reset to 1
        streak = 1;
      }
    } else {
      streak = 1;
    }

    await db
      .update(users)
      .set({
        name,
        email,
        streak,
        lastActiveAt: new Date(),
      })
      .where(eq(users.id, clerkUser.id));

    return { ...existingUser, streak, lastActiveAt: new Date() };
  }

  // Create new user in DB
  const newUser = {
    id: clerkUser.id,
    email,
    name,
    role: "user",
    streak: 1,
    lastActiveAt: new Date(),
    createdAt: new Date(),
  };

  await db.insert(users).values(newUser);
  return newUser;
}

export async function getUserProfile(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}
