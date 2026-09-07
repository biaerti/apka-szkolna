// Widoczny POWOD, dla ktorego "Dobrze" jest wyszarzone przy wylosowanym uczniu.
//
// Sama blokada dziala od dawna (canEarnPlus w src/lib/recap.ts: 2. uwaga w
// miesiacu = koniec plusow do konca miesiaca), ale jedynym wyjasnieniem byl
// atrybut `title` na WYLACZONYM przycisku - a takiemu przyciskowi przegladarka
// nie pokazuje dymka. Nauczyciel widzial wiec szary przycisk bez powodu.
// Dlatego powod stoi w ramce z nazwiskiem, w tym samym miejscu we wszystkich
// trzech kolach (powtorzeniowe, na lekcji, plywajacy panel).

export interface NoPlusNoteProps {
  /** Ile uwag uczen ma w tym miesiacu - zeby bylo widac, ze to nie pomylka. */
  warnings: number;
  /** Mniejszy wariant do panelu 360 px i szuflady na slajdzie. */
  compact?: boolean;
}

export function NoPlusNote({ warnings, compact = false }: NoPlusNoteProps) {
  return (
    <p
      className={`mt-1 rounded-md bg-orange-900/60 font-semibold text-orange-200 ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm'
      }`}
    >
      {warnings} uwagi w tym miesiącu - bez plusów do końca miesiąca
    </p>
  );
}
