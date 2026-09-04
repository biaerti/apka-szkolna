// Gorny pasek sterowania ekranu powtorki: nazwa klasy/zestawu, tryby (wybor
// ucznia / ocenianie / powtorki), postep rundy, wybor pytania, cofanie, fullscreen,
// zakoncz. Wydzielone z RecapSession.tsx, zeby komponent zmiescil sie w
// limicie 250 linii.

import type { PickMode } from './useRecapDraw';

export interface RecapToolbarProps {
  className: string;
  questionSetName: string;
  pickMode: PickMode;
  onChangePickMode: (mode: PickMode) => void;
  grading: boolean;
  onChangeGrading: (value: boolean) => void;
  allowRepeats: boolean;
  onChangeAllowRepeats: (value: boolean) => void;
  drawsCompleted: number;
  plannedTotal: number;
  inProgress: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onOpenQuestionPicker: () => void;
  embedded?: boolean;
  onToggleFullscreen: () => void;
  onExit: () => void;
}

export function RecapToolbar({
  className,
  questionSetName,
  pickMode,
  onChangePickMode,
  grading,
  onChangeGrading,
  allowRepeats,
  onChangeAllowRepeats,
  drawsCompleted,
  plannedTotal,
  inProgress,
  canUndo,
  onUndo,
  onOpenQuestionPicker,
  embedded,
  onToggleFullscreen,
  onExit,
}: RecapToolbarProps) {
  const currentDraw = Math.min(plannedTotal, drawsCompleted + (inProgress ? 1 : 0));

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-4 py-1.5 text-xs text-gray-300">
      <div className="flex items-center gap-3">
        <span>
          {className} - {questionSetName}
        </span>
        {plannedTotal > 0 && (
          <span className="text-gray-500">
            losowanie {currentDraw} z {plannedTotal}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5">
          wybór ucznia:
          <select
            value={pickMode}
            onChange={(e) => onChangePickMode(e.target.value as PickMode)}
            className="rounded border-gray-600 bg-gray-800 px-1.5 py-0.5 text-xs text-gray-200"
          >
            <option value="wheel">koło</option>
            <option value="sequential">po kolei</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={grading}
            onChange={(e) => onChangeGrading(e.target.checked)}
            className="rounded border-gray-500"
          />
          oceniaj
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={allowRepeats}
            onChange={(e) => onChangeAllowRepeats(e.target.checked)}
            className="rounded border-gray-500"
          />
          pozwól na powtórki
        </label>
        <button
          type="button"
          onClick={onOpenQuestionPicker}
          className="rounded-md border border-gray-600 px-2.5 py-1 hover:bg-gray-800"
        >
          wybierz pytanie
        </button>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-md border border-gray-600 px-2.5 py-1 hover:bg-gray-800 disabled:opacity-40"
        >
          cofnij ostatnią akcję
        </button>
        {!embedded && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="rounded-md border border-gray-600 px-2.5 py-1 hover:bg-gray-800"
          >
            pełny ekran (F)
          </button>
        )}
        <button
          type="button"
          onClick={onExit}
          className="rounded-md bg-red-700 px-2.5 py-1 hover:bg-red-600"
        >
          Zakończ
        </button>
      </div>
    </div>
  );
}
