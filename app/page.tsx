"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check, ChevronDown, Flame, GraduationCap, Code } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { FEATURES, TESTIMONIALS, PRICING_PLANS, FAQS } from "../constants";
import { LucideIcon } from "../components/ui/icon";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-300/30 rounded-full blur-3xl pointer-events-none dark:bg-zinc-800/10" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-zinc-200/20 rounded-full blur-2xl pointer-events-none dark:bg-zinc-700/5" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
            <span>Powering instant learning curricula</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl max-w-4xl mx-auto leading-tight"
          >
            Learn anything. <br />
            <span className="bg-gradient-to-r from-zinc-600 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Synthesized by AI in seconds.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Enter a topic, set your goals, and instantly generate a complete, interactive course complete with weekly modules, markdown lessons, code execution playgrounds, and certificates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex justify-center gap-4 flex-wrap"
          >
            <Link href="/dashboard">
              <Button size="lg" className="flex items-center gap-2 shadow-lg dark:shadow-none">
                Start Generating <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </a>
          </motion.div>

          {/* Interactive Player Mockup Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 mx-auto max-w-5xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-left overflow-hidden shadow-2xl"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-xs font-mono text-zinc-500 select-none">AI Course Player Demo</div>
              <div className="w-12" />
            </div>

            {/* Split Screen layout */}
            <div className="flex flex-col md:flex-row h-[420px]">
              {/* Left pane - course modules */}
              <div className="w-full md:w-[260px] border-r border-zinc-800 bg-zinc-950/20 p-4 space-y-4 overflow-y-auto hidden md:block select-none">
                <div className="font-bold text-sm text-zinc-200">Modules (4 Weeks)</div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-zinc-800 text-xs text-white flex items-center gap-2 border border-zinc-700">
                    <Flame className="h-4.5 w-4.5 text-orange-400" />
                    <span>Week 1: Foundations</span>
                  </div>
                  <div className="p-2 rounded hover:bg-zinc-800/40 text-xs text-zinc-400 flex items-center gap-2 transition-colors">
                    <GraduationCap className="h-4.5 w-4.5" />
                    <span>Week 2: Advanced Logic</span>
                  </div>
                  <div className="p-2 rounded hover:bg-zinc-800/40 text-xs text-zinc-400 flex items-center gap-2 transition-colors">
                    <Code className="h-4.5 w-4.5" />
                    <span>Week 3: Practical Projects</span>
                  </div>
                </div>
              </div>

              {/* Right pane - lesson content + simulator */}
              <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto bg-zinc-900 text-zinc-200">
                <div className="border-b border-zinc-800 pb-3">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Week 1 / Lesson 1</div>
                  <h3 className="text-xl font-bold mt-1 text-white">Introduction to Machine Learning & Paradigms</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Machine Learning (ML) is a core subfield of Artificial Intelligence (AI) focused on design systems that learn from data and improve their models over time without explicit rules coding. At a high level, ML paradigms are split into:
                </p>
                <ul className="text-xs space-y-2 list-disc list-inside text-zinc-400 pl-2">
                  <li><strong className="text-zinc-300">Supervised Learning:</strong> Mapping inputs to labeled outputs.</li>
                  <li><strong className="text-zinc-300">Unsupervised Learning:</strong> Finding hidden structures in unlabeled data.</li>
                  <li><strong className="text-zinc-300">Reinforcement Learning:</strong> Agent behavior policy rewards optimization.</li>
                </ul>
                <div className="border border-zinc-800 rounded bg-zinc-950 p-3 font-mono text-xs text-emerald-400 mt-2">
                  <span className="text-zinc-500 select-none">// Simple Linear Regression model initialization</span>
                  <br />
                  <span className="text-amber-400">import</span> numpy <span className="text-amber-400">as</span> np
                  <br />
                  <span className="text-amber-400">from</span> sklearn.linear_model <span className="text-amber-400">import</span> LinearRegression
                  <br />
                  X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
                  <br />
                  y = np.dot(X, np.array([1, 2])) + 3
                  <br />
                  reg = LinearRegression().fit(X, y)
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Equipped with Everything to Learn Successfully
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Stop wandering search results or basic video paths. AI Course Gen synthesizes professional, academic-grade material instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all bg-zinc-50/50 dark:bg-zinc-900/30 group"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <LucideIcon name={feature.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Trusted by Ambitious Learners
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Discover how developers, designers, and business experts deploy custom AI courses to pick up complex skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                  &ldquo;{t.feedback}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{t.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Upgrade to Pro for unlimited AI course syntheses, coding playground runs, and digital certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 rounded-xl border flex flex-col justify-between bg-white dark:bg-zinc-900 relative ${
                  plan.popular
                    ? "border-zinc-900 dark:border-zinc-100 shadow-xl ring-1 ring-zinc-900 dark:ring-zinc-100 scale-105 z-10"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black text-xs font-bold border border-zinc-950 dark:border-white">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-2">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">${plan.price}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Check className="h-4.5 w-4.5 text-zinc-900 dark:text-zinc-100 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/dashboard" className="w-full">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 scroll-mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Clear up any doubts about generated structures, credit usage, and learning tools.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm md:text-base text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-zinc-500 transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
