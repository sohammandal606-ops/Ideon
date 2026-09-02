"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Target },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-[#12141a] border-r border-white/[0.06] text-zinc-300 select-none shrink-0 h-screen transition-all duration-300 ease-in-out relative z-30",
        isCollapsed ? "w-[72px]" : "w-[250px]"
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-white/[0.04] transition-all",
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 group overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-transform group-hover:scale-105 shrink-0">
            <svg
              className="w-4.5 h-4.5 text-[#12141a]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[17px] tracking-tight text-white group-hover:text-zinc-100 transition-colors truncate">
              Ideon
            </span>
          )}
        </Link>

        {/* Fold / Unfold Toggle Button */}
        {!isCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Fold sidebar"
            aria-label="Fold sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* When Collapsed: Quick Expand Button */}
      {isCollapsed && (
        <div className="pt-2 px-2 flex justify-center">
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className={cn("flex-1 py-4 overflow-y-auto space-y-1.5", isCollapsed ? "px-2" : "px-3.5")}>
        {!isCollapsed && (
          <div className="mb-3 px-3">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Workspace
            </p>
          </div>
        )}

        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.name === "Overview" && pathname === "/dashboard");

          return (
            <div key={item.name} className="relative group/nav">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl text-[13.5px] font-medium transition-all duration-200 relative",
                  isCollapsed
                    ? "justify-center w-11 h-11 mx-auto"
                    : "gap-3 px-3.5 py-2.5",
                  isActive
                    ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.06]"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-500 rounded-full" />
                )}
                {isActive && isCollapsed && (
                  <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-500 rounded-full" />
                )}

                <item.icon
                  className={cn(
                    "w-4 h-4 transition-colors shrink-0",
                    isActive ? "text-white" : "text-zinc-400 group-hover/nav:text-zinc-200"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>

              {/* Tooltip on Collapsed Hover */}
              {isCollapsed && (
                <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#1d212c] text-white text-[12px] font-medium whitespace-nowrap shadow-xl border border-white/[0.1] opacity-0 pointer-events-none group-hover/nav:opacity-100 transition-opacity z-50">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile & Sign Out Footer */}
      <div
        className={cn(
          "border-t border-white/[0.06] bg-[#0f1116]/60 transition-all",
          isCollapsed ? "p-2.5 flex flex-col items-center gap-2" : "p-4 space-y-3"
        )}
      >
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3 px-1")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-[12px] font-semibold text-white">FE</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate leading-tight">
                Franklin Eugene
              </p>
              <p className="text-[11px] text-zinc-400 truncate">
                eug.frank01@ideon.ai
              </p>
            </div>
          )}
        </div>

        {/* Sign Out */}
        {!isCollapsed ? (
          <Link
            href="/login"
            className="flex items-center gap-2 px-1 text-[12.5px] font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-white/[0.04] transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </aside>
  );
}
