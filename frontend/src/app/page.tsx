"use client";

import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">

      {/* ═══════════════════════════════════════════════
          BACKGROUND: 3 dramatic dark orbs with violet 
          edge glow — the signature visual element
          ═══════════════════════════════════════════════ */}

      {/* Center orb — largest, positioned behind hero */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #0d0d0d 0%, #080808 60%, #050505 100%)",
          boxShadow: `
            0 0 80px 15px rgba(139, 92, 246, 0.08),
            0 0 160px 40px rgba(139, 92, 246, 0.04),
            inset 0 0 60px 10px rgba(0, 0, 0, 0.8)
          `,
          border: "1px solid rgba(139, 92, 246, 0.08)",
        }}
      >
        {/* Luminescent edge ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(ellipse at 30% 10%, rgba(139, 92, 246, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 10%, rgba(167, 139, 250, 0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 90%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      {/* Left orb — partially hidden off-screen */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "18%",
          left: "-8%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #0d0d0d 0%, #080808 60%, #050505 100%)",
          boxShadow: `
            0 0 60px 10px rgba(139, 92, 246, 0.06),
            0 0 120px 30px rgba(139, 92, 246, 0.03),
            inset 0 0 50px 10px rgba(0, 0, 0, 0.8)
          `,
          border: "1px solid rgba(139, 92, 246, 0.06)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(ellipse at 70% 15%, rgba(139, 92, 246, 0.20) 0%, transparent 45%),
              radial-gradient(ellipse at 90% 50%, rgba(167, 139, 250, 0.10) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      {/* Right orb — partially hidden off-screen */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "15%",
          right: "-10%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #0d0d0d 0%, #080808 60%, #050505 100%)",
          boxShadow: `
            0 0 60px 10px rgba(139, 92, 246, 0.06),
            0 0 120px 30px rgba(139, 92, 246, 0.03),
            inset 0 0 50px 10px rgba(0, 0, 0, 0.8)
          `,
          border: "1px solid rgba(139, 92, 246, 0.06)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(ellipse at 30% 15%, rgba(139, 92, 246, 0.20) 0%, transparent 45%),
              radial-gradient(ellipse at 10% 50%, rgba(167, 139, 250, 0.10) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      {/* Subtle ambient glow between the orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1200px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════════
          CONTENT
          ═══════════════════════════════════════════════ */}

      <div className="z-10 flex flex-col min-h-screen relative">
        <Navbar />

        <main className="flex-1 flex flex-col">

          {/* ─── HERO SECTION ─── */}
          <section className="flex flex-col items-center text-center px-6 pt-40 md:pt-52 pb-20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-[800px] mx-auto flex flex-col items-center"
            >
              {/* Pill badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center px-5 py-2 rounded-full border border-white/[0.10] text-[13px] text-zinc-400 font-medium mb-10 tracking-wide">
                  AI-powered startup validation
                </div>
              </motion.div>

              {/* Heading — large, dramatic, minimal */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-[-0.035em] mb-7 leading-[1.05]"
              >
                The Command Center
                <br />
                for Your Startup
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-[17px] md:text-[19px] text-zinc-500 max-w-[520px] mb-10 font-normal leading-[1.7]"
              >
                Monitor, validate, and plan all your startup operations from one
                intelligent dashboard.
              </motion.p>

              {/* Single CTA — bordered pill button */}
              <motion.div variants={itemVariants}>
                <Link href="/signup">
                  <button className="h-12 px-8 text-[15px] font-medium rounded-full border border-white/[0.15] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/[0.25] transition-all duration-300 backdrop-blur-sm shadow-[0_0_30px_-8px_rgba(139,92,246,0.2)]">
                    Get Started
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* ─── SOCIAL PROOF: Stars + Testimonial ─── */}
          <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              {/* 5 Stars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-[15px] text-zinc-500 max-w-[480px] leading-relaxed">
                Validate and plan all your startup operations from one
                intelligent, data-driven workspace.
              </p>
            </motion.div>
          </section>

          {/* ─── LOGO STRIP: Trusted By ─── */}
          <section className="border-t border-white/[0.04] py-12 px-6 mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl mx-auto flex items-center justify-between gap-8 overflow-hidden"
            >
              {[
                "TechCrunch",
                "ProductHunt",
                "Y Combinator",
                "Sequoia",
                "Andreessen",
              ].map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 text-zinc-600 shrink-0"
                >
                  {/* Abstract logo mark */}
                  <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-zinc-500">
                      {name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold tracking-tight hidden sm:block">
                    {name}
                  </span>
                </div>
              ))}
            </motion.div>
          </section>

          {/* ─── FEATURES SECTION ─── */}
          <section className="px-6 py-24 relative z-20">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Everything you need to validate
                </h2>
                <p className="text-zinc-500 text-[17px] max-w-[480px] mx-auto">
                  From market research to financial planning, Ideon handles the
                  heavy lifting.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={containerVariants}
                className="grid md:grid-cols-3 gap-5"
              >
                {[
                  {
                    title: "Market Research",
                    description:
                      "Understand your audience and competitors before writing a single line of code.",
                    icon: "🔍",
                  },
                  {
                    title: "Structured Planning",
                    description:
                      "Your financial and go-to-market plan updates automatically as assumptions change.",
                    icon: "📐",
                  },
                  {
                    title: "Evidence Backed",
                    description:
                      "Every recommendation is grounded in real-world data and established frameworks.",
                    icon: "📊",
                  },
                ].map((card) => (
                  <motion.div
                    key={card.title}
                    variants={itemVariants}
                    className="glass-surface-interactive p-8 flex flex-col items-start text-left group"
                  >
                    <div className="text-2xl mb-5">{card.icon}</div>
                    <h3 className="text-[17px] font-semibold mb-3 text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-zinc-500 text-[15px] leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-white/[0.06] py-8 px-8 md:px-12">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[15px] text-white tracking-tight">
                Ideon
              </span>
              <span className="text-[13px] text-zinc-700">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[13px] text-zinc-600">
              <Link
                href="/privacy"
                className="hover:text-zinc-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-zinc-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-zinc-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
