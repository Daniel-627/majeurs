import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://majeurs.co.ke";
const DESCRIPTION =
  "Professional accounting, tax, and advisory services for businesses, startups, individuals and organizations across Kenya.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Majeurs Ltd — Clarity in Numbers. Confidence in Decisions.",
    template: "%s | Majeurs Ltd",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Majeurs Ltd",
    description: DESCRIPTION,
    siteName: "Majeurs Ltd",
    type: "website",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Majeurs Ltd",
    description: DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}