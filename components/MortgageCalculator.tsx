"use client";

import { useState } from "react";

const aed = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

// Standard amortisation: M = P r (1+r)^n / ((1+r)^n - 1).
// UAE banks lend up to 80% for expats on a first home, so the default down payment is 20%.
export default function MortgageCalculator({ price }: { price: number }) {
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const loan = price * (1 - down / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? loan / n : (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1);

  const slider = (label: string, value: number, set: (v: number) => void, min: number, max: number, step: number, suffix: string) => (
    <label className="block space-y-1">
      <span className="flex justify-between text-xs font-semibold text-ink-soft">
        {label}
        <span className="text-ink">
          {value}
          {suffix}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-sand-600" />
    </label>
  );

  return (
    <div className="rounded-2xl bg-white border border-sand-200 p-5 space-y-4">
      <h3 className="font-display text-xl">Mortgage estimate</h3>
      {slider("Down payment", down, setDown, 20, 80, 5, "%")}
      {slider("Interest rate", rate, setRate, 2, 8, 0.25, "%")}
      {slider("Term", years, setYears, 5, 25, 1, " years")}
      <div className="rounded-xl bg-sand-100 p-4">
        <p className="text-xs text-ink-soft">Estimated monthly payment</p>
        <p className="text-2xl font-semibold">AED {aed.format(Math.round(monthly))}</p>
        <p className="text-xs text-ink-soft mt-1">
          Loan AED {aed.format(loan)} · down payment AED {aed.format(price - loan)}
        </p>
      </div>
      <p className="text-[11px] text-ink-soft">Indicative only. Excludes DLD fees (4%), agency and bank fees.</p>
    </div>
  );
}
