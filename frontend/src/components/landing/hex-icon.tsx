export function HexIcon({ className = "w-4 h-4", color = "#eab308" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" />
    </svg>
  );
}

export function IdeonLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-12 h-12" };
  return (
    <div className={`${sizes[size]} relative flex items-center justify-center`}>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.15))",
          boxShadow: "0 0 20px rgba(139,92,246,0.25)",
        }}
      />
      <svg viewBox="0 0 40 40" className="relative w-full h-full">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill="url(#logoGrad)" opacity="0.9" />
        <polygon points="20,10 28,15 28,25 20,30 12,25 12,15" fill="#0a0a0a" opacity="0.6" />
        <polygon points="20,14 24,17 24,23 20,26 16,23 16,17" fill="url(#logoGrad)" />
      </svg>
    </div>
  );
}
