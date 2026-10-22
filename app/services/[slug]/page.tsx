import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { services, company } from "@/lib/company";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s?.name ?? "Service", description: s?.summary };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Service</p>
      <h1 className="mt-2 text-4xl font-extrabold text-brand-950">{service.name}</h1>
      <p className="mt-4 text-xl leading-relaxed text-ink-soft">{service.summary}</p>

      <div className="mt-10 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <h2 className="text-2xl font-bold text-brand-900">What this includes</h2>
        <ul className="mt-4 space-y-3 text-lg">
          {service.points.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-800 font-bold">
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/quote"
          className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-brand-700 px-8 py-4 text-xl font-bold text-white hover:bg-brand-800"
        >
          Request a quote for this <ArrowRight className="h-6 w-6" />
        </Link>
        <a
          href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] border-2 border-brand-300 px-8 py-4 text-xl font-semibold text-brand-800 hover:bg-brand-50"
        >
          <Phone className="h-6 w-6" /> Talk to us
        </a>
      </div>

      <div className="mt-12 flex flex-wrap gap-6 text-brand-700">
        {services
          .filter((s) => s.slug !== slug)
          .slice(0, 3)
          .map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="underline font-semibold">
              Also: {s.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
