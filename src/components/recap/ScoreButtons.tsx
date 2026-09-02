// Przyciski oceny odpowiedzi ucznia + licznik pasow + wejscie do wyboru
// ucznia podpowiadajacego.

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
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onGrade('plus')}
          disabled={gradeDisabled}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-4 text-2xl font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          Dobrze (+) <span className="text-sm font-normal opacity-75">[1]</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('minus')}
          disabled={gradeDisabled}
          className="flex-1 rounded-lg bg-red-600 px-4 py-4 text-2xl font-semibold text-white hover:bg-red-500 disabled:opacity-40"
        >
          Źle (-) <span className="text-sm font-normal opacity-75">[2]</span>
        </button>
        <button
          type="button"
          onClick={() => onGrade('pass')}
          disabled={gradeDisabled || !canPass}
          title={!canPass ? 'Limit pasów w tym tygodniu wyczerpany' : undefined}
          className="flex-1 rounded-lg bg-amber-600 px-4 py-4 text-2xl font-semibold text-white hover:bg-amber-500 disabled:opacity-40"
        >
          Pas <span className="text-sm font-normal opacity-75">[3]</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          pasy w tym tygodniu: {passesUsed}/{passesPerWeek}
        </span>
        {hintGivesMinus && (
          <button
            type="button"
            onClick={onOpenHint}
            disabled={disabled}
            className="rounded-md border border-gray-600 px-3 py-1.5 text-gray-200 hover:bg-gray-800 disabled:opacity-40"
          >
            Podpowiadał(a)...
          </button>
        )}
      </div>
    </div>
  );
}
