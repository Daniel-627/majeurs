import Link from "next/link";
import { LogoFull } from "@/components/ui/Logo";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/resources", label: "Resources" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

export default function Footer() {
  return (
    <footer className="bg-navy pb-9 pt-14 text-[#9FB4CC]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <LogoFull height={52} reversed />
          <p className="mt-3.5 max-w-xs text-[13.5px] text-[#7E93AC]">
            Accounting, tax and advisory services for businesses, startups
            and individuals across Kenya.
          </p>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-semibold text-white">
            Quick Links
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13.5px]">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-semibold text-white">
            Contact
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            <span>{site.city}, Kenya</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[#1B3350] px-8 pt-6 text-[12.5px] text-[#6C82A0]">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
