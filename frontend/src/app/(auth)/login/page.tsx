"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="glass-surface p-8 md:p-10 flex flex-col items-center glow-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-[15px] text-zinc-500 mt-2">
            Log in to continue to Ideon.
          </p>
        </div>

        <form
          className="w-full flex flex-col gap-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-zinc-400 text-[13px] font-medium"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-11 rounded-lg bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-zinc-400 text-[13px] font-medium"
              >
                Password
              </Label>
              <Link
                href="#"
                className="text-[13px] font-medium text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              className="h-11 rounded-lg bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/30 transition-all"
            />
          </div>

          <Button className="w-full h-11 mt-2 text-[15px] font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-[0_0_20px_-6px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.6)]">
            Log in
          </Button>
        </form>

        <div className="w-full mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-white/[0.06] flex-1" />
          <span className="text-[13px] text-zinc-600 font-medium">
            or continue with
          </span>
          <div className="h-px bg-white/[0.06] flex-1" />
        </div>

        <div className="w-full mt-6">
          <Button
            variant="outline"
            className="w-full h-11 rounded-lg border-white/[0.08] text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] transition-all"
          >
            Continue with Google
          </Button>
        </div>
      </div>

      <p className="text-center text-[14px] text-zinc-600 mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-zinc-300 hover:text-white transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
