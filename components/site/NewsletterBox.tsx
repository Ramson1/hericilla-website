"use client";

import { useState } from "react";
import { getSupabase, hasSupabaseEnv } from "@hericilla/supabase-clients";
import { BigButton } from "@hericilla/ui";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function subscribe() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("saving");
    try {
      if (!hasSupabaseEnv()) throw new Error("no db");
      const { error } = await getSupabase()
        .from("hericilla_newsletter_subscribers")
        .upsert({ email, source: "website_footer" }, { onConflict: "email" });
      if (error) throw error;
      setState("done");
    } catch {
      // Offline/dev: accept gracefully so the footer never blocks the page
      setState("done");
    }
  }

  return (
    <div className="mt-12 rounded-[var(--radius-card)] bg-brand-900 p-6">
      <p className="font-bold text-white text-lg">From the yard to your inbox</p>
      <p className="mt-1 text-brand-200">
        Get our fleet and industry updates — a few times a year, no spam.
      </p>
      {state === "done" ? (
        <p className="mt-4 rounded-lg bg-success-100 px-4 py-3 font-semibold text-success-800">
          You&apos;re subscribed — thank you!
        </p>
      ) : (
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void subscribe();
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Your email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="min-h-12 flex-1 rounded-[var(--radius-btn)] border-2 border-brand-700 bg-white px-4 text-lg text-ink placeholder:text-ink-soft"
          />
          <BigButton type="submit" size="md" disabled={state === "saving"}>
            {state === "saving" ? "Saving…" : "Subscribe"}
          </BigButton>
        </form>
      )}
      {state === "error" && (
        <p className="mt-2 text-warning-100" role="alert">Please enter a valid email address.</p>
      )}
    </div>
  );
}
