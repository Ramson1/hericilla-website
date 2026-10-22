import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Card } from "@hericilla/ui";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "HSEQ — Health, Safety, Environment & Quality",
  description:
    "How Hericilla runs logistics safely: zero-harm policy, driver certification, pre-trip inspections and environmental discipline across Port Harcourt operations.",
};

const commitments = [
  {
    title: "Zero-harm is the target, not a slogan",
    body: "No delivery deadline justifies risking a life. Crews are empowered to stop any job — unsafe load, bad route, fatigued driver — and report it straight to Operations without penalty.",
  },
  {
    title: "Certified people, checked daily",
    body: "Drivers hold valid licences and SEN certifications. Every truck runs a documented pre-trip and post-trip inspection; faults are logged and the vehicle is grounded until fixed.",
  },
  {
    title: "Load security you can audit",
    body: "Weight distribution, lashing and tarping follow a standard checklist per trip. Outsize cargo moves only after a route survey, and with escorts where required.",
  },
  {
    title: "Environmental responsibility",
    body: "Spill kits travel on every vehicle carrying fluids or materials. Idling is minimised, waste is taken back to base, and any spill is reported the same day.",
  },
  {
    title: "Quality through paperwork",
    body: "Work orders, delivery notes, proof of delivery and inspection records are captured digitally the same day — what is documented can be improved.",
  },
  {
    title: "Incidents make us sharper",
    body: "Every incident, near-miss or breakdown is reported with photos, reviewed by a supervisor and closed with a corrective action the crew signs off.",
  },
];

export default function HseqPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PageHeader
        title="Health, Safety, Environment & Quality"
        purpose="The rules we run our fleet and crews by — because your cargo and our people both get home."
      />

      <Card className="mt-8 p-8">
        <p className="text-lg leading-relaxed text-ink-soft">
          {company.name} operates to an HSEQ management approach built for oil &amp; gas logistics in the Niger Delta.
          Our clients audit us; we audit ourselves harder. HSE performance is reviewed with management monthly, and
          every supervisor carries a safety objective alongside their delivery objective.
        </p>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {commitments.map((c) => (
          <Card key={c.title} className="p-7">
            <h2 className="text-xl font-bold text-brand-900">{c.title}</h2>
            <p className="mt-2 text-lg leading-relaxed text-ink-soft">{c.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-card)] bg-brand-950 p-8 text-white">
        <h2 className="text-2xl font-bold">Report a safety concern</h2>
        <p className="mt-2 text-lg text-brand-100">
          Seen something unsafe on a Hericilla vehicle or site? Call our operations line any time:{" "}
          <a className="font-bold underline" href={`tel:${company.opsBase.phone.replace(/\s/g, "")}`}>
            {company.opsBase.phone}
          </a>
          . Reports stay confidential.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex rounded-[var(--radius-btn)] bg-white px-8 py-4 text-lg font-bold text-brand-950 hover:bg-brand-50"
        >
          Write to us instead
        </Link>
      </div>
    </div>
  );
}
