import Link from "next/link";
import { BigButton } from "@hericilla/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-4 text-3xl font-bold text-brand-950">We could not find that page</h1>
      <p className="mt-3 text-lg text-ink-soft">
        The link may be old or mistyped. The pages below cover almost everything on this site.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/">
          <BigButton size="lg">Go to homepage</BigButton>
        </Link>
        <Link href="/contact">
          <BigButton size="lg" variant="secondary">
            Contact us
          </BigButton>
        </Link>
      </div>
      <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg font-semibold text-brand-700">
        <Link href="/services" className="underline">Services</Link>
        <Link href="/quote" className="underline">Request a quote</Link>
        <Link href="/careers" className="underline">Careers</Link>
        <Link href="/blog" className="underline">Blog &amp; news</Link>
        <Link href="/status" className="underline">Enquiry status</Link>
      </nav>
    </div>
  );
}
