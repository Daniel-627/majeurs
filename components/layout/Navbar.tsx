import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/resources", label: "Resources" },
  { href: "/tools", label: "Tools" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[17px] tracking-tight">
          <svg width="26" height="22" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 34V4L11 15V34H0Z" fill="#0B2035" />
            <path d="M22 34V4L11 15L22 26V34Z" fill="#0B2035" />
            <rect x="24" y="20" width="4.4" height="14" fill="#1268E8" />
            <rect x="30" y="14" width="4.4" height="20" fill="#3C8CFF" />
            <rect x="36" y="8" width="4" height="26" fill="#1268E8" />
          </svg>
          MAJEURS LTD
        </Link>

        <div className="hidden gap-8 text-[14.5px] font-medium text-mute md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="whitespace-nowrap rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white"
        >
          Book Consultation
        </Link>
      </div>
    </nav>
  );
}
