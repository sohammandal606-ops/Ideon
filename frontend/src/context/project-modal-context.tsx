"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AgentWorkflowOutput {
  idea_validation: {
    fitScore: number;
    problemUrgency: string;
    targetPersona: string;
    painPointIntensity: string;
    coreAssumptions: string[];
  };
  market_research: {
    tam: string;
    sam: string;
    som: string;
    cagr: string;
    tailwinds: string[];
    trends: string[];
  };
  competitor_analysis: {
    directRivals: string[];
    indirectRivals: string[];
    moats: string[];
    differentiation: string;
  };
  business_model: {
    monetization: string;
    pricingTiers: { tier: string; price: string; description: string }[];
    unitEconomics: string;
  };
  financial_analysis: {
    grossMargin: string;
    cacPayback: string;
    breakEven: string;
    monthlyBurnEstimate: string;
    runwayRecommendation: string;
  };
  mvp_plan: {
    p0Features: string[];
    techStack: string[];
    timeline: { week: string; goal: string }[];
  };
  gtm_strategy: {
    channels: string[];
    flywheel: string;
    first100Customers: string[];
  };
  final_verdict: {
    viabilityScore: number;
    verdictTitle: string;
    executiveSummary: string;
    keyStrengths: string[];
    criticalRisks: string[];
    immediateActions: string[];
  };
}

export interface StartupProject {
  id: string | number;
  name: string;
  description: string;
  industry?: string | null;
  target_market?: string | null;
  additional_info?: string | null;
  status: "Validating" | "Building" | "Draft" | "Scale";
  lastEdited: string;
  progress: number;
  category: string;
  accent: "violet" | "emerald" | "amber" | "blue";
  viabilityScore?: number;
  agentOutputs?: AgentWorkflowOutput;
}

export function generateMockAgentOutput(
  name: string,
  description: string,
  industry?: string | null,
  targetMarket?: string | null,
  additionalInfo?: string | null
): AgentWorkflowOutput {
  const ind = industry || "B2B SaaS";
  const market = targetMarket || "Mid-market & High-Growth Companies";
  const viabilityScore = Math.floor(Math.random() * 10) + 84; // 84-93

  return {
    idea_validation: {
      fitScore: 88,
      problemUrgency: "High. Current industry workflows suffer from acute manual friction and legacy software fragmentation.",
      targetPersona: market,
      painPointIntensity: "9.1/10 Severity — direct daily operational bottleneck.",
      coreAssumptions: [
        "Buyers prioritize automated intelligent synthesis over manual spreadsheet configurations.",
        "Mid-market teams are willing to consolidate point solutions into a dedicated platform.",
        "Time-to-value within 7 days is critical for trial-to-paid conversion.",
      ],
    },
    market_research: {
      tam: "$5.8 Billion",
      sam: "$1.4 Billion",
      som: "$280 Million (3-5 Year Target)",
      cagr: "19.4% Annual Growth",
      tailwinds: [
        `Accelerating automation adoption in ${ind}`,
        "Shift towards integrated AI-agent copilot workspaces",
        "Regulatory pressure for transparent compliance and auditability",
      ],
      trends: [
        "Democratization of specialized multi-agent systems",
        "Demand for instant API-first integrations",
      ],
    },
    competitor_analysis: {
      directRivals: [
        "Legacy enterprise suites (high complexity, 6-month deployment cycles)",
        "Niche single-feature tools (fragmented, lack end-to-end agentic workflow)",
      ],
      indirectRivals: [
        "In-house spreadsheet / Zapier glue logic",
        "Generalist AI chatbots lacking proprietary domain grounding",
      ],
      moats: [
        "Proprietary multi-agent reasoning graph",
        "High workflow switching costs through synthesized knowledge graphs",
        "Data network effects from continuous benchmarking telemetry",
      ],
      differentiation:
        "10x faster deployment, automated 8-agent reasoning loop, and actionable executive synthesis without manual configuration.",
    },
    business_model: {
      monetization: "Tiered B2B SaaS Subscription with usage-based expansion tiers",
      pricingTiers: [
        {
          tier: "Starter",
          price: "$49 / mo",
          description: "Essential validation workflows for solo founders and pre-seed projects.",
        },
        {
          tier: "Growth",
          price: "$199 / mo",
          description: "Full multi-agent analysis suite, unlimited telemetry runs, and PDF memo generation.",
        },
        {
          tier: "Scale / Enterprise",
          price: "$599+ / mo",
          description: "Dedicated webhook integrations, private LLM fine-tuning, and priority agent execution.",
        },
      ],
      unitEconomics: "Target LTV/CAC > 3.8x with estimated 82% gross margins.",
    },
    financial_analysis: {
      grossMargin: "82% SaaS Gross Margin",
      cacPayback: "5.4 Months Estimated",
      breakEven: "14 Months at 220 Active Pro Subscribers",
      monthlyBurnEstimate: "$12,500 / month (Pre-scale infrastructure & API token overhead)",
      runwayRecommendation: "$250k Pre-Seed provides 18 months of runway to reach $50k MRR.",
    },
    mvp_plan: {
      p0Features: [
        "Core Input & Workspace Ingestion Engine",
        "Automated 8-Agent Pipeline Orchestration Worker",
        "Interactive Synthesis Dashboard & Visual Reasoning Graphs",
        "One-Click Executive PDF & Pitch Teardown Generator",
      ],
      techStack: [
        "Next.js 16 (React 19, TypeScript, TailwindCSS v4)",
        "FastAPI Backend with SQLModel / PostgreSQL",
        "LangGraph Multi-Agent StateGraph with Mistral AI / Tavily Search",
      ],
      timeline: [
        { week: "Week 1", goal: "Database schema, auth integration & core input models" },
        { week: "Week 2", goal: "LangGraph 8-agent state machine and reasoning prompt tuning" },
        { week: "Week 3", goal: "Live telemetry dashboard, scorecards & PDF export engine" },
        { week: "Week 4", goal: "End-to-end alpha testing, beta user onboarding & analytics" },
      ],
    },
    gtm_strategy: {
      channels: [
        "Founder & Decision-Maker Outbound on LinkedIn",
        "High-Intent Technical Teardown Content & SEO",
        "Product Hunt & Tech Community Launch Flywheel",
        "Targeted Incubator & Accelerator Partnerships",
      ],
      flywheel:
        "Free instant idea validation teaser -> Viral shareable viability score -> Upgrade to full 8-agent blueprint.",
      first100Customers: [
        "Conduct 30 discovery interviews with active founders",
        "Offer 60-day concierge onboarding to early design partners",
        "Publish comparative industry teardowns on Substack & X",
      ],
    },
    final_verdict: {
      viabilityScore,
      verdictTitle: "High Potential & Strong Venture-Scale Feasibility",
      executiveSummary: `"${name}" addresses a well-defined acute pain point within ${ind}. The proposed solution is positioned to capitalize on strong tailwinds in the ${market} sector. With a 4-week MVP development timeline and disciplined outbound GTM execution, the business demonstrates robust unit economics and defensibility.`,
      keyStrengths: [
        "High-urgency problem with verified willingness-to-pay",
        `Substantial $5.8B addressable market with 19.4% annual CAGR`,
        "Lean technical architecture enabling sub-30 day MVP validation",
      ],
      criticalRisks: [
        "Competitive noise from generalist incumbents requiring sharp positioning",
        "Need for frictionless onboarding to maintain high activation velocity",
      ],
      immediateActions: [
        "Deploy the 4-week MVP core workflow sprint",
        "Interview 15 target buyers to pre-sell annual founding pilot packages",
        "Finalize integration telemetry for the LangGraph agent layer",
      ],
    },
  };
}

import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface ProjectModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  startups: StartupProject[];
  addStartup: (startup: StartupProject) => void;
  getStartup: (id: string | number) => StartupProject | undefined;
  refreshStartups: () => Promise<void>;
  loading: boolean;
}

const ProjectModalContext = createContext<ProjectModalContextType | undefined>(undefined);

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startups, setStartups] = useState<StartupProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshStartups = async () => {
    if (!user) {
      setStartups([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await api.startups.list();
      // Assume the backend returns an array of startups matching (or close to) StartupProject
      // We might need to map it if the backend format differs slightly, but for now we'll set it.
      // We'll also attach mock agentOutputs if missing, or use the analysis endpoint later.
      const formatted = data.map((item: any) => ({
        ...item,
        // Map backend fields to frontend fields if necessary
        category: item.industry || "General",
        accent: "violet",
        progress: 100,
        status: "Validating",
        lastEdited: "just now",
      }));
      setStartups(formatted);
    } catch (err) {
      console.error("Failed to fetch startups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStartups();
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addStartup = (newStartup: StartupProject) => {
    setStartups((prev) => [newStartup, ...prev.filter((s) => String(s.id) !== String(newStartup.id))]);
  };

  const getStartup = (id: string | number) => {
    return startups.find((s) => String(s.id) === String(id));
  };

  return (
    <ProjectModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        startups,
        addStartup,
        getStartup,
        refreshStartups,
        loading,
      }}
    >
      {children}
    </ProjectModalContext.Provider>
  );
}

export function useProjectModal() {
  const context = useContext(ProjectModalContext);
  if (!context) {
    throw new Error("useProjectModal must be used within a ProjectModalProvider");
  }
  return context;
}
