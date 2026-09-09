"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HexIcon } from "./hex-icon";

export const AGENT_WORKFLOW = [
  {
    step: 1,
    name: "Idea Validator",
    category: "Validation",
    color: "#3b82f6",
    description: "Evaluates problem strength, solution quality, market potential, and key risks.",
    duration: "~2 min",
  },
  {
    step: 2,
    name: "Market Research",
    category: "Research",
    color: "#8b5cf6",
    description: "Analyzes TAM/SAM, industry trends, customer segments, and growth opportunities.",
    duration: "~3 min",
    parallel: true,
  },
  {
    step: 3,
    name: "Competitor Analysis",
    category: "Research",
    color: "#8b5cf6",
    description: "Maps competitive landscape, positioning gaps, and differentiation strategies.",
    duration: "~3 min",
    parallel: true,
  },
  {
    step: 4,
    name: "Business Model",
    category: "Strategy",
    color: "#6366f1",
    description: "Designs revenue streams, pricing strategy, and unit economics framework.",
    duration: "~2 min",
  },
  {
    step: 5,
    name: "Financial Analysis",
    category: "Strategy",
    color: "#6366f1",
    description: "Projects revenue, burn rate, runway, and break-even scenarios.",
    duration: "~2 min",
  },
  {
    step: 6,
    name: "MVP Plan",
    category: "Execution",
    color: "#eab308",
    description: "Scopes core features, tech stack, timeline, and validation milestones.",
    duration: "~2 min",
  },
  {
    step: 7,
    name: "GTM Strategy",
    category: "Execution",
    color: "#eab308",
    description: "Plans launch channels, acquisition tactics, and early traction goals.",
    duration: "~2 min",
  },
  {
    step: 8,
    name: "Final Verdict",
    category: "Validation",
    color: "#ef4444",
    description: "Synthesizes all analyses into a go/no-go recommendation with confidence score.",
    duration: "~1 min",
  },
];

const CATEGORIES = [
  { label: "Validation", color: "#3b82f6" },
  { label: "Research", color: "#8b5cf6" },
  { label: "Strategy", color: "#6366f1" },
  { label: "Execution", color: "#eab308" },
];

function WorkflowChart() {
  const steps = AGENT_WORKFLOW.length;
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { top: 30, right: 20, bottom: 30, left: 50 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const generatePath = (baseY: number, amplitude: number) => {
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = padding.left + (i / steps) * innerW;
      const y = padding.top + baseY + Math.sin(i * 0.8) * amplitude;
      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  };

  const activeStep = 4;
  const activeX = padding.left + (activeStep / steps) * innerW;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
      <defs>
        <linearGradient id="chartBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id="dotGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={padding.left}
          y1={padding.top + (i / 4) * innerH}
          x2={chartWidth - padding.right}
          y2={padding.top + (i / 4) * innerH}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}

      {[1000, 800, 600, 400, 200].map((val, i) => (
        <text
          key={val}
          x={padding.left - 8}
          y={padding.top + (i / 4) * innerH + 4}
          textAnchor="end"
          fill="#52525b"
          fontSize="9"
        >
          {val}
        </text>
      ))}

      <rect
        x={padding.left}
        y={padding.top}
        width={innerW}
        height={innerH}
        fill="url(#chartBg)"
        rx="4"
      />

      <path d={generatePath(innerH * 0.3, 15)} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
      <path d={generatePath(innerH * 0.5, 20)} fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
      <path d={generatePath(innerH * 0.7, 12)} fill="none" stroke="#eab308" strokeWidth="2" opacity="0.8" />

      <rect x={activeX - 20} y={padding.top} width="40" height={innerH} fill="rgba(239,68,68,0.06)" rx="4" />
      <line
        x1={activeX} y1={padding.top}
        x2={activeX} y2={padding.top + innerH}
        stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4 4"
      />
      <circle cx={activeX} cy={padding.top + innerH * 0.5} r="6" fill="#ef4444" filter="url(#dotGlow)" />
      <circle cx={activeX} cy={padding.top + innerH * 0.5} r="3" fill="#fff" />

      {[
        { label: "Validation", y: -8, color: "#3b82f6" },
        { label: "Research", y: 12, color: "#8b5cf6" },
        { label: "Strategy", y: 32, color: "#6366f1" },
      ].map((item) => (
        <g key={item.label}>
          <rect
            x={activeX + 12} y={padding.top + innerH * 0.5 + item.y - 8}
            width="70" height="16" rx="4"
            fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.08)"
          />
          <circle cx={activeX + 20} cy={padding.top + innerH * 0.5 + item.y} r="3" fill={item.color} />
          <text x={activeX + 28} y={padding.top + innerH * 0.5 + item.y + 3} fill="#a1a1aa" fontSize="8">
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function AgentStepList() {
  return (
    <div className="space-y-2">
      {AGENT_WORKFLOW.slice(0, 4).map((agent, i) => (
        <div key={agent.name} className="flex items-center gap-3 py-1.5">
          <div
            className="w-1 h-7 rounded-full shrink-0"
            style={{ backgroundColor: agent.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-zinc-300 truncate">{agent.name}</p>
              <span className="text-[11px] text-zinc-600 shrink-0 ml-2">
                {i === 0 ? "100%" : i === 1 ? "80%" : i === 2 ? "60%" : "40%"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600">{agent.duration}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkflowSection() {
  return (
    <section id="workflow" className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] mb-5">
            <HexIcon className="w-3.5 h-3.5" />
            <span className="text-[13px] text-zinc-500 font-medium">The Agent Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold tracking-[-0.03em] mb-4">
            Your Work, Visualized Clearly
          </h2>
          <p className="text-[14px] sm:text-[15px] text-zinc-500 max-w-[560px] mx-auto leading-[1.75] px-2">
            Watch 8 specialized AI agents analyze your startup in sequence—each building on the
            last to deliver a complete, evidence-backed strategy you can act on.
          </p>
        </motion.div>

        {/* Mobile status pills — shown only on <xl, above the dashboard */}
        <div className="xl:hidden flex items-center justify-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-surface rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <span className="text-[12px] text-zinc-300 font-medium">Agent 1: Idea Validation</span>
            <span className="text-[11px] text-emerald-400 font-medium">✓</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 glass-surface rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
            <span className="text-[12px] text-zinc-300 font-medium">Agent 4: Business Model</span>
            <span className="text-[11px] text-violet-400 font-medium">Running</span>
          </div>
        </div>

        {/* Dashboard Mock — floating cards on xl only */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative xl:mx-16 2xl:mx-24"
        >
          {/* Floating cards — only xl+ where there's enough room */}
          <div className="hidden xl:block absolute -left-52 top-1/2 -translate-y-1/2 z-10">
            <div className="glass-surface rounded-xl p-4 w-[170px] shadow-xl border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Agent 1</p>
              </div>
              <p className="text-[13px] font-medium text-zinc-200 mb-1">Idea Validation</p>
              <p className="text-[11px] text-zinc-500">Step 1 of 8</p>
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                <span>✓</span> Complete
              </p>
            </div>
          </div>
          <div className="hidden xl:block absolute -right-52 top-1/2 -translate-y-1/2 z-10">
            <div className="glass-surface rounded-xl p-4 w-[170px] shadow-xl border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Agent 4</p>
              </div>
              <p className="text-[13px] font-medium text-zinc-200 mb-1">Business Model</p>
              <p className="text-[11px] text-zinc-500">Step 4 of 8</p>
              <p className="text-[11px] text-violet-400 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
                In Progress
              </p>
            </div>
          </div>

          {/* Main dashboard */}
          <div className="glass-surface rounded-2xl overflow-hidden border-white/[0.08]">
            <div className="grid lg:grid-cols-[220px_1fr]">
              {/* Sidebar — Agent Progress */}
              <div className="border-b lg:border-b-0 lg:border-r border-white/[0.06] p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[13px] font-medium text-zinc-400">Agent Progress</p>
                  <span className="text-[11px] text-zinc-600">Step 4/8</span>
                </div>
                <AgentStepList />
                <Link href="/signup">
                  <button className="w-full mt-5 h-9 text-[13px] font-medium rounded-lg border border-white/[0.12] text-white hover:bg-white/[0.05] transition-colors cursor-pointer">
                    Run Analysis
                  </button>
                </Link>
              </div>

              {/* Chart area */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.label} className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-[11px] text-zinc-500">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <WorkflowChart />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agent Steps Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 sm:mt-16"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-3 tracking-tight">
            How Our Agents Work Together
          </h3>
          <p className="text-[13px] sm:text-[14px] text-zinc-500 text-center max-w-[640px] mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Each agent specializes in one domain. They share a common Startup State, so insights
            from market research inform financial projections, and competitor gaps shape your GTM
            strategy. The result: a coherent plan, not disconnected advice.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {AGENT_WORKFLOW.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-surface rounded-xl p-4 sm:p-5 relative group hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.step}
                  </span>
                  {agent.parallel && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-500">
                      parallel
                    </span>
                  )}
                </div>
                <h4 className="text-[14px] font-semibold text-white mb-1.5">{agent.name}</h4>
                <p className="text-[12px] text-zinc-500 leading-relaxed mb-3">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${agent.color}15`,
                      color: agent.color,
                    }}
                  >
                    {agent.category}
                  </span>
                  <span className="text-[10px] text-zinc-600">{agent.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="mt-10 sm:mt-12 glass-surface rounded-xl p-5 sm:p-6 md:p-8">
            <p className="text-[13px] font-medium text-zinc-400 mb-4 text-center">
              Execution Flow
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px]">
              {[
                "Idea Validator",
                "→",
                "Market Research",
                "+",
                "Competitor Analysis",
                "→",
                "Business Model",
                "→",
                "Financial Analysis",
                "→",
                "MVP Plan",
                "→",
                "GTM Strategy",
                "→",
                "Final Verdict",
              ].map((item, i) =>
                item === "→" || item === "+" ? (
                  <span key={i} className="text-zinc-600 font-mono">
                    {item}
                  </span>
                ) : (
                  <span
                    key={i}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-300"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
            <p className="text-[11px] sm:text-[12px] text-zinc-600 text-center mt-4">
              Market Research and Competitor Analysis run in parallel, then merge into Business
              Model synthesis.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
