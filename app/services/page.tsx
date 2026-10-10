import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Accounting, tax, payroll, audit, advisory and financial reporting services for businesses across Kenya.",
};

const services = [
  {
    n: "01",
    title: "Accounting & Bookkeeping",
    href: "/services/accounting",
    dek: "Accounting that gives you a clearer picture of your business — records kept accurate, organized, and current.",
    items: ["Bookkeeping", "Financial statements", "General ledger management", "Account reconciliation"],
  },
  {
    n: "02",
    title: "Tax Services",
    href: "/services/tax",
    dek: "Minimize your tax burden and stay compliant with confidence, from filing to long-term planning.",
    items: ["Tax preparation", "Tax compliance", "Tax planning", "Tax advisory"],
  },
  {
    n: "03",
    title: "Payroll",
    href: "/services/payroll",
    dek: "Hassle-free payroll management for your team, handled accurately every cycle.",
    items: ["Payroll processing", "Statutory deductions", "Employee records"],
  },
  {
    n: "04",
    title: "Audit & Assurance",
    href: "/services/audit",
    dek: "Independent reviews that give you — and your stakeholders — greater transparency and trust.",
    items: ["Independent financial audits", "Internal controls review", "Assurance reporting"],
  },
  {
    n: "05",
    title: "Business Advisory",
    href: "/services/advisory",
    dek: "Strategic insights to help you plan, grow, and make decisions with real financial backing.",
    items: ["Growth & strategy planning", "Cash flow advisory", "Business structuring"],
  },
  {
    n: "06",
    title: "Financial Reporting",
    href: "/services/financial-reporting",
    dek: "Clear, accurate reports for better business decisions — built for owners, not just auditors.",
    items: ["Management reports", "Statutory reporting", "Custom financial dashboards"],
  },
];

const steps = [
  ["01", "Consultation", "We learn your business and what \"good\" looks like for you."],
  ["02", "Proposal", "A clear scope and price — no surprises once we start."],
  ["03", "Onboarding", "We set up systems and pull in your existing records."],
  ["04", "Ongoing delivery", "Regular reporting, filings and check-ins, on schedule."],
];

export default function ServicesPage() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-10 pt-20">
        <div className="rise rise-1 text-[13.5px] font-semibold text-blue">What we do</div>
        <h1 className="rise rise-2 mt-4 max-w-xl text-[36px] sm:text-[46px]">
          Six services. One clear picture of your business.
        </h1>
        <p className="rise rise-3 mt-5 max-w-xl text-lg text-mute">
          Each service runs as its own practice, with its own process — but
          they all feed the same goal: numbers you can trust and act on.
        </p>
      </header>

      <section className="mx-auto max-w-6xl border-t border-line px-8">
        {services.map((s) => (
          <Reveal
            key={s.n}
            className="grid gap-6 border-b border-line py-11 sm:grid-cols-[120px_1fr_1fr] sm:gap-10"
          >
            <div className="font-serif text-xl text-blue">{s.n}</div>
            <div>
              <h2 className="text-[24px]">{s.title}</h2>
              <div className="mt-2 font-mono text-[13px] text-mute">{s.href}</div>
            </div>
            <div>
              <p className="max-w-md text-[15.5px] text-mute">{s.dek}</p>
              <ul className="mt-4 space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13.5px] text-mute">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="mt-5 inline-block border-b border-ink text-[13.5px] font-semibold"
              >
                Learn more →
              </Link>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-8 py-24">
        <Reveal className="grid items-end gap-10 pb-13 sm:grid-cols-2">
          <h2 className="text-[32px] sm:text-[34px]">How we work with you</h2>
          <p className="max-w-md text-[15px] text-mute">
            The same process underlies every service — only the details
            change.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([n, t, d]) => (
            <Item key={n} className="bg-white p-7">
              <div className="text-[13px] font-semibold text-blue">{n}</div>
              <div className="mt-3.5 text-[15px] font-semibold">{t}</div>
              <div className="mt-2 text-[13.5px] text-mute">{d}</div>
            </Item>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <Reveal className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-navy p-11 sm:p-14">
          <div>
            <h2 className="max-w-xs text-[26px] text-white sm:text-[32px]">
              Not sure which service fits?
            </h2>
            <p className="mt-2 max-w-sm text-[14.5px] text-[#9FB4CC]">
              Tell us about your business and we&apos;ll point you in the
              right direction.
            </p>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-blue px-6 py-3.5 text-sm font-semibold text-white"
          >
            Talk to an advisor
          </Link>
        </Reveal>
      </section>
    </>
  );
}
