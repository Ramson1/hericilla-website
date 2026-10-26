"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BigButton, BigInput, BigPasswordInput, Card } from "@hericilla/ui";
import { getSupabase, hasSupabaseEnv } from "@hericilla/supabase-clients";

type Phase = "checking" | "set-password" | "send-link" | "link-sent";

/**
 * Public-site landing for Supabase password-recovery links (the project's Site URL
 * points here, so dashboard-sent recovery emails land on this page). The recovery
 * session is picked from the URL by supabase-js; we then set the new portal password.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      setPhase("send-link");
      return;
    }
    const s = getSupabase();
    let cancelled = false;

    // The email link carries #...type=recovery (implicit) or ?code=...type=recovery (PKCE).
    const linkIsRecovery =
      window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery");

    // PASSWORD_RECOVERY fires once the auth client has finished ingesting the link —
    // a one-shot getSession() check races that async handover and misses it.
    const { data: sub } = s.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || (linkIsRecovery && event === "SIGNED_IN")) {
        setPhase("set-password");
      }
    });

    void s.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const flagged =
        (data.session as unknown as { user?: { app_metadata?: { recovery?: string } } } | null)?.user
          ?.app_metadata?.recovery === "password";
      if (linkIsRecovery || flagged) setPhase("set-password");
      else setPhase("send-link");
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const s = getSupabase();
      const { error: err } = await s.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (err) throw err;
      setPhase("link-sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reset email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Please choose a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match. Please check both fields.");
      return;
    }
    setBusy(true);
    try {
      const s = getSupabase();
      const { error: err } = await s.auth.updateUser({ password });
      if (err) throw err;
      await s.auth.signOut();
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save the new password. Open the email link again and try once more.",
      );
      setBusy(false);
    }
  }

  if (!hasSupabaseEnv()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg text-center p-10">
          <h1 className="text-2xl font-bold text-brand-950">Supabase is not configured</h1>
          <p className="mt-4 text-lg text-ink-soft">
            Password recovery needs the project keys in <code className="bg-brand-50 px-2 rounded">.env.local</code>.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <Card className="w-full max-w-md p-8 sm:p-10">
        <h1 className="text-2xl font-extrabold text-brand-950">
          {phase === "set-password" ? "Choose a new password" : "Reset your portal password"}
        </h1>

        {phase === "checking" && <p className="mt-4 text-lg text-ink-soft">Checking your reset link…</p>}

        {phase === "set-password" && (
          <form className="mt-6" onSubmit={savePassword}>
            <p className="mb-5 text-lg text-ink-soft">
              Your reset link is valid. Type a new password twice — you will use it to sign in to the staff or
              admin portal.
            </p>
            <BigPasswordInput
              label="New password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <BigPasswordInput
              label="Repeat new password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && (
              <p className="rounded-lg bg-danger-100 p-4 text-danger-800 font-semibold" role="alert">
                {error}
              </p>
            )}
            <BigButton type="submit" size="lg" className="w-full mt-2" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </BigButton>
          </form>
        )}

        {phase === "send-link" && (
          <form className="mt-6" onSubmit={sendLink}>
            <p className="mb-5 text-lg text-ink-soft">
              Enter the email of your portal account and we will send you a link to set a new password.
            </p>
            <BigInput
              label="Email address"
              type="email"
              autoComplete="username"
              placeholder="you@hericilla.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className="rounded-lg bg-danger-100 p-4 text-danger-800 font-semibold" role="alert">
                {error}
              </p>
            )}
            <BigButton type="submit" size="lg" className="w-full mt-2" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </BigButton>
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="mt-4 w-full text-center text-base font-semibold text-brand-700 underline"
            >
              Back to the website
            </button>
          </form>
        )}

        {phase === "link-sent" && (
          <div className="mt-6">
            <p className="rounded-lg bg-success-100 p-4 text-success-800 font-semibold">
              Reset link sent to <strong>{email}</strong>. Open it on this device — this page will ask you for a
              new password.
            </p>
            <BigButton variant="secondary" size="lg" className="w-full mt-4" onClick={() => setPhase("send-link")}>
              Send to a different email
            </BigButton>
          </div>
        )}
      </Card>
    </div>
  );
}
