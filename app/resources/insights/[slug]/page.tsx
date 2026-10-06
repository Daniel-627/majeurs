import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllInsights, getInsightBySlug } from "@/lib/mdx";

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

  return (
    <article className="mx-auto max-w-2xl px-8 pb-24 pt-20">
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