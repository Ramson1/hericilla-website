import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Card } from "@hericilla/ui";
import { whyUs, company, clientReferences } from "@/lib/company";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description:
    "Accountability built into every work order, oil & gas HSEQ discipline, one partner for six capabilities and transparent pricing.",
};

export default function WhyUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PageHeader
        title="Why clients keep our number"
        purpose="Four plain reasons operators in the Niger Delta choose Hericilla — and never quite go back to juggling multiple vendors."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {whyUs.map((w, i) => (
          <Card key={w.title} className="p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-xl font-extrabold text-white">
              {i + 1}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-brand-900">{w.title}</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{w.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-10 p-8">
        <h2 className="text-2xl font-bold text-brand-900">The numbers we hold ourselves to</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          {company.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold text-brand-700">{s.value}</p>
              <p className="mt-1 text-base font-semibold text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-lg text-ink-soft">
          Trusted by {clientReferences.slice(0, 3).join(", ")} and other operators —{" "}
          <Link href="/projects" className="font-semibold text-brand-700 underline">
            see project experience
          </Link>
          .
        </p>
      </Card>

      <div className="mt-10 text-center">
        <Link
          href="/quote"
          className="inline-flex rounded-[var(--radius-btn)] bg-accent-500 px-10 py-5 text-2xl font-bold text-white hover:bg-accent-600"
        >
          Request a quote — it takes 3 minutes
        </Link>
      </div>
    </div>
  );
}
