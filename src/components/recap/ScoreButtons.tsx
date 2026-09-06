// Przyciski oceny odpowiedzi ucznia + licznik pasow + wejscia do "kto
// podpowiadal" i "uwaga". Uklad zalezy od trybu rundy (src/lib/recap.ts:
// RecapMode):
// - 'powtorzeniowe' - pelne ocenianie plus/kropka/plomba/pas. "Dobrze" jest
//   wylaczone, gdy uczen ma juz 2 lub wiecej uwag w tym miesiacu (canEarnPlus).
// - 'po-lekcji' (domyslny) - mozna tylko zyskac: zamiast kropki/pasa jest
//   neutralne "Dalej" (nic sie nie zapisuje), a plomba jest WYJATKIEM - aktywna
//   tylko dla ucznia z juz >=3 uwagami w tym miesiacu (canReceivePlomba).

import type { RecapResult } from '../../data/types';
import type { RecapMode } from '../../lib/recap';
import { resultSymbol } from '../../lib/resultSymbol';

export interface ScoreButtonsProps {
  disabled: boolean;
  graded: boolean;
  recapMode: RecapMode;
  onGrade: (result: Extract<RecapResult, 'plus' | 'kropka' | 'plomba' | 'pass'>) => void;
  /** "Dalej" w kole po lekcji - jak "gotowe, następny", nic nie zapisuje. */
  onSkip: () => void;
  canPass: boolean;
  canEarnPlus: boolean;
  /** Czy wylosowany uczen moze dostac plombe w kole po lekcji (patrz canReceivePlombaAfterLesson). */
  canReceivePlomba: boolean;
  passesUsed: number;
  passesPerMonth: number;
  hintGivesMinus: boolean;
  onOpenHint: () => void;
  onOpenUwaga: () => void;
}

export function ScoreButtons({
  disabled,
  graded,
  recapMode,
  onGrade,
  onSkip,
  canPass,
  canEarnPlus,
  canReceivePlomba,
  passesUsed,
  passesPerMonth,
  hintGivesMinus,
  onOpenHint,
  onOpenUwaga,
}: ScoreButtonsProps) {
  const gradeDisabled = disabled || graded;
  const isPowtorzeniowe = recapMode === 'powtorzeniowe';

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className={isPowtorzeniowe ? 'grid grid-cols-4 gap-2' : 'grid grid-cols-3 gap-2'}>
        <button
          type="button"
          onClick={() => onGrade('plus')}
          disabled={gradeDisabled || !canEarnPlus}
          title={!canEarnPlus ? '2. uwaga - bez plusa w tym miesiącu' : undefined}
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
            Częściowo
            <span className="block text-sm font-normal opacity-75">klawisz 2</span>
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

        <button
          type="button"
          onClick={() => onGrade('plomba')}
          disabled={gradeDisabled || (!isPowtorzeniowe && !canReceivePlomba)}
          title={!isPowtorzeniowe && !canReceivePlomba ? 'Plomba w kole po lekcji dopiero od 3. uwagi w tym miesiącu' : undefined}
          className="whitespace-nowrap rounded-lg bg-red-600 px-2 py-3 text-2xl font-semibold text-white hover:bg-red-500 disabled:opacity-40 sm:text-3xl"
        >
          <span className="mr-2 font-black">{resultSymbol('plomba').symbol}</span>
          Źle
          <span className="block text-sm font-normal opacity-75">klawisz 3</span>
        </button>

        {isPowtorzeniowe && (
          <button
            type="button"
            onClick={() => onGrade('pass')}
            disabled={gradeDisabled || !canPass}
            title={!canPass ? 'Limit pasów w tym miesiącu wyczerpany' : undefined}
            className="whitespace-nowrap rounded-lg bg-amber-600 px-2 py-3 text-2xl font-semibold text-white hover:bg-amber-500 disabled:opacity-40 sm:text-3xl"
          >
            <span className="mr-2 font-black">{resultSymbol('pass').symbol}</span>
            Pas
            <span className="block text-sm font-normal opacity-75">klawisz 4</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {hintGivesMinus && (
          <button
            type="button"
            onClick={onOpenHint}
            disabled={disabled}
            className="whitespace-nowrap rounded-lg bg-gray-600 px-2 py-2.5 text-xl font-semibold text-white hover:bg-gray-500 disabled:opacity-40"
          >
            Podpowiadał(a)<span className="block text-sm font-normal opacity-75">plomba dla innego ucznia</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenUwaga}
          className="whitespace-nowrap rounded-lg bg-orange-700 px-2 py-2.5 text-xl font-semibold text-white hover:bg-orange-600"
        >
          Uwaga<span className="block text-sm font-normal opacity-75">niegrzeczne zachowanie</span>
        </button>
      </div>

      {isPowtorzeniowe && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            pasy w tym miesiącu: {passesUsed}/{passesPerMonth}
          </span>
        </div>
      )}
    </div>
  );
}
