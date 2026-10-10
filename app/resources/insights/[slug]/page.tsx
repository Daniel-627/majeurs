import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllInsights, getInsightBySlug } from "@/lib/mdx";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllInsights().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) return { title: "Insight" };
  return {
    title: insight.frontmatter.title,
    description: insight.frontmatter.description,
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const { frontmatter, content } = insight;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/resources/insights/${slug}`,
  };

  return (
    <article className="mx-auto max-w-2xl px-8 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/resources" className="text-[13px] font-semibold text-blue">
        ← Resources
      </Link>
      <div className="mt-6 text-xs font-semibold text-blue">
        {frontmatter.tag}
      </div>
      <h1 className="mt-3 text-[30px] sm:text-[38px]">{frontmatter.title}</h1>
      <div className="mt-3 text-[13px] text-mute">{frontmatter.readTime}</div>

      <div className="prose-majeurs mt-10">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
