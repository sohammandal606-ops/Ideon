"use client";

import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProjectModal } from "@/context/project-modal-context";

const accentStyles = {
  violet: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    bar: "from-violet-500 to-indigo-500",
    avatarBg: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    dot: "bg-violet-400",
  },
  emerald: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    bar: "from-emerald-500 to-teal-400",
    avatarBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  amber: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    bar: "from-amber-500 to-orange-400",
    avatarBg: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    dot: "bg-amber-400",
  },
  blue: {
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    bar: "from-blue-500 to-cyan-400",
    avatarBg: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    dot: "bg-blue-400",
  },
};

export default function DashboardPage() {
  const { startups, openModal } = useProjectModal();

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 select-none">
      {/* 1. Header Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Overview
          </h1>
          <p className="text-[13.5px] sm:text-[14px] text-zinc-400 mt-1">
            Manage your startup ventures, track agent progress, and view live workspace activity.
          </p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-4.5 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-[13.5px] font-medium shadow-sm transition-all active:scale-[0.98] shrink-0 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 text-zinc-950" />
          <span>New Project</span>
        </button>
      </div>

      {/* 2. Projects Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-white tracking-tight">
            Active Projects
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium">Showing {startups.length} projects</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {startups.map((startup, i) => {
            const style = accentStyles[startup.accent] || accentStyles.violet;
            return (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link href={`/projects/${startup.id}`} className="block h-full group">
                  <div className="h-full rounded-[22px] bg-[#141720] hover:bg-[#171b26] border border-white/[0.07] hover:border-white/[0.14] p-5.5 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-2xl relative overflow-hidden">
                    {/* Top edge glow line */}
                    <div
                      className="absolute inset-x-0 top-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent)",
                      }}
                    />

                    {/* Top Row: Avatar & Status & Menu */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-11 h-11 rounded-xl ${style.avatarBg} border flex items-center justify-center font-bold text-[14px] shadow-sm`}
                        >
                          {startup.name.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex items-center gap-2">
                          {startup.viabilityScore && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              <Sparkles className="w-3 h-3 text-blue-400" />
                              {startup.viabilityScore}/100
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${style.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {startup.status}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="p-1 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-white/[0.06] transition-colors"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Project Name & Description */}
                      <h3 className="text-[17px] font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors leading-snug mb-2">
                        {startup.name}
                      </h3>
                      <p className="text-[13.5px] text-zinc-400 line-clamp-2 leading-relaxed font-normal mb-6">
                        {startup.description}
                      </p>
                    </div>

                    {/* Bottom Progress & Metadata */}
                    <div className="space-y-3 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-zinc-400 font-medium">
                          Validation Completion
                        </span>
                        <span className="text-white font-semibold">
                          {startup.progress}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${style.bar} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${startup.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11.5px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Edited {startup.lastEdited}
                        </span>
                        <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-white transition-colors text-[11px]">
                          <span>{startup.category}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
