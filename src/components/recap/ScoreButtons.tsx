// Przyciski wyniku odpowiedzi. Aktualna zasada kola jest prosta:
// - 'powtorzeniowe' - plus albo neutralna kropka; bez plomb, pasow i kar za
//   podpowiadanie,
// - 'po-lekcji' - STARY tryb (wycofany, zostaje dla starych danych - patrz
//   src/lib/recap.ts): mozna tylko zyskac: tylko dwa przyciski, "Dobrze" i
//   "Dalej" (neutralne, nic sie nie zapisuje). Nie ma tu "Źle" wcale - ten tryb
//   nigdy nie dawal plomby.
//   Aktualne kolo NA LEKCJI (po kazdym zadaniu) nie korzysta z tego komponentu -
//   ma wlasna szuflade na slajdzie zadania (TaskWheelDrawer).
//
// Uwaga za zachowanie nie odbiera juz plusa - to tylko przypominajka do
// dziennika (patrz src/lib/recap.ts i zakladka "Uwagi").

import type { RecapResult } from '../../data/types';
import type { RecapMode } from '../../lib/recap';
import { resultSymbol } from '../../lib/resultSymbol';

export interface ScoreButtonsProps {
  disabled: boolean;
  graded: boolean;
  recapMode: RecapMode;
  onGrade: (result: Extract<RecapResult, 'plus' | 'kropka'>) => void;
  /** "Dalej" w starym trybie po-lekcji - jak "gotowe, następny", nic nie zapisuje. */
  onSkip: () => void;
}

export function ScoreButtons({
  disabled,
  graded,
  recapMode,
  onGrade,
  onSkip,
}: ScoreButtonsProps) {
  const gradeDisabled = disabled || graded;
  const isPowtorzeniowe = recapMode === 'powtorzeniowe';

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onGrade('plus')}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-emerald-600 px-2 py-3 text-2xl font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 sm:text-3xl"
        >
          <span className="mr-2 font-black">{resultSymbol('plus').symbol}</span>
          Dobrze
          <span className="block text-sm font-normal opacity-75">klawisz 1</span>
        </button>

        {isPowtorzeniowe ? (
          <button
            type="button"
            onClick={() => onGrade('kropka')}
            disabled={gradeDisabled}
            className="whitespace-nowrap rounded-lg bg-sky-600 px-2 py-3 text-2xl font-semibold text-white hover:bg-sky-500 disabled:opacity-40 sm:text-3xl"
          >
            <span className="mr-2 font-black">{resultSymbol('kropka').symbol}</span>
            Kropka
            <span className="block text-sm font-normal opacity-75">bez plusa · klawisz 2</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSkip}
            disabled={gradeDisabled}
            className="whitespace-nowrap rounded-lg bg-gray-600 px-2 py-3 text-2xl font-semibold text-white hover:bg-gray-500 disabled:opacity-40 sm:text-3xl"
          >
            Dalej
            <span className="block text-sm font-normal opacity-75">klawisz 2</span>
          </button>
        )}

      </div>
    </div>
  );
}
