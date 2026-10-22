import Link from "next/link";
import { Card, BigButton } from "@hericilla/ui";
import { CheckCircle2 } from "lucide-react";

export default function QuoteSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Card className="p-10">
        <CheckCircle2 className="mx-auto h-20 w-20 text-success-600" aria-hidden />
        <h1 className="mt-6 text-3xl font-extrabold text-brand-900">Request received — thank you!</h1>
        <p className="mt-3 text-xl text-ink-soft">
          An officer from our Abuloma office will respond within 24 hours. A copy has been sent to your email.
        </p>
        <SuccessRef searchParams={searchParams} />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/status">
            <BigButton variant="secondary">Check status later</BigButton>
          </Link>
          <Link href="/">
            <BigButton variant="ghost">Back to homepage</BigButton>
          </Link>
        </div>
      </Card>
    </div>
  );
}

async function SuccessRef({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) return null;
  return (
    <p className="mt-6 text-xl">
      Your reference number:{" "}
      <strong className="rounded-lg bg-brand-50 px-3 py-1 font-mono text-2xl text-brand-800">{ref}</strong>
    </p>
  );
}
