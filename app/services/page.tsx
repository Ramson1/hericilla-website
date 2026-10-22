import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@hericilla/ui";
import { services } from "@/lib/company";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Trucking, transportation, procurement & contracts, packing & removal, materials & logistics support and oil & gas support services in Port Harcourt and across Nigeria.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <PageHeader
        title="Services"
        purpose="Everything Hericilla does for operators, servicing companies and contractors — one partner, six capabilities."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-pop)]"
          >
            <h2 className="flex items-center justify-between text-2xl font-bold text-brand-900">
              {s.name}
              <ArrowRight className="h-7 w-7 text-brand-500 transition group-hover:translate-x-1" />
            </h2>
            <p className="mt-3 text-lg text-ink-soft">{s.summary}</p>
            <ul className="mt-4 space-y-1 text-ink-soft">
              {s.points.slice(0, 2).map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-success-600">✓</span> {p}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
