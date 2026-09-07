// Pasek plywajacego panelu - wspolny dla obu trybow (kolo i stoper).
//
// Jest jednoczesnie uchwytem do przeciagania okna, wiec wszystko poza
// przyciskami reaguje na ciagniecie (useUchwytPrzeciagania - drag rusza dopiero
// po ruchu myszy, klik zostaje klikiem).
//
// Klasa jest w <select>, a nie w zakladkach: przy czterech klasach zakladki
// zjadaly polowe paska szerokiego na 360 px, a doszedl jeszcze przelacznik
// trybu. Wybor klasy zostaje takze w trybie stopera, bo przycisk "Uwagi"
// dotyczy konkretnej klasy.

import type { SchoolClass } from '../../data/types';
import { useUchwytPrzeciagania } from './useUchwytPrzeciagania';

export type PanelTryb = 'kolo' | 'stoper';

export interface PanelNaglowekProps {
  classes: SchoolClass[];
  classId: string;
  onClassId: (id: string) => void;
  tryb: PanelTryb;
  onTryb: (tryb: PanelTryb) => void;
  uwagiOtwarte: boolean;
  onUwagi: (open: boolean) => void;
  /**
   * Srodkowy przycisk paska - jak "przywroc w dol" w oknie Windows. Podajemy go
   * tylko tam, gdzie jest co zmniejszac (stoper); w trybie kola panel nie ma
   * pustych przestrzeni i przycisk sie nie pojawia.
   */
  kompakt?: boolean;
  onKompakt?: (kompakt: boolean) => void;
  onZwin: () => void;
  /** Brak w przegladarce - zamykac mozna tylko okno Tauri. */
  onZamknij?: () => void;
}

export function PanelNaglowek({
  classes,
  classId,
  onClassId,
  tryb,
  onTryb,
  uwagiOtwarte,
  onUwagi,
  kompakt = false,
  onKompakt,
  onZwin,
  onZamknij,
}: PanelNaglowekProps) {
  const uchwyt = useUchwytPrzeciagania(() => {});

  return (
    <div
      {...uchwyt}
      className="flex shrink-0 cursor-move select-none items-center gap-1 border-b border-gray-800 bg-gray-950 px-2 py-1.5"
    >
      <select
        value={classId}
        onChange={(e) => onClassId(e.target.value)}
        aria-label="Klasa"
        className="shrink-0 rounded-md border border-gray-700 bg-gray-900 px-1.5 py-1 text-xs font-semibold text-gray-100"
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="flex shrink-0 overflow-hidden rounded-md border border-gray-700">
        {(['kolo', 'stoper'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTryb(t)}
            aria-pressed={tryb === t}
            className={
              tryb === t
                ? 'bg-accent-600 px-2 py-1 text-xs font-semibold text-white'
                : 'px-2 py-1 text-xs text-gray-400 hover:bg-gray-800'
            }
          >
            {t === 'kolo' ? 'Koło' : 'Stoper'}
          </button>
        ))}
      </div>

      <div className="min-w-0 flex-1" />

      <button
        type="button"
        onClick={() => onUwagi(!uwagiOtwarte)}
        aria-expanded={uwagiOtwarte}
        title="Uwagi - lista klasy"
        className="shrink-0 rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 hover:text-gray-100"
      >
        Uwagi
      </button>
      {onKompakt && (
        <button
          type="button"
          onClick={() => onKompakt(!kompakt)}
          title={kompakt ? 'Powiększ panel' : 'Zmniejsz do samego czasu'}
          aria-label={kompakt ? 'Powiększ panel' : 'Zmniejsz panel'}
          aria-pressed={kompakt}
          className="shrink-0 rounded-md px-1.5 py-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          ▭
        </button>
      )}
      <button
        type="button"
        onClick={onZwin}
        title="Zwiń do pigułki (Esc)"
        aria-label="Zwiń do pigułki"
        className="shrink-0 rounded-md px-1.5 py-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      >
        −
      </button>
      {onZamknij && (
        <button
          type="button"
          onClick={onZamknij}
          title="Zamknij panel"
          aria-label="Zamknij panel"
          className="shrink-0 rounded-md px-1.5 py-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
