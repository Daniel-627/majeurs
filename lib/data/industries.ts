export interface IndustryContent {
  slug: string;
  name: string;
  dek: string;
  points: string[];
}

export const industries: IndustryContent[] = [
  {
    slug: "smes",
    name: "Businesses",
    dek: "Accounting and compliance for SMEs and established companies.",
    points: [
      "Monthly bookkeeping and reconciliation",
      "VAT, PAYE and statutory filings handled on schedule",
      "Management reports that support real decisions",
      "A single point of contact as your business scales",
    ],
  },
  {
    slug: "startups",
    name: "Startups",
    dek: "Financial foundations for growing companies.",
    points: [
      "Setting up bookkeeping systems from day one",
      "Filing first-year returns correctly",
      "Cash flow visibility while you're finding product-market fit",
      "Investor-ready financials when you need to raise",
    ],
  },
  {
    slug: "individuals",
    name: "Individuals",
    dek: "Personal tax and financial support.",
    points: [
      "Personal income tax filing",
      "Guidance on deductions and reliefs you're entitled to",
      "Support if KRA raises a query",
      "Straightforward advice, no jargon",
    ],
  },
  {
    slug: "ngos",
    name: "NGOs & Organizations",
    dek: "Reporting, compliance and financial management.",
    points: [
      "Donor-compliant financial reporting",
      "Grant and fund tracking",
      "Statutory and regulatory compliance",
      "Audit preparation for donor or board review",
    ],
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug);
}
