"use client";

import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { UsersSection } from "@/components/landing/users-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div
        className="absolute pointer-events-none inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 60%, rgba(99,102,241,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.03) 0%, transparent 40%)
          `,
        }}
      />

      <div className="z-10 flex flex-col min-h-screen relative">
        <LandingNavbar />

        <main className="flex-1">
          <HeroSection />
          <UsersSection />
          <WorkflowSection />
          <TestimonialsSection />
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
