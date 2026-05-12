import type { MacroAnalysis, NewsArticle, RiskLevel, Sentiment } from "@/lib/types";

function isSentiment(v: string): v is Sentiment {
  return v === "Positive" || v === "Neutral" || v === "Negative";
}

function isRiskLevel(v: string): v is RiskLevel {
  return v === "Low" || v === "Medium" || v === "High";
}

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}

/** Heuristic sentiment from headline text (fallback only). */
function guessSentiment(text: string): Sentiment {
  const t = text.toLowerCase();
  const neg =
    /recession|slump|crisis|sanction|default|layoff|strike|war|inflation\s+surge|crash|plunge|downgrade/.test(
      t,
    );
  const pos =
    /expansion|growth|surge|record|upgrade|deal|boom|rally|recovery|stimulus|optim/.test(t);
  if (neg && !pos) return "Negative";
  if (pos && !neg) return "Positive";
  return "Neutral";
}

function guessRiskLevel(s: Sentiment): RiskLevel {
  if (s === "Negative") return "High";
  if (s === "Positive") return "Low";
  return "Medium";
}

/**
 * Deterministic macro-shaped payload when OpenAI is unavailable or returns invalid JSON.
 */
export function buildMacroAnalysisFallback(
  countryLabel: string,
  articles: NewsArticle[],
): MacroAnalysis {
  const blob = articles.map((a) => `${a.title} ${a.description}`).join(" ");
  const sentiment = guessSentiment(blob);
  const riskLevel = guessRiskLevel(sentiment);
  const titles = articles.map((a) => a.title).filter(Boolean);

  const overview =
    titles.length > 0
      ? `Based on the available headline set for ${countryLabel}, markets appear focused on: ${titles.slice(0, 3).join(" · ")}. This is an automated fallback read—not a substitute for full desk research.`
      : `Limited headline evidence is available for ${countryLabel}. Treat any conclusions as provisional until live news coverage returns.`;

  const keyThemes = [
    titles[0] ? `Flow: ${titles[0].slice(0, 120)}${titles[0].length > 120 ? "…" : ""}` : "Policy and rates",
    "Inflation and labour market dynamics",
    "Trade, energy, and external demand",
    "Corporate earnings quality and breadth",
    "Geopolitical tail risks to positioning",
  ].slice(0, 5);

  const risks = [
    "Surprises in inflation or labour data could force a repricing of rate expectations.",
    "External demand weakness may weigh on export-oriented sectors.",
    "Credit spreads and liquidity episodes can amplify moves in risk assets.",
  ];

  const opportunities = [
    "Selective quality and balance-sheet strength may outperform if dispersion rises.",
    "Structural themes (energy transition, reshoring) can offer multi-year angles.",
    "Volatility can improve entry points for investors with clear risk budgets.",
  ];

  const outlook =
    sentiment === "Positive"
      ? "Near-term tone skews constructive, but validate against incoming hard data and central-bank guidance."
      : sentiment === "Negative"
        ? "Near-term tone skews cautious; prioritize risk controls and scenario buffers."
        : "Near-term tone is mixed—base case should assume two-way headline risk until trends clarify.";

  const base = sentiment === "Positive" ? 62 : sentiment === "Negative" ? 42 : 52;

  return {
    overview,
    sentiment,
    riskLevel,
    keyThemes,
    risks,
    opportunities,
    outlook,
    indicators: {
      marketConfidence: clampScore(base + 6),
      economicStability: clampScore(base - 4),
      growthMomentum: clampScore(base + 2),
    },
  };
}

export function normalizeMacroAnalysis(
  raw: Record<string, unknown>,
  countryLabel: string,
  articles: NewsArticle[],
): MacroAnalysis {
  const fb = buildMacroAnalysisFallback(countryLabel, articles);

  const sentimentRaw = raw.sentiment;
  const sentiment =
    typeof sentimentRaw === "string" && isSentiment(sentimentRaw)
      ? sentimentRaw
      : fb.sentiment;

  const riskRaw = raw.riskLevel;
  const riskLevel =
    typeof riskRaw === "string" && isRiskLevel(riskRaw)
      ? riskRaw
      : guessRiskLevel(sentiment);

  const overview =
    typeof raw.overview === "string" && raw.overview.trim()
      ? raw.overview.trim()
      : fb.overview;

  const outlook =
    typeof raw.outlook === "string" && raw.outlook.trim()
      ? raw.outlook.trim()
      : fb.outlook;

  const pickStrings = (v: unknown, max: number, fallback: string[]): string[] => {
    if (!Array.isArray(v)) return fallback;
    const xs = v
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (xs.length === 0) return fallback;
    return xs.map((s) => s.trim()).slice(0, max);
  };

  const keyThemes = pickStrings(raw.keyThemes, 6, fb.keyThemes);
  const risks = pickStrings(raw.risks, 6, fb.risks);
  const opportunities = pickStrings(raw.opportunities, 6, fb.opportunities);

  const ind = raw.indicators;
  let indicators = fb.indicators;
  if (ind && typeof ind === "object" && !Array.isArray(ind)) {
    const o = ind as Record<string, unknown>;
    const mc = typeof o.marketConfidence === "number" ? o.marketConfidence : null;
    const es = typeof o.economicStability === "number" ? o.economicStability : null;
    const gm = typeof o.growthMomentum === "number" ? o.growthMomentum : null;
    if (mc !== null && es !== null && gm !== null) {
      indicators = {
        marketConfidence: clampScore(mc),
        economicStability: clampScore(es),
        growthMomentum: clampScore(gm),
      };
    }
  }

  return {
    overview,
    sentiment,
    riskLevel,
    keyThemes,
    risks,
    opportunities,
    outlook,
    indicators,
  };
}
