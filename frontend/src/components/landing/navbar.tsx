"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { IdeonLogo } from "./hex-icon";
import { Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const links = [
    { label: "Product", href: "#product" },
    { label: "Workflow", href: "#workflow" },
    { label: "Features", href: "#features" },
    { label: "Company", href: "#company" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3.5 md:py-4 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <IdeonLogo size="sm" />
          <span className="font-semibold text-[17px] tracking-tight text-white">
            Ideon
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-medium tracking-[0.06em] text-zinc-400 uppercase">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-200 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <Link href="/signup" className="hidden sm:block">
            <button className="h-9 px-5 text-[13px] font-medium rounded-full border border-white/[0.15] text-white bg-transparent hover:bg-white/[0.05] hover:border-white/[0.25] transition-all duration-200">
              Get Started
            </button>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[57px] z-40 bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/[0.06] md:hidden">
          <div className="flex flex-col px-5 py-4 space-y-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center h-12 text-[15px] font-medium text-zinc-300 hover:text-white border-b border-white/[0.04] last:border-0 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 pb-1">
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                <button className="w-full h-11 text-[14px] font-medium rounded-xl border border-white/[0.15] text-white hover:bg-white/[0.06] transition-all">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
