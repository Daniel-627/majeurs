import type { Metadata } from "next";
import Link from "next/link";
import { getAllInsights } from "@/lib/mdx";
import {
  getUpcomingDeadlines,
  CALENDAR_LAST_REVIEWED,
} from "@/lib/data/tax-calendar";

// Regenerate at most hourly so "next due" dates roll forward on their own
// instead of freezing at whatever day the site was last built.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Practical guides on VAT, PAYE and tax compliance, plus a running calendar of Kenyan statutory deadlines.",
};

export default function ResourcesPage() {
  const posts = getAllInsights();
  const calendar = getUpcomingDeadlines();

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
            <Link
              key={p.slug}
              href={`/resources/insights/${p.slug}`}
              className="grid items-baseline gap-2 border-b border-line py-6 transition-colors hover:bg-white sm:grid-cols-[140px_1fr_100px] sm:gap-7"
            >
              <div className="text-xs font-semibold text-blue">{p.tag}</div>
              <h3 className="text-[17px] font-semibold">{p.title}</h3>
              <div className="text-[12.5px] text-mute sm:text-right">
                {p.readTime}
              </div>
            </Link>
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
              key={c.name}
              className={`grid items-center gap-2 px-7 py-5 sm:grid-cols-[130px_1fr_90px] sm:gap-5 ${
                i !== calendar.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="font-serif text-lg">{c.label}</div>
              <div>
                <div className="text-[14.5px] font-medium">{c.name}</div>
                {c.note && (
                  <div className="mt-0.5 text-[12.5px] text-mute">{c.note}</div>
                )}
              </div>
              <div className="w-fit rounded-full bg-blue/10 px-2.5 py-1 text-[11.5px] font-semibold text-blue">
                {c.freq}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12.5px] text-mute">
          Based on KRA guidance and the Finance Act 2026 · Last reviewed{" "}
          {CALENDAR_LAST_REVIEWED}. Always confirm the exact date on iTax —
          deadlines can shift when they fall on a weekend or public holiday.
        </p>
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
