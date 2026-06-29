import React from "react";
import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>AI Course Gen</span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-5">
              Empowering global learners to synthesize, execute, and master new skills using Gemini AI and real-time interactive playgrounds.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  API Status
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} AI Course Generator. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
            Built with ❤️ and Gemini 3.5 Flash
          </p>
        </div>
      </div>
    </footer>
  );
}
