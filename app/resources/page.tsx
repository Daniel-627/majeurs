import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Practical guides on VAT, PAYE and tax compliance, plus a running calendar of Kenyan statutory deadlines.",
};

// Static for now — swap for a CMS/MDX source once content volume grows.
const posts = [
  { tag: "Tax", title: "Understanding VAT in Kenya", read: "6 min read" },
  { tag: "Records", title: "How to keep proper business records", read: "5 min read" },
  { tag: "Payroll", title: "PAYE explained", read: "4 min read" },
  { tag: "Reporting", title: "What financial statements tell you", read: "7 min read" },
  { tag: "Tax", title: "Common tax mistakes businesses make", read: "5 min read" },
  { tag: "Audit", title: "How to prepare for an audit", read: "6 min read" },
];

const calendar = [
  { date: "Sep 20", name: "VAT Return", freq: "Monthly" },
  { date: "Sep 30", name: "PAYE Remittance", freq: "Monthly" },
  { date: "Oct 09", name: "Withholding Tax", freq: "Monthly" },
  { date: "Oct 20", name: "VAT Return", freq: "Monthly" },
  { date: "Dec 31", name: "Annual Income Tax Return", freq: "Annual" },
];

export default function ResourcesPage() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-12 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">Resources</div>
        <h1 className="mt-4 max-w-xl text-[36px] sm:text-[46px]">
          Straight answers to the questions we hear most.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mute">
          Practical guidance on tax, records and compliance in Kenya — plus a
          running calendar of the deadlines that actually matter.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-8 pb-20">
        <div className="grid items-end gap-10 pb-10 sm:grid-cols-2">
          <h2 className="text-[28px] sm:text-[32px]">Majeurs Insights</h2>
          <p className="max-w-md text-[15px] text-mute">
            Short, practical reads — no jargon, no filler.
          </p>
        </div>
        <div className="border-t border-line">
          {posts.map((p) => (
            <div
              key={p.title}
              className="grid items-baseline gap-2 border-b border-line py-6 sm:grid-cols-[140px_1fr_100px] sm:gap-7"
            >
              <div className="text-xs font-semibold text-blue">{p.tag}</div>
              <h3 className="text-[17px] font-semibold">{p.title}</h3>
              <div className="text-[12.5px] text-mute sm:text-right">{p.read}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="grid items-end gap-10 pb-10 sm:grid-cols-2">
          <h2 className="text-[28px] sm:text-[32px]">Tax Calendar</h2>
          <p className="max-w-md text-[15px] text-mute">
            Key statutory deadlines, kept up to date so you never miss one.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {calendar.map((c, i) => (
            <div
              key={`${c.date}-${c.name}`}
              className={`grid items-center gap-5 px-7 py-5 sm:grid-cols-[120px_1fr_90px] ${
                i !== calendar.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="font-serif text-lg">{c.date}</div>
              <div className="text-[14.5px] font-medium">{c.name}</div>
              <div className="w-fit rounded-full bg-blue/10 px-2.5 py-1 text-[11.5px] font-semibold text-blue">
                {c.freq}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-navy p-11 sm:p-14">
          <div>
            <h2 className="max-w-xs text-[26px] text-white sm:text-[30px]">
              Never miss a deadline again
            </h2>
            <p className="mt-2 max-w-sm text-[14.5px] text-[#9FB4CC]">
              Let us handle your filings so the calendar is our concern, not
              yours.
            </p>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-blue px-6 py-3.5 text-sm font-semibold text-white"
          >
            Talk to an advisor
          </Link>
        </div>
      </section>
    </>
  );
}