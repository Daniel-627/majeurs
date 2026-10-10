"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/resources", label: "Resources" },
  { href: "/tools", label: "Tools" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes. Comparing during
  // render (React's sanctioned pattern for this) instead of in an effect —
  // avoids the setState-in-effect cascading-render warning.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[17px] font-bold tracking-tight"
        >
          <svg width="26" height="22" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 34V4L11 15V34H0Z" fill="#0B2035" />
            <path d="M22 34V4L11 15L22 26V34Z" fill="#0B2035" />
            <rect x="24" y="20" width="4.4" height="14" fill="#1268E8" />
            <rect x="30" y="14" width="4.4" height="20" fill="#3C8CFF" />
            <rect x="36" y="8" width="4" height="26" fill="#1268E8" />
          </svg>
          MAJEURS LTD
        </Link>

        {/* Desktop links */}
        <div className="hidden gap-8 text-[14.5px] font-medium md:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative pb-1 transition-colors ${active ? "text-ink" : "text-mute hover:text-ink"}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                <span
                  className={`absolute -bottom-[1px] left-0 right-0 h-[2px] origin-left rounded-full bg-blue transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden whitespace-nowrap rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white sm:inline-block"
          >
            Book Consultation
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3.5 py-2.5 text-[15px] font-medium ${
                      active ? "bg-paper text-ink" : "text-mute"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="mt-2 rounded-lg bg-navy px-3.5 py-3 text-center text-[15px] font-semibold text-white"
              >
                Book Consultation
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
