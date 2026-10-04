"use client";

import { useState } from "react";
import { CalcField, inputClass, ResultRow, fmtKES } from "./CalcField";

const RATE = 0.16;

export default function VatCalculator() {
  const [amount, setAmount] = useState(10000);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");

  let net = amount;
  let vat = amount * RATE;
  let total = net + vat;

  if (mode === "inclusive") {
    total = amount;
    net = amount / (1 + RATE);
    vat = total - net;
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-7">
      <CalcField label="Amount (KES)">
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </CalcField>
      <CalcField label="Calculation">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as typeof mode)}
          className={inputClass}
        >
          <option value="exclusive">Add VAT (amount excludes VAT)</option>
          <option value="inclusive">Extract VAT (amount includes VAT)</option>
        </select>
      </CalcField>
      <ResultRow label="Net amount" value={fmtKES(net)} />
      <ResultRow label="VAT (16%)" value={fmtKES(vat)} />
      <ResultRow label="Total" value={fmtKES(total)} />
    </div>
  );
}
