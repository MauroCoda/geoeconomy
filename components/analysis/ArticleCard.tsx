"use client";

import type { NewsArticle } from "@/lib/types";
import { ArticleThumbnail } from "@/components/analysis/ArticleThumbnail";
import { glassCard, glassCardHover } from "@/components/analysis/ui-tokens";

function formatArticleDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <article
      className={`group ${glassCard} ${glassCardHover} flex flex-col overflow-hidden p-5 sm:flex-row sm:gap-5 sm:p-5`}
    >
      <ArticleThumbnail article={article} />
      <div className="mt-4 flex min-w-0 flex-1 flex-col sm:mt-0">
        {article.isSynthetic ? (
          <span className="mb-2 w-fit rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/95">
            Fallback
          </span>
        ) : null}
        <h4 className="text-base font-semibold leading-snug tracking-tight text-white transition duration-300 group-hover:text-amber-50/95">
          {article.title || "Untitled"}
        </h4>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-zinc-400 transition duration-300 group-hover:text-zinc-300">
          {article.description || "No description available."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
          {article.sourceName && (
            <span className="rounded-md border border-white/[0.06] bg-zinc-950/50 px-2 py-0.5 font-medium text-zinc-300">
              {article.sourceName}
            </span>
          )}
          {article.publishedAt && (
            <time
              className="tabular-nums text-zinc-500"
              dateTime={article.publishedAt}
              suppressHydrationWarning
            >
              {formatArticleDate(article.publishedAt)}
            </time>
          )}
        </div>
        {article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit min-h-[2.75rem] items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-2.5 text-xs font-semibold text-amber-100/95 transition duration-300 hover:border-amber-400/45 hover:bg-amber-500/15 hover:text-amber-50 sm:min-h-0 sm:py-2"
          >
            {article.isSynthetic ? "Open fallback reference" : "Read article"}
          </a>
        ) : null}
      </div>
    </article>
  );
}
