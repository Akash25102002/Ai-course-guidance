import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800">
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Page Not Found
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            The course or section you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Link href="/dashboard">
            <Button className="flex items-center gap-2">
              Back to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
