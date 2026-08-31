"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <span className="font-semibold text-[18px] tracking-tight text-white">
          Ideon
        </span>
      </Link>

      {/* Center: Links */}
      <div className="hidden md:flex items-center gap-8 text-[14px] font-normal text-zinc-400">
        <Link
          href="/product"
          className="hover:text-white transition-colors duration-200"
        >
          Product
        </Link>
        <Link
          href="/features"
          className="hover:text-white transition-colors duration-200"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="hover:text-white transition-colors duration-200"
        >
          Pricing
        </Link>
        <Link
          href="/about"
          className="hover:text-white transition-colors duration-200"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:text-white transition-colors duration-200"
        >
          Contact
        </Link>
      </div>

      {/* Right Side — bordered pill CTA */}
      <Link href="/signup">
        <button className="h-9 px-5 text-[14px] font-medium rounded-full border border-white/[0.15] text-white bg-transparent hover:bg-white/[0.05] hover:border-white/[0.25] transition-all duration-200">
          Get Started
        </button>
      </Link>
    </nav>
  );
}
