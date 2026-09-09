// Gorny pasek sterowania ekranu powtorki: nazwa klasy/zestawu, tryby (wybor
// ucznia / ocenianie / powtorki), postep rundy, wybor pytania, cofanie, fullscreen,
// zakoncz. Wydzielone z RecapSession.tsx, zeby komponent zmiescil sie w
// limicie 250 linii.

import type { RecapMode } from '../../lib/recap';
import type { PickMode } from './useRecapDraw';

/** Etykieta trybu rundy do paska - zeby nauczyciel od razu widzial, w czym jest. */
const RECAP_MODE_LABELS: Record<RecapMode, string> = {
  // Stary tryb po-lekcji - tylko dla nieodswiezonych lekcji (patrz src/lib/recap.ts).
  'po-lekcji': 'koło po lekcji (stary tryb)',
  powtorzeniowe: 'koło powtórzeniowe',
  demo: 'koło (demo)',
};

export interface RecapToolbarProps {
  className: string;
  questionSetName: string;
  /** Tryb rundy - patrz src/lib/recap.ts (RecapMode). Nieustawiony = bez etykiety (np. demo/"Przedstaw się"). */
  recapMode?: RecapMode;
  pickMode: PickMode;
  onChangePickMode: (mode: PickMode) => void;
  grading: boolean;
  onChangeGrading: (value: boolean) => void;
  allowRepeats: boolean;
  onChangeAllowRepeats: (value: boolean) => void;
  drawsCompleted: number;
  plannedTotal: number;
  inProgress: boolean;
  /** Miekki limit pytan kola powtorzeniowego (Settings.reviewQuestionCount) - patrz useRecapDraw. */
  reviewQuestionCount: number;
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
  recapMode,
  pickMode,
  onChangePickMode,
  grading,
  onChangeGrading,
  allowRepeats,
  onChangeAllowRepeats,
  drawsCompleted,
  plannedTotal,
  inProgress,
  reviewQuestionCount,
  canUndo,
  onUndo,
  onOpenQuestionPicker,
  embedded,
  onToggleFullscreen,
  onExit,
}: RecapToolbarProps) {
  const currentDraw = Math.min(plannedTotal, drawsCompleted + (inProgress ? 1 : 0));
  // Pytania zadane w tej rundzie - kazde losowanie to jedno pytanie, bez
  // ograniczenia do plannedTotal (limit jest miekki, nie blokuje kolejnych
  // losowan). Liczone tylko dla kola powtorzeniowego - tam ma sens (patrz B.2).
  const questionsAsked = drawsCompleted + (inProgress ? 1 : 0);
  const isReview = recapMode === 'powtorzeniowe';
  const limitReached = isReview && reviewQuestionCount > 0 && questionsAsked >= reviewQuestionCount;

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-4 py-1.5 text-xs text-gray-300">
      <div className="flex items-center gap-3">
        <span>
          {className} - {questionSetName}
        </span>
        {recapMode && (
          <span className="rounded border border-gray-700 px-1.5 py-0.5 font-medium text-gray-300">
            {RECAP_MODE_LABELS[recapMode]}
          </span>
        )}
        {plannedTotal > 0 && (
          <span className="text-gray-500">
            losowanie {currentDraw} z {plannedTotal}
          </span>
        )}
        {isReview && (
          <span className={limitReached ? 'font-semibold text-amber-400' : 'text-gray-500'}>
            pytanie {questionsAsked} / {reviewQuestionCount}
            {limitReached ? ' - limit osiągnięty, możesz kręcić dalej albo zakończyć' : ''}
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
          cofnij ostatnią akcję (Ctrl+Z)
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
          title={limitReached ? 'Limit pytań powtórki osiągnięty - możesz kręcić dalej albo zakończyć' : undefined}
          className={
            limitReached
              ? 'rounded-md bg-amber-600 px-2.5 py-1 font-semibold text-white ring-2 ring-amber-300 hover:bg-amber-500'
              : 'rounded-md bg-red-700 px-2.5 py-1 hover:bg-red-600'
          }
        >
          Zakończ
        </button>
      </div>
    </div>
  );
}
