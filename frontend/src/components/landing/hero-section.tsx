"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, Sparkles, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { HexIcon } from "./hex-icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const AgentGlobeVisual = dynamic(
  () => import("./agent-globe").then((mod) => mod.AgentGlobeVisual),
  { ssr: false }
);

const SAMPLE_IDEAS = [
  "AI copilot for architectural CAD blueprints",
  "Automated SOC2 compliance for B2B SaaS",
  "Micro-learning app for sales onboarding",
];

export function HeroSection() {
  const [ideaInput, setIdeaInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [resultReady, setResultReady] = useState(false);

  const runSimulation = (ideaToRun?: string) => {
    const text = ideaToRun || ideaInput || SAMPLE_IDEAS[0];
    setIdeaInput(text);
    setIsSimulating(true);
    setResultReady(false);
    setSimStep(1);

    // Staggered simulation steps
    setTimeout(() => setSimStep(2), 400);
    setTimeout(() => setSimStep(3), 800);
    setTimeout(() => setSimStep(4), 1200);
    setTimeout(() => {
      setIsSimulating(false);
      setResultReady(true);
    }, 1600);
  };

  const resetSimulation = () => {
    setResultReady(false);
    setIsSimulating(false);
    setSimStep(0);
    setIdeaInput("");
  };

  return (
    <section id="product" className="scroll-mt-24 px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Left — Interactive Agent Globe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl min-h-[320px] sm:min-h-[400px] md:min-h-[560px] overflow-hidden group order-2 md:order-1"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 50px -20px rgba(0,0,0,0.5)",
          }}
        >
          {/* Inner vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)",
            }}
          />
          {/* Top edge shine */}
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)",
            }}
          />
          <AgentGlobeVisual />
        </motion.div>

        {/* Right — Bento Content */}
        <div className="flex flex-col gap-4 order-1 md:order-2">
          {/* Title Header with Spotlight */}
          <SpotlightCard className="p-6 sm:p-8 md:p-9 relative">
            <div
              className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
              }}
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Startup Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.03em] leading-[1.15]">
              Guided by AI.
              <br />
              <span className="gradient-text-brand">Validated by Data.</span>
            </h1>
          </SpotlightCard>

          {/* Quick Stats / Journey Banner */}
          <SpotlightCard className="p-4 sm:p-5 flex items-center justify-between hover:border-white/[0.15] transition-colors">
            <div className="flex items-center gap-3">
              <HexIcon className="w-4 h-4 shrink-0" color="#22c55e" />
              <span className="text-[14px] sm:text-[15px] font-medium text-zinc-300">
                Your Startup Journey from Zero to Execution
              </span>
            </div>
            <Link href="/signup" className="shrink-0" aria-label="Start validating">
              <button className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.08] hover:border-white/[0.25] transition-all active:scale-95">
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </button>
            </Link>
          </SpotlightCard>

          {/* Interactive Startup Idea Validator Simulator Widget */}
          <SpotlightCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Interactive Sandbox</span>
              </div>
              {resultReady && (
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-[13px] text-zinc-400 mb-3.5">
              Type an idea to preview how Ideon&apos;s 8 agents cross-analyze your startup:
            </p>

            {/* Input Bar */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                placeholder="e.g. AI-driven logistics tracker for cold storage"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSimulating) runSimulation();
                }}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors"
              />
              <button
                onClick={() => runSimulation()}
                disabled={isSimulating}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs sm:text-sm font-medium shrink-0 flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-violet-500/20"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Test Idea</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Pick Idea Chips */}
            {!resultReady && !isSimulating && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SAMPLE_IDEAS.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => runSimulation(sample)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.05] transition-all"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            )}

            {/* Simulation Progress States */}
            <AnimatePresence mode="wait">
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-3 border-t border-white/[0.06] mt-3"
                >
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    {simStep >= 1 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 animate-pulse" />
                    )}
                    <span>Idea Validator: Scanning market need and target personas...</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    {simStep >= 2 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 animate-pulse" />
                    )}
                    <span>Business Model: Formulating monetization & pricing tiers...</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    {simStep >= 3 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 animate-pulse" />
                    )}
                    <span>Financial Engine: Projecting 3-year burn, CAC, and ARR...</span>
                  </div>
                </motion.div>
              )}

              {resultReady && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 border-t border-white/[0.06] mt-3 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-emerald-400 font-semibold">91% Feasibility</div>
                      <div className="text-zinc-400 text-[11px]">Strong B2B Willingness to Pay</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <div className="text-violet-400 font-semibold">$1.4M ARR Target</div>
                      <div className="text-zinc-400 text-[11px]">Month 18 Breakeven</div>
                    </div>
                  </div>

                  <Link href="/signup" className="block">
                    <button className="w-full h-9 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-xs font-medium text-white flex items-center justify-center gap-2 transition-all">
                      <span>Generate Full 8-Agent Execution Plan</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
