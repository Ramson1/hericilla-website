/**
 * Static company facts from the corporate profile (docs/requirements/company-profile.md).
 * The DB may override page copy via `page_content`; these are the guaranteed defaults.
 */
export const company = {
  name: "Hericilla Support Services Limited",
  tagline: "Providers of Supply Chain Solutions and Logistics Services to the Nigerian Oil & Gas Industry",
  rc: "8100414",
  motto: "Working together for success",
  founded: 2020,
  adminOffice: {
    label: "Administrative Office",
    address: "No 234, Abuloma Road, Abuloma — Port Harcourt, Rivers State",
    phone: "+234 802 309 1220",
    email: "hericillasurportservices@gmail.com",
  },
  opsBase: {
    label: "Operational Base",
    address: "226 Abuloma Road, Abuloma — Port Harcourt, Rivers State",
    phone: "+234 803 403 6596",
  },
  stats: [
    { value: "0", label: "Lost-time injuries" },
    { value: "24/7", label: "Fleet operations" },
    { value: "6+", label: "Core service lines" },
    { value: "100%", label: "Documentation on every trip" },
  ],
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    slug: "trucking",
    name: "Trucking & Haulage",
    summary:
      "Heavy-duty trucking for rigs, yards and project sites — flatbeds, low-beds and crane combinations operated by SEN-certified drivers.",
    points: [
      "40ft low-bed & flatbed trailers up to 45 tons",
      "Crane-and-transport combinations for outsize cargo",
      "Route surveys and escorted movements",
      "Live trip status and POD the same day",
    ],
  },
  {
    slug: "transportation",
    name: "Transportation & Distribution",
    summary:
      "Personnel logistics, equipment distribution and multi-stop delivery across the South-South and beyond.",
    points: [
      "Staff bus and personnel movement contracts",
      "Scheduled multi-drop distribution",
      "Secure handling of sensitive equipment",
      "Trip reporting and odometer accountability",
    ],
  },
  {
    slug: "procurement",
    name: "Procurement & Contract Management",
    summary:
      "End-to-end sourcing: market intelligence, vendor pre-qualification, negotiation, contract drafting, expediting and reporting.",
    points: [
      "Vendor pre-qualification audits",
      "T&C negotiation and contract drafting",
      "Inspection, monitoring and expediting",
      "Spend analysis and purchasing reports",
    ],
  },
  {
    slug: "packing-removal",
    name: "Packing & International Removals",
    summary:
      "Household and office relocations — local and international — planned with the discipline of a decade in the removals business.",
    points: [
      "Item-by-item inventory with condition grading",
      "Professional packing & crating",
      "Origin & destination door service",
      "Handover records signed on delivery",
    ],
  },
  {
    slug: "materials-support",
    name: "Materials & Logistics Support",
    summary:
      "Stock supply, consumables, spare parts, protective agency and security gadgets — plus ships agency, stevedoring and marine support.",
    points: [
      "Inventory management & just-in-time supply",
      "Ships agency and stevedoring",
      "Protective agency / security gadgets",
      "Warehousing, handling and transportation",
    ],
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas Support",
    summary:
      "Integrated supply-chain support to E&P operators, servicing companies and rig contractors onshore and offshore Nigeria.",
    points: [
      "Rig mobilisation and demobilisation",
      "Oilfield equipment procurement",
      "Pipeline and facility logistics support",
      "HSEQ-compliant operations documentation",
    ],
  },
];

export const clientReferences = [
  "AOS Orwell",
  "Best Land & Sea Resources",
  "Geoplex DrillTeq",
  "Pimo-Mafuta Services",
  "Welltec",
  "Titan Tubulars",
];

/** Approved client logos (public/clients) keyed by the reference names above. */
export const clientLogos: Record<string, string> = {
  "AOS Orwell": "/clients/aos-orwell.jpg",
  "Best Land & Sea Resources": "/clients/best-land-sea.jpg",
  "Geoplex DrillTeq": "/clients/geoplex-drillteq.png",
  "Pimo-Mafuta Services": "/clients/pimo-mafuta.jpg",
  Welltec: "/clients/welltec.jpg",
  "Titan Tubulars": "/clients/titan-tubulars.jpg",
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  credentials: string[];
};

/** Management team from the corporate profile (Hericilla Profile). */
export const team: TeamMember[] = [
  {
    name: "Ogundipe Paul",
    role: "Managing Director",
    bio: "Chartered Accountant with over 25 years of experience across finance, audit, trading, oil & gas, supply chain and global logistics. Served as Internal Auditor, Senior Accountant, Financial Controller, Assets/Agency & Commercial Manager and Supply Chain Group Lead at AOS Orwell before founding Hericilla.",
    credentials: ["BSc Accounting", "MBA — Ladoke Akintola University of Technology", "MSc Corporate Governance — Leeds Metropolitan University, UK", "Fellow, ICAN", "Fellow, NIM"],
  },
  {
    name: "Bright Efekoro",
    role: "Executive Director",
    bio: "Over 22 years in global logistics, cutting his teeth at Chellarams PLC and IAL Nigeria Limited, then as Logistics Manager at Schlumberger Nigeria. He also consults for downstream oil & gas operators on logistics delivery.",
    credentials: ["22+ years global logistics", "Ex-Schlumberger Nigeria (Logistics Manager)"],
  },
  {
    name: "Ogundipe Kikelomo",
    role: "Director",
    bio: "Management Science graduate with more than 10 years in senior civil service before moving into logistics. Brings deep expertise in international removals and plans our international business network and forecast planning.",
    credentials: ["BSc Management Science", "10+ years senior civil service", "International removals specialist"],
  },
  {
    name: "Joan Okere",
    role: "Operations Manager",
    bio: "History & International Relations graduate (University of Lagos) with 12 years in logistics. Former Transport Manager in heavy-duty trucking, she runs our Trucking and Transport operations day to day.",
    credentials: ["BA History & International Relations — University of Lagos", "12 years logistics", "Former Transport Manager, heavy-duty trucking"],
  },
];

export const whyUs = [
  {
    title: "Accountability built in",
    body: "Every job carries a work-order number from request to invoice. Trip reports, PODs and odometer readings are captured the same day.",
  },
  {
    title: "Oil & gas discipline",
    body: "HSEQ procedures, pre/post-trip inspections and SEN-certified drivers — the way logistics should run around critical operations.",
  },
  {
    title: "One partner, many capabilities",
    body: "Trucking, procurement, packing & removal, materials supply and ships agency under one contract and one point of contact.",
  },
  {
    title: "Transparent pricing",
    body: "Quotations with line items, validities and approvals. No surprises between the quote and the invoice.",
  },
];
