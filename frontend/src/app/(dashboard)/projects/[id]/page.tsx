"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Search,
  Target,
  Layers,
  DollarSign,
  Rocket,
  Zap,
  Award,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  FileText,
  Copy,
  Check,
  Building,
  Globe,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Cpu,
  Activity,
  Compass,
  PieChart,
  BarChart3,
  Flame,
  ExternalLink,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  useProjectModal,
  StartupProject,
  AgentWorkflowOutput,
  generateMockAgentOutput,
} from "@/context/project-modal-context";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface AgentConfigItem {
  key: keyof AgentWorkflowOutput;
  name: string;
  role: string;
  category: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  borderHover: string;
  accentText: string;
  badgeBg: string;
}

const AGENTS_CONFIG: AgentConfigItem[] = [
  {
    key: "idea_validation",
    name: "Idea Validator",
    role: "Problem-Solution Fit",
    category: "Phase 1: Discovery",
    icon: Brain,
    gradient: "from-blue-600 via-indigo-500 to-cyan-400",
    glow: "rgba(59, 130, 246, 0.35)",
    borderHover: "hover:border-blue-500/50",
    accentText: "text-blue-400",
    badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  },
  {
    key: "market_research",
    name: "Market Research",
    role: "TAM / SAM / SOM Sizing",
    category: "Phase 1: Discovery",
    icon: Search,
    gradient: "from-indigo-600 via-violet-500 to-purple-400",
    glow: "rgba(99, 102, 241, 0.35)",
    borderHover: "hover:border-indigo-500/50",
    accentText: "text-indigo-400",
    badgeBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  },
  {
    key: "competitor_analysis",
    name: "Competitor Analyst",
    role: "Moats & Landscape",
    category: "Phase 2: Strategy",
    icon: Target,
    gradient: "from-violet-600 via-purple-500 to-fuchsia-400",
    glow: "rgba(139, 92, 246, 0.35)",
    borderHover: "hover:border-violet-500/50",
    accentText: "text-violet-400",
    badgeBg: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  },
  {
    key: "business_model",
    name: "Business Model",
    role: "Pricing & Unit Economics",
    category: "Phase 2: Strategy",
    icon: Layers,
    gradient: "from-purple-600 via-fuchsia-500 to-pink-400",
    glow: "rgba(168, 85, 247, 0.35)",
    borderHover: "hover:border-purple-500/50",
    accentText: "text-purple-400",
    badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  {
    key: "financial_analysis",
    name: "Financial Analyst",
    role: "Runway & Projections",
    category: "Phase 3: Execution",
    icon: DollarSign,
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
    glow: "rgba(16, 185, 129, 0.35)",
    borderHover: "hover:border-emerald-500/50",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  {
    key: "mvp_plan",
    name: "MVP Planner",
    role: "4-Week Build Scope",
    category: "Phase 3: Execution",
    icon: Rocket,
    gradient: "from-amber-600 via-orange-500 to-yellow-400",
    glow: "rgba(245, 158, 11, 0.35)",
    borderHover: "hover:border-amber-500/50",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  {
    key: "gtm_strategy",
    name: "GTM Specialist",
    role: "Distribution Engine",
    category: "Phase 4: Launch",
    icon: Zap,
    gradient: "from-cyan-600 via-blue-500 to-indigo-400",
    glow: "rgba(6, 182, 212, 0.35)",
    borderHover: "hover:border-cyan-500/50",
    accentText: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  },
  {
    key: "final_verdict",
    name: "Verdict Synthesizer",
    role: "Investment Viability Memo",
    category: "Phase 4: Launch",
    icon: Award,
    gradient: "from-rose-600 via-pink-500 to-violet-400",
    glow: "rgba(244, 63, 94, 0.35)",
    borderHover: "hover:border-rose-500/50",
    accentText: "text-rose-400",
    badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  },
];

export default function ProjectAnalysisPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  const router = useRouter();
  const { getStartup, startups } = useProjectModal();

  const [project, setProject] = useState<StartupProject | null>(null);
  const [activeTab, setActiveTab] = useState<keyof AgentWorkflowOutput>("final_verdict");
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showSummaryMatrix, setShowSummaryMatrix] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    const found = getStartup(projectId);
    if (found) {
      if (!found.agentOutputs) {
        found.agentOutputs = generateMockAgentOutput(
          found.name,
          found.description,
          found.industry,
          found.target_market,
          found.additional_info
        );
      }
      setProject(found);
    } else {
      // Fallback if accessed via direct URL
      const fallback: StartupProject = {
        id: projectId,
        name: "Autonomous Venture Engine",
        description: "Intelligent autonomous startup validation & architecture pipeline.",
        industry: "B2B SaaS",
        target_market: "Global Tech Companies & Founders",
        status: "Validating",
        lastEdited: "Just now",
        progress: 100,
        category: "B2B SaaS",
        accent: "violet",
        viabilityScore: 89,
        agentOutputs: generateMockAgentOutput(
          "Autonomous Venture Engine",
          "Intelligent autonomous startup validation & architecture pipeline.",
          "B2B SaaS",
          "Global Tech Companies & Founders"
        ),
      };
      setProject(fallback);
    }
  }, [projectId, startups, getStartup]);

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      window.print();
      setIsGeneratingPdf(false);
    }, 600);
  };

  const handleCopySummary = () => {
    if (!project?.agentOutputs) return;
    navigator.clipboard.writeText(
      `Project: ${project.name}\nViability Score: ${project.agentOutputs.final_verdict.viabilityScore}/100\nVerdict: ${project.agentOutputs.final_verdict.executiveSummary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!project || !project.agentOutputs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-zinc-400 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[2px] animate-spin">
            <div className="w-full h-full rounded-full bg-[#0d0f17] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/20" />
        </div>
        <p className="text-sm font-medium tracking-wide text-zinc-300">
          Synthesizing 8-Agent Neural Consensus...
        </p>
      </div>
    );
  }

  const out = project.agentOutputs;
  const currentAgent = AGENTS_CONFIG.find((a) => a.key === activeTab) || AGENTS_CONFIG[7];
  const CurrentIcon = currentAgent.icon;

  const filteredAgents = AGENTS_CONFIG.filter((a) =>
    a.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative min-h-screen text-zinc-100 select-none print:bg-white print:text-black">
      {/* ─────────────────────────────────────────────────────────────
          AMBIENT AURORA & GLOW SYSTEM (Futuristic Dark Aesthetic)
          ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 print:hidden">
        {/* Top radial purple-indigo glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-purple-700/18 via-indigo-600/12 to-transparent blur-[140px] rounded-full" />
        {/* Subtle cyan-teal ambient pocket */}
        <div className="absolute top-1/3 -right-32 w-[550px] h-[450px] bg-cyan-600/8 blur-[130px] rounded-full" />
        {/* Soft violet side pocket */}
        <div className="absolute bottom-10 -left-32 w-[500px] h-[450px] bg-fuchsia-600/8 blur-[140px] rounded-full" />
        {/* Fine background grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      <div className="space-y-7 pb-20 print:space-y-4 print:p-0">
        {/* ─────────────────────────────────────────────────────────────
            1. TOP HERO HEADER & METALLIC ORB BADGE
            ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 print:hidden">
          {/* Breadcrumb row */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-zinc-400 hover:text-white transition-all backdrop-blur-md shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-zinc-400 group-hover:text-white" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.02] border border-white/[0.06] px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-medium">8/8 Pipeline Verified</span>
            </div>
          </div>

          {/* Centerpiece Hero Container with Sleek Futuristic Orb */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#141224]/80 via-[#0e101b]/90 to-[#0c0e16]/95 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden">
            {/* Ambient inner shimmer */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-500/15 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left Details with Futuristic Sphere Icon */}
              <div className="flex items-start gap-4 sm:gap-5">
                {/* 3D-Style Reflective Glass Orb */}
                <div className="relative shrink-0 mt-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-white/20 via-white/5 to-white/0 p-[1px] shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#2a244d] via-[#1a1733] to-[#100f24] flex items-center justify-center relative overflow-hidden border border-white/10">
                      {/* Inner metallic sphere optics */}
                      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-white/25 blur-md" />
                      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-purple-500/30 to-transparent" />
                      <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] relative z-10" />
                    </div>
                  </div>
                  {/* Subtle outer neon ring */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-sm -z-10" />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                      {project.name}
                    </h1>
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      {project.industry || project.category || "B2B SaaS"}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                      Target: {project.target_market || "Global High-Growth"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300/90 max-w-2xl leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Right Viability Pill Card */}
              <div className="flex flex-col sm:flex-row items-center gap-3 self-stretch md:self-auto shrink-0">
                {/* Glowing Score Centerpiece */}
                <div className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 flex items-center justify-between sm:justify-start gap-4 backdrop-blur-xl shadow-lg">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Consensus Viability
                    </span>
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> High Venture Viability
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-emerald-300">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {out.final_verdict.viabilityScore}
                    </span>
                    <span className="text-xs font-semibold opacity-70">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing Action Buttons Row */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Executive Memo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSummaryMatrix((prev) => !prev)}
                  className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
                  <span>{showSummaryMatrix ? "Collapse Agent Matrix" : "View 8-Agent Synthesis Matrix"}</span>
                  {showSummaryMatrix ? (
                    <ChevronUp className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                  )}
                </button>
              </div>

              {/* Glowing Aurora Action Button */}
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="relative h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg"
                >
                  {isGeneratingPdf ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating PDF Document...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export Executive PDF Memo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. ALL-AGENTS EXECUTIVE SUMMARY MATRIX (Futuristic Card Grid)
            ───────────────────────────────────────────────────────────── */}
        {showSummaryMatrix && (
          <section className="space-y-3.5 print:hidden">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center">
                  <LayoutGrid className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Autonomous 8-Agent Synthesis Matrix
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    Comprehensive cross-agent telemetry & consensus findings
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                Consensus: {out.final_verdict.viabilityScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Idea Validator */}
              <div
                onClick={() => setActiveTab("idea_validation")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Brain className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">1. Idea Validator</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Fit: {out.idea_validation.fitScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    {out.idea_validation.problemUrgency}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">{out.idea_validation.targetPersona}</span>
                  <span className="text-blue-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 2. Market Research */}
              <div
                onClick={() => setActiveTab("market_research")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Search className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">2. Market Research</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      TAM: {out.market_research.tam}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] mb-2">
                    <span className="text-zinc-400">SAM: <strong className="text-zinc-200">{out.market_research.sam}</strong></span>
                    <span className="text-zinc-400">CAGR: <strong className="text-emerald-400">{out.market_research.cagr}</strong></span>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">SOM: {out.market_research.som}</span>
                  <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 3. Competitor Analyst */}
              <div
                onClick={() => setActiveTab("competitor_analysis")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-violet-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">3. Competitor Analyst</span>
                    </div>
                    <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                      3 Defensible Moats
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    {out.competitor_analysis.differentiation}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">Rivals: {out.competitor_analysis.directRivals[0]}</span>
                  <span className="text-violet-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 4. Business Model */}
              <div
                onClick={() => setActiveTab("business_model")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">4. Business Model</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                      {out.business_model.pricingTiers[0]?.price || "SaaS"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    {out.business_model.monetization}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">{out.business_model.unitEconomics}</span>
                  <span className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 5. Financial Analyst */}
              <div
                onClick={() => setActiveTab("financial_analysis")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">5. Financial Analyst</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {out.financial_analysis.grossMargin}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    Payback: {out.financial_analysis.cacPayback} • Break-even: {out.financial_analysis.breakEven}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">{out.financial_analysis.runwayRecommendation}</span>
                  <span className="text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 6. MVP Planner */}
              <div
                onClick={() => setActiveTab("mvp_plan")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-amber-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Rocket className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">6. MVP Planner</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      4-Week Sprint
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    P0: {out.mvp_plan.p0Features.slice(0, 2).join(", ")}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">{out.mvp_plan.timeline[0]?.goal}</span>
                  <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 7. GTM Specialist */}
              <div
                onClick={() => setActiveTab("gtm_strategy")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.03] border border-white/[0.07] hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">7. GTM Specialist</span>
                    </div>
                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      Viral Flywheel
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    {out.gtm_strategy.flywheel}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[170px]">Channel: {out.gtm_strategy.channels[0]}</span>
                  <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* 8. Final Verdict */}
              <div
                onClick={() => setActiveTab("final_verdict")}
                className="group relative p-4 rounded-2xl bg-gradient-to-b from-rose-950/40 via-purple-950/20 to-white/[0.02] hover:from-rose-900/50 hover:to-white/[0.04] border border-rose-500/30 hover:border-rose-500/60 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md backdrop-blur-xl hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">8. Final Verdict</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/30">
                      {out.final_verdict.viabilityScore} / 100
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-2">
                    {out.final_verdict.verdictTitle}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="text-emerald-400 font-medium truncate max-w-[170px]">Venture Ready Consensus</span>
                  <span className="text-rose-400 font-medium group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            3. CHROMATIC AURORA PILL BAR (Interactive Agent Switcher)
            ───────────────────────────────────────────────────────────── */}
        <section className="space-y-3.5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs sm:text-sm font-bold tracking-wider text-zinc-300 uppercase">
                Autonomous Agent Orchestration Graph
              </h2>
            </div>

            {/* Glowing search/filter pill resembling reference image */}
            <div className="relative flex items-center">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-cyan-500/30 blur-sm pointer-events-none" />
              <div className="relative flex items-center bg-[#131220]/90 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
                <Search className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                <input
                  type="text"
                  placeholder="Filter agent models..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none w-36 sm:w-44"
                />
              </div>
            </div>
          </div>

          {/* Agent Tabs Carousel / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {filteredAgents.map((agent, index) => {
              const isCurrent = activeTab === agent.key;
              const Icon = agent.icon;

              return (
                <button
                  key={agent.key}
                  type="button"
                  onClick={() => setActiveTab(agent.key)}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[105px] overflow-hidden group backdrop-blur-xl ${
                    isCurrent
                      ? "bg-gradient-to-b from-[#1f1d38] to-[#121124] border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40 scale-[1.02]"
                      : "bg-white/[0.025] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/[0.15]"
                  }`}
                >
                  {/* Neon top rim highlight on active */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeTabRim"
                      className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                    />
                  )}

                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                        isCurrent
                          ? "bg-purple-500/25 border-purple-400/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                          : "bg-white/[0.04] border-white/[0.08] text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400">
                        0{index + 1}
                      </span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? "text-purple-400" : "text-emerald-400/80"}`} />
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3
                      className={`text-xs font-semibold truncate ${
                        isCurrent ? "text-white" : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {agent.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">
                      {agent.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. ACTIVE AGENT DEEP-DIVE CARD (Glassmorphic Container)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#131222]/90 via-[#0e101b]/95 to-[#0b0c14] border border-white/[0.09] shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden print:hidden">
          {/* Card Ambient Top Accent */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          {/* Card Top Title Bar */}
          <div className="px-6 py-4.5 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-[1px] shadow-md`}>
                <div className="w-full h-full rounded-2xl bg-[#1b1933] border border-white/10 flex items-center justify-center">
                  <CurrentIcon className={`w-5 h-5 ${currentAgent.accentText}`} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {currentAgent.name} Output & Reasoning
                  </h2>
                  <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                    {currentAgent.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {currentAgent.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified by LangGraph Orchestration Engine
              </span>
            </div>
          </div>

          {/* Dynamic Content Panel */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* 1. IDEA VALIDATION */}
              {activeTab === "idea_validation" && (
                <motion.div
                  key="idea_validation"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-zinc-400 font-medium">Problem-Solution Fit</span>
                      <p className="text-2xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        {out.idea_validation.fitScore} / 100
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-zinc-400 font-medium">Pain Point Intensity</span>
                      <p className="text-sm font-semibold text-white">
                        {out.idea_validation.painPointIntensity}
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-zinc-400 font-medium">Target Persona</span>
                      <p className="text-sm font-semibold text-white truncate">
                        {out.idea_validation.targetPersona}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      Problem Urgency Diagnosis
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl leading-relaxed backdrop-blur-md">
                      {out.idea_validation.problemUrgency}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Validated Core Assumptions & Evidence
                    </h3>
                    <div className="space-y-2.5">
                      {out.idea_validation.coreAssumptions.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all backdrop-blur-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-zinc-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. MARKET RESEARCH */}
              {activeTab === "market_research" && (
                <motion.div
                  key="market_research"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-blue-500/[0.06] border border-blue-500/25 space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-blue-300 font-medium">TAM (Total Addressable)</span>
                      <p className="text-2xl font-extrabold text-white">{out.market_research.tam}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/25 space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-indigo-300 font-medium">SAM (Serviceable)</span>
                      <p className="text-2xl font-extrabold text-white">{out.market_research.sam}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-violet-500/[0.06] border border-violet-500/25 space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-violet-300 font-medium">SOM (Obtainable)</span>
                      <p className="text-2xl font-extrabold text-white">{out.market_research.som}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-emerald-300 font-medium">Market Growth CAGR</span>
                      <p className="text-2xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        {out.market_research.cagr}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3.5 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Sector Tailwinds & Key Drivers
                      </h3>
                      <ul className="space-y-2.5">
                        {out.market_research.tailwinds.map((t, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3.5 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        Emerging Global Trends
                      </h3>
                      <ul className="space-y-2.5">
                        {out.market_research.trends.map((t, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. COMPETITOR ANALYSIS */}
              {activeTab === "competitor_analysis" && (
                <motion.div
                  key="competitor_analysis"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-transparent border border-violet-500/30 space-y-2 backdrop-blur-md">
                    <h3 className="text-sm font-bold text-white">Competitive Differentiation Vector</h3>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {out.competitor_analysis.differentiation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3 backdrop-blur-md">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> Direct Competitors
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-300">
                        {out.competitor_analysis.directRivals.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3 backdrop-blur-md">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" /> Indirect Substitutes
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-300">
                        {out.competitor_analysis.indirectRivals.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3 backdrop-blur-md">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Defensible Moats
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-300">
                        {out.competitor_analysis.moats.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. BUSINESS MODEL */}
              {activeTab === "business_model" && (
                <motion.div
                  key="business_model"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md">
                    <span className="text-xs text-zinc-400 font-medium">Monetization Engine</span>
                    <p className="text-base font-bold text-white mt-1">
                      {out.business_model.monetization}
                    </p>
                    <p className="text-xs font-semibold text-emerald-400 mt-1">
                      {out.business_model.unitEconomics}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {out.business_model.pricingTiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/50 transition-all flex flex-col justify-between backdrop-blur-md group hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">{tier.tier}</h4>
                          <div className="text-2xl font-extrabold text-blue-400 my-2.5">
                            {tier.price}
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{tier.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 5. FINANCIAL ANALYSIS */}
              {activeTab === "financial_analysis" && (
                <motion.div
                  key="financial_analysis"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-zinc-400">Gross Margin Target</span>
                      <p className="text-2xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                        {out.financial_analysis.grossMargin}
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-zinc-400">CAC Payback Timeline</span>
                      <p className="text-2xl font-extrabold text-white">{out.financial_analysis.cacPayback}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 backdrop-blur-md">
                      <span className="text-xs text-zinc-400">Break-even Milestone</span>
                      <p className="text-2xl font-extrabold text-blue-400">{out.financial_analysis.breakEven}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-2.5 backdrop-blur-md">
                    <h3 className="text-sm font-bold text-white">Capital & Runway Recommendation</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {out.financial_analysis.runwayRecommendation}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Estimated Operating Burn: <span className="text-zinc-200 font-semibold">{out.financial_analysis.monthlyBurnEstimate}</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 6. MVP PLANNER */}
              {activeTab === "mvp_plan" && (
                <motion.div
                  key="mvp_plan"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white">Core P0 Feature Scope</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {out.mvp_plan.p0Features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] flex items-center gap-3 backdrop-blur-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs sm:text-sm text-zinc-200">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white">4-Week Build Sprint Timeline</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                      {out.mvp_plan.timeline.map((sprint, idx) => (
                        <div
                          key={idx}
                          className="p-4.5 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-2 backdrop-blur-sm"
                        >
                          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                            {sprint.week}
                          </span>
                          <p className="text-xs text-zinc-300 leading-snug">{sprint.goal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 7. GTM STRATEGY */}
              {activeTab === "gtm_strategy" && (
                <motion.div
                  key="gtm_strategy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-transparent border border-cyan-500/30 space-y-2 backdrop-blur-md">
                    <h3 className="text-sm font-bold text-white">Growth & Distribution Flywheel</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {out.gtm_strategy.flywheel}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3.5 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-white">Core Acquisition Channels</h3>
                      <ul className="space-y-2.5">
                        {out.gtm_strategy.channels.map((ch, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5">
                            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3.5 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-white">First 100 Customers Execution Plan</h3>
                      <ul className="space-y-2.5">
                        {out.gtm_strategy.first100Customers.map((step, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 8. FINAL VERDICT & INVESTMENT MEMO */}
              {activeTab === "final_verdict" && (
                <motion.div
                  key="final_verdict"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Viability Index Header */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-pink-900/20 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/40 flex flex-col items-center justify-center shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <span className="text-2xl font-extrabold text-white">
                          {out.final_verdict.viabilityScore}
                        </span>
                        <span className="text-[10px] text-purple-300 font-semibold">/ 100</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            Venture Ready
                          </span>
                          <span className="text-xs text-zinc-400">8-Agent Consensus Engine</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                          {out.final_verdict.verdictTitle}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      Executive Investment Memo
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-200 bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl leading-relaxed backdrop-blur-md">
                      {out.final_verdict.executiveSummary}
                    </p>
                  </div>

                  {/* Strengths & Risks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-3 backdrop-blur-md">
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Core Defensible Strengths
                      </div>
                      <ul className="space-y-2.5">
                        {out.final_verdict.keyStrengths.map((item, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 space-y-3 backdrop-blur-md">
                      <div className="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Risk Vectors & Mitigations
                      </div>
                      <ul className="space-y-2.5">
                        {out.final_verdict.criticalRisks.map((item, idx) => (
                          <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2">
                            <span className="text-rose-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Immediate Next Actions */}
                  <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3 backdrop-blur-md">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-violet-400" />
                      Immediate 30-Day Execution Milestones
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {out.final_verdict.immediateActions.map((action, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300"
                        >
                          <span className="text-purple-400 font-bold block mb-1">Milestone 0{idx + 1}</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. PUBLICATION-GRADE PRINTABLE PDF DOCUMENT (Print View Only)
            ───────────────────────────────────────────────────────────── */}
        <div className="hidden print:block space-y-6 text-black bg-white p-6 font-sans">
          {/* PDF Document Header */}
          <div className="border-b-2 border-zinc-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <span>Ideon Autonomous AI Multi-Agent Report</span>
              </div>
              <h1 className="text-3xl font-extrabold text-black mt-1">{project.name}</h1>
              <p className="text-sm text-zinc-600 mt-1 max-w-xl">{project.description}</p>
            </div>
            <div className="text-right border-l-2 border-zinc-200 pl-4">
              <div className="text-3xl font-black text-blue-600">
                {out.final_verdict.viabilityScore}<span className="text-sm font-normal text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold uppercase text-emerald-700 mt-0.5">
                Venture Ready Score
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Sector: {project.industry || project.category || "Technology"}
              </div>
            </div>
          </div>

          {/* Section: Executive Summary & Investment Thesis */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <h2 className="text-base font-bold text-black uppercase tracking-wider mb-1.5 flex items-center gap-2">
              Executive Summary & Investment Verdict
            </h2>
            <p className="text-xs text-zinc-800 leading-relaxed font-medium">
              {out.final_verdict.executiveSummary}
            </p>
          </div>

          {/* Section: All 8 Agents Summary Matrix Table in PDF */}
          <div>
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2.5 border-b border-zinc-300 pb-1">
              Autonomous 8-Agent Synthesis Matrix
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Agent 1 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-blue-900">1. Idea Validator</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Fit: {out.idea_validation.fitScore}/100</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">{out.idea_validation.problemUrgency}</p>
                <div className="text-[10px] text-zinc-500 mt-1">Persona: {out.idea_validation.targetPersona}</div>
              </div>

              {/* Agent 2 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-indigo-900">2. Market Research</span>
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded">TAM: {out.market_research.tam}</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">SAM: {out.market_research.sam} • SOM: {out.market_research.som} • Growth: {out.market_research.cagr}</p>
                <div className="text-[10px] text-zinc-500 mt-1">Trend: {out.market_research.tailwinds[0]}</div>
              </div>

              {/* Agent 3 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-purple-900">3. Competitor Analyst</span>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">Moats Verified</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">{out.competitor_analysis.differentiation}</p>
                <div className="text-[10px] text-zinc-500 mt-1">Direct: {out.competitor_analysis.directRivals.join(", ")}</div>
              </div>

              {/* Agent 4 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-violet-900">4. Business Model</span>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">{out.business_model.pricingTiers[0]?.price}</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">{out.business_model.monetization}</p>
                <div className="text-[10px] text-zinc-500 mt-1">{out.business_model.unitEconomics}</div>
              </div>

              {/* Agent 5 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-emerald-900">5. Financial Analyst</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">{out.financial_analysis.grossMargin}</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">Payback: {out.financial_analysis.cacPayback} • Break-even: {out.financial_analysis.breakEven}</p>
                <div className="text-[10px] text-zinc-500 mt-1">{out.financial_analysis.runwayRecommendation}</div>
              </div>

              {/* Agent 6 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-amber-900">6. MVP Planner</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">4 Weeks</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">P0 Scope: {out.mvp_plan.p0Features.join("; ")}</p>
                <div className="text-[10px] text-zinc-500 mt-1">Sprint 1: {out.mvp_plan.timeline[0]?.goal}</div>
              </div>

              {/* Agent 7 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-cyan-900">7. GTM Specialist</span>
                  <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-1.5 py-0.5 rounded">Growth Engine</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">{out.gtm_strategy.flywheel}</p>
                <div className="text-[10px] text-zinc-500 mt-1">Channels: {out.gtm_strategy.channels.slice(0, 2).join(", ")}</div>
              </div>

              {/* Agent 8 Summary */}
              <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-rose-900">8. Final Verdict</span>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">Score: {out.final_verdict.viabilityScore}/100</span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">{out.final_verdict.verdictTitle}</p>
                <div className="text-[10px] text-zinc-500 mt-1">3 Key Milestones Ready</div>
              </div>
            </div>
          </div>

          {/* Section: Strengths, Risks & Next Milestones */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 border border-emerald-200 bg-emerald-50/40 rounded-lg">
              <h3 className="text-xs font-bold text-emerald-900 uppercase mb-1.5">Key Defensible Strengths</h3>
              <ul className="text-[11px] text-zinc-800 space-y-1">
                {out.final_verdict.keyStrengths.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 border border-rose-200 bg-rose-50/40 rounded-lg">
              <h3 className="text-xs font-bold text-rose-900 uppercase mb-1.5">Critical Risks & Mitigations</h3>
              <ul className="text-[11px] text-zinc-800 space-y-1">
                {out.final_verdict.criticalRisks.map((item, idx) => (
                  <li key={idx}>⚠ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Immediate Next Milestones */}
          <div className="p-3 border border-zinc-300 rounded-lg bg-zinc-50">
            <h3 className="text-xs font-bold text-zinc-900 uppercase mb-1.5">Immediate 30-Day Execution Milestones</h3>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-800">
              {out.final_verdict.immediateActions.map((action, idx) => (
                <div key={idx} className="p-2 border border-zinc-200 rounded bg-white">
                  <span className="font-bold text-blue-700 block mb-0.5">Milestone 0{idx + 1}</span>
                  {action}
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer */}
          <div className="border-t border-zinc-300 pt-3 flex justify-between items-center text-[10px] text-zinc-500">
            <span>Generated by Ideon AI Multi-Agent Autonomous Orchestration Pipeline</span>
            <span>Confidential Startup Investment Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}
