import Link from "next/link";
import { Truck, Package, Ship, Building2, Boxes, Flame, ArrowRight, Star } from "lucide-react";
import { services, clientReferences, company } from "@/lib/company";
import { getPosts, getTestimonials, getPageContent } from "@/lib/db";
import { BigButton } from "@hericilla/ui";

export const revalidate = 60;

const icons: Record<string, React.ReactNode> = {
  trucking: <Truck className="h-8 w-8" />,
  transportation: <Building2 className="h-8 w-8" />,
  procurement: <Package className="h-8 w-8" />,
  "packing-removal": <Boxes className="h-8 w-8" />,
  "materials-support": <Ship className="h-8 w-8" />,
  "oil-gas": <Flame className="h-8 w-8" />,
};

export default async function HomePage() {
  const [posts, testimonials, heroTitle, heroSubtitle] = await Promise.all([
    getPosts(3),
    getTestimonials(),
    getPageContent("home.hero_title", "Moving cargo. Sourcing equipment. Supporting Nigeria's energy sector."),
    getPageContent(
      "home.hero_subtitle",
      "Hericilla Support Services Limited delivers integrated logistics, procurement and supply-chain solutions to the Nigerian oil & gas industry — documented, accountable and on time.",
    ),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
            RC {company.rc} · Port Harcourt, Nigeria
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-brand-100">{heroSubtitle}</p>
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
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-10 max-w-6xl px-4">
        <dl className="grid grid-cols-2 gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] md:grid-cols-4">
          {company.stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-extrabold text-brand-800">{s.value}</dd>
              <dd className="mt-1 text-ink-soft">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-extrabold text-brand-950">What we do</h2>
        <p className="mt-2 text-xl text-ink-soft">Six service lines, one accountable partner.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                {icons[s.slug]}
              </span>
              <h3 className="mt-4 text-xl font-bold text-brand-900 group-hover:underline">{s.name}</h3>
              <p className="mt-2 text-ink-soft">{s.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-line bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-bold uppercase tracking-wider text-ink-soft">
            Trusted by operators and service companies
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clientReferences.map((c) => (
              <li key={c} className="text-lg font-semibold text-brand-800">{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-extrabold text-brand-950">What clients say</h2>
            <Link href="/testimonials" className="font-semibold text-brand-700 underline">
              See all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.id} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
                <div className="flex gap-1 text-accent-500" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 text-[1.05rem] leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-4 font-semibold text-brand-900">
                  {t.client_name}
                  {t.company && <span className="block text-ink-soft font-normal">{t.company}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Latest from the fleet */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-extrabold text-brand-950">From the fleet &amp; the yard</h2>
            <Link href="/blog" className="font-semibold text-brand-700 underline">
              All posts
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="mt-6 text-xl text-ink-soft">
              Stories from our operations will appear here as we publish them.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group card">
                  <article className="rounded-[var(--radius-card)] border border-line bg-surface p-6 transition group-hover:shadow-[var(--shadow-card)]">
                    <p className="text-sm font-bold uppercase text-brand-600">{p.category.replace("_", " ")}</p>
                    <h3 className="mt-2 text-xl font-bold text-brand-900 group-hover:underline">{p.title}</h3>
                    <p className="mt-2 text-ink-soft">{p.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-[var(--radius-card)] bg-brand-900 p-10 text-center text-white md:p-16">
          <h2 className="text-3xl font-extrabold">Have cargo, a contract or a list of materials?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-brand-100">
            Send the details — you will get a reference number immediately and a quotation within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/quote">
              <BigButton size="lg" variant="success">
                Request a Quotation
              </BigButton>
            </Link>
            <a
              href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center rounded-[var(--radius-btn)] border-2 border-white/40 px-8 py-4 text-xl font-semibold hover:bg-white/10"
            >
              Call {company.adminOffice.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
