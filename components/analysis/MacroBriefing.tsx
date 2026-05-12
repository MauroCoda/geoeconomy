"use client";

import { MacroIndicatorBars } from "@/components/analysis/MacroIndicatorBars";
import { SectionDivider } from "@/components/analysis/SectionDivider";
import { glassCard, glassCardHover, riskStyles, sentimentStyles } from "@/components/analysis/ui-tokens";
import { countryCodeToFlagEmoji } from "@/lib/flags";
import { tryResolveFlagCode } from "@/lib/market-display";
import type { NewsApiSuccess } from "@/lib/types";

export function MacroBriefing({ data }: { data: NewsApiSuccess }) {
  const a = data.analysis;
  const flagCode = tryResolveFlagCode(data.country);

  return (
    <div className={`${glassCard} ${glassCardHover} p-6 sm:p-8 md:p-10`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl leading-none sm:text-4xl" aria-hidden>
              {flagCode ? countryCodeToFlagEmoji(flagCode) : "🌐"}
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {data.country}
              </h2>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {data.feedSource === "google-news-rss"
                  ? "Macro briefing · Google News RSS · en-US"
                  : "Macro briefing · Fallback headlines"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset transition duration-300 ${sentimentStyles(a.sentiment)}`}
          >
            {a.sentiment}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset transition duration-300 ${riskStyles(a.riskLevel)}`}
          >
            Risk · {a.riskLevel}
          </span>
        </div>
      </div>

      {data.aiError ? (
        <p className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-xs leading-relaxed text-amber-100/95">
          Model notice: {data.aiError}
        </p>
      ) : null}

      <SectionDivider label="Pulse" />
      <div className="mt-2">
        <MacroIndicatorBars indicators={a.indicators} />
      </div>

      <SectionDivider label="Analysis" />
      <p className="mt-1 text-[15px] leading-[1.72] text-zinc-300 sm:text-base">
        {a.overview}
      </p>

      <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Key themes
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {a.keyThemes.map((t, i) => (
          <li
            key={i}
            className="rounded-full border border-white/[0.08] bg-zinc-950/50 px-3 py-1.5 text-xs font-medium text-zinc-200 transition duration-300 hover:border-amber-400/25 hover:text-white"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-300/80">
            Risks
          </h3>
          <ul className="mt-4 space-y-3 border-l border-rose-500/20 pl-4 text-sm leading-relaxed text-zinc-300">
            {a.risks.map((r, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-4 top-2 h-1 w-1 rounded-full bg-rose-400/70" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
            Opportunities
          </h3>
          <ul className="mt-4 space-y-3 border-l border-emerald-500/20 pl-4 text-sm leading-relaxed text-zinc-300">
            {a.opportunities.map((r, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-4 top-2 h-1 w-1 rounded-full bg-emerald-400/70" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SectionDivider label="Outlook" />
      <p className="mt-1 text-[15px] leading-[1.72] text-zinc-300 sm:text-base">
        {a.outlook}
      </p>
    </div>
  );
}
