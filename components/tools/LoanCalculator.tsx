"use client";

import { useState } from "react";
import { CalcField, inputClass, ResultRow, fmtKES } from "./CalcField";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [annualRate, setAnnualRate] = useState(14);
  const [years, setYears] = useState(3);

  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / n
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - principal;

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <CalcField label="Loan amount (KES)">
        <input
          type="number"
          min={0}
          value={principal}
          onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </CalcField>
      <div className="grid grid-cols-2 gap-4">
        <CalcField label="Annual interest rate (%)">
          <input
            type="number"
            min={0}
            step={0.1}
            value={annualRate}
            onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
            className={inputClass}
          />
        </CalcField>
        <CalcField label="Term (years)">
          <input
            type="number"
            min={1}
            value={years}
            onChange={(e) => setYears(parseFloat(e.target.value) || 1)}
            className={inputClass}
          />
        </CalcField>
      </div>
      <ResultRow label="Monthly payment" value={fmtKES(monthlyPayment)} />
      <ResultRow label="Total interest" value={fmtKES(totalInterest)} />
      <ResultRow label="Total repaid" value={fmtKES(totalPaid)} />
    </div>
  );
}
