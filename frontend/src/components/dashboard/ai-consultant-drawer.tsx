"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  FileText,
  AlertCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { fetchApi } from "@/lib/api";

interface Citation {
  section: string;
  title: string;
  preview: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: string;
}

interface AIConsultantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  startupId: string;
  startupName: string;
  viabilityScore?: number;
}

const STARTER_QUESTIONS = [
  "Why is my defensibility score low and how do I fix it?",
  "What are the biggest fatal risks identified in my verdict?",
  "How can I acquire my first 100 customers with my MVP?",
  "What pricing strategy and revenue streams make the most sense?",
];

export function AIConsultantDrawer({
  isOpen,
  onClose,
  startupId,
  startupName,
  viabilityScore,
}: AIConsultantDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your **IDEON AI Consultant**. I have reviewed the full analysis dossier for **${startupName}** (including your market research, competitor landscape, business model, and final verdict).\n\nAsk me anything about your score, why certain risks were flagged, or how to build stronger moats and defensibility.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build conversation history excluding initial welcome
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetchApi(`/startups/${startupId}/chat`, {
        method: "POST",
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.reply || "I analyzed your dossier but could not form a response.",
        citations: res.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ Failed to get advice: ${err.message || "Something went wrong"}. If you just created this project, please make sure the AI analysis has completed first.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReindex = async () => {
    try {
      setIsReindexing(true);
      await fetchApi(`/startups/${startupId}/chat/reindex`, { method: "POST" });
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 3000);
    } catch (e) {
      console.error("Reindex error:", e);
    } finally {
      setIsReindexing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[540px] z-50 bg-[#0e101a] border-l border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-zinc-100"
          >
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none -z-10" />

            {/* Top Navigation Bar */}
            <div className="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-purple-500/20">
                  <div className="w-full h-full rounded-xl bg-[#121324] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold tracking-tight text-white">
                      AI Startup Consultant
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      RAG Grounded
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate max-w-[260px]">
                    Advising on {startupName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReindex}
                  disabled={isReindexing}
                  title="Sync vector knowledge base with latest analysis"
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isReindexing ? "animate-spin text-purple-400" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {reindexSuccess && (
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 text-[11px] text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Knowledge vector base synchronized with analysis reports!</span>
              </div>
            )}

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-purple-300" />
                      </div>
                    )}

                    <div className={`max-w-[85%] space-y-2`}>
                      <div
                        className={`rounded-2xl px-4 py-3 leading-relaxed ${
                          isUser
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs shadow-md shadow-purple-600/20"
                            : "bg-white/[0.04] border border-white/[0.08] text-zinc-200 rounded-bl-xs shadow-sm backdrop-blur-sm"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>

                      {/* Grounded Citations (RAG evidence) */}
                      {!isUser && m.citations && m.citations.length > 0 && (
                        <div className="pt-1 space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1 font-semibold">
                            <FileText className="w-3 h-3 text-purple-400" /> Grounded in Analysis
                            Dossier ({m.citations.length} sections):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.citations.map((c, idx) => {
                              const isExp = expandedCitation === `${m.id}-${idx}`;
                              return (
                                <div key={idx} className="flex flex-col">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedCitation(isExp ? null : `${m.id}-${idx}`)
                                    }
                                    className="px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-[10px] font-medium text-purple-300 flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <span>{c.title}</span>
                                    <ChevronRight
                                      className={`w-3 h-3 transition-transform ${
                                        isExp ? "rotate-90 text-white" : "text-zinc-400"
                                      }`}
                                    />
                                  </button>
                                  {isExp && (
                                    <div className="mt-1 p-2 rounded-lg bg-black/40 border border-purple-500/20 text-[11px] text-zinc-300 max-w-sm leading-snug">
                                      {c.preview}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div
                        className={`text-[9px] text-zinc-400 font-mono ${
                          isUser ? "text-right" : "text-left"
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                    <Bot className="w-3.5 h-3.5 text-purple-300" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-bl-xs px-4 py-3 text-zinc-400 flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                    <span className="text-xs">Searching analysis vector embeddings & formulating advice...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Suggestions */}
            {messages.length <= 2 && (
              <div className="px-5 py-2 border-t border-white/[0.05] bg-black/20 shrink-0">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Suggested Questions:
                </span>
                <div className="flex flex-col gap-1.5">
                  {STARTER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="text-left px-3 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-[11px] text-zinc-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate">{q}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0c0e17] shrink-0">
              <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-purple-500/50 focus-within:bg-white/[0.05] transition-all flex flex-col p-2.5">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI consultant about moats, risks, CAC, or scores..."
                  rows={2}
                  className="w-full bg-transparent resize-none text-xs text-white placeholder-zinc-400 focus:outline-none leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Press <kbd className="px-1 py-0.5 rounded bg-white/[0.08] text-zinc-300">Enter</kbd> to send
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    <span>Ask Consultant</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
