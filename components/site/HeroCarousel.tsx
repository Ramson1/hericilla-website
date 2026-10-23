"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { company } from "@/lib/company";

const DURATION = 6500;

/** Hero photography is oil & gas only — every scene is real industry, no household or generic freight shots.
 *  Served from Unsplash (free to use, no attribution required — credited anyway).
 *  Swap these src values for the company's own site and fleet photos in /public/hero when available.
 *  Headline copy rides with the slide: title/subtitle fall back to the page_content values when omitted. */
const slides = [
  {
    src: "https://images.unsplash.com/photo-1528458538087-f58e9ad895da?auto=format&fit=crop&w=1920&q=80",
    alt: "Tanker truck on an open road hauling product",
    label: "Trucking & Haulage",
    title: "Bulk and hazardous haulage, on schedule.",
    subtitle:
      "Tanker and flatbed movements for operators across the Niger Delta and beyond — sealed, documented and tracked on every trip.",
    href: "/services/trucking",
    credit: "ALE SAT",
  },
  {
    src: "https://images.unsplash.com/photo-1726731782158-fcf6822b6ca4?auto=format&fit=crop&w=1920&q=80",
    alt: "Refinery process pipework and towers on site",
    label: "Procurement & Contract Management",
    title: "Sourcing what the field actually demands.",
    subtitle:
      "Pipes, valves, fittings and consumables procured, vetted and delivered to specification — with full traceability from vendor to site.",
    href: "/services/procurement",
    credit: "Christian Harb",
  },
  {
    src: "https://images.unsplash.com/photo-1780622558479-12ef1162515d?auto=format&fit=crop&w=1920&q=80",
    alt: "Industrial storage tanks at a fuel and chemical terminal",
    label: "Transportation & Distribution",
    title: "Depot to field, without broken custody.",
    subtitle:
      "Scheduled distribution from tank farms and warehouses, with chain-of-custody records and proof of delivery on every load.",
    href: "/services/transportation",
    credit: "Sebastian Schuster",
  },
  {
    src: "https://images.unsplash.com/photo-1690508313456-bf8c851e8319?auto=format&fit=crop&w=1920&q=80",
    alt: "Offshore oil and gas platform at sea",
    label: "Materials & Logistics Support",
    title: "Materials that reach the rig on time.",
    subtitle:
      "Port clearance, marine coordination and last-mile delivery that keep offshore and onshore programmes moving without stalls.",
    href: "/services/materials-support",
    credit: "Gabriel Xavier",
  },
  {
    src: "https://images.unsplash.com/photo-1788377563485-92b5c6196fbd?auto=format&fit=crop&w=1920&q=80",
    alt: "Industrial flare stack burning at an oil and gas facility",
    label: "Oil & Gas Support",
    title: "Field-ready support for energy operations.",
    subtitle:
      "Integrated logistics, procurement and supply-chain services built around the demands of the Nigerian oil & gas industry.",
    href: "/services/oil-gas",
    credit: "Ghostinmirror",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function HeroCarousel({ title, subtitle }: { title: string; subtitle: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onVis = () => setOffscreen(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (paused || offscreen || reduced) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, offscreen, reduced]);

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current;
    const end = e.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start == null || end == null) return;
    if (Math.abs(end - start) > 48) go(end < start ? 1 : -1);
  };

  const active = slides[index];

  return (
    <section
      data-hero
      aria-roledescription="carousel"
      aria-label={`What we do — ${slides.length} scenes from our operations`}
      className="relative isolate overflow-hidden bg-brand-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* photographic backdrop layers */}
      <div className="absolute inset-0 bg-brand-950">
        {slides.map((s, i) => (
          <div
            key={s.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`object-cover ${i === index && !reduced ? "hero-kb" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* scrims for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/92 via-brand-950/72 to-brand-900/35" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-brand-950/90 to-transparent" />

      {/* Top padding clears the floating nav pill, which now overlays the photo */}
      <div className="relative mx-auto max-w-6xl px-4 pb-44 pt-[100px] md:pb-52 md:pt-[120px] lg:pb-44">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/15">
          RC {company.rc} · Port Harcourt, Nigeria
        </p>
        {/* Headline copy rides with the slide — swaps in on every transition */}
        <div key={`copy-${index}`} className="hero-swap min-h-[23rem] md:min-h-[18rem]">
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            {active.title ?? title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-brand-100">
            {active.subtitle ?? subtitle}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-400">{active.label}</span>
            <Link
              href={active.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-100 underline underline-offset-4 hover:text-white"
            >
              Learn about {active.label.split(" &")[0]} <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-xs text-brand-200/60">· Photo: {active.credit}, Unsplash</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-accent-500 px-8 py-4 text-xl font-bold text-brand-950 shadow-lg hover:bg-accent-400"
          >
            Request a Quote <ArrowRight className="h-6 w-6" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] border-2 border-white/40 px-8 py-4 text-xl font-semibold hover:bg-white/10"
          >
            Explore services
          </Link>
        </div>
      </div>

      {/* controls + indicator, bottom right */}
      <div className="absolute bottom-5 right-4 z-10 md:bottom-7 md:right-7">
        <div className="flex flex-col items-end gap-3 rounded-2xl bg-brand-950/70 p-3 shadow-[0_10px_30px_rgba(3,15,24,0.45)] ring-1 ring-white/15 backdrop-blur">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose a scene">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Scene ${i + 1}: ${s.label}`}
                onClick={() => setIndex(i)}
                className="group relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                style={{ width: i === index ? 46 : 22 }}
              >
                {i === index && (
                  <span
                    key={`${index}-${paused || offscreen}`}
                    className={`absolute inset-0 origin-left rounded-full bg-accent-400 ${
                      paused || offscreen || reduced ? "" : "hero-fill"
                    }`}
                    style={{ animationDuration: `${DURATION}ms` }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous scene"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 transition hover:bg-white/22 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <p className="min-w-[74px] text-center font-bold tabular-nums" aria-live="polite">
              <span className="text-2xl text-accent-400">{pad(index + 1)}</span>
              <span className="text-base text-brand-100/70"> / {pad(slides.length)}</span>
            </p>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next scene"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 transition hover:bg-white/22 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
