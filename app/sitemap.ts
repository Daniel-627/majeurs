import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { tools } from "@/lib/data/tools";
import { getAllInsights } from "@/lib/mdx";

// Served at /sitemap.xml. New services, industries, tools and MDX articles
// are picked up automatically — nothing to maintain by hand.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const pages = ["", "/about", "/services", "/industries", "/resources", "/tools", "/contact"];

  return [
    ...pages.map((path) => ({ url: `${base}${path}` })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}` })),
    ...industries.map((i) => ({ url: `${base}/industries/${i.slug}` })),
    ...tools.map((t) => ({ url: `${base}/tools/${t.slug}` })),
    ...getAllInsights().map((a) => ({
      url: `${base}/resources/insights/${a.slug}`,
      lastModified: new Date(a.date),
    })),
  ];
}
