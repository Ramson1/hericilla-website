"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { company } from "@/lib/company";

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const moreNav = [
  { href: "/blog", label: "Blog & News" },
  { href: "/careers", label: "Careers" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/why-us", label: "Why Choose Us" },
  { href: "/hseq", label: "HSEQ" },
];

const allNav = [...primaryNav, ...moreNav];

/** Gap between the viewport top and the floating pill — matches `top-3` / `mt-3`. */
const INSET = 12;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [dark, setDark] = useState(false);
  // The hero band lives on the home page only — seed from the route so the very first
  // paint already floats the pill instead of reserving a strip above the hero.
  const [overHero, setOverHero] = useState(pathname === "/");
  const [barH, setBarH] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Close every open menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  /* Measure the pill bar so it can be lifted out of the page flow over a hero
     section, letting the hero start at the very top of the document. */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Flip the pill to the dark brand skin once the hero has scrolled away.
     On pages without a hero, it flips as soon as the page moves at all. */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const pillBottom = INSET + (barH || 64);
    function evaluate() {
      if (hero) {
        // "Passed" once the hero's bottom edge has risen above the floating pill.
        setDark(hero.getBoundingClientRect().bottom < pillBottom);
      } else {
        setDark(window.scrollY > 24);
      }
    }
    setOverHero(!!hero);
    evaluate();
    let io: IntersectionObserver | null = null;
    if (hero && "IntersectionObserver" in window) {
      io = new IntersectionObserver(evaluate, { rootMargin: `-${pillBottom}px 0px 0px 0px`, threshold: 0 });
      io.observe(hero);
    }
    // Geometry is recomputed on scroll too, so the skin never stalls if the observer is starved.
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", evaluate);
    };
  }, [pathname, barH]);

  // Dismiss the desktop dropdown on outside click or Escape.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // One set of colours for the light pill, one for the dark brand pill.
  // Tighter padding below xl: a 75%-wide pill has to fit logo + 6 links + CTA.
  const linkClass = (href: string) =>
    `rounded-full px-2 py-2 text-[15px] font-medium transition-colors xl:px-3 ${
      dark
        ? isActive(href)
          ? "bg-white/20 text-white"
          : "text-brand-100 hover:bg-white/10 hover:text-white"
        : isActive(href)
          ? "bg-brand-50 text-brand-700"
          : "text-ink hover:bg-brand-50 hover:text-brand-800"
    }`;

  const moreClass = `flex items-center gap-1 rounded-full px-2 py-2 text-[15px] font-medium transition-colors xl:px-3 ${
    dark
      ? moreNav.some((n) => isActive(n.href))
        ? "bg-white/20 text-white"
        : "text-brand-100 hover:bg-white/10 hover:text-white"
      : moreNav.some((n) => isActive(n.href))
        ? "bg-brand-50 text-brand-700"
        : "text-ink hover:bg-brand-50 hover:text-brand-800"
  }`;

  const callClass = `inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
    dark
      ? "border-white/40 text-white hover:bg-white/10"
      : "border-brand-300 text-brand-800 hover:bg-brand-50"
  }`;

  const quoteClass = `rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
    dark ? "bg-accent-500 text-brand-950 hover:bg-accent-400" : "bg-brand-700 text-white hover:bg-brand-800"
  }`;

  // Fallback 60px = logo (40) + bar padding (py-2.5 = 20); the ResizeObserver value replaces it once measured.
  const lift = (barH || 60) + INSET;

  return (
    <div
      className="sticky top-3 z-40 mx-auto mt-3 w-[75%]"
      // Over a hero the pill floats above the photo instead of pushing the page down.
      style={overHero ? { marginBottom: -lift } : undefined}
    >
      <header
        className={`overflow-visible rounded-full transition-colors duration-300 ${
          dark
            ? "bg-brand-950/95 shadow-[0_10px_30px_rgba(6,25,38,0.35)] backdrop-blur"
            : "bg-white/95 shadow-sm ring-1 ring-line backdrop-blur"
        }`}
      >
        <div ref={barRef} className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Hericilla home">
            {/* White circular badge keeps the logo legible on both pill skins */}
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-line">
              {/* 32px mark sits clear of the disc edge: the logo art is portrait (taller than wide) */}
              <Image src="/logo.png" alt="Hericilla logo" width={32} height={32} className="h-8 w-8 object-contain" priority />
            </span>
            <span className="leading-tight">
              <span className={`block font-extrabold ${dark ? "text-white" : "text-brand-900"}`}>Hericilla</span>
              <span className={`hidden text-xs 2xl:block ${dark ? "text-brand-200" : "text-ink-soft"}`}>
                Support Services Ltd · RC {company.rc}
              </span>
            </span>
          </Link>

          {/* Desktop: five primary links + a "More" dropdown (from lg — a 75% pill cannot hold them sooner) */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {primaryNav.map((n) => (
              <Link key={n.href} href={n.href} className={linkClass(n.href)}>
                {n.label}
              </Link>
            ))}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-controls="more-menu"
                className={moreClass}
              >
                More
                <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <div
                  id="more-menu"
                  className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-pop"
                >
                  {moreNav.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      className={`mx-1 block rounded-xl px-3 py-2 text-[15px] font-medium transition-colors ${
                        isActive(n.href) ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-brand-50 hover:text-brand-800"
                      }`}
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`}
              className={`${callClass} hidden xl:inline-flex`}
            >
              <Phone className="h-4 w-4" /> Call us
            </a>
            <Link href="/quote" className={`hidden sm:inline-flex ${quoteClass}`}>
              Request a Quote
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={`inline-flex items-center justify-center rounded-full p-2 transition-colors lg:hidden ${
                dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-brand-50"
              }`}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel, dropped below the pill (out of the flow so the hero stays put) */}
        {mobileOpen && (
          <nav
            className={`absolute inset-x-0 top-full z-50 mt-1 max-h-[70vh] overflow-auto rounded-b-[1.75rem] border-t px-4 pb-4 pt-2 shadow-pop lg:hidden ${
              dark ? "border-white/15 bg-brand-950/95" : "border-line bg-white"
            }`}
            aria-label="Mobile"
          >
            <ul className="grid gap-1">
              {allNav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`block w-full text-left ${linkClass(n.href)}`}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`} className={callClass}>
                <Phone className="h-4 w-4" /> Call us
              </a>
              <Link href="/quote" className={`inline-flex items-center justify-center ${quoteClass}`}>
                Request a Quote
              </Link>
            </div>
          </nav>
        )}
      </header>
    </div>
  );
}
