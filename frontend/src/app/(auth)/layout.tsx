import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background — dot grid */}
      <div className="absolute inset-0 dot-grid-bg opacity-30 pointer-events-none" />

      {/* Gradient glow orb */}
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.10) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)",
        }}
      />

      {/* Minimal Navbar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-[#0a0a0a] font-bold text-[13px]">Id</span>
          </div>
          <span className="font-semibold text-[18px] tracking-tight text-white">
            Ideon
          </span>
        </Link>
      </div>

      {/* Auth Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-24">
        {children}
      </div>
    </div>
  );
}
