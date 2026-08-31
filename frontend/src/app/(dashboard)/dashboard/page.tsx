"use client";

import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const startups = [
  {
    id: 1,
    name: "Acme Corp Analytics",
    description: "B2B SaaS platform for predictive churn analysis.",
    status: "Validating",
    lastEdited: "2 hours ago",
    progress: 35,
    accent: "violet",
  },
  {
    id: 2,
    name: "Fintech API",
    description: "Open banking infrastructure for Latin America.",
    status: "Building",
    lastEdited: "1 day ago",
    progress: 78,
    accent: "emerald",
  },
  {
    id: 3,
    name: "EcoLogistics",
    description: "Supply chain optimization for sustainable brands.",
    status: "Draft",
    lastEdited: "3 days ago",
    progress: 12,
    accent: "amber",
  },
];

const accentStyles: Record<string, { bg: string; text: string; bar: string }> = {
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    bar: "from-violet-500 to-violet-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    bar: "from-emerald-500 to-emerald-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    bar: "from-amber-500 to-amber-400",
  },
};

export default function DashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Overview
          </h1>
          <p className="text-[15px] text-zinc-500 mt-1">
            Manage your startup projects and view recent activity.
          </p>
        </div>
        <Button className="h-9 px-4 rounded-lg bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_16px_-4px_rgba(139,92,246,0.4)] hover:shadow-[0_0_24px_-4px_rgba(139,92,246,0.6)] transition-all flex items-center gap-2 text-[14px] font-medium">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {startups.map((startup) => {
          const accent = accentStyles[startup.accent];
          return (
            <motion.div key={startup.id} variants={item}>
              <Link href={`/projects/${startup.id}`} className="block h-full">
                <div className="glass-surface-interactive p-5 flex flex-col h-full group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${accent.bg} ${accent.text} flex items-center justify-center font-bold text-sm`}
                    >
                      {startup.name.substring(0, 2).toUpperCase()}
                    </div>
                    <button
                      className="p-1.5 text-zinc-600 hover:text-zinc-300 rounded-md hover:bg-white/[0.06] transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-[16px] font-semibold text-white mb-1 tracking-tight">
                    {startup.name}
                  </h3>
                  <p className="text-[14px] text-zinc-500 line-clamp-2 mb-6 flex-1">
                    {startup.description}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[13px] font-medium ${accent.text}`}
                      >
                        {startup.status}
                      </span>
                      <span className="text-[12px] text-zinc-600">
                        {startup.progress}%
                      </span>
                    </div>
                    {/* Gradient progress bar */}
                    <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${accent.bar} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${startup.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-[12px] text-zinc-600">
                        Edited {startup.lastEdited}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Create New Card */}
        <motion.div variants={item}>
          <button className="w-full h-full min-h-[220px] rounded-2xl border border-dashed border-white/[0.08] hover:border-white/[0.15] bg-white/[0.01] hover:bg-white/[0.03] flex flex-col items-center justify-center gap-3 transition-all duration-300 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 group-hover:border-violet-500/30 transition-all duration-300">
              <Plus className="w-5 h-5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
            </div>
            <span className="text-[15px] font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">
              Create New Project
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <div className="mt-4">
        <h2 className="text-[16px] font-semibold tracking-tight text-white mb-4">
          Recent Activity
        </h2>
        <div className="glass-surface p-1 divide-y divide-white/[0.04]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors duration-200 rounded-xl cursor-pointer"
            >
              <div className="mt-0.5 w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center">
                <Activity className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-[14px] text-white font-medium">
                  Financial model updated automatically.
                </p>
                <p className="text-[13px] text-zinc-500 mt-0.5">
                  Based on your new market size assumption for Acme Corp.
                </p>
                <p className="text-[12px] text-zinc-700 mt-2">
                  {i * 2} hours ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
