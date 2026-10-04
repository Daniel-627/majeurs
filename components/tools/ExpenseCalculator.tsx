"use client";

import { useState } from "react";
import { inputClass, fmtKES } from "./CalcField";

interface ExpenseRow {
  id: string;
  label: string;
  amount: number;
}

export default function ExpenseCalculator() {
  const [rows, setRows] = useState<ExpenseRow[]>([
    { id: "1", label: "Rent", amount: 50000 },
    { id: "2", label: "Salaries", amount: 150000 },
    { id: "3", label: "Utilities", amount: 15000 },
  ]);

  function update(id: string, field: "label" | "amount", value: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, [field]: field === "amount" ? parseFloat(value) || 0 : value }
          : r
      )
    );
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: Date.now().toString(), label: "", amount: 0 },
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <div className="mb-1.5 text-xs font-semibold text-mute">
        Recurring monthly expenses
      </div>
      {rows.map((r) => (
        <div key={r.id} className="mb-2.5 flex gap-2">
          <input
            value={r.label}
            onChange={(e) => update(r.id, "label", e.target.value)}
            placeholder="Expense name"
            className={inputClass}
          />
          <input
            type="number"
            min={0}
            value={r.amount}
            onChange={(e) => update(r.id, "amount", e.target.value)}
            className={`${inputClass} w-36`}
          />
          <button
            onClick={() => removeRow(r.id)}
            className="rounded-lg border border-line px-3 text-sm text-mute"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="mt-1 text-[13px] font-semibold text-blue"
      >
        + Add expense
      </button>
      <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
        <div className="text-[13px] text-mute">Total monthly burn</div>
        <div className="font-serif text-2xl text-blue">{fmtKES(total)}</div>
      </div>
    </div>
  );
}
