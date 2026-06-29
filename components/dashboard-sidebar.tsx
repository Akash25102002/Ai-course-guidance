"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Trophy, ShieldAlert, Sparkles, BookOpen, Bookmark, Award } from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

export function DashboardSidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Leaderboard",
      icon: Trophy,
      href: "/dashboard/leaderboard",
      active: pathname === "/dashboard/leaderboard",
    },
  ];

  if (isAdmin) {
    links.push({
      label: "Admin Panel",
      icon: ShieldAlert,
      href: "/dashboard/admin",
      active: pathname === "/dashboard/admin",
    });
  }

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 gap-2">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>AI Course Gen</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                link.active
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Account</span>
            <span className="text-[10px] text-zinc-400">Manage settings</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
export default DashboardSidebar;
