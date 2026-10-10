import type { Metadata } from "next";
import Link from "next/link";
import SignOutButton from "@/components/inbox/SignOutButton";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-paper">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-line bg-white px-5 py-3">
        <div className="flex items-center gap-6">
          <span className="font-serif text-base">Majeurs Inbox</span>
          <nav className="flex gap-4 text-[13.5px] font-medium text-mute">
            <Link href="/inbox" className="hover:text-ink">
              Messages
            </Link>
            <Link href="/inbox/leads" className="hover:text-ink">
              Leads
            </Link>
          </nav>
        </div>
        <SignOutButton />
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
