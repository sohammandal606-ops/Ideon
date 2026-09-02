"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { HexIcon } from "./hex-icon";

const AgentGlobeVisual = dynamic(
  () => import("./agent-globe").then((mod) => mod.AgentGlobeVisual),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section className="px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Left — Interactive Agent Globe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl min-h-[300px] sm:min-h-[380px] md:min-h-[520px] overflow-hidden group order-2 md:order-1"
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-surface rounded-2xl p-6 sm:p-8 md:p-10 flex-1 flex items-center relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
              }}
            />
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-[42px] font-semibold tracking-[-0.03em] leading-[1.15] relative">
              Guided by AI
              <br />
              <span className="gradient-text-brand">Ideon</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-surface rounded-2xl p-4 sm:p-6 flex items-center justify-between hover:border-white/[0.1] transition-colors"
          >
            <div className="flex items-center gap-3">
              <HexIcon className="w-4 h-4 shrink-0" color="#22c55e" />
              <span className="text-[14px] sm:text-[15px] font-medium text-zinc-300">
                Your Startup Journey
              </span>
            </div>
            <Link href="/signup" className="shrink-0">
              <button className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.05] hover:border-white/[0.2] transition-all">
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-surface rounded-2xl p-6 sm:p-8 md:p-10 flex-[2]"
          >
            <p className="text-[14px] sm:text-[15px] text-zinc-400 leading-[1.75] mb-4">
              Your startup is more than a pitch deck—it&apos;s a living strategy. Ideon helps you
              see the bigger picture by orchestrating 8 specialized AI agents that analyze your
              idea from every angle.
            </p>
            <p className="text-[14px] sm:text-[15px] text-zinc-500 leading-[1.75]">
              From idea validation to go-to-market strategy, each agent builds on the last—tracking
              evidence, surfacing risks, and delivering structured insights so you can launch with
              confidence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
