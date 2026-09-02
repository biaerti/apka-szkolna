import { Button } from '../ui/Button';

export function WeekNav({
  rangeLabel,
  onPrev,
  onNext,
  onToday,
  showWeekend,
  onToggleWeekend,
}: {
  rangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  showWeekend: boolean;
  onToggleWeekend: (value: boolean) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onPrev}>
          Poprzedni tydzień
        </Button>
        <Button size="sm" variant="secondary" onClick={onToday}>
          Dziś
        </Button>
        <Button size="sm" variant="secondary" onClick={onNext}>
          Następny tydzień
        </Button>
        <span className="ml-2 text-sm font-medium text-gray-700">{rangeLabel}</span>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={showWeekend}
          onChange={(e) => onToggleWeekend(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
        />
        Pokaż weekend
      </label>
    </div>
  );
}
