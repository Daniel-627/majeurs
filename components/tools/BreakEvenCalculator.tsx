"use client";

import { useState } from "react";
import { CalcField, inputClass, ResultRow, fmtKES } from "./CalcField";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(200000);
  const [pricePerUnit, setPricePerUnit] = useState(1500);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(800);

  const contribution = pricePerUnit - variableCostPerUnit;
  const breakEvenUnits = contribution > 0 ? fixedCosts / contribution : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <CalcField label="Monthly fixed costs (KES)">
        <input
          type="number"
          min={0}
          value={fixedCosts}
          onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </CalcField>
      <div className="grid grid-cols-2 gap-4">
        <CalcField label="Price per unit (KES)">
          <input
            type="number"
            min={0}
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </CalcField>
        <CalcField label="Variable cost per unit (KES)">
          <input
            type="number"
            min={0}
            value={variableCostPerUnit}
            onChange={(e) =>
              setVariableCostPerUnit(parseFloat(e.target.value) || 0)
            }
            className={inputClass}
          />
        </CalcField>
      </div>
      <ResultRow
        label="Break-even units"
        value={isFinite(breakEvenUnits) ? Math.ceil(breakEvenUnits).toLocaleString() : "—"}
      />
      <ResultRow label="Break-even revenue" value={fmtKES(breakEvenRevenue)} />
    </div>
  );
}
