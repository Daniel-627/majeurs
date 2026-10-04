"use client";

import { useState } from "react";
import { CalcField, inputClass, ResultRow, fmtKES } from "./CalcField";

// Kenya PAYE monthly bands (2026, Income Tax Act Cap 470 — verify against
// current KRA guidance before relying on this for real payroll).
const BANDS = [
  { upTo: 24000, rate: 0.1 },
  { upTo: 32333, rate: 0.25 },
  { upTo: 500000, rate: 0.3 },
  { upTo: 800000, rate: 0.325 },
  { upTo: Infinity, rate: 0.35 },
];
const PERSONAL_RELIEF = 2400;

function calculatePaye(grossPay: number) {
  let remaining = grossPay;
  let lastCap = 0;
  let tax = 0;

  for (const band of BANDS) {
    const bandSize = band.upTo - lastCap;
    const taxableInBand = Math.min(Math.max(remaining, 0), bandSize);
    tax += taxableInBand * band.rate;
    remaining -= taxableInBand;
    lastCap = band.upTo;
    if (remaining <= 0) break;
  }

  const payable = Math.max(tax - PERSONAL_RELIEF, 0);
  return { grossTax: tax, payable };
}

export default function PayeCalculator() {
  const [gross, setGross] = useState(80000);
  const { grossTax, payable } = calculatePaye(gross);

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <CalcField label="Gross monthly pay (KES)">
        <input
          type="number"
          min={0}
          value={gross}
          onChange={(e) => setGross(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </CalcField>
      <ResultRow label="Tax before relief" value={fmtKES(grossTax)} />
      <ResultRow label="Personal relief" value={fmtKES(PERSONAL_RELIEF)} />
      <ResultRow label="PAYE payable" value={fmtKES(payable)} />
      <p className="mt-4 text-[12px] text-mute">
        Estimate only — excludes NSSF, SHIF and Housing Levy. Confirm exact
        figures on KRA&apos;s official calculator before filing.
      </p>
    </div>
  );
}
