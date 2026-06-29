import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <SignUp appearance={{
          elements: {
            card: "shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
          }
        }} />
      </div>
    </div>
  );
}
