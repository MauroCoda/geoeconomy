import Parser from "rss-parser";
import type { NewsArticle } from "@/lib/types";

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent":
      "GeoEconomy/1.0 (educational RSS reader; https://news.google.com/rss)",
  },
});

/** English US region — aligns with `hl` / `ceid` on Google News RSS. */
const RSS_HL = "en-US";
const RSS_GL = "US";
const RSS_CEID = "US:en";

export function buildGoogleNewsRssUrl(marketFocus: string): string {
  const focus = marketFocus.trim();
  const q = `${focus} economy OR business OR "central bank" OR inflation OR market`;
  return `https://news.google.com/rss/search?${new URLSearchParams({
    q,
    hl: RSS_HL,
    gl: RSS_GL,
    ceid: RSS_CEID,
  }).toString()}`;
}

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  summary?: string;
  creator?: string;
  source?: string | { name?: string };
};

function pickSourceName(item: RssItem, rawTitle: string): string | null {
  const s = item.source;
  if (typeof s === "string" && s.trim()) return s.trim();
  if (s && typeof s === "object" && s.name?.trim()) return s.name.trim();
  if (item.creator?.trim()) return item.creator.trim();
  const idx = rawTitle.lastIndexOf(" - ");
  if (idx > 0 && idx < rawTitle.length - 3) {
    return rawTitle.slice(idx + 3).trim() || null;
  }
  return null;
}

function parseDate(item: RssItem): string | null {
  if (item.isoDate) return item.isoDate;
  if (item.pubDate) {
    const d = new Date(item.pubDate);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

/**
 * Fetches and parses Google News RSS for a market/country focus string.
 * Returns up to `max` articles (default 10).
 */
export async function fetchGoogleNewsRssArticles(
  marketFocus: string,
  max = 10,
  signal?: AbortSignal,
): Promise<NewsArticle[]> {
  const url = buildGoogleNewsRssUrl(marketFocus);
  const res = await fetch(url, {
    signal,
    headers: {
      "User-Agent":
        "GeoEconomy/1.0 (educational RSS reader; https://news.google.com/rss)",
    },
  });
  if (!res.ok) {
    throw new Error(`Google News RSS returned HTTP ${res.status}`);
  }
  const xml = await res.text();
  const feed = await parser.parseString(xml);
  const items = (feed.items ?? []) as RssItem[];

  const out: NewsArticle[] = [];
  for (const item of items) {
    const link = item.link?.trim();
    const rawTitle = item.title?.trim() ?? "";
    if (!link) continue;

    let title = rawTitle;
    const dash = rawTitle.lastIndexOf(" - ");
    if (dash > 0 && dash < rawTitle.length - 3) {
      title = rawTitle.slice(0, dash).trim();
    }

    out.push({
      title: title || rawTitle,
      description: (item.contentSnippet ?? item.summary ?? "").trim(),
      url: link,
      publishedAt: parseDate(item),
      sourceName: pickSourceName(item, rawTitle),
      imageUrl: null,
    });
    if (out.length >= max) break;
  }

  return out;
}
