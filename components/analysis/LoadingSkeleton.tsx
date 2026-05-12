import { glassCard } from "@/components/analysis/ui-tokens";

export function LoadingSkeleton() {
  const pulse =
    "rounded-lg bg-zinc-700/35 motion-safe:animate-pulse motion-reduce:bg-zinc-800/45";

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div
        className={`${glassCard} p-6 sm:p-8 md:p-10`}
        aria-busy
        aria-label="Loading macro briefing"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className={`h-4 w-32 ${pulse}`} />
            <div className={`h-10 w-56 max-w-full sm:w-72 ${pulse}`} />
            <div className={`h-3 w-40 ${pulse}`} />
          </div>
          <div className="flex gap-2">
            <div className={`h-9 w-24 shrink-0 rounded-full ${pulse}`} />
            <div className={`h-9 w-24 shrink-0 rounded-full ${pulse}`} />
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.05] bg-zinc-950/35 p-4"
            >
              <div className={`mb-3 h-3 w-24 ${pulse}`} />
              <div className={`h-2 w-full rounded-full ${pulse}`} />
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <div className={`h-3 w-full ${pulse}`} />
          <div className={`h-3 w-full ${pulse}`} />
          <div className={`h-3 max-w-[94%] ${pulse}`} />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`h-3 w-28 ${pulse}`} />
              <div className={`h-3 w-full ${pulse}`} />
              <div className={`h-3 w-full ${pulse}`} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className={`mb-5 h-6 w-48 ${pulse}`} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${glassCard} flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:p-5`}
            >
              <div
                className={`aspect-[16/10] w-full shrink-0 sm:aspect-square sm:h-[7.25rem] sm:w-[7.25rem] ${pulse}`}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className={`h-4 w-3/4 ${pulse}`} />
                <div className={`h-3 w-full ${pulse}`} />
                <div className={`h-3 w-5/6 ${pulse}`} />
                <div className="mt-auto flex gap-2 pt-2">
                  <div className={`h-9 w-28 ${pulse}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
