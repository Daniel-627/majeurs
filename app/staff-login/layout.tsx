import type { Metadata } from "next";

// Not linked anywhere on the site and kept out of search. (It is deliberately
// NOT listed in robots.txt either — that file is public, so listing it there
// would just advertise the address.)
export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function StaffLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
