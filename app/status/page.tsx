"use client";

import { useState } from "react";
import { PageHeader, Card, BigButton, BigInput, StatusBadge } from "@hericilla/ui";
import { getSupabase, hasSupabaseEnv } from "@hericilla/supabase-clients";

type StatusRow = { ref_no: string; status: string; created_at: string; updated_summary: string };

export default function StatusPage() {
  const [ref, setRef] = useState("");
  const [row, setRow] = useState<StatusRow | null>(null);
  const [state, setState] = useState<"idle" | "searching" | "found" | "notfound" | "offline">("idle");

  async function lookup() {
    setState("searching");
    setRow(null);
    try {
      if (!hasSupabaseEnv()) throw new Error("offline");
      const s = getSupabase();
      const { data, error } = await s.rpc("hericilla_get_enquiry_status", { p_ref: ref.trim() });
      if (error) throw error;
      const rows = (data as StatusRow[]) ?? [];
      if (rows.length === 0) setState("notfound");
      else {
        setRow(rows[0]);
        setState("found");
      }
    } catch {
      setState("offline");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <PageHeader
        title="Check your enquiry status"
        purpose="Type the reference number we gave you (it starts with ENQ-) to see where your request is."
      />
      <Card className="mt-8 p-6">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            void lookup();
          }}
        >
          <BigInput
            label="Reference number"
            hint="Example: ENQ-2026-00007"
            required
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="ENQ-…"
          />
          <BigButton type="submit" disabled={state === "searching"}>
            {state === "searching" ? "Searching…" : "Check status"}
          </BigButton>
        </form>

        {state === "found" && row && (
          <div className="mt-6 rounded-[var(--radius-card)] bg-surface p-6" role="status">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xl font-bold text-brand-800">{row.ref_no}</p>
              <StatusBadge status={row.status} />
            </div>
            <p className="mt-3 text-lg">{row.updated_summary}</p>
            <p className="mt-2 text-sm text-ink-soft">Received on {new Date(row.created_at).toLocaleDateString()}.</p>
          </div>
        )}
        {state === "notfound" && (
          <p className="mt-6 rounded-lg bg-warning-100 p-4 text-warning-800" role="alert">
            We could not find that reference. Please check the number from your confirmation email, or contact us.
          </p>
        )}
        {state === "offline" && (
          <p className="mt-6 rounded-lg bg-info-100 p-4 text-info-800" role="alert">
            Status lookup is being connected. Please email{" "}
            <a className="underline font-semibold" href="mailto:hericillasurportservices@gmail.com">
              hericillasurportservices@gmail.com
            </a>{" "}
            with your reference number.
          </p>
        )}
      </Card>
    </div>
  );
}
