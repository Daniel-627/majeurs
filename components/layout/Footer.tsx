import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy pb-9 pt-14 text-[#9FB4CC]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-bold text-white">
            <svg width="22" height="19" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 34V4L11 15V34H0Z" fill="#fff" />
              <path d="M22 34V4L11 15L22 26V34Z" fill="#fff" />
              <rect x="24" y="20" width="4.4" height="14" fill="#1268E8" />
              <rect x="30" y="14" width="4.4" height="20" fill="#3C8CFF" />
              <rect x="36" y="8" width="4" height="26" fill="#1268E8" />
            </svg>
            MAJEURS LTD
          </div>
          <p className="mt-3.5 max-w-xs text-[13.5px] text-[#7E93AC]">
            Accounting, tax and advisory services for businesses, startups
            and individuals across Kenya.
          </p>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-semibold text-white">
            Quick Links
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <div className="mb-3.5 text-[13px] font-semibold text-white">
            Contact
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <a href="tel:+254700123456">+254 700 123 456</a>
            <a href="mailto:info@majeurs.co.ke">info@majeurs.co.ke</a>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[#1B3350] px-8 pt-6 text-[12.5px] text-[#6C82A0]">
        © {new Date().getFullYear()} Majeurs Ltd. All rights reserved.
      </div>
    </footer>
  );
}
