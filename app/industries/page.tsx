import type { Metadata } from "next";
import Link from "next/link";
import { industries } from "@/lib/data/industries";

export const metadata: Metadata = {
  title: "Industries — Majeurs Ltd",
};

export default function IndustriesPage() {
  const [smes, startups, individuals, ngos] = industries;

  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-12 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">Who we serve</div>
        <h1 className="mt-4 max-w-xl text-[36px] sm:text-[46px]">
          Built for how your organization actually works.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mute">
          We work with a diverse range of clients — from small enterprises
          to established companies, startups, individuals and
          organizations — and shape our approach to fit each one.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="grid gap-5 sm:grid-cols-[1.3fr_0.7fr]">
          <div className="flex flex-col gap-5">
            <Link
              href={`/industries/${smes.slug}`}
              className="rounded-2xl bg-navy p-10"
            >
              <div className="font-mono text-[12.5px] text-blue-light">
                /industries/{smes.slug}
              </div>
              <h2 className="mt-3.5 text-[28px] text-white">{smes.name}</h2>
              <p className="mt-3 max-w-md text-[14.5px] text-[#9FB4CC]">
                {smes.dek}
              </p>
            </Link>
            <Link
              href={`/industries/${startups.slug}`}
              className="rounded-2xl border border-line bg-white p-9"
            >
              <div className="font-mono text-[12.5px] text-blue">
                /industries/{startups.slug}
              </div>
              <h2 className="mt-3.5 text-[24px]">{startups.name}</h2>
              <p className="mt-3 max-w-md text-[14.5px] text-mute">
                {startups.dek}
              </p>
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <Link
              href={`/industries/${individuals.slug}`}
              className="rounded-2xl border border-line bg-white p-9"
            >
              <div className="font-mono text-[12.5px] text-blue">
                /industries/{individuals.slug}
              </div>
              <h2 className="mt-3.5 text-[24px]">{individuals.name}</h2>
              <p className="mt-3 text-[14.5px] text-mute">{individuals.dek}</p>
            </Link>
            <Link
              href={`/industries/${ngos.slug}`}
              className="rounded-2xl border border-line bg-white p-9"
            >
              <div className="font-mono text-[12.5px] text-blue">
                /industries/{ngos.slug}
              </div>
              <h2 className="mt-3.5 text-[24px]">{ngos.name}</h2>
              <p className="mt-3 text-[14.5px] text-mute">{ngos.dek}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-paper p-11 sm:p-14" style={{ border: "1px solid #DEE6EF" }}>
          <div>
            <h2 className="max-w-xs text-[26px] sm:text-[30px]">
              Don&apos;t see your situation here?
            </h2>
            <p className="mt-2 max-w-sm text-[14.5px] text-mute">
              Tell us about your business and we&apos;ll point you in the
              right direction.
            </p>
          </div>
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
