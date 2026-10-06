import type { Metadata } from "next";
import AvatarImage from "@/components/ui/AvatarImage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Majeurs Ltd — our story, mission, values and the team behind our accounting, tax and advisory services in Kenya.",
};

const values = [
  ["Accuracy", "Reliable, precise, and on time — every filing, every report."],
  ["Integrity", "We do what's right, even when it's the harder answer."],
  ["Clarity", "Complex issues explained in plain terms, not jargon."],
  ["Partnership", "Your goals set the agenda — not our billable hours."],
];

const timeline = [
  ["2021", "Majeurs founded to serve SMEs across Nairobi with hands-on bookkeeping and tax support."],
  ["2022", "Payroll and statutory compliance added as a dedicated service line."],
  ["2023", "First NGO and organizational clients onboarded, expanding our reporting practice."],
  ["2024", "Audit & assurance launched; client base passes 100 businesses served."],
  ["2025–26", "Business advisory formalized as clients ask for more than compliance — for direction."],
];

// Photo path convention: /public/images/team/<slug>.jpg
// Drop a photo in with the matching filename and it's used automatically —
// nothing else needs editing. No file there yet? The navy initial avatar
// (already built) shows instead, so the site works either way.
const team = [
  { slug: "amina", initial: "A", name: "Amina K.", role: "Founder & Managing Partner", bio: "Leads client strategy and oversees audit & assurance." },
  { slug: "david", initial: "D", name: "David O.", role: "Head of Tax", bio: "Manages compliance, filings and tax planning for the firm's clients." },
  { slug: "christine", initial: "C", name: "Christine M.", role: "Head of Bookkeeping", bio: "Runs day-to-day reconciliation and financial reporting." },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-8 py-11 sm:grid-cols-[220px_1fr] sm:gap-14">
        <div className="pt-1 text-[13px] font-semibold text-blue">{label}</div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-10 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">About Majeurs</div>
        <h1 className="mt-4 max-w-xl text-[32px] sm:text-[46px]">
          More than accounting. A partner in your financial journey.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mute">
          We started Majeurs because too many businesses were making
          decisions on gut feeling — not because they wanted to, but because
          their numbers weren&apos;t telling them anything useful.
        </p>
      </header>

      <Row label="Our story">
        <div className="max-w-2xl space-y-4 text-[17px] text-mute">
          <p>
            Majeurs began with a simple observation: most small and
            mid-sized businesses in Kenya treat accounting as a compliance
            chore — something to hand off once a year and forget about. We
            thought it should be the opposite. Done well, your books are the
            clearest view you&apos;ll ever have of your own business.
          </p>
          <p>
            We built the firm around that idea — combining proper technical
            rigor with an approach that actually explains what the numbers
            mean, so decisions get easier, not harder.
          </p>
        </div>
      </Row>

      <Row label="Mission & vision">
        <h2 className="text-[26px]">Financial clarity, as standard.</h2>
        <p className="mt-3.5 max-w-xl text-[15.5px] text-mute">
          Our mission is to give every client — business, startup,
          individual or organization — financial information they can
          actually act on. Our vision is a Kenya where sound financial
          management isn&apos;t a luxury reserved for large companies, but the
          norm for businesses of every size.
        </p>
      </Row>

      <Row label="Our values">
        <h2 className="text-[26px]">What guides how we work</h2>
        <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {values.map(([t, d]) => (
            <div key={t} className="bg-white p-6">
              <div className="text-[15px] font-semibold">{t}</div>
              <div className="mt-2 text-[13.5px] text-mute">{d}</div>
            </div>
          ))}
        </div>
      </Row>

      <Row label="Our history">
        <h2 className="text-[26px]">Five years of steady growth</h2>
        <div className="mt-5">
          {timeline.map(([year, desc]) => (
            <div
              key={year}
              className="grid grid-cols-[80px_1fr] gap-6 border-t border-line py-5 first:border-t-0"
            >
              <div className="font-serif text-[19px]">{year}</div>
              <p className="text-[14.5px] text-mute">{desc}</p>
            </div>
          ))}
        </div>
      </Row>

      <Row label="Team">
        <h2 className="text-[26px]">The people behind the numbers</h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border border-line bg-white p-6">
              <AvatarImage
                src={`/images/team/${m.slug}.jpg`}
                alt={m.name}
                fallbackInitial={m.initial}
                size={44}
              />
              <div className="mt-4 text-[15.5px] font-semibold">{m.name}</div>
              <div className="mt-0.5 text-[13px] text-blue">{m.role}</div>
              <p className="mt-3 text-[13.5px] text-mute">{m.bio}</p>
            </div>
          ))}
        </div>
      </Row>

      <section className="mx-auto max-w-6xl px-8 py-20">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-navy p-11 sm:p-14">
          <div>
            <h2 className="max-w-xs text-[26px] text-white sm:text-[32px]">
              Why clients choose us
            </h2>
            <p className="mt-2 max-w-sm text-[14.5px] text-[#9FB4CC]">
              Accuracy, integrity and a genuine partnership — not just a firm
              that files on time.
            </p>
          </div>
          <a
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-blue px-6 py-3.5 text-sm font-semibold text-white"
          >
            Talk to an advisor
          </a>
        </div>
      </section>
    </>
  );
}