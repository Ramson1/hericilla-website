import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHeader, Card } from "@hericilla/ui";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach Hericilla Support Services — administrative office and operational base on Abuloma Road, Port Harcourt. Call, email or send an enquiry.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <PageHeader
        title="Contact us"
        purpose="Two offices on Abuloma Road, two phone lines, one email — and every call reaches a person, not a menu."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{company.adminOffice.label}</p>
          <h2 className="mt-2 flex items-start gap-3 break-words text-xl font-bold text-brand-900">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-brand-600" />
            {company.adminOffice.address}
          </h2>
          <a
            href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`}
            className="mt-4 flex items-center gap-3 rounded-[var(--radius-btn)] bg-brand-700 px-6 py-4 text-xl font-bold text-white hover:bg-brand-800"
          >
            <Phone className="h-6 w-6" /> {company.adminOffice.phone}
          </a>
          <a
            href={`mailto:${company.adminOffice.email}`}
            className="mt-3 flex min-w-0 items-center gap-3 break-all text-lg font-semibold text-brand-700 underline"
          >
            <Mail className="h-6 w-6" /> {company.adminOffice.email}
          </a>
        </Card>

        <Card className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{company.opsBase.label}</p>
          <h2 className="mt-2 flex items-start gap-3 break-words text-xl font-bold text-brand-900">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-brand-600" />
            {company.opsBase.address}
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Trucks, crews and dispatch. If your cargo is moving (or should be), this is the line to call.
          </p>
          <a
            href={`tel:${company.opsBase.phone.replace(/\s/g, "")}`}
            className="mt-4 flex items-center gap-3 rounded-[var(--radius-btn)] bg-brand-950 px-6 py-4 text-xl font-bold text-white hover:bg-brand-900"
          >
            <Phone className="h-6 w-6" /> {company.opsBase.phone}
          </a>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="flex items-center gap-3 text-xl font-bold text-brand-900">
          <Clock className="h-6 w-6 text-brand-600" /> Working hours
        </h2>
        <p className="mt-2 text-lg text-ink-soft">
          Office: Monday–Saturday, 8:00am–6:00pm. Fleet operations run around the clock — urgent movements at night
          are answered by the operations line.
        </p>
      </Card>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/quote"
          className="inline-flex rounded-[var(--radius-btn)] bg-accent-500 px-8 py-4 text-xl font-bold text-white hover:bg-accent-600"
        >
          Request a quotation (faster for pricing)
        </Link>
        <Link
          href="/status"
          className="inline-flex rounded-[var(--radius-btn)] border-2 border-brand-300 px-8 py-4 text-xl font-semibold text-brand-800 hover:bg-brand-50"
        >
          Check an enquiry reference
        </Link>
      </div>

      <p className="mt-8 text-base text-ink-soft">
        Registered with the Corporate Affairs Commission of Nigeria — RC {company.rc}.
      </p>
    </div>
  );
}
