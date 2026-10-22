import type { Metadata } from "next";
import { PageHeader, Card, EmptyState } from "@hericilla/ui";
import { getCareers } from "@/lib/db";
import { company } from "@/lib/company";
import { ApplyForm } from "@/components/ApplyForm";
import { MapPin, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Hericilla Support Services — open roles in logistics, procurement, warehousing and operations in Port Harcourt, Rivers State.",
};

export default async function CareersPage() {
  const careers = await getCareers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <PageHeader
        title="Work with us"
        purpose="Open positions at Hericilla. We hire careful, honest people and train them properly — drivers, officers and warehouse teams."
      />

      {careers.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No open roles right now"
            teach="When a position opens, it appears here. You can still send your CV to hericillasurportservices@gmail.com — good people are always welcome."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {careers.map((c) => (
            <Card key={c.id} className="p-8">
              <h2 className="text-2xl font-bold text-brand-900">{c.title}</h2>
              <div className="mt-2 flex flex-wrap gap-4 text-base text-ink-soft">
                {c.department && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-5 w-5" /> {c.department}
                  </span>
                )}
                {c.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-5 w-5" /> {c.location}
                  </span>
                )}
                {c.closing_date && (
                  <span className="font-semibold text-warning-800">
                    Apply before {new Date(c.closing_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {c.description && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{c.description}</p>}
              {c.requirements && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-brand-800">What we need from you</h3>
                  <p className="mt-1 whitespace-pre-line text-lg text-ink-soft">{c.requirements}</p>
                </div>
              )}
              <div className="mt-6">
                <ApplyForm careerId={c.id} careerTitle={c.title} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-12 p-8 bg-brand-50">
        <h2 className="text-xl font-bold text-brand-900">Always recruiting good drivers</h2>
        <p className="mt-2 text-lg text-ink-soft">
          Even without an advertised role, SEN-certified and heavy-duty drivers with valid licences can write to{" "}
          <a className="font-semibold underline" href={`mailto:${company.adminOffice.email}`}>
            {company.adminOffice.email}
          </a>{" "}
          with their CV and licence details.
        </p>
      </Card>
    </div>
  );
}
