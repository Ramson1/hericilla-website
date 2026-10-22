import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { company } from "@/lib/company";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog & News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Hericilla home">
            <Image src="/logo.png" alt="Hericilla logo" width={44} height={44} className="rounded-lg" priority />
            <span className="leading-tight">
              <span className="block font-extrabold text-brand-900 text-lg">Hericilla</span>
              <span className="block text-xs text-ink-soft">Support Services Ltd · RC {company.rc}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 rounded-lg text-lg font-medium text-ink hover:bg-brand-50 hover:text-brand-800"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`}
              className="hidden sm:inline-flex items-center gap-2 rounded-[var(--radius-btn)] border-2 border-brand-300 px-4 py-2 font-semibold text-brand-800 hover:bg-brand-50"
            >
              <Phone className="h-5 w-5" /> Call us
            </a>
            <Link
              href="/quote"
              className="inline-flex items-center rounded-[var(--radius-btn)] bg-brand-700 px-5 py-2.5 text-lg font-semibold text-white hover:bg-brand-800 shadow-sm"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        {/* Small screens: horizontal scrollable nav keeps every destination one tap away */}
        <nav className="lg:hidden -mx-1 mb-2 flex gap-1 overflow-x-auto pb-1" aria-label="Mobile">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-lg bg-surface px-4 py-2.5 text-lg font-medium text-ink hover:bg-brand-50"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
