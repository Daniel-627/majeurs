import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getServiceBySlug } from "@/lib/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return { title: service.title, description: service.dek };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-12 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">
          Services / {service.kicker}
        </div>
        <h1 className="mt-4 max-w-2xl text-[36px] sm:text-[46px]">
          {service.dek}
        </h1>
      </header>

      <section className="mx-auto max-w-6xl border-t border-line px-8 py-14">
        <h2 className="text-[26px]">What&apos;s included</h2>
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {service.benefits.map((b) => (
            <div key={b} className="flex items-start gap-3 bg-white p-6">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue" />
              <p className="text-[14.5px] text-mute">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-line px-8 py-14">
        <h2 className="text-[26px]">Frequently asked questions</h2>
        <div className="mt-6 space-y-6">
          {service.faqs.map((f) => (
            <div key={f.q}>
              <div className="text-[15px] font-semibold">{f.q}</div>
              <p className="mt-1.5 max-w-2xl text-[14.5px] text-mute">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-navy p-11 sm:p-14">
          <div>
            <h2 className="max-w-xs text-[26px] text-white sm:text-[30px]">
              Ready to talk about {service.title.toLowerCase()}?
            </h2>
            <p className="mt-2 max-w-sm text-[14.5px] text-[#9FB4CC]">
              Book a free consultation and we&apos;ll scope exactly what you
              need.
            </p>
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-blue px-6 py-3.5 text-sm font-semibold text-white"
          >
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  );
}