import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col relative overflow-hidden font-sans select-none">
      {/* Ambient background blue glow on left and right sides */}
      <div
        className="absolute top-1/2 -left-[20%] -translate-y-1/2 w-[600px] h-[700px] pointer-events-none rounded-full blur-[140px] opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.45) 0%, rgba(29, 78, 216, 0.15) 60%, transparent 80%)",
        }}
      />
      <div
        className="absolute top-1/2 -right-[20%] -translate-y-1/2 w-[600px] h-[700px] pointer-events-none rounded-full blur-[140px] opacity-35"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, rgba(30, 64, 175, 0.1) 60%, transparent 80%)",
        }}
      />
      {/* Central aura behind the card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none rounded-full blur-[120px] opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(30, 64, 175, 0.3) 0%, rgba(15, 23, 42, 0.5) 70%, transparent 90%)",
        }}
      />

      {/* Minimal Top Header */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-zinc-300 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-105">
            <span className="text-[#080b11] font-bold text-[13px] tracking-tight">Id</span>
          </div>
          <span className="font-semibold text-[18px] tracking-tight text-white/90 group-hover:text-white transition-colors">
            Ideon
          </span>
        </Link>
      </header>

      {/* Auth Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
