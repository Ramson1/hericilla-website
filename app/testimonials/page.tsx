import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { PageHeader, Card, EmptyState } from "@hericilla/ui";
import { getTestimonials } from "@/lib/db";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients say about working with Hericilla Support Services — trucking, procurement and relocations in Nigeria.",
};

export default async function TestimonialsPage() {
  const items = await getTestimonials();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PageHeader
        title="What our clients say"
        purpose="Approved words from the companies that trust us with their cargo, contracts and move-days."
      />

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No testimonials published yet" teach="As our clients share feedback on completed jobs, we publish the approved ones here." />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <Card key={t.id} className="flex flex-col p-8">
              <div className="flex gap-1" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink">“{t.quote}”</blockquote>
              <footer className="mt-5">
                <p className="text-xl font-bold text-brand-900">{t.client_name}</p>
                {t.company && <p className="text-base text-ink-soft">{t.company}</p>}
              </footer>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <p className="text-lg text-ink-soft">Want to be part of this page?</p>
        <Link
          href="/quote"
          className="mt-3 inline-flex rounded-[var(--radius-btn)] bg-brand-700 px-8 py-4 text-xl font-bold text-white hover:bg-brand-800"
        >
          Work with us first
        </Link>
      </div>
    </div>
  );
}
