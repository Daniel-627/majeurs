import Link from "next/link";

const services = [
  { n: "01", title: "Accounting & Bookkeeping", desc: "Accurate records, reconciled monthly, so your numbers are never a surprise.", href: "/services/accounting" },
  { n: "02", title: "Tax Services", desc: "Preparation, compliance and planning that keeps you ahead of KRA deadlines.", href: "/services/tax" },
  { n: "03", title: "Payroll", desc: "Statutory deductions and employee records, processed accurately every cycle.", href: "/services/payroll" },
  { n: "04", title: "Audit & Assurance", desc: "Independent review that gives your figures — and your stakeholders — confidence.", href: "/services/audit" },
  { n: "05", title: "Business Advisory", desc: "Strategic input when a decision is bigger than the last set of accounts.", href: "/services/advisory" },
  { n: "06", title: "Financial Reporting", desc: "Clear statements that tell you what's actually happening in the business.", href: "/services/financial-reporting" },
];

const industries = [
  { name: "Businesses", desc: "Accounting and compliance for SMEs and established companies." },
  { name: "Startups", desc: "Financial foundations for growing companies." },
  { name: "Individuals", desc: "Personal tax and financial support." },
  { name: "NGOs & Organizations", desc: "Reporting, compliance and financial management." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <header className="mx-auto max-w-6xl px-8 pb-24 pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-[13.5px] font-semibold text-blue">
              Accounting · Tax · Advisory
            </div>
            <h1 className="mt-4 text-[44px] leading-[1.08] sm:text-[56px]">
              Clarity in numbers.
              <br />
              Confidence in decisions.
            </h1>
            <p className="mt-5 max-w-md text-lg text-mute">
              We handle the books, the compliance, and the reporting — so you
              can run your business on facts, not guesswork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href="/contact"
                className="rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white"
              >
                Book a consultation
              </Link>
              <Link
                href="/services"
                className="rounded-lg border border-line px-6 py-3.5 text-sm font-semibold"
              >
                See our services
              </Link>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[20px] bg-navy p-9">
            <div className="absolute right-7 top-8 flex h-[140px] items-end gap-2">
              <div className="w-4 rounded-t bg-gradient-to-t from-blue to-blue-light" style={{ height: "40%" }} />
              <div className="w-4 rounded-t bg-gradient-to-t from-blue to-blue-light" style={{ height: "58%" }} />
              <div className="w-4 rounded-t bg-gradient-to-t from-blue to-blue-light" style={{ height: "74%" }} />
              <div className="w-4 rounded-t bg-gradient-to-t from-blue to-blue-light" style={{ height: "100%" }} />
            </div>
            <div className="absolute bottom-9 left-9 right-9 text-white">
              <div className="font-serif text-4xl">5+ yrs</div>
              <div className="mt-1.5 text-[13.5px] text-[#9FB4CC]">
                helping Kenyan businesses stay compliant and grow
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust strip */}
      <div className="border-y border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 px-8 py-6 text-sm text-mute">
          <div><b className="text-ink">100+</b> businesses served</div>
          <div><b className="text-ink">98%</b> client satisfaction</div>
          <div><b className="text-ink">6</b> core service areas</div>
          <div><b className="text-ink">Nairobi</b>, serving clients nationwide</div>
        </div>
      </div>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-8 py-24">
        <div className="grid items-end gap-10 pb-14 sm:grid-cols-2">
          <h2 className="text-[32px] sm:text-[38px]">
            Comprehensive financial solutions, built around how your business
            actually runs.
          </h2>
          <p className="max-w-md text-[15.5px] text-mute">
            From day-to-day bookkeeping to the advisory work that shapes real
            decisions — each service stands on its own.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.n}
              href={s.href}
              className="flex min-h-[190px] flex-col justify-between bg-white p-7 hover:bg-paper"
            >
              <div>
                <div className="text-[13px] font-semibold text-blue">{s.n}</div>
                <h3 className="mt-4 font-sans text-[19px] font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-mute">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Majeurs */}
      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="rounded-[22px] bg-navy p-11 sm:p-16">
          <h2 className="max-w-xs text-[28px] text-white sm:text-[34px]">
            More than numbers. A trusted partner.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              ["Accuracy", "Reliable, precise and on time — every filing, every report."],
              ["Integrity", "Doing what's right, always."],
              ["Clarity", "Complex issues, simple answers."],
              ["Partnership", "Your goals, our priority."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="text-[15.5px] font-semibold text-white">{t}</div>
                <div className="mt-1.5 text-[13.5px] leading-relaxed text-[#9FB4CC]">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="grid items-end gap-10 pb-10 sm:grid-cols-2">
          <h2 className="text-[32px] sm:text-[38px]">Who we serve</h2>
          <p className="max-w-md text-[15px] text-mute">
            From first-time founders to established firms, our approach
            adapts to where the business actually is.
          </p>
        </div>
        <div className="flex flex-col border-t border-line">
          {industries.map((i) => (
            <div
              key={i.name}
              className="grid gap-1.5 border-b border-line py-6 sm:grid-cols-[200px_1fr] sm:items-baseline sm:gap-6"
            >
              <div className="font-serif text-xl">{i.name}</div>
              <p className="max-w-xl text-[14.5px] text-mute">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl border border-line bg-paper p-11 sm:p-14">
          <h2 className="max-w-xs text-[26px] sm:text-[32px]">
            Let&apos;s put your finances in order.
          </h2>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white"
          >
            Talk to an advisor
          </Link>
        </div>
      </section>
    </>
  );
}