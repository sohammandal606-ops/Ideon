"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Pure frontend simulation without backend connection
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Floating Glassmorphic Card */}
      <div className="relative rounded-[32px] p-8 sm:p-12 bg-[#0c1017]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_50px_-10px_rgba(37,99,235,0.2)] overflow-hidden">
        {/* Subtle top edge highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 50%, transparent)",
          }}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
            Sign up
          </h1>
          <p className="text-[13px] sm:text-[14px] text-zinc-400 mt-3 leading-relaxed max-w-sm mx-auto font-normal">
            Create your account to start validating ideas, analyzing markets, and
            building your startup with specialized AI agents.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name input */}
          <div className="relative flex items-center">
            <User className="absolute left-5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full h-12 sm:h-13 pl-12 pr-5 rounded-full bg-[#070a10]/70 border border-white/[0.09] text-white text-[14px] placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Email input */}
          <div className="relative flex items-center">
            <Mail className="absolute left-5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full h-12 sm:h-13 pl-12 pr-5 rounded-full bg-[#070a10]/70 border border-white/[0.09] text-white text-[14px] placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Password input */}
          <div className="relative flex items-center">
            <Lock className="absolute left-5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full h-12 sm:h-13 pl-12 pr-12 rounded-full bg-[#070a10]/70 border border-white/[0.09] text-white text-[14px] placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-blue-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-blue-400/80" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-13 mt-2 rounded-full bg-[#181d28] hover:bg-[#202738] active:scale-[0.99] border border-white/[0.08] text-white text-[14px] sm:text-[15px] font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Google Signup */}
        <div className="mt-4">
          <button
            type="button"
            className="w-full h-12 sm:h-13 rounded-full bg-[#0d111a]/80 hover:bg-[#141a27] border border-white/[0.08] text-zinc-300 hover:text-white text-[14px] font-medium flex items-center justify-center gap-2.5 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.3)] active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer link */}
        <div className="text-center mt-6">
          <p className="text-[13px] sm:text-[14px] text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
