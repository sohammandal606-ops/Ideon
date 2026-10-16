import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ideon.ai"),
  title: {
    default: "Ideon — Validate and Build Your Startup",
    template: "%s | Ideon",
  },
  description:
    "A structured workspace for founders. Turn your assumptions into data-backed plans, accelerating your journey from idea to execution.",
  keywords: [
    "startup validation",
    "business model planner",
    "financial modeling for founders",
    "market research AI",
    "go-to-market strategy",
    "pitch deck builder",
    "startup workspace",
  ],
  authors: [{ name: "Ideon Team" }],
  creator: "Ideon",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ideon",
    title: "Ideon — Validate and Build Your Startup",
    description:
      "A structured workspace for founders. Turn your assumptions into data-backed plans, accelerating your journey from idea to execution.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ideon — Validate and Build Your Startup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideon — Validate and Build Your Startup",
    description:
      "A structured workspace for founders. Turn your assumptions into data-backed plans, accelerating your journey from idea to execution.",
    images: ["/og-image.png"],
    creator: "@ideon_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

import { AuthProvider } from "@/context/auth-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Ideon",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description":
        "A structured workspace for founders to test assumptions, build financial models, and validate startup ideas into data-backed plans.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "Organization",
      "name": "Ideon",
      "url": "https://ideon.ai",
      "logo": "https://ideon.ai/favicon.ico",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#fafafa] overflow-x-hidden">
        <SmoothScrollProvider>
          <AuthProvider>{children}</AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

