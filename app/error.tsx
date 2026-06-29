"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-650 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            An unexpected error occurred while parsing the requested layout segment.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Button onClick={() => reset()} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
