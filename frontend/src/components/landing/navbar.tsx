"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { IdeonLogo } from "./hex-icon";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Company", href: "#company" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("product");

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Update scroll progress (0 - 100)
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentY / docHeight) * 100)));
      }

      // Background styling threshold
      setScrolled(currentY > 20);

      // Smart navbar hide on scroll down, show on scroll up
      if (currentY > 120 && currentY > lastY && !mobileOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = currentY;

      // Scrollspy active section detection
      const sections = ["product", "features", "workflow", "company"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        setActiveSection(targetId);
      }
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${
          hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Scroll Progress Bar */}
        <div className="w-full h-[2px] bg-white/[0.05] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <nav
          className={`flex items-center justify-between px-4 sm:px-6 md:px-10 py-3.5 md:py-4 transition-all duration-300 ${
            scrolled || mobileOpen
              ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/50"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <IdeonLogo size="sm" />
            <span className="font-semibold text-[17px] tracking-tight text-white group-hover:text-violet-300 transition-colors">
              Ideon
            </span>
          </Link>

          {/* Desktop nav links with active scrollspy indicator */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] font-medium tracking-[0.04em] text-zinc-400">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3 py-1 rounded-full transition-all duration-200 relative ${
                    isActive
                      ? "text-white bg-white/[0.08] shadow-sm"
                      : "hover:text-zinc-200 hover:bg-white/[0.03]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-block text-[13px] font-medium text-zinc-400 hover:text-white px-3 py-1.5 transition-colors">
              Sign In
            </Link>

            <Link href="/signup" className="hidden sm:block">
              <button className="h-9 px-5 text-[13px] font-medium rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 active:scale-95 transition-all duration-200">
                Get Started
              </button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center border border-white/[0.1] text-zinc-300 hover:text-white hover:bg-white/[0.05] active:scale-95 transition-all"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Slide-Down Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[59px] z-40 bg-[#0a0a0a]/98 backdrop-blur-2xl border-b border-white/[0.08] md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-5 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`flex items-center justify-between h-12 text-[15px] font-medium px-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-white bg-white/[0.08]"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                </a>
              );
            })}
            <div className="pt-4 pb-2 flex flex-col gap-2.5">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <button className="w-full h-11 text-[14px] font-medium rounded-xl border border-white/[0.12] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all">
                  Sign In
                </button>
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                <button className="w-full h-11 text-[14px] font-medium rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 active:scale-98 transition-all">
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
