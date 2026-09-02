export function PresentProgressBar({ index, total }: { index: number; total: number }) {
  const pct = total > 0 ? ((index + 1) / total) * 100 : 0;
  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 pb-1.5">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-accent-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400">
        {index + 1} / {total}
      </span>
    </div>
  );
}
