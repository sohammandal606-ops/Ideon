"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HexIcon } from "./hex-icon";

const TESTIMONIALS = [
  {
    name: "Alex Thompson",
    role: "Solo Founder",
    date: "January 15, 2025",
    quote:
      "Ideon's agent pipeline saved me weeks of research. The Idea Validator caught flaws in my assumptions before I wrote a single line of code.",
  },
  {
    name: "Mia Chen",
    role: "Product Manager",
    date: "February 3, 2025",
    quote:
      "The parallel market and competitor analysis gave me a complete picture in minutes. The Final Verdict helped me pitch to investors with real data.",
  },
  {
    name: "David Okonkwo",
    role: "Startup Advisor",
    date: "March 10, 2025",
    quote:
      "I recommend Ideon to every founder I mentor. The evidence tracking and structured outputs are exactly what early-stage teams need.",
  },
  {
    name: "Lisa Park",
    role: "Technical Co-founder",
    date: "April 22, 2025",
    quote:
      "The MVP Plan agent scoped our v1 perfectly. We went from idea to validated roadmap in one afternoon instead of three weeks of meetings.",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? TESTIMONIALS.length - 1 : a - 1));
  const next = () => setActive((a) => (a === TESTIMONIALS.length - 1 ? 0 : a + 1));

  return (
    <section id="product" className="px-4 md:px-8 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-5">
              Our Clients Say
            </h2>
            <p className="text-[15px] text-zinc-500 leading-[1.75] max-w-[400px] mb-8">
              Founders and advisors trust Ideon to turn raw ideas into structured, actionable
              startup strategies backed by real evidence.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.05] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-400" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.05] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-6">
                  &ldquo;{TESTIMONIALS[active].quote}&rdquo;
                </p>
                <p className="text-[15px] font-medium text-white">{TESTIMONIALS[active].name}</p>
                <p className="text-[13px] text-zinc-500">
                  {TESTIMONIALS[active].role} • {TESTIMONIALS[active].date}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Card carousel */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.button
              key={t.name}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`text-left glass-surface rounded-xl p-5 transition-all ${
                i === active
                  ? "border-white/[0.12] shadow-[0_0_40px_-8px_rgba(139,92,246,0.25)] scale-[1.02]"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <HexIcon className="w-3.5 h-3.5 mb-4 ml-auto" />
              <p className="text-[13px] font-semibold text-white">{t.name}</p>
              <p className="text-[11px] text-zinc-500 mb-3">
                {t.role} • {t.date}
              </p>
              <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-3">{t.quote}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
