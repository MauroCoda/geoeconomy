/**
 * Optional aliases → ISO-2 for flag emojis only (not used for RSS queries).
 */
const ALIAS_TO_CODE: Record<string, string> = {
  switzerland: "ch",
  "united states": "us",
  usa: "us",
  america: "us",
  japan: "jp",
  germany: "de",
  italy: "it",
  china: "cn",
  "united kingdom": "gb",
  uk: "gb",
  "great britain": "gb",
  britain: "gb",
  england: "gb",
  france: "fr",
  spain: "es",
};

const CANONICAL_LABEL: Record<string, string> = {
  switzerland: "Switzerland",
  "united states": "United States",
  usa: "United States",
  america: "United States",
  japan: "Japan",
  germany: "Germany",
  italy: "Italy",
  china: "China",
  "united kingdom": "United Kingdom",
  uk: "United Kingdom",
  "great britain": "United Kingdom",
  britain: "United Kingdom",
  england: "United Kingdom",
  france: "France",
  spain: "Spain",
};

export const QUICK_COUNTRIES = [
  "Switzerland",
  "United States",
  "Japan",
  "Germany",
  "Italy",
  "China",
] as const;

export function normalizeMarketKey(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Canonical display label for known markets; otherwise title-cased free text. */
export function displayMarketLabel(raw: string): string {
  const key = normalizeMarketKey(raw);
  if (!key) return "Global";
  if (CANONICAL_LABEL[key]) return CANONICAL_LABEL[key];
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** ISO-2 for flag emoji when the query matches a known alias; otherwise null. */
export function tryResolveFlagCode(raw: string): string | null {
  const key = normalizeMarketKey(raw);
  if (!key) return null;
  return ALIAS_TO_CODE[key] ?? null;
}
