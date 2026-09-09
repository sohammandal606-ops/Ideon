"use client";

import { Search, PanelLeft, PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";

export function DashboardHeader() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#12141a] border-b border-white/[0.06] sticky top-0 z-40 select-none gap-4">
      {/* Sidebar Toggle Button & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4 text-zinc-300" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-zinc-300" />
          )}
        </button>

        <div className="relative w-full flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-14 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl text-[13.5px] text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <kbd className="absolute right-3 pointer-events-none text-[11px] font-mono text-zinc-400 border border-white/[0.08] rounded-md px-1.5 py-0.5 bg-white/[0.03]">
            ⌘ + F
          </kbd>
        </div>
      </div>
    </header>
  );
}
