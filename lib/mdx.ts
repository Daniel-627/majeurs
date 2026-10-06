import fs from "fs";
import path from "path";
import matter from "gray-matter";

const INSIGHTS_DIR = path.join(process.cwd(), "content/insights");

export interface InsightFrontmatter {
  title: string;
  tag: string;
  description: string;
  date: string; // ISO format, e.g. "2026-09-10"
  readTime: string;
}

export interface InsightSummary extends InsightFrontmatter {
  slug: string;
}

export function getAllInsights(): InsightSummary[] {
  const files = fs
    .readdirSync(INSIGHTS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const insights = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(INSIGHTS_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return { slug, ...(data as InsightFrontmatter) };
  });

  return insights.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getInsightBySlug(slug: string) {
  const filePath = path.join(INSIGHTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as InsightFrontmatter, content, slug };
}
