export function CalcField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-semibold text-mute">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none";

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-t border-line py-3 first:border-t-0">
      <div className="text-[13px] text-mute">{label}</div>
      <div className="font-serif text-xl text-blue">{value}</div>
    </div>
  );
}

export function fmtKES(n: number) {
  if (!isFinite(n) || isNaN(n)) return "KES 0";
  return "KES " + Math.round(n).toLocaleString();
}
