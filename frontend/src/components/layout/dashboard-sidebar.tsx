"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Activity, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Target },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-[#0a0a0a]">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-[#0a0a0a] font-bold text-xs">Id</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">
            Ideon
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <div className="mb-4 px-3">
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">
            Workspace
          </p>
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-white/[0.06] text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-violet-500 rounded-full" />
              )}
              <item.icon
                className={cn(
                  "w-4 h-4",
                  isActive
                    ? "text-white"
                    : "text-zinc-600 group-hover:text-zinc-400"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="p-3 border-t border-white/[0.06]">
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all duration-200 group">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
            <Plus className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
          </div>
          New Project
        </button>
      </div>
    </div>
  );
}
