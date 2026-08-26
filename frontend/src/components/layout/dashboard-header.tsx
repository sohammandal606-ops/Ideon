"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 flex items-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full pl-9 pr-12 h-8 bg-white/[0.03] border-white/[0.06] rounded-lg text-[13px] text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/30 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[11px] font-mono text-zinc-600 border border-white/[0.08] rounded px-1.5 py-0.5 bg-white/[0.03]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-zinc-600 hover:text-zinc-300 transition-colors duration-200 rounded-lg hover:bg-white/[0.03]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-7 w-7 rounded-lg cursor-pointer border border-white/[0.08] hover:border-white/[0.15] transition-colors">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="rounded-lg bg-violet-500/10 text-violet-400 text-xs">
                ID
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-1 rounded-xl bg-[#141414] border-white/[0.08]"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  Steve Jobs
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  steve@apple.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem className="text-zinc-400 hover:text-white focus:text-white focus:bg-white/[0.06]">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-zinc-400 hover:text-white focus:text-white focus:bg-white/[0.06]">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-zinc-400 hover:text-white focus:text-white focus:bg-white/[0.06]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
