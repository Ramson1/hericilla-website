import Link from "next/link";
import { company } from "@/lib/company";
import { NewsletterBox } from "./NewsletterBox";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services/trucking", label: "Trucking & Haulage" },
      { href: "/services/transportation", label: "Transportation" },
      { href: "/services/procurement", label: "Procurement" },
      { href: "/services/packing-removal", label: "Packing & Removal" },
      { href: "/services/materials-support", label: "Materials Support" },
      { href: "/services/oil-gas", label: "Oil & Gas Support" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/projects", label: "Projects & experience" },
      { href: "/why-us", label: "Why choose us" },
      { href: "/hseq", label: "HSEQ" },
      { href: "/careers", label: "Careers" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/blog", label: "Blog & news" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/quote", label: "Request a quotation" },
      { href: "/status", label: "Check enquiry status" },
      { href: "/contact", label: "Contact us" },
      { href: "/privacy", label: "Privacy & GPS policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="text-xl font-extrabold text-white">Hericilla Support Services Ltd</p>
            <p className="mt-2 text-brand-200">{company.tagline}</p>
            <p className="mt-4 text-sm text-brand-300">RC {company.rc} · {company.motto}</p>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="font-bold text-white mb-3">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white underline-offset-4 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] bg-brand-900 p-6">
            <p className="font-bold text-white">{company.adminOffice.label}</p>
            <p className="mt-1">{company.adminOffice.address}</p>
            <p className="mt-1">
              Tel:{" "}
              <a className="underline" href={`tel:${company.adminOffice.phone.replace(/\s/g, "")}`}>
                {company.adminOffice.phone}
              </a>
            </p>
            <p>
              Email:{" "}
              <a className="underline" href={`mailto:${company.adminOffice.email}`}>
                {company.adminOffice.email}
              </a>
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-brand-900 p-6">
            <p className="font-bold text-white">{company.opsBase.label}</p>
            <p className="mt-1">{company.opsBase.address}</p>
            <p className="mt-1">
              Tel:{" "}
              <a className="underline" href={`tel:${company.opsBase.phone.replace(/\s/g, "")}`}>
                {company.opsBase.phone}
              </a>
            </p>
          </div>
        </div>

        <NewsletterBox />

        <p className="mt-10 text-center text-sm text-brand-300">
          © {new Date().getFullYear()} Hericilla Support Services Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
