import type { Metadata } from "next";
import { PageHeader, Card } from "@hericilla/ui";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy & GPS Use",
  description:
    "How Hericilla Support Services collects, uses and protects personal data — including location data from staff and driver applications.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <PageHeader
        title="Privacy & GPS-use policy"
        purpose="Plain-language explanation of what we collect from website visitors, staff and drivers — and why."
      />

      <div className="mt-8 space-y-6">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-brand-900">1. What we collect on this website</h2>
          <p className="mt-3 text-lg text-ink-soft">
            When you request a quotation or send an enquiry we collect: your name, company (optional), email, phone,
            the details of the job you describe, and any documents you attach. Chat conversations are stored so our
            team can respond. We do not use advertising trackers or sell visitor data.
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-brand-900">2. Location (GPS) data — staff &amp; drivers</h2>
          <p className="mt-3 text-lg text-ink-soft">
            Our attendance and delivery apps can record your location at three moments only: when you clock in/out,
            when you update a job stage (arrived, loaded, delivered), and when you capture proof of delivery. We store
            the coordinates for that moment and whether it fell inside the expected site area — not a continuous trail
            of your movements.
          </p>
          <p className="mt-3 text-lg text-ink-soft">
            Your employer (and only supervisors, fleet and finance officers) can see these points for attendance
            verification and job records. When you first open the staff or driver app, it explains this again and asks
            for location permission — you can refuse; clocking in will then be verified by your supervisor manually.
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-brand-900">3. How long we keep things</h2>
          <p className="mt-3 text-lg text-ink-soft">
            Enquiry, job, attendance and financial records are kept for at least 6 years to meet Nigerian business and
            tax record-keeping obligations. Website chat transcripts are kept for 12 months. Photos attached to
            deliveries or incidents are kept with the job file.
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-brand-900">4. Who can see your data</h2>
          <p className="mt-3 text-lg text-ink-soft">
            Only authorised Hericilla staff, by role: a finance officer sees invoices, a supervisor sees their team’s
            attendance, a fleet officer sees vehicle records. Access is enforced by the system, not by trust. We never
            share personal data with third parties except regulators, auditors or courts where legally required.
          </p>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-brand-900">5. Your rights</h2>
          <p className="mt-3 text-lg text-ink-soft">
            You may ask us for a copy of your personal data, ask for corrections, or ask questions about this policy.
            Write to{" "}
            <a className="font-semibold underline" href={`mailto:${company.adminOffice.email}`}>
              {company.adminOffice.email}
            </a>{" "}
            or call {company.adminOffice.phone}. We respond within 30 days.
          </p>
        </Card>

        <p className="text-base text-ink-soft">
          This policy supports compliance with the Nigeria Data Protection Act (2023). Last updated: 2026.
        </p>
      </div>
    </div>
  );
}
