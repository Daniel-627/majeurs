import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { industries, getIndustryBySlug } from "@/lib/data/industries";
import { Reveal, Stagger, Item } from "@/components/motion/primitives";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return { title: "Industries" };
  return { title: industry.name, description: industry.dek };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-12 pt-20">
        <div className="rise rise-1 text-[13.5px] font-semibold text-blue">
          Industries / {industry.name}
        </div>
        <h1 className="rise rise-2 mt-4 max-w-2xl text-[36px] sm:text-[46px]">
          {industry.dek}
        </h1>
      </header>

      <section className="mx-auto max-w-6xl border-t border-line px-8 py-14">
        <h2 className="text-[26px]">How we help</h2>
        <Stagger className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {industry.points.map((p) => (
            <Item key={p} className="flex items-start gap-3 bg-white p-6">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue" />
              <p className="text-[14.5px] text-mute">{p}</p>
            </Item>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <Reveal className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-navy p-11 sm:p-14">
          <div>
            <h2 className="max-w-xs text-[26px] text-white sm:text-[30px]">
              Let&apos;s talk about your finances.
            </h2>
            <p className="mt-2 max-w-sm text-[14.5px] text-[#9FB4CC]">
              Book a free consultation to see how we can help.
            </p>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-blue px-6 py-3.5 text-sm font-semibold text-white"
          >
            Book a consultation
          </Link>
        </Reveal>
      </section>
    </>
  );
}
