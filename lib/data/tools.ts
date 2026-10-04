export interface ToolInfo {
  slug: string;
  title: string;
  desc: string;
}

export const tools: ToolInfo[] = [
  { slug: "vat-calculator", title: "VAT Calculator", desc: "Add or extract 16% VAT from an amount." },
  { slug: "paye-calculator", title: "PAYE Calculator", desc: "Estimate monthly PAYE from gross pay." },
  { slug: "profit-margin-calculator", title: "Profit Margin Calculator", desc: "Work out gross and net margin from revenue and costs." },
  { slug: "loan-calculator", title: "Loan Calculator", desc: "See monthly repayments for a principal, rate and term." },
  { slug: "break-even-calculator", title: "Break-even Calculator", desc: "Find the sales volume that covers your fixed and variable costs." },
  { slug: "expense-calculator", title: "Business Expense Calculator", desc: "Total up recurring costs to see your real monthly burn." },
];

export function getToolBySlug(slug: string) {
  return tools.find((t) => t.slug === slug);
}
