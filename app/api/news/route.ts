import { NextResponse } from "next/server";
import { buildFallbackArticles } from "@/lib/fallback-articles";
import { fetchGoogleNewsRssArticles } from "@/lib/google-news-rss";
import { displayMarketLabel, normalizeMarketKey } from "@/lib/market-display";
import * as newsCache from "@/lib/news-cache";
import { generateMacroAnalysis } from "@/lib/openai-macro-analysis";
import type { NewsApiErrorBody, NewsApiSuccess, NewsArticle } from "@/lib/types";

export const dynamic = "force-dynamic";

const CACHE_HEADER = "private, max-age=120";

const MAX_COUNTRY_LEN = 80;
const MIN_COUNTRY_LEN = 2;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryParam = searchParams.get("country")?.trim();

  if (!countryParam) {
    return NextResponse.json<NewsApiErrorBody>(
      { error: "Missing required query parameter: country" },
      { status: 400 },
    );
  }

  if (countryParam.length < MIN_COUNTRY_LEN) {
    return NextResponse.json<NewsApiErrorBody>(
      { error: "Country or market name is too short." },
      { status: 400 },
    );
  }

  if (countryParam.length > MAX_COUNTRY_LEN) {
    return NextResponse.json<NewsApiErrorBody>(
      { error: `Country or market name must be at most ${MAX_COUNTRY_LEN} characters.` },
      { status: 400 },
    );
  }

  const cacheKey = normalizeMarketKey(countryParam);
  const countryLabel = displayMarketLabel(countryParam);

  const cachedFresh = newsCache.getFresh(cacheKey);
  if (cachedFresh) {
    return NextResponse.json<NewsApiSuccess>(cachedFresh, {
      status: 200,
      headers: { "Cache-Control": CACHE_HEADER },
    });
  }

  try {
    const body = await newsCache.runDeduped(cacheKey, () =>
      buildPayload({ cacheKey, countryLabel, rssQuery: countryParam.trim() }),
    );

    return NextResponse.json<NewsApiSuccess>(body, {
      status: 200,
      headers: { "Cache-Control": CACHE_HEADER },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json<NewsApiErrorBody>(
      { error: "Unable to build macro briefing.", details: message },
      { status: 500 },
    );
  }
}

async function buildPayload(opts: {
  cacheKey: string;
  countryLabel: string;
  rssQuery: string;
}): Promise<NewsApiSuccess> {
  const { cacheKey, countryLabel, rssQuery } = opts;

  const doubleCheck = newsCache.getFresh(cacheKey);
  if (doubleCheck) return doubleCheck;

  let articles: NewsArticle[] = [];
  let feedSource: NewsApiSuccess["feedSource"] = "google-news-rss";
  let usedFallback = false;
  let fallbackNotice: string | null = null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    try {
      articles = await fetchGoogleNewsRssArticles(rssQuery, 10, controller.signal);
    } catch (e) {
      const stale = newsCache.getStale(cacheKey);
      if (stale) {
        return {
          ...stale,
          fallbackNotice:
            (stale.fallbackNotice ? `${stale.fallbackNotice} ` : "") +
            `RSS error; serving cached briefing. (${e instanceof Error ? e.message : String(e)})`,
          fromStaleCache: true,
        };
      }
      articles = buildFallbackArticles(countryLabel, 10);
      feedSource = "fallback";
      usedFallback = true;
      fallbackNotice = `Could not load Google News RSS (${e instanceof Error ? e.message : "error"}). Showing friendly fallback headlines.`;
    }

    if (!usedFallback && articles.length === 0) {
      articles = buildFallbackArticles(countryLabel, 10);
      feedSource = "fallback";
      usedFallback = true;
      fallbackNotice =
        "RSS feed returned no parseable articles for this query. Friendly fallback headlines are shown instead.";
    }
  } finally {
    clearTimeout(timeout);
  }

  const { data: analysis, aiError } = await generateMacroAnalysis(
    countryLabel,
    articles,
  );

  const body: NewsApiSuccess = {
    country: countryLabel,
    feedSource,
    usedFallback,
    analysis,
    articles,
    ...(fallbackNotice ? { fallbackNotice } : {}),
    ...(aiError ? { aiError } : {}),
  };

  newsCache.setCached(cacheKey, body);
  return body;
}
