"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BigButton, BigInput, BigTextarea, Card } from "@hericilla/ui";
import { getSupabase, hasSupabaseEnv } from "@hericilla/supabase-clients";

const MAX_FILES = 6;
const MAX_SIZE_MB = 8;

const schema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  cover_letter: z.string().max(4000).optional(),
});
type FormValues = z.infer<typeof schema>;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplyForm({ careerId, careerTitle }: { careerId: string; careerTitle: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFileError("");
    if (selected.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed.`);
      setFiles(selected.slice(0, MAX_FILES));
      return;
    }
    const oversized = selected.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setFileError(`"${oversized.name}" exceeds ${MAX_SIZE_MB} MB limit.`);
      setFiles([]);
      e.target.value = "";
      return;
    }
    setFiles(selected);
  }, []);

  async function submit(values: FormValues) {
    setState("sending");
    try {
      if (!hasSupabaseEnv()) throw new Error("offline");
      const fd = new FormData();
      fd.append("career_id", careerId);
      fd.append("full_name", values.full_name);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("cover_letter", values.cover_letter ?? "");
      for (const f of files) {
        fd.append("files", f);
      }
      const { error: fnError } = await getSupabase().functions.invoke("career-apply", { body: fd });
      if (fnError) throw fnError;
      setState("sent");
      reset();
      setFiles([]);
      setFileError("");
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
        onSubmit={handleSubmit((values) => void submit(values))}
      >
        <BigInput label="Full name" required error={errors.full_name?.message} {...register("full_name")} />
        <BigInput label="Email address" type="email" required error={errors.email?.message} {...register("email")} />
        <BigInput label="Phone number" type="tel" required error={errors.phone?.message} {...register("phone")} />

        <div>
          <label htmlFor={`files-${careerId}`} className="mb-1 block text-base font-semibold text-ink">
            Your documents <span className="font-normal text-ink-soft">(PDF, Word, images — up to {MAX_FILES} files, max {MAX_SIZE_MB} MB each, optional)</span>
          </label>
          <input
            id={`files-${careerId}`}
            type="file"
            multiple
            accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.webp"
            className="block w-full text-base file:mr-4 file:rounded-[var(--radius-btn)] file:border-0 file:bg-brand-50 file:px-6 file:py-3 file:font-bold file:text-brand-800"
            onChange={handleFileChange}
          />
          {fileError && <p className="mt-1 text-sm font-semibold text-danger-600">{fileError}</p>}
          {files.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {files.map((f, i) => (
                <li key={i}>• {f.name} ({formatSize(f.size)})</li>
              ))}
            </ul>
          )}
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
