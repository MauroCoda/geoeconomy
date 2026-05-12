# GeoEconomy

A [Next.js](https://nextjs.org) App Router app that pulls **live-ish economy headlines** from **Google News RSS** (free public XML), then runs an **OpenAI** macro desk: structured briefing (overview, themes, risks, opportunities, outlook, sentiment, risk level, illustrative pulse scores).

## Prerequisites

- Node.js 20+ recommended
- [OpenAI](https://platform.openai.com/api-keys) API key (optional; missing key uses heuristic fallback analysis)

No third-party news API key is required—headlines come from Google’s public RSS search endpoint.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and add your key:

   ```bash
   cp .env.local.example .env.local
   ```

   - `OPENAI_API_KEY` — OpenAI SDK (server only).

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## API

`GET /api/news?country=Switzerland`

- Accepts any market string (trimmed, 2–80 characters). Builds an English **Google News RSS** query:
  `"<country> economy OR business OR \"central bank\" OR inflation OR market"` with `hl=en-US`, `gl=US`, `ceid=US:en`.
- Parses RSS server-side with **`rss-parser`**, returns up to **10** articles (`title`, `link`, `source`, `publishedAt`, etc.).
- **`feedSource`**: `google-news-rss` or `fallback` when RSS fails or returns nothing usable.
- **`usedFallback`** + **`fallbackNotice`** when synthetic headlines substitute so the UI never hard-crashes.
- **In-memory cache**: **30 minutes** per normalized market key; concurrent identical requests are **deduplicated**.
- **`cachedAt` / `fromStaleCache`** when a response is served from cache (including stale cache after RSS errors).

OpenAI uses **`gpt-4.1-mini`** with JSON mode. On failure, a **deterministic fallback** briefing is still returned.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Production server        |
| `npm run lint` | ESLint                   |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, **rss-parser**, Google News RSS, OpenAI Node SDK.
