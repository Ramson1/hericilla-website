"use client";

import { useState } from "react";
import { BigButton, BigInput, BigTextarea, Card } from "@hericilla/ui";

type State = "idle" | "sending" | "sent" | "failed";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [refNo, setRefNo] = useState("");
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "", company_website: "" });

  function input(field: keyof typeof form) {
    return {
      value: form[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value })),
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // honeypot — silently discard
    if (form.company_website) {
      setState("sent");
      setRefNo("ENQ-SPAM");
      return;
    }
    setState("sending");
    try {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!base) throw new Error("offline");
      const res = await fetch(`${base}/functions/v1/enquiry-intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiry_type: "general",
          name: form.name,
          company: form.company || undefined,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
          company_website: form.company_website,
        }),
      });
      const json = await res.json();
      if (json.ref_no) {
        setRefNo(json.ref_no);
        setState("sent");
        return;
      }
      throw new Error(json.error || "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <Card className="p-6 bg-success-100 text-success-800">
        <p className="text-base font-bold">Message sent ✓</p>
        <p className="mt-1">
          Your reference is <strong>{refNo}</strong>. Keep it to check your enquiry status anytime.
        </p>
        <BigButton className="mt-4" variant="secondary" onClick={() => { setState("idle"); setForm({ name: "", company: "", email: "", phone: "", message: "", company_website: "" }); setRefNo(""); }}>
          Send another message
        </BigButton>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-brand-900">Send us a message</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Fill in the form below and we will get back to you. You will receive a reference number to track your enquiry.
      </p>
      <form className="mt-5 space-y-5" onSubmit={submit}>
        <BigInput label="Full name" required autoComplete="name" {...input("name")} />
        <BigInput label="Company (optional)" autoComplete="organization" {...input("company")} />
        <BigInput label="Email" type="email" required autoComplete="email" {...input("email")} />
        <BigInput label="Phone (optional)" type="tel" autoComplete="tel" placeholder="+234 …" {...input("phone")} />
        <BigTextarea label="Your message" required rows={5} placeholder="How can we help?" {...input("message")} />

        {/* Honeypot — hidden from humans */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          value={form.company_website}
          onChange={(e) => setForm((prev) => ({ ...prev, company_website: e.target.value }))}
        />

        <BigButton type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </BigButton>

        {state === "failed" && (
          <p className="rounded-lg bg-warning-100 p-4 text-warning-800" role="alert">
            We could not send your message online. Please email us at{" "}
            <a className="font-bold underline" href="mailto:hericillasurportservices@gmail.com">
              hericillasurportservices@gmail.com
            </a>{" "}
            — nothing you typed is lost.
          </p>
        )}
      </form>
    </Card>
  );
}
