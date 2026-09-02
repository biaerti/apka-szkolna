// Przyciski oceny odpowiedzi ucznia + licznik pasow + wejscie do wyboru
// ucznia podpowiadajacego. Jeden zwarty rzad, wyraznie rozne kolory,
// zeby zmiescic sie na wysokosci ekranu bez przewijania.

export interface ScoreButtonsProps {
  disabled: boolean;
  graded: boolean;
  onGrade: (result: 'plus' | 'minus' | 'pass') => void;
  canPass: boolean;
  passesUsed: number;
  passesPerWeek: number;
  hintGivesMinus: boolean;
  onOpenHint: () => void;
}

export function ScoreButtons({
  disabled,
  graded,
  onGrade,
  canPass,
  passesUsed,
  passesPerWeek,
  hintGivesMinus,
  onOpenHint,
}: ScoreButtonsProps) {
  const gradeDisabled = disabled || graded;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onGrade('plus')}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-emerald-600 px-2 py-3 text-lg font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 sm:text-xl"
        >
          Dobrze<span className="block text-xs font-normal opacity-75">+ &middot; klawisz 1</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('minus')}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-red-600 px-2 py-3 text-lg font-semibold text-white hover:bg-red-500 disabled:opacity-40 sm:text-xl"
        >
          Źle<span className="block text-xs font-normal opacity-75">- &middot; klawisz 2</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('pass')}
          disabled={gradeDisabled || !canPass}
          title={!canPass ? 'Limit pasów w tym tygodniu wyczerpany' : undefined}
          className="whitespace-nowrap rounded-lg bg-amber-600 px-2 py-3 text-lg font-semibold text-white hover:bg-amber-500 disabled:opacity-40 sm:text-xl"
        >
          Pas<span className="block text-xs font-normal opacity-75">klawisz 3</span>
        </button>
        {hintGivesMinus && (
          <button
            type="button"
            onClick={onOpenHint}
            disabled={disabled}
            className="whitespace-nowrap rounded-lg bg-gray-600 px-2 py-3 text-lg font-semibold text-white hover:bg-gray-500 disabled:opacity-40 sm:text-xl"
          >
            Podpowiadał(a)<span className="block text-xs font-normal opacity-75">minus dla innego ucznia</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          pasy w tym tygodniu: {passesUsed}/{passesPerWeek}
        </span>
      </div>
    </div>
  );
}
