// Przyciski oceny odpowiedzi ucznia (plus/kropka/plomba/pas) + licznik pasow +
// wejscia do "kto podpowiadal" i "uwaga". "Dobrze" jest wylaczone, gdy uczen
// ma juz 2 lub wiecej uwag w tej sesji (canEarnPlus = false) - eskalacja z
// src/lib/recap.ts (warnLevel/canEarnPlus).

import type { RecapResult } from '../../data/types';

export interface ScoreButtonsProps {
  disabled: boolean;
  graded: boolean;
  onGrade: (result: Extract<RecapResult, 'plus' | 'kropka' | 'plomba' | 'pass'>) => void;
  canPass: boolean;
  canEarnPlus: boolean;
  passesUsed: number;
  passesPerMonth: number;
  hintGivesMinus: boolean;
  onOpenHint: () => void;
  onOpenUwaga: () => void;
}

export function ScoreButtons({
  disabled,
  graded,
  onGrade,
  canPass,
  canEarnPlus,
  passesUsed,
  passesPerMonth,
  hintGivesMinus,
  onOpenHint,
  onOpenUwaga,
}: ScoreButtonsProps) {
  const gradeDisabled = disabled || graded;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onGrade('plus')}
          disabled={gradeDisabled || !canEarnPlus}
          title={!canEarnPlus ? 'Uczeń ma już 2 uwagi - nie może teraz zdobyć plusa' : undefined}
          className="whitespace-nowrap rounded-lg bg-emerald-600 px-2 py-3 text-lg font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 sm:text-xl"
        >
          Dobrze<span className="block text-xs font-normal opacity-75">klawisz 1</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('kropka')}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-sky-600 px-2 py-3 text-lg font-semibold text-white hover:bg-sky-500 disabled:opacity-40 sm:text-xl"
        >
          Częściowo<span className="block text-xs font-normal opacity-75">klawisz 2</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('plomba')}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-red-600 px-2 py-3 text-lg font-semibold text-white hover:bg-red-500 disabled:opacity-40 sm:text-xl"
        >
          Źle<span className="block text-xs font-normal opacity-75">klawisz 3</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('pass')}
          disabled={gradeDisabled || !canPass}
          title={!canPass ? 'Limit pasów w tym tygodniu wyczerpany' : undefined}
          className="whitespace-nowrap rounded-lg bg-amber-600 px-2 py-3 text-lg font-semibold text-white hover:bg-amber-500 disabled:opacity-40 sm:text-xl"
        >
          Pas<span className="block text-xs font-normal opacity-75">klawisz 4</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {hintGivesMinus && (
          <button
            type="button"
            onClick={onOpenHint}
            disabled={disabled}
            className="whitespace-nowrap rounded-lg bg-gray-600 px-2 py-2.5 text-base font-semibold text-white hover:bg-gray-500 disabled:opacity-40"
          >
            Podpowiadał(a)<span className="block text-xs font-normal opacity-75">plomba dla innego ucznia</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenUwaga}
          className="whitespace-nowrap rounded-lg bg-orange-700 px-2 py-2.5 text-base font-semibold text-white hover:bg-orange-600"
        >
          Uwaga<span className="block text-xs font-normal opacity-75">niegrzeczne zachowanie</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          pasy w tym miesiącu: {passesUsed}/{passesPerMonth}
        </span>
      </div>
    </div>
  );
}
