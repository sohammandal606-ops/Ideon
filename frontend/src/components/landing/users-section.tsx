"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HexIcon } from "./hex-icon";

const USER_PROFILES = [
  {
    id: "sarah",
    name: "Sarah Chen",
    handle: "@sarah.builds",
    role: "First-time Founder & Product Designer",
    tools: ["Idea Validation", "MVP Plan", "Market Research"],
    avatar: "SC",
    avatarGradient: "from-violet-500/30 to-indigo-600/20",
    stack: { top: "0%", x: "-6%", scale: 0.94, z: 10 },
  },
  {
    id: "marcus",
    name: "Marcus Rivera",
    handle: "@marcus.ceo",
    role: "Serial Entrepreneur & SaaS Builder",
    tools: ["Financial Analysis", "GTM Strategy", "Competitor Intel"],
    avatar: "MR",
    avatarGradient: "from-indigo-500/35 to-violet-600/25",
    featured: true,
    stack: { top: "28%", x: "0%", scale: 1, z: 30 },
  },
  {
    id: "priya",
    name: "Priya Patel",
    handle: "@priya.vc",
    role: "Angel Investor & Startup Advisor",
    tools: ["Final Verdict", "Risk Analysis", "Evidence Tracking"],
    avatar: "PP",
    avatarGradient: "from-purple-500/30 to-fuchsia-600/20",
    stack: { top: "52%", x: "5%", scale: 0.94, z: 20 },
  },
];

function ProfileCard({
  profile,
  isHovered,
  isFeatured,
  onHover,
  onLeave,
}: {
  profile: (typeof USER_PROFILES)[0];
  isHovered: boolean;
  isFeatured: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const active = isHovered || (isFeatured && !isHovered);

  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{
        scale: isHovered ? 1.03 : profile.stack.scale,
        y: isHovered ? -6 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute left-0 right-0 mx-auto w-full max-w-[400px] cursor-default"
      style={{
        top: profile.stack.top,
        transform: `translateX(${profile.stack.x})`,
        zIndex: isHovered ? 50 : profile.stack.z,
      }}
    >
      {/* Featured glow behind card */}
      {isFeatured && (
        <div
          className="absolute -inset-4 rounded-3xl pointer-events-none transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.12) 40%, transparent 70%)",
            opacity: active ? 1 : 0.6,
            filter: "blur(20px)",
          }}
        />
      )}

      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          active
            ? "border border-white/[0.14] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.1)]"
            : "border border-white/[0.07] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
        }`}
        style={{
          background: active
            ? "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Top shine */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)",
          }}
        />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            {/* Avatar with gradient ring */}
            <div className="relative shrink-0">
              <div
                className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${profile.avatarGradient} opacity-80`}
              />
              <div className="relative w-[52px] h-[52px] rounded-full bg-[#141414] border border-white/[0.08] flex items-center justify-center">
                <span className="text-[15px] font-semibold text-zinc-200 tracking-tight">
                  {profile.avatar}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[16px] font-semibold text-white tracking-tight leading-tight">
                {profile.name}
              </p>
              <p className="text-[13px] text-zinc-500 mt-0.5">{profile.handle}</p>
              <p className="text-[13px] text-zinc-400 mt-1 leading-snug">{profile.role}</p>
            </div>
          </div>

          {/* Tool pills */}
          <div className="flex flex-wrap gap-2">
            {profile.tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full text-[11.5px] font-medium text-zinc-300 border border-white/[0.07] transition-colors duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function UsersSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="features" className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          top: "20%",
          right: "5%",
          width: "500px",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-5">
              <HexIcon className="w-3.5 h-3.5" />
              <span className="text-[12px] text-zinc-400 font-medium tracking-wide">Our Users</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-[44px] font-semibold tracking-[-0.035em] leading-[1.12] mb-5">
              Built for Every
              <br />
              Modern Founder
            </h2>

            <p className="text-[14px] sm:text-[15px] text-zinc-500 leading-[1.8] max-w-[420px] mb-8">
              Ideon integrates seamlessly into your startup-building workflow. Whether you&apos;re
              validating your first idea or scaling your third venture, our AI agents adapt to your
              stage and deliver evidence-backed insights.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  { initials: "SC", color: "bg-violet-900/80" },
                  { initials: "MR", color: "bg-indigo-900/80" },
                  { initials: "PP", color: "bg-purple-900/80" },
                  { initials: "JK", color: "bg-zinc-800" },
                  { initials: "AL", color: "bg-zinc-800" },
                ].map((user, i) => (
                  <div
                    key={user.initials}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#0a0a0a] ${user.color} flex items-center justify-center text-[10px] font-semibold text-zinc-300`}
                    style={{ zIndex: 5 - i }}
                  >
                    {user.initials}
                  </div>
                ))}
              </div>
              <div className="h-4 w-px bg-white/[0.08]" />
              <span className="text-[13px] sm:text-[14px] font-semibold text-amber-400/90">10,000+ Founders</span>
            </div>
          </motion.div>

          {/* Right — Profile Cards */}
          {/* Mobile/tablet: flat stacked list */}
          <div className="md:hidden flex flex-col gap-4">
            {USER_PROFILES.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br ${profile.avatarGradient} opacity-80`} />
                      <div className="relative w-12 h-12 rounded-full bg-[#141414] border border-white/[0.08] flex items-center justify-center">
                        <span className="text-[14px] font-semibold text-zinc-200">{profile.avatar}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-white tracking-tight">{profile.name}</p>
                      <p className="text-[12px] text-zinc-500 mt-0.5">{profile.handle}</p>
                      <p className="text-[12px] text-zinc-400 mt-0.5 leading-snug">{profile.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-zinc-300 border border-white/[0.07] bg-white/[0.04]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: animated stacked cards */}
          <div className="hidden md:block relative h-[520px] lg:h-[580px]">
            <div
              className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {USER_PROFILES.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: profile.stack.scale }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12, type: "spring", stiffness: 100 }}
                className="absolute inset-0"
              >
                <ProfileCard
                  profile={profile}
                  isHovered={hoveredId === profile.id}
                  isFeatured={!!profile.featured}
                  onHover={() => setHoveredId(profile.id)}
                  onLeave={() => setHoveredId(null)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
