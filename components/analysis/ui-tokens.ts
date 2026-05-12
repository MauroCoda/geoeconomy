import type { RiskLevel, Sentiment } from "@/lib/types";

export const glassCard =
  "rounded-2xl border border-white/[0.07] bg-zinc-900/30 shadow-[0_8px_44px_-14px_rgba(0,0,0,0.72)] backdrop-blur-2xl";

export const glassCardHover =
  "transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-amber-400/15 motion-safe:hover:shadow-[0_22px_56px_-18px_rgba(251,191,36,0.08)]";

export function sentimentStyles(s: Sentiment): string {
  switch (s) {
    case "Positive":
      return "bg-emerald-500/14 text-emerald-100 ring-emerald-400/35 shadow-[0_0_24px_-4px_rgba(16,185,129,0.25)]";
    case "Negative":
      return "bg-rose-500/14 text-rose-100 ring-rose-400/35 shadow-[0_0_24px_-4px_rgba(244,63,94,0.22)]";
    default:
      return "bg-zinc-500/14 text-zinc-100 ring-zinc-400/28 shadow-[0_0_20px_-6px_rgba(255,255,255,0.06)]";
  }
}

export function riskStyles(r: RiskLevel): string {
  switch (r) {
    case "Low":
      return "bg-sky-500/12 text-sky-100 ring-sky-400/35";
    case "High":
      return "bg-amber-500/14 text-amber-100 ring-amber-400/40";
    default:
      return "bg-zinc-500/14 text-zinc-100 ring-zinc-400/28";
  }
}
