import type { NewsApiSuccess } from "@/lib/types";

const TTL_MS = 30 * 60 * 1000;

type Stored = {
  payload: Omit<NewsApiSuccess, "cachedAt" | "fromStaleCache">;
  storedAt: number;
};

const store = new Map<string, Stored>();
const inflight = new Map<string, Promise<NewsApiSuccess>>();

function stripEphemeral(b: NewsApiSuccess): Omit<NewsApiSuccess, "cachedAt" | "fromStaleCache"> {
  const { cachedAt: _c, fromStaleCache: _f, ...rest } = b;
  return rest;
}

/** Fresh cache hit (≤ TTL). */
export function getFresh(cacheKey: string): NewsApiSuccess | null {
  const row = store.get(cacheKey);
  if (!row) return null;
  const age = Date.now() - row.storedAt;
  if (age > TTL_MS) return null;
  return {
    ...row.payload,
    cachedAt: new Date(row.storedAt).toISOString(),
    fromStaleCache: false,
  };
}

/** Any cached payload (including expired) for emergency fallback after RSS failure. */
export function getStale(cacheKey: string): NewsApiSuccess | null {
  const row = store.get(cacheKey);
  if (!row) return null;
  const age = Date.now() - row.storedAt;
  return {
    ...row.payload,
    cachedAt: new Date(row.storedAt).toISOString(),
    fromStaleCache: age > TTL_MS,
  };
}

export function setCached(cacheKey: string, body: NewsApiSuccess): void {
  store.set(cacheKey, {
    payload: stripEphemeral(body),
    storedAt: Date.now(),
  });
}

/**
 * Coalesces concurrent identical requests so burst traffic does not duplicate upstream calls.
 */
export function runDeduped(
  cacheKey: string,
  fn: () => Promise<NewsApiSuccess>,
): Promise<NewsApiSuccess> {
  const existing = inflight.get(cacheKey);
  if (existing) return existing;
  const p = fn().finally(() => {
    inflight.delete(cacheKey);
  });
  inflight.set(cacheKey, p);
  return p;
}
