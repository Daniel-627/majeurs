import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Served at /robots.txt. Keeps the private staff areas and API out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/inbox", "/login", "/api/"],
      },
    ],
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
