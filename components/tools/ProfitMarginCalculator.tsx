"use client";

import { useState } from "react";
import { CalcField, inputClass, ResultRow, fmtKES } from "./CalcField";

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState(500000);
  const [costs, setCosts] = useState(350000);

  const profit = revenue - costs;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = costs > 0 ? (profit / costs) * 100 : 0;

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <CalcField label="Revenue (KES)">
        <input
          type="number"
          min={0}
          value={revenue}
          onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </CalcField>
      <CalcField label="Total costs (KES)">
        <input
          type="number"
          min={0}
          value={costs}
          onChange={(e) => setCosts(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </CalcField>
      <ResultRow label="Profit" value={fmtKES(profit)} />
      <ResultRow label="Profit margin" value={`${margin.toFixed(1)}%`} />
      <ResultRow label="Markup on costs" value={`${markup.toFixed(1)}%`} />
    </div>
  );
}
