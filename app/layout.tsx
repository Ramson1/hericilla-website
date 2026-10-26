import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { RecoveryRedirect } from "@/components/site/RecoveryRedirect";
import { company } from "@/lib/company";
import { siteUrl } from "@/lib/db";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Logistics, Trucking & Supply Chain in Nigeria`,
    template: `%s | ${company.name}`,
  },
  description: company.tagline,
  openGraph: {
    title: company.name,
    description: company.tagline,
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-surface text-ink antialiased">
        <RecoveryRedirect />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
