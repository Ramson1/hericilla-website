import type { Metadata } from "next";
import { PageHeader } from "@hericilla/ui";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description:
    "Tell us what you need moved, sourced or packed. You get a reference number immediately and a quotation within 24 hours.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <PageHeader
        title="Request a Quotation"
        purpose="Fill this short form and our Port Harcourt office will send you a priced quotation. You will get a reference number to track it."
      />
      <div className="mt-8">
        <QuoteForm />
      </div>
    </div>
  );
}
