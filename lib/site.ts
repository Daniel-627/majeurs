// One place for the firm's public details. Footer, contact page, the chat
// "Call us" button and Google structured data all read from here, so you
// only ever update them once.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://majeurs.co.ke";

export const site = {
  name: "Majeurs Ltd",
  url: SITE_URL,
  description:
    "Professional accounting, tax, and advisory services for businesses, startups, individuals and organizations across Kenya.",

  // ⚠️ PLACEHOLDERS — replace with the real details before launch.
  phone: "+254 700 123 456",
  phoneHref: "tel:+254700123456",
  email: "info@majeurs.co.ke",
  city: "Nairobi",
  country: "KE",
  hours: "Mon–Fri, 8:00 AM – 5:00 PM",
  hoursSchema: "Mo-Fr 08:00-17:00",
};
