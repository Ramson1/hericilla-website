import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Card } from "@hericilla/ui";
import { company, team } from "@/lib/company";
import { getPageContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Hericilla Support Services Limited — RC 8100414 — provides supply chain solutions and logistics services to the Nigerian oil & gas industry from Port Harcourt.",
};

const values = [
  {
    title: "Safety first, always",
    body: "No load is worth an injury. HSEQ procedures govern every trip, lift and handover.",
  },
  {
    title: "Say it once, deliver it right",
    body: "Clear documentation and one accountable point of contact, from request to proof of delivery.",
  },
  {
    title: "Partners, not vendors",
    body: "We plan our fleet and people around our clients' schedules — rigs do not wait.",
  },
  {
    title: "Growth of our people",
    body: "Drivers, agents and officers are trained and certified; experience stays with the crew.",
  },
];

export default async function AboutPage() {
  const intro = await getPageContent(
    "about_intro",
    "Hericilla Support Services Limited is a Port Harcourt–based logistics and supply chain company serving oil & gas operators, servicing companies and contractors. Since 2020 we have combined heavy-duty trucking, procurement and contract management, packing and international removals, materials supply and ships agency under one disciplined operation.",
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PageHeader
        title={`About ${company.name}`}
        purpose="Who we are, what we believe and how we got here — RC 8100414, founded 2020, Port Harcourt."
      />

      <div className="mt-8 space-y-10">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-brand-900">Our story</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Our management team brings a combined decade of experience in the removals and logistics business, backed by
            degreed and certified professionals in transportation, haulage, buying and selling. We operate from our
            administrative office at {company.adminOffice.address.split("—")[0].trim()} with our operational base at{" "}
            {company.opsBase.address.split("—")[0].trim()}, keeping trucks, crews and documentation moving 24/7.
          </p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-brand-900">Mission</h2>
            <p className="mt-3 text-lg text-ink-soft">
              To deliver safe, fully documented and honestly priced logistics and supply chain services that keep our
              clients' operations running without interruption.
            </p>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-brand-900">Vision</h2>
            <p className="mt-3 text-lg text-ink-soft">
              To be the most trusted support-services partner in the Niger Delta — the first call operators make when
              cargo, contracts or deadlines matter.
            </p>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-900">Our values</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} className="p-6">
                <h3 className="text-xl font-bold text-brand-800">{v.title}</h3>
                <p className="mt-2 text-lg text-ink-soft">{v.body}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-900">Meet the management team</h2>
          <p className="mt-2 text-lg text-ink-soft">
            Hericilla is led by a small team of hands-on professionals with decades of combined experience in
            logistics, finance and the removals business.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {team.map((m) => (
              <Card key={m.name} className="p-7">
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-700 text-2xl font-extrabold text-white"
                  >
                    {m.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-900">{m.name}</h3>
                    <p className="text-base font-semibold uppercase tracking-wide text-brand-500">{m.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{m.bio}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {m.credentials.map((c) => (
                    <li key={c} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800">
                      {c}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-brand-900">How we are organised</h2>
          <p className="mt-3 text-lg text-ink-soft">
            Eight departments run the business end to end: Operations, Procurement, Logistics &amp; Transportation,
            Warehouse, Projects &amp; Relocations, Facilities, Clients&apos; Service and Finance. Every job is issued a
            work-order number that links the request, the crew, the vehicles, the documents and the invoice — so answers
            are never guesswork.
          </p>
          <p className="mt-4 text-lg font-semibold text-brand-800">“{company.motto}.”</p>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex rounded-[var(--radius-btn)] bg-brand-700 px-8 py-4 text-xl font-bold text-white hover:bg-brand-800"
          >
            See our projects &amp; experience
          </Link>
          <Link
            href="/hseq"
            className="inline-flex rounded-[var(--radius-btn)] border-2 border-brand-300 px-8 py-4 text-xl font-semibold text-brand-800 hover:bg-brand-50"
          >
            Read our HSEQ policy
          </Link>
        </div>
      </div>
    </div>
  );
}
