"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export interface AgentWorkflowOutput {
  idea_validation: {
    is_valid: boolean;
    strengths: string[];
    weaknesses: string[];
    score: number;
  };
  market_research: {
    target_audience: string[];
    market_size: string;
    key_trends: string[];
    opportunities: string[];
  };
  competitor_analysis: {
    direct_competitors: string[];
    indirect_competitors: string[];
    competitive_advantage: string;
    barriers_to_entry: string[];
  };
  business_model: {
    revenue_streams: string[];
    pricing_strategy: string;
    cost_structure: string[];
    key_partners: string[];
  };
  financial_analysis: {
    startup_costs: string;
    burn_rate_estimate: string;
    revenue_projections: string;
    break_even_timeline: string;
  };
  mvp_plan: {
    core_features: string[];
    tech_stack_recommendation: string[];
    development_timeline: string;
    success_metrics: string[];
  };
  gtm_strategy: {
    launch_channels: string[];
    marketing_tactics: string[];
    customer_acquisition_cost_estimate: string;
    early_adopter_profile: string;
  };
  final_verdict: {
    overall_score: number;
    executive_summary: string;
    go_no_go_decision: boolean;
    top_3_risks: string[];
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
interface ProjectModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  startups: StartupProject[];
  addStartup: (startup: StartupProject) => void;
  getStartup: (id: string | number) => StartupProject | undefined;
}

const ProjectModalContext = createContext<ProjectModalContextType | undefined>(undefined);

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startups, setStartups] = useState<StartupProject[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    async function fetchStartupsData() {
      try {
        const data = await fetchApi("/startups");
        const enriched = await Promise.all(
          data.map(async (s: Record<string, unknown>) => {
            let status: StartupProject["status"] = "Draft";
            let progress = 0;
            let viabilityScore = undefined;
            let agentOutputs = undefined;

            try {
              const analysis = await fetchApi(`/startups/${s.id}/analysis`);
              if (analysis) {
                progress = analysis.progress_percentage || 0;
                if (analysis.status === "COMPLETED") {
                  status = "Validating";
                  agentOutputs = analysis.final_state_snapshot;
                  viabilityScore = agentOutputs?.final_verdict?.viabilityScore || agentOutputs?.final_verdict?.overall_score || undefined;
                } else if (analysis.status === "IN_PROGRESS") {
                  status = "Validating";
                } else if (analysis.status === "PENDING") {
                  status = "Validating";
                }
              }
            } catch (e) {
              // No analysis yet
            }

            const accents = ["violet", "emerald", "amber", "blue"];
            const nameStr = (s.name as string) || "";
            const randomAccent = accents[nameStr.length % accents.length] as "violet" | "emerald" | "amber" | "blue";

            return {
              id: String(s.id),
              name: nameStr,
              description: String(s.description || ""),
              industry: s.industry ? String(s.industry) : undefined,
              target_market: s.target_market ? String(s.target_market) : undefined,
              additional_info: s.additional_info ? String(s.additional_info) : undefined,
              status,
              lastEdited: new Date(s.updated_at as string).toLocaleDateString(),
              progress,
              category: s.industry ? String(s.industry) : "General",
              accent: randomAccent,
              viabilityScore,
              agentOutputs,
            };
          })
        );
        if (isMounted) {
          setStartups(enriched);
        }
      } catch (e) {
        console.error("Error loading startups", e);
      }
    }

    if (user) {
      fetchStartupsData();
    } else {
      setTimeout(() => {
        if (isMounted) setStartups([]);
      }, 0);
    }
    
    return () => {
      isMounted = false;
    };
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
