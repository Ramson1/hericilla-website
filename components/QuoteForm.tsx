"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Wizard, BigInput, BigTextarea, BigSelect, Card } from "@hericilla/ui";
import { services, clientReferences } from "@/lib/company";

const serviceOptions = services.map((s) => ({ value: s.slug, label: s.name }));
// Website slugs → service_type enum values used by the database
const slugToEnum: Record<string, string> = {
  trucking: "trucking",
  transportation: "transportation",
  procurement: "procurement",
  "packing-removal": "packing_removal",
  "materials-support": "materials_support",
  "oil-gas": "logistics",
};
const priorityOptions = [
  { value: "normal", label: "Standard (within 48 hours)" },
  { value: "urgent", label: "Urgent (needed faster)" },
  { value: "scheduled", label: "Planned / scheduled project" },
];

type Form = {
  enquiry_type: string;
  service_type: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  pickup_location: string;
  destination: string;
  cargo_details: string;
  needed_by: string;
  priority: string;
  message: string;
};

const empty: Form = {
  enquiry_type: "quotation",
  service_type: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  pickup_location: "",
  destination: "",
  cargo_details: "",
  needed_by: "",
  priority: "normal",
  message: "",
};

export function QuoteForm() {
  const [f, setF] = useState<Form>(empty);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const input = (k: keyof Form) => ({
    value: f[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value })),
  });

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);

  const steps = useMemo(
    () => [
      {
        title: "What do you need?",
        valid: f.service_type !== "",
        content: (
          <div className="space-y-5">
            <BigSelect
              label="Which service?"
              hint="Choose the closest — an officer will confirm scope."
              options={serviceOptions}
              required
              {...input("service_type")}
            />
            <BigSelect label="How soon?" options={priorityOptions} {...input("priority")} />
          </div>
        ),
      },
      {
        title: "Cargo & route",
        valid: f.cargo_details.trim().length >= 5,
        content: (
          <div className="space-y-5">
            <BigTextarea
              label="What is being moved or sourced?"
              hint="Items, weights, dimensions, quantities, hazmat class if any."
              required
              {...input("cargo_details")}
            />
            <BigInput label="Pickup location" placeholder="e.g. Onne Wharf 4" {...input("pickup_location")} />
            <BigInput label="Destination" placeholder="e.g. Ahoada rig base" {...input("destination")} />
            <BigInput label="Needed by (date)" type="date" {...input("needed_by")} />
          </div>
        ),
      },
      {
        title: "About you",
        valid: f.name.trim().length >= 2 && emailOk && f.phone.trim().length >= 7,
        content: (
          <div className="space-y-5">
            <BigInput label="Your full name" required autoComplete="name" {...input("name")} />
            <BigInput label="Company" autoComplete="organization" {...input("company")} />
            <BigInput label="Email" type="email" required autoComplete="email" {...input("email")} />
            <BigInput label="Phone" type="tel" required autoComplete="tel" placeholder="+234 …" {...input("phone")} />
          </div>
        ),
      },
      {
        title: "Anything else?",
        content: (
          <div className="space-y-5">
            <BigTextarea
              label="Extra instructions (optional)"
              hint="Access constraints, permits, contact-on-arrival, documentation needs…"
              {...input("message")}
            />
            <div className="rounded-[var(--radius-card)] bg-surface p-5">
              <p className="font-bold">Review</p>
              <ul className="mt-2 space-y-1 text-ink-soft">
                <li>Service: <strong className="text-ink">{f.service_type}</strong></li>
                <li>Route: <strong className="text-ink">{f.pickup_location || "—"} → {f.destination || "—"}</strong></li>
                <li>Contact: <strong className="text-ink">{f.name} · {f.email} · {f.phone}</strong></li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f],
  );

  async function submit() {
    setSubmitting(true);
    try {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (base) {
        const res = await fetch(`${base}/functions/v1/enquiry-intake`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, service_type: slugToEnum[f.service_type] ?? f.service_type }),
        });
        const json = await res.json();
        if (json.ref_no) {
          router.push(`/quote/success?ref=${encodeURIComponent(json.ref_no)}`);
          return;
        }
      }
      throw new Error("no function");
    } catch {
      // No backend yet: mailto fallback keeps the enquiry reachable
      const body = Object.entries(f)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      window.location.href = `mailto:hericillasurportservices@gmail.com?subject=Quotation%20request&body=${encodeURIComponent(body)}`;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6 md:p-10">
      <p className="mb-6 text-ink-soft">
        Four short steps. You will get a reference number at the end — keep it to check your status any time.
      </p>
      <Wizard steps={steps} onSubmit={submit} submitting={submitting} submitLabel="Send request" />
      {clientReferences.length > 0 && (
        <p className="mt-6 text-sm text-ink-soft">
          Companies like {clientReferences.slice(0, 2).join(" and ")} already trust us with their cargo.
        </p>
      )}
    </Card>
  );
}
