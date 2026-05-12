import type { NewsArticle } from "@/lib/types";

const SOURCE = "GeoEconomy Fallback Wire";

function slug(label: string): string {
  return encodeURIComponent(label.replace(/\s+/g, "-").toLowerCase());
}

/**
 * Synthetic macro-style headlines when Google News RSS is unreachable or empty.
 */
export function buildFallbackArticles(
  countryLabel: string,
  max = 10,
): NewsArticle[] {
  const base = `https://demo.geoeconomy.app/${slug(countryLabel)}`;
  const now = new Date().toISOString();
  const c = countryLabel;
  const rows: Omit<NewsArticle, "isSynthetic">[] = [
    {
      title: `${c} — central bank watchers weigh next policy move amid global rate shifts`,
      description:
        "Fixed income desks flag a shallow curve and optionality around inflation prints; guidance tone from officials is seen as the next catalyst for local duration.",
      url: `${base}#cb-watch`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Trade and supply chains: ${c} exporters navigate softer goods demand`,
      description:
        "Manufacturing PMIs and container throughput are under scrutiny as firms rebalance inventories; energy and logistics costs remain a margin variable.",
      url: `${base}#trade`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Labour markets in ${c}: wage growth vs productivity in focus`,
      description:
        "Economists debate whether job creation is cooling structurally or seasonally; services resilience is offsetting pockets of industrial slack.",
      url: `${base}#labour`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Energy transition spend: ${c} corporates update capex plans`,
      description:
        "Utilities and heavy industry outline grid and storage investments; policy incentives and borrowing costs shape the pace of deployment.",
      url: `${base}#energy`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Equity strategy: ${c} benchmarks tilt toward quality as earnings breadth narrows`,
      description:
        "Analysts highlight dispersion within sectors; balance-sheet strength and pricing power screen as differentiators into the next reporting cycle.",
      url: `${base}#equities`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Geopolitical risk premium: investors map scenarios for ${c} exposures`,
      description:
        "Cross-border sanctions risk, commodity corridors, and alliance shifts are being stress-tested in asset allocation models.",
      url: `${base}#geo`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Consumer pulse: ${c} households balance savings, credit, and inflation`,
      description:
        "Retail card data and sentiment surveys suggest uneven strength; housing and autos remain key cyclical swing factors.",
      url: `${base}#consumer`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `Recession monitors: leading indicators for ${c} flash mixed signals`,
      description:
        "Market-implied recession probabilities tick with swap spreads and survey diffusion; consensus still anchors on a soft-landing base case.",
      url: `${base}#cycle`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `${c} — fiscal trajectory and debt markets in focus for investors`,
      description:
        "Sovereign issuance calendars and term premia are in focus as policymakers balance growth support with inflation vigilance.",
      url: `${base}#fiscal`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
    {
      title: `FX and capital flows: ${c} on the radar of global macro desks`,
      description:
        "Carry, positioning, and terms-of-trade shocks are being monitored against a backdrop of divergent central-bank cycles.",
      url: `${base}#fx`,
      publishedAt: now,
      sourceName: SOURCE,
      imageUrl: null,
    },
  ];

  return rows.slice(0, max).map((a) => ({
    ...a,
    isSynthetic: true,
    description: `${a.description} [Fallback: illustrative only — RSS feed unavailable.]`,
  }));
}
