import OpenAI from "openai";
import { buildMacroAnalysisFallback, normalizeMacroAnalysis } from "@/lib/macro-fallback";
import type { MacroAnalysis, NewsArticle } from "@/lib/types";

const MODEL = "gpt-4.1-mini";

function buildHeadlineDigest(articles: NewsArticle[]): string {
  return articles
    .map((a, i) => {
      const desc = (a.description || "").slice(0, 420);
      const tag = a.isSynthetic ? " [SYNTHETIC]" : "";
      return `${i + 1}. ${tag}Title: ${a.title}\n   Description: ${desc}`;
    })
    .join("\n\n");
}

/**
 * Macro analysis via OpenAI JSON mode. On failure, returns heuristic fallback.
 */
export async function generateMacroAnalysis(
  countryLabel: string,
  articles: NewsArticle[],
): Promise<{ data: MacroAnalysis; aiError?: string }> {
  if (articles.length === 0) {
    return {
      data: buildMacroAnalysisFallback(countryLabel, []),
      aiError: "No headlines available for model input.",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      data: buildMacroAnalysisFallback(countryLabel, articles),
      aiError: "OPENAI_API_KEY is not configured.",
    };
  }

  const client = new OpenAI({ apiKey });

  const userBlock = `Country / market: ${countryLabel}

You are given recent news headlines from public RSS aggregation (possibly including SYNTHETIC-labeled fallback rows). Treat SYNTHETIC rows as stylized placeholders—do not treat them as verified facts.

Headlines:
${buildHeadlineDigest(articles)}`;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content: `You are a senior macroeconomic strategist at a global investment bank. Your job is to interpret headlines like a professional analyst.

Focus your reasoning (when supported by the headlines) on: inflation, interest rates, trade, unemployment, central banks, equities, energy, geopolitics, consumer spending, and recession/cycle signals.

Output ONE JSON object ONLY, with exactly these keys:
- "overview": string, 3-5 sentences, tight macro read of the country/market.
- "sentiment": exactly one of "Positive", "Neutral", "Negative" (overall market tone implied by the set).
- "riskLevel": exactly one of "Low", "Medium", "High" (macro/policy/market risk tilt).
- "keyThemes": array of 3-6 short strings (2-5 words each), thematic buckets.
- "risks": array of 3-5 concise bullet strings (specific, not generic platitudes where possible).
- "opportunities": array of 3-5 concise bullet strings.
- "outlook": string, 2-3 sentences, short-term (next few weeks / quarter) outlook conditional on headline information.
- "indicators": object with integer scores 0-100 only:
  - "marketConfidence"
  - "economicStability"
  - "growthMomentum"
  These are illustrative model estimates derived from the headline mix (not official data).

Rules: No markdown. No extra keys. If evidence is thin, lower confidence in language and prefer "Neutral" sentiment and "Medium" risk unless headlines clearly justify otherwise.`,
        },
        { role: "user", content: userBlock },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return {
        data: buildMacroAnalysisFallback(countryLabel, articles),
        aiError: "Empty completion from OpenAI.",
      };
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return { data: normalizeMacroAnalysis(parsed, countryLabel, articles) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      data: buildMacroAnalysisFallback(countryLabel, articles),
      aiError: message,
    };
  }
}
