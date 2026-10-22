"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BigButton, BigInput, BigTextarea, Card } from "@hericilla/ui";
import { getSupabase, hasSupabaseEnv } from "@hericilla/supabase-clients";

const schema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  cover_letter: z.string().max(4000).optional(),
});
type FormValues = z.infer<typeof schema>;

export function ApplyForm({ careerId, careerTitle }: { careerId: string; careerTitle: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [cvName, setCvName] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function submit(values: FormValues, cv: File | null) {
    setState("sending");
    try {
      if (!hasSupabaseEnv()) throw new Error("offline");
      const fd = new FormData();
      fd.append("career_id", careerId);
      fd.append("full_name", values.full_name);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("cover_letter", values.cover_letter ?? "");
      if (cv) {
        fd.append("cv", cv);
        fd.append("cv_name", cv.name);
      }
      const { error: fnError } = await getSupabase().functions.invoke("career-apply", { body: fd });
      if (fnError) throw fnError;
      setState("sent");
      reset();
      setCvName("");
    } catch {
      // Fall back to email so the application is never lost
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <Card className="p-6 bg-success-100 text-success-800">
        <p className="text-lg font-bold">Application received ✓</p>
        <p className="mt-1">
          Thank you — our HR team will contact you if your profile matches the {careerTitle} role.
        </p>
        <BigButton className="mt-4" variant="secondary" onClick={() => setState("idle")}>
          Apply for another role
        </BigButton>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-brand-900">Apply for: {careerTitle}</h3>
      <form
        className="mt-4 space-y-5"
        onSubmit={handleSubmit((values) => {
          const input = document.querySelector<HTMLInputElement>(`#cv-${careerId}`);
          void submit(values, input?.files?.[0] ?? null);
        })}
      >
        <BigInput label="Full name" required error={errors.full_name?.message} {...register("full_name")} />
        <BigInput label="Email address" type="email" required error={errors.email?.message} {...register("email")} />
        <BigInput label="Phone number" type="tel" required error={errors.phone?.message} {...register("phone")} />

        <div>
          <label htmlFor={`cv-${careerId}`} className="mb-1 block text-lg font-semibold text-ink">
            Your CV <span className="font-normal text-ink-soft">(PDF or Word, optional — max 8 MB)</span>
          </label>
          <input
            id={`cv-${careerId}`}
            type="file"
            accept=".pdf,.doc,.docx"
            className="block w-full text-lg file:mr-4 file:rounded-[var(--radius-btn)] file:border-0 file:bg-brand-50 file:px-6 file:py-3 file:font-bold file:text-brand-800"
            onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
          />
          {cvName && <p className="mt-1 text-sm text-ink-soft">Attached: {cvName}</p>}
        </div>

        <BigTextarea
          label="Why do you want this job? (optional)"
          rows={4}
          error={errors.cover_letter?.message}
          {...register("cover_letter")}
        />

        <BigButton type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending your application…" : "Send application"}
        </BigButton>

        {state === "failed" && (
          <p className="rounded-lg bg-warning-100 p-4 text-warning-800" role="alert">
            We could not send it online. Please email your CV and this role&apos;s title to{" "}
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
