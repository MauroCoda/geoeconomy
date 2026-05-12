"use client";

import { useCallback, useState } from "react";
import { ArticleCard } from "@/components/analysis/ArticleCard";
import { LoadingSkeleton } from "@/components/analysis/LoadingSkeleton";
import { MacroBriefing } from "@/components/analysis/MacroBriefing";
import { glassCard, glassCardHover } from "@/components/analysis/ui-tokens";
import { QUICK_COUNTRIES, tryResolveFlagCode } from "@/lib/market-display";
import { countryCodeToFlagEmoji } from "@/lib/flags";
import type { NewsApiSuccess } from "@/lib/types";

type ApiErrorShape = { error: string; details?: string };

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<NewsApiSuccess | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (country: string) => {
    const trimmed = country.trim();
    if (!trimmed) {
      setError("Enter a country name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/news?country=${encodeURIComponent(trimmed)}`,
      );
      const json = (await res.json()) as NewsApiSuccess | ApiErrorShape;
      if (!res.ok && "error" in json) {
        const msg = json.details
          ? `${json.error} ${json.details}`
          : json.error;
        setData(null);
        setError(msg);
        return;
      }
      setData(json as NewsApiSuccess);
    } catch {
      setData(null);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void loadNews(query);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_-25%,rgba(251,191,36,0.07),transparent_52%),radial-gradient(ellipse_70%_55%_at_100%_40%,rgba(16,185,129,0.05),transparent_48%),radial-gradient(ellipse_55%_45%_at_0%_85%,rgba(59,130,246,0.04),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-400/90 sm:text-xs">
            GeoEconomy
          </p>
          <h1 className="mt-3 bg-gradient-to-br from-white via-zinc-100 to-zinc-500 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:mt-4 sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
            AI macro desk for global markets.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400 sm:mx-0 sm:text-base">
            Search a market to pull global economy headlines from public RSS
            sources, then get an AI macro readout—themes, risks, opportunities,
            outlook, sentiment, risk level, and illustrative pulse scores.
          </p>
        </header>

        <section className={`${glassCard} ${glassCardHover} p-6 sm:p-8 md:p-9`}>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Switzerland, Japan, Euro area"
              className="min-h-12 w-full rounded-xl border border-white/[0.08] bg-zinc-950/45 px-4 py-3 text-[15px] text-zinc-100 shadow-inner shadow-black/25 outline-none transition duration-300 placeholder:text-zinc-500 focus:border-amber-400/35 focus:bg-zinc-950/65 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] sm:min-h-[3rem] sm:flex-1"
              aria-label="Country or market"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-amber-300 to-amber-600 px-7 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/35 transition duration-300 hover:from-amber-200 hover:to-amber-500 hover:shadow-amber-950/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 sm:min-h-[3rem] sm:px-8"
            >
              {loading ? "Running desk…" : "Run briefing"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Quick markets
            </span>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {QUICK_COUNTRIES.map((c) => {
                const code = tryResolveFlagCode(c);
                const flag = code ? countryCodeToFlagEmoji(code) : "🌐";
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setQuery(c);
                      void loadNews(c);
                    }}
                    className="group inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-950/40 px-3.5 py-2 text-left text-xs font-medium text-zinc-200 shadow-sm shadow-black/25 transition duration-300 hover:border-amber-400/30 hover:bg-zinc-800/45 hover:text-white active:scale-[0.98] sm:min-h-0 sm:py-1.5"
                  >
                    <span
                      className="text-lg leading-none transition duration-300 group-hover:scale-110 sm:text-base"
                      aria-hidden
                    >
                      {flag}
                    </span>
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {loading && <LoadingSkeleton />}

        {error && !loading && (
          <div
            className={`${glassCard} border-rose-500/25 bg-rose-950/20 p-6 text-rose-100 sm:p-7`}
            role="alert"
          >
            <p className="font-semibold tracking-tight">Desk unavailable</p>
            <p className="mt-2 text-sm leading-relaxed text-rose-200/90">
              {error}
            </p>
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              {data.feedSource === "google-news-rss" && !data.usedFallback ? (
                <span className="inline-flex w-fit items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/95">
                  Headlines · Google News RSS
                </span>
              ) : (
                <span className="inline-flex w-fit items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200/95">
                  Headlines · Fallback wire
                </span>
              )}
            </div>

            {(data.usedFallback || data.fallbackNotice || data.fromStaleCache) && (
              <div className="flex flex-col gap-2 rounded-xl border border-amber-400/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-50/95 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="space-y-1">
                  {data.usedFallback ? (
                    <p className="font-semibold uppercase tracking-wide text-amber-200/95">
                      Fallback data
                    </p>
                  ) : null}
                  {data.fallbackNotice ? (
                    <p className="text-xs leading-relaxed text-amber-100/90">
                      {data.fallbackNotice}
                    </p>
                  ) : null}
                </div>
                {data.cachedAt ? (
                  <p className="font-mono text-[10px] text-amber-200/70 sm:text-right">
                    {data.fromStaleCache ? "Stale cache · " : "Cached · "}
                    {data.cachedAt}
                  </p>
                ) : null}
              </div>
            )}

            {!data.usedFallback &&
            !data.fallbackNotice &&
            !data.fromStaleCache &&
            data.cachedAt ? (
              <p className="text-center font-mono text-[10px] text-zinc-500 sm:text-left">
                Briefing served from cache · {data.cachedAt}
              </p>
            ) : null}

            <MacroBriefing data={data} />

            <section>
              <h3 className="mb-5 text-lg font-semibold tracking-tight text-white sm:mb-6 sm:text-xl">
                Latest headlines
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {data.articles.map((article, idx) => (
                  <ArticleCard key={`${article.url}-${idx}`} article={article} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
