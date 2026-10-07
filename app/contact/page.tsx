import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free consultation with Majeurs Ltd — accounting, tax and advisory services across Kenya.",
};

export default function ContactPage() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-10 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">Get in touch</div>
        <h1 className="mt-4 max-w-xl text-[30px] sm:text-[42px]">
          Let&apos;s talk about your finances.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-mute">
          Tell us a bit about your business and what you need — we&apos;ll
          get back to you within one business day.
        </p>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-8 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
          <div className="bg-navy p-6">
            <div className="text-xs font-semibold text-blue-light">Phone</div>
            <a href={site.phoneHref} className="mt-1.5 block text-white">
              {site.phone}
            </a>
          </div>
          <div className="bg-white p-6">
            <div className="text-xs font-semibold text-blue">Email</div>
            <a href={`mailto:${site.email}`} className="mt-1.5 block">
              {site.email}
            </a>
          </div>
          <div className="bg-white p-6">
            <div className="text-xs font-semibold text-blue">Office</div>
            <div className="mt-1.5">{site.city}, Kenya</div>
          </div>
          <div className="bg-white p-6">
            <div className="text-xs font-semibold text-blue">Hours</div>
            <div className="mt-1.5">{site.hours}</div>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}