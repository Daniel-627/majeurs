// Tax calendar — stored as RULES, not fixed dates, so "next due" is always
// computed from today and never goes stale.
//
// When the law changes, edit the rules below and update CALENDAR_LAST_REVIEWED.
// Sources: KRA's own pages (PAYE 9th; VAT, withholding and turnover tax 20th)
// and KRA's Sept 2026 notices on the Finance Act 2026 filing-date changes.
// Where reports disagreed on annual returns, the EARLIEST plausible date is
// shown — filing early is harmless, filing late costs a penalty.

export const CALENDAR_LAST_REVIEWED = "October 2026";

interface DeadlineRule {
  name: string;
  freq: "Monthly" | "Annual" | "One-off";
  day: number;
  month?: number; // 1–12 — Annual and One-off only
  year?: number; // One-off only
  note?: string;
}

export const deadlineRules: DeadlineRule[] = [
  { name: "PAYE return & remittance", freq: "Monthly", day: 9 },
  { name: "VAT return", freq: "Monthly", day: 20 },
  { name: "Withholding tax", freq: "Monthly", day: 20 },
  { name: "Turnover tax", freq: "Monthly", day: 20 },
  {
    name: "Nil income tax return",
    freq: "Annual",
    month: 1,
    day: 31,
    note: "New from 2027 under Finance Act 2026 (previously June 30).",
  },
  {
    name: "Individual income tax return",
    freq: "Annual",
    month: 4,
    day: 30,
    note: "New from 2027 under Finance Act 2026 (previously June 30). Some income types may differ — confirm yours with us.",
  },
  {
    name: "Company income tax return",
    freq: "Annual",
    month: 6,
    day: 30,
    note: "Due six months after your financial year-end — June 30 for December year-ends.",
  },
  {
    name: "Tax amnesty — clear outstanding principal tax",
    freq: "One-off",
    month: 12,
    day: 31,
    year: 2026,
    note: "Penalties and interest waived once the principal is paid.",
  },
];

export interface UpcomingDeadline {
  name: string;
  freq: DeadlineRule["freq"];
  label: string;
  note?: string;
  sortKey: number;
}

export function getUpcomingDeadlines(now: Date = new Date()): UpcomingDeadline[] {
  // Work in East Africa Time (UTC+3) so "today" matches Kenya, not the server.
  const eat = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const y = eat.getUTCFullYear();
  const m = eat.getUTCMonth(); // 0-based
  const d = eat.getUTCDate();
  const today = Date.UTC(y, m, d);

  const results: UpcomingDeadline[] = [];

  for (const rule of deadlineRules) {
    let next: number;

    if (rule.freq === "Monthly") {
      next = d <= rule.day ? Date.UTC(y, m, rule.day) : Date.UTC(y, m + 1, rule.day);
    } else if (rule.freq === "Annual") {
      const thisYear = Date.UTC(y, rule.month! - 1, rule.day);
      next = thisYear >= today ? thisYear : Date.UTC(y + 1, rule.month! - 1, rule.day);
    } else {
      next = Date.UTC(rule.year!, rule.month! - 1, rule.day);
      if (next < today) continue; // one-offs disappear once passed
    }

    const label = new Date(next).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(rule.freq === "Monthly" ? {} : { year: "numeric" }),
      timeZone: "UTC",
    });

    results.push({
      name: rule.name,
      freq: rule.freq,
      label,
      note: rule.note,
      sortKey: next,
    });
  }

  return results.sort((a, b) => a.sortKey - b.sortKey);
}
