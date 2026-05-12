"use client";

import type { MacroIndicators } from "@/lib/types";

const LABELS: { key: keyof MacroIndicators; label: string }[] = [
  { key: "marketConfidence", label: "Market confidence" },
  { key: "economicStability", label: "Economic stability" },
  { key: "growthMomentum", label: "Growth momentum" },
];

function barTone(v: number): string {
  if (v >= 66) return "from-emerald-400/90 to-emerald-600/80";
  if (v >= 40) return "from-amber-300/85 to-amber-600/75";
  return "from-rose-400/80 to-rose-600/75";
}

export function MacroIndicatorBars({ indicators }: { indicators: MacroIndicators }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {LABELS.map(({ key, label }) => {
        const v = indicators[key];
        return (
          <div
            key={key}
            className="rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4 shadow-inner shadow-black/30"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                {label}
              </span>
              <span className="font-mono text-sm tabular-nums text-zinc-200">{v}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800/80 ring-1 ring-inset ring-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${barTone(v)} transition-[width] duration-700 ease-out`}
                style={{ width: `${v}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] leading-snug text-zinc-600">
              AI-estimated pulse from headlines — illustrative, not official data.
            </p>
          </div>
        );
      })}
    </div>
  );
}
