import Link from "next/link";

export function LandingFooter() {
  return (
    <footer id="company" className="relative border-t border-white/[0.06]">
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {/* CTA Column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
              Stay Focused,
              <br />
              Stay Ahead
            </h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed mb-6 max-w-[200px]">
              Turn your startup idea into a validated strategy with AI agents that work for you.
            </p>
            <Link href="/signup">
              <button className="h-10 px-6 text-[13px] font-medium rounded-full border border-white/[0.15] text-white hover:bg-white/[0.05] hover:border-white/[0.25] transition-all">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              <li>
                <a href="mailto:hello@ideon.ai" className="hover:text-zinc-300 transition-colors">
                  hello@ideon.ai
                </a>
              </li>
              <li>San Francisco, CA</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              {["About Us", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-zinc-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              {["Features", "Pricing", "Integrations", "Security"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="hover:text-zinc-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[13px] font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-500">
              {["Help Center", "Guides", "Community", "API Docs"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-zinc-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-zinc-600">
            © {new Date().getFullYear()} Ideon. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-zinc-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
