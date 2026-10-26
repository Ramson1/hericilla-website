import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, Card, EmptyState } from "@hericilla/ui";
import { clientLogos, clientReferences, services } from "@/lib/company";
import { getPosts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projects & Experience",
  description:
    "Approved client references and project updates: rig support, heavy haulage, procurement contracts and relocations delivered across Nigeria.",
};

// One short, honest line per approved reference (no invented job details).
const referenceNotes: Record<string, string> = {
  "AOS Orwell": "Equipment and materials logistics support.",
  "Best Land & Sea Resources": "Trucking and delivery operations.",
  "Geoplex DrillTeq": "Oilfield equipment procurement support.",
  "Pimo-Mafuta Services": "Materials supply and haulage.",
  Welltec: "Time-critical transport and site deliveries.",
  "Titan Tubulars": "Heavy tubulars movement and yard transfers.",
};

export default async function ProjectsPage() {
  const updates = (await getPosts(12)).filter((p) => p.category === "project_update").slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PageHeader
        title="Projects & experience"
        purpose="The companies that rely on us and the kind of work we do for them. Client names are published with permission."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {clientReferences.map((c) => (
          <Card key={c} className="p-7">
            <div className="flex items-start gap-5">
              {clientLogos[c] && (
                <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-2">
                  <Image
                    src={clientLogos[c]}
                    alt={`${c} logo`}
                    width={280}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-500">Client reference</p>
                <h2 className="mt-1 text-2xl font-bold text-brand-900">{c}</h2>
                <p className="mt-2 text-lg text-ink-soft">{referenceNotes[c] ?? "Logistics and support services."}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-10 p-8">
        <h2 className="text-2xl font-bold text-brand-900">Sectors we serve</h2>
        <p className="mt-3 text-lg text-ink-soft">
          E&amp;P operators, oilfield servicing companies, rig contractors, pipeline and facility builders, and
          corporate movers — across{" "}
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="font-semibold text-brand-700 underline">
              {s.name.split(" &")[0].split("—")[0].trim()}
            </Link>
          )).reduce<React.ReactNode[]>((acc, el, i) => (i ? acc.concat(<span key={i}>, </span>, el) : [el]), [])}
          .
        </p>
      </Card>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-brand-900">Recent project updates</h2>
        {updates.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No published updates yet"
              teach="When we complete notable jobs, we write them up here (with client permission)."
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {updates.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="block">
                <Card className="p-6 transition hover:shadow-[var(--shadow-pop)]">
                  <h3 className="text-xl font-bold text-brand-900">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-lg text-ink-soft">{p.excerpt}</p>}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
