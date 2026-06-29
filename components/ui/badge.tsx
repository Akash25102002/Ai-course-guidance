import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300";

  const variants = {
    default:
      "border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-900/80 dark:hover:bg-zinc-50/80",
    secondary:
      "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80",
    outline: "text-zinc-950 border-zinc-200 dark:text-zinc-50 dark:border-zinc-800",
    success:
      "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
    warning:
      "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
