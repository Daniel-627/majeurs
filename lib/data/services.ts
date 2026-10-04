export interface ServiceContent {
  slug: string;
  title: string;
  kicker: string;
  dek: string;
  benefits: string[];
  faqs: { q: string; a: string }[];
}

export const services: ServiceContent[] = [
  {
    slug: "accounting",
    title: "Accounting & Bookkeeping",
    kicker: "Accounting",
    dek: "Accounting that gives you a clearer picture of your business.",
    benefits: [
      "Monthly reconciliation, so your bank and books always match",
      "Clean, audit-ready financial statements",
      "A general ledger you can actually make sense of",
      "Fewer year-end surprises at tax time",
    ],
    faqs: [
      { q: "How often will my books be updated?", a: "Monthly by default, with weekly updates available for higher-volume businesses." },
      { q: "Can you take over from my current bookkeeper?", a: "Yes — we handle the handover and reconcile historical records as part of onboarding." },
    ],
  },
  {
    slug: "tax",
    title: "Tax Services",
    kicker: "Tax",
    dek: "Minimize your tax burden and stay compliant with confidence.",
    benefits: [
      "Accurate, on-time VAT, PAYE and income tax filings",
      "Proactive tax planning, not just year-end scrambling",
      "Representation if KRA raises a query",
      "Clear guidance on what's deductible and what isn't",
    ],
    faqs: [
      { q: "Do you handle KRA audits?", a: "Yes, we represent and prepare documentation on your behalf throughout the process." },
      { q: "What if I'm behind on filings?", a: "We assess the backlog, prioritize what's most urgent, and get you current." },
    ],
  },
  {
    slug: "payroll",
    title: "Payroll",
    kicker: "Payroll",
    dek: "Hassle-free payroll management for your team.",
    benefits: [
      "Accurate payslips, every cycle, on time",
      "Statutory deductions (NSSF, SHIF, PAYE) handled correctly",
      "Organized employee records",
      "One less thing for you to manage manually",
    ],
    faqs: [
      { q: "What size teams do you support?", a: "From a handful of employees to larger teams — pricing scales with headcount." },
      { q: "Can employees access their own payslips?", a: "Yes, through a simple portal we set up as part of onboarding." },
    ],
  },
  {
    slug: "audit",
    title: "Audit & Assurance",
    kicker: "Audit",
    dek: "Independent reviews for greater transparency and trust.",
    benefits: [
      "Independent financial statement audits",
      "Review of internal controls and risk areas",
      "Assurance reports for lenders, investors or regulators",
      "Clear, practical recommendations — not just findings",
    ],
    faqs: [
      { q: "Do I need an audit if I'm a small business?", a: "Not always legally required, but often requested by lenders or investors — we can advise based on your situation." },
      { q: "How long does an audit take?", a: "Depends on size and record quality, typically a few weeks for an SME." },
    ],
  },
  {
    slug: "advisory",
    title: "Business Advisory",
    kicker: "Advisory",
    dek: "Strategic insights to help you plan and grow.",
    benefits: [
      "Cash flow forecasting and management",
      "Guidance on business structuring and growth decisions",
      "Scenario planning for major decisions",
      "A sounding board that actually understands your numbers",
    ],
    faqs: [
      { q: "Is advisory a one-off or ongoing service?", a: "Both options exist — a single strategy session, or an ongoing quarterly arrangement." },
      { q: "Do you help with fundraising or loan applications?", a: "Yes, including preparing the financials lenders and investors ask for." },
    ],
  },
  {
    slug: "financial-reporting",
    title: "Financial Reporting",
    kicker: "Reporting",
    dek: "Clear, accurate reports for better business decisions.",
    benefits: [
      "Management reports you can actually read",
      "Statutory reporting handled on schedule",
      "Custom dashboards tracking what matters to you",
      "Reports built for decisions, not just compliance",
    ],
    faqs: [
      { q: "How often do we receive reports?", a: "Monthly management reports as standard, with custom cadences available." },
      { q: "Can reports be tailored to specific metrics?", a: "Yes — we build dashboards around whatever drives decisions in your business." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
