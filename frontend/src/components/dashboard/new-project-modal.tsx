"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Brain,
  Search,
  Target,
  Layers,
  DollarSign,
  Rocket,
  Zap,
  Award,
} from "lucide-react";
import {
  useProjectModal,
  StartupProject,
  generateMockAgentOutput,
} from "@/context/project-modal-context";

interface FormErrors {
  name?: string;
  description?: string;
}

const QUICK_INDUSTRIES = [
  "B2B SaaS",
  "AI & DevTools",
  "Fintech",
  "HealthTech",
  "CleanTech",
  "EdTech",
  "E-commerce",
  "Marketplace",
  "Cybersecurity",
];

export function NewProjectModal() {
  const router = useRouter();
  const { isModalOpen, closeModal, addStartup } = useProjectModal();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [targetMarket, setTargetMarket] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setDescription("");
      setIndustry("");
      setTargetMarket("");
      setAdditionalInfo("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isModalOpen]);

  // Validation
  const validateForm = (): boolean => {
    const errs: FormErrors = {};
    if (!name.trim()) {
      errs.name = "Project name is required (min 1 character)";
    } else if (name.trim().length > 100) {
      errs.name = "Project name cannot exceed 100 characters";
    }

    if (!description.trim()) {
      errs.description = "Description is required (minimum 10 characters)";
    } else if (description.trim().length < 10) {
      errs.description = `Description is too short (${description.trim().length}/10 chars minimum)`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Start AI Multi-Agent Analysis and redirect to dedicated page
  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const accents: Array<"violet" | "emerald" | "amber" | "blue"> = [
      "violet",
      "emerald",
      "amber",
      "blue",
    ];
    const assignedAccent = accents[Math.floor(Math.random() * accents.length)];
    const projectId = Date.now().toString();

    const agentOutputs = generateMockAgentOutput(
      name.trim(),
      description.trim(),
      industry.trim() || undefined,
      targetMarket.trim() || undefined,
      additionalInfo.trim() || undefined
    );

    const newProject: StartupProject = {
      id: projectId,
      name: name.trim(),
      description: description.trim(),
      industry: industry.trim() || "Technology",
      target_market: targetMarket.trim() || "Global Digital Enterprises",
      additional_info: additionalInfo.trim() || undefined,
      status: "Validating",
      lastEdited: "Just now",
      progress: 100,
      category: industry.trim() || "Technology",
      accent: assignedAccent,
      viabilityScore: agentOutputs.final_verdict.viabilityScore,
      agentOutputs,
    };

    addStartup(newProject);
    closeModal();

    // Redirect to the dedicated analysis and PDF generation page
    router.push(`/projects/${projectId}`);
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-[26px] bg-[#12141c] border border-white/[0.1] shadow-2xl overflow-hidden my-auto z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top subtle glow banner */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/[0.06] shrink-0 bg-[#12141c]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-[17px] sm:text-[18px] font-semibold text-white tracking-tight">
                  New Project Analysis
                </h2>
                <p className="text-[12.5px] text-zinc-400">
                  Fill in your startup idea to launch all 8 autonomous AI agents and generate a full PDF memo.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6 space-y-5">
            <form onSubmit={handleStartAnalysis} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13.5px] font-medium text-zinc-200 flex items-center gap-1.5">
                    Startup / Project Name <span className="text-blue-400">*</span>
                  </label>
                  <span className="text-[11.5px] text-zinc-400 font-mono">
                    {name.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="e.g. OmniFlow AI, NexaPay, CleanTrack"
                  maxLength={100}
                  className={`w-full h-11 px-4 rounded-xl bg-white/[0.04] border text-[14px] text-white placeholder:text-zinc-500 focus:outline-none transition-all ${
                    errors.name
                      ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                      : "border-white/[0.08] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
                {errors.name && (
                  <p className="text-[12px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13.5px] font-medium text-zinc-200 flex items-center gap-1.5">
                    Description / Core Problem <span className="text-blue-400">*</span>
                  </label>
                  <span className="text-[11.5px] text-zinc-400 font-mono">
                    {description.length} chars (min 10)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Describe the primary problem you are solving and your solution in 1-3 sentences..."
                  className={`w-full p-3.5 rounded-xl bg-white/[0.04] border text-[13.5px] text-white placeholder:text-zinc-500 focus:outline-none transition-all resize-none ${
                    errors.description
                      ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                      : "border-white/[0.08] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                  }`}
                />
                {errors.description && (
                  <p className="text-[12px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* 2-Column Grid: Industry & Target Market */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-[13.5px] font-medium text-zinc-200">
                    Industry / Sector <span className="text-zinc-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. B2B SaaS, Fintech, AI"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />

                  {/* Quick Selection Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {QUICK_INDUSTRIES.slice(0, 5).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setIndustry(item)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          industry === item
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-300"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Market */}
                <div className="space-y-2">
                  <label className="text-[13.5px] font-medium text-zinc-200">
                    Target Market / Audience <span className="text-zinc-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    placeholder="e.g. Mid-market CTOs, Freelancers"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                  <p className="text-[11.5px] text-zinc-400">
                    Ideal customer profile (ICP)
                  </p>
                </div>
              </div>

              {/* Additional Info / Describe your idea in detail */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13.5px] font-medium text-zinc-200">
                    Detailed Idea & Additional Context <span className="text-zinc-400 text-xs">(Optional)</span>
                  </label>
                  <span className="text-[11.5px] text-zinc-400">
                    Describe your full vision
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Describe your full idea in detail: target audience pain points, proposed monetization model, competitors, unique advantages, or specific questions for the agents..."
                  className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                />
              </div>

              {/* Submit / Start Analysis Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-medium text-[14.5px] flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.99] cursor-pointer group disabled:opacity-50"
                >
                  <Sparkles className="w-4.5 h-4.5 text-blue-200 group-hover:rotate-12 transition-transform" />
                  <span>Start AI Analysis & Open Workflow</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-center text-[11.5px] text-zinc-400 mt-2.5">
                  Redirects to the full 8-agent analysis page with one-click PDF memo download.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
