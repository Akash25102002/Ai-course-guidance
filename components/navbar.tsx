"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span>AI Course Gen</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              FAQ
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="default" size="sm" className="flex items-center gap-1">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="mr-2">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-600 dark:text-zinc-400 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-zinc-600 dark:text-zinc-400 py-2"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-zinc-600 dark:text-zinc-400 py-2"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-zinc-600 dark:text-zinc-400 py-2"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-zinc-600 dark:text-zinc-400 py-2"
          >
            FAQ
          </Link>
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
            <SignedOut>
              <Link href="/sign-in" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="default" className="w-full">
                  Start Free
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3 pt-2">
                <UserButton afterSignOutUrl="/" />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Account settings</span>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
