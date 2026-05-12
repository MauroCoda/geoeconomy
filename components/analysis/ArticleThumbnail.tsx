"use client";

import { useState } from "react";
import type { NewsArticle } from "@/lib/types";

export function ArticleThumbnail({ article }: { article: NewsArticle }) {
  const [failed, setFailed] = useState(false);
  const src = article.imageUrl;

  if (!src || failed) {
    return (
      <div
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-zinc-800/80 via-zinc-900 to-zinc-950 sm:aspect-square sm:h-[7.25rem] sm:w-[7.25rem] sm:rounded-lg"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(251,191,36,0.06),transparent_55%)]" />
        <div className="absolute bottom-2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950 sm:aspect-square sm:h-[7.25rem] sm:w-[7.25rem] sm:rounded-lg">
      {/* eslint-disable-next-line @next/next/no-img-element -- remote CDNs vary */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
