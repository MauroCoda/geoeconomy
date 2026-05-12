export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      {label ? (
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {label}
        </span>
      ) : null}
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
    </div>
  );
}
