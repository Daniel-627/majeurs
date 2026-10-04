import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tools, getToolBySlug } from "@/lib/data/tools";
import VatCalculator from "@/components/tools/VatCalculator";
import PayeCalculator from "@/components/tools/PayeCalculator";
import ProfitMarginCalculator from "@/components/tools/ProfitMarginCalculator";
import LoanCalculator from "@/components/tools/LoanCalculator";
import BreakEvenCalculator from "@/components/tools/BreakEvenCalculator";
import ExpenseCalculator from "@/components/tools/ExpenseCalculator";

const components: Record<string, React.ComponentType> = {
  "vat-calculator": VatCalculator,
  "paye-calculator": PayeCalculator,
  "profit-margin-calculator": ProfitMarginCalculator,
  "loan-calculator": LoanCalculator,
  "break-even-calculator": BreakEvenCalculator,
  "expense-calculator": ExpenseCalculator,
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  return { title: tool ? `${tool.title} — Majeurs Ltd` : "Tools — Majeurs Ltd" };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const Calculator = components[slug];
  if (!tool || !Calculator) notFound();

  return (
    <>
      <header className="mx-auto max-w-6xl px-8 pb-10 pt-20">
        <div className="text-[13.5px] font-semibold text-blue">
          Tools / {tool.title}
        </div>
        <h1 className="mt-4 max-w-xl text-[32px] sm:text-[40px]">
          {tool.desc}
        </h1>
      </header>

      <section className="mx-auto max-w-xl px-8 pb-24">
        <Calculator />
      </section>
    </>
  );
}
