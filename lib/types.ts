/** Client-safe article returned from /api/news */
export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  sourceName: string | null;
  imageUrl: string | null;
  /** Synthetic fallback row when RSS is unavailable */
  isSynthetic?: boolean;
};

export type Sentiment = "Positive" | "Neutral" | "Negative";

export type RiskLevel = "Low" | "Medium" | "High";

/** AI-estimated macro pulse indicators (0–100), illustrative only */
export type MacroIndicators = {
  marketConfidence: number;
  economicStability: number;
  growthMomentum: number;
};

export type MacroAnalysis = {
  overview: string;
  sentiment: Sentiment;
  riskLevel: RiskLevel;
  keyThemes: string[];
  risks: string[];
  opportunities: string[];
  outlook: string;
  indicators: MacroIndicators;
};

export type ArticleFeedSource = "google-news-rss" | "fallback";

export type NewsApiSuccess = {
  country: string;
  /** Where headline rows originated */
  feedSource: ArticleFeedSource;
  /** True when synthetic fallback headlines were used */
  usedFallback: boolean;
  fallbackNotice?: string | null;
  analysis: MacroAnalysis;
  articles: NewsArticle[];
  /** ISO timestamp of cached payload when serving from cache */
  cachedAt?: string | null;
  /** True when serving expired cache after upstream failure */
  fromStaleCache?: boolean;
  aiError?: string;
};

export type NewsApiErrorBody = {
  error: string;
  details?: string;
};
