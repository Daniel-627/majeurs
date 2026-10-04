import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/data/tools";
import VatCalculator from "@/components/tools/VatCalculator";

export const metadata: Metadata = {
  title: "Tools — Majeurs Ltd",
};

export default function ToolsPage() {
  const [featured, ...rest] = tools;

  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-10 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">Majeurs Tools</div>
        <h1 className="mt-4 max-w-xl text-[36px] sm:text-[46px]">
          Free calculators, not just advice.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mute">
          Get a quick answer before you need a consultation — every tool runs
          right here, no sign-up required.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-8 pb-16">
        <div className="grid items-center gap-9 rounded-[20px] bg-navy p-9 sm:p-11 lg:grid-cols-2">
          <div>
            <div className="text-[12.5px] font-semibold text-blue-light">
              Featured tool
            </div>
            <h2 className="mt-3 text-[26px] text-white">{featured.title}</h2>
            <p className="mt-2.5 max-w-xs text-sm text-[#9FB4CC]">
              {featured.desc}
            </p>
          </div>
          <VatCalculator />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="grid items-end gap-10 pb-9 sm:grid-cols-2">
          <h2 className="text-[28px] sm:text-[32px]">More tools</h2>
          <p className="max-w-md text-[15px] text-mute">
            Not sure what you need? Ask Majeurs and we&apos;ll point you to
            the right one.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="flex min-h-[150px] flex-col justify-between bg-white p-7 hover:bg-paper"
            >
              <div>
                <h3 className="text-[16.5px] font-semibold">{t.title}</h3>
                <p className="mt-2 text-[13.5px] text-mute">{t.desc}</p>
              </div>
              <div className="mt-4 text-[12.5px] font-semibold text-blue">
                Open tool →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
