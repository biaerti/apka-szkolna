// Pasek plywajacego panelu - wspolny dla obu trybow (kolo i stoper).
//
// Jest jednoczesnie uchwytem do przeciagania okna, wiec wszystko poza
// przyciskami reaguje na ciagniecie (useUchwytPrzeciagania - drag rusza dopiero
// po ruchu myszy, klik zostaje klikiem).
//
// Klasa jest w <select>, a nie w zakladkach: przy czterech klasach zakladki
// zjadaly polowe paska szerokiego na 390 px, a doszedl jeszcze przelacznik
// trybu. Lekcje ustawia sam plan (Panel.tsx); w selekcie sa dzisiejsze lekcje
// ("2. IV B"), a pod nimi klasy - na zastepstwa i sytuacje spoza planu.
// Przycisk "Obecność" dotyczy wybranej klasy.
//
// W trybie KOMPAKT (stoper sciagniety do paska) zostaja WYLACZNIE trzy
// przyciski okna. Klasa, tryb i obecnosc sa wtedy zbedne - kto chce ich uzyc,
// najpierw powieksza panel, a kazdy dodatkowy element zjada miejsce, ktore ma
// isc na czas widoczny z konca sali.

import { useUchwytPrzeciagania } from './useUchwytPrzeciagania';

export type PanelTryb = 'kolo' | 'stoper' | 'czytanki';

export interface OpcjaWyboru {
  value: string;
  label: string;
}

export interface PanelNaglowekProps {
  /** Wartosc selectu: "l:<id komorki planu>" albo "k:<id klasy>". */
  wybor: string;
  /** Dzisiejsze lekcje z planu, np. "2. IV B". */
  lekcje: OpcjaWyboru[];
  /** Wszystkie klasy - wybor bez lekcji (zastepstwo, poza planem). */
  klasy: OpcjaWyboru[];
  onWybor: (value: string) => void;
  tryb: PanelTryb;
  onTryb: (tryb: PanelTryb) => void;
  obecnoscOtwarta: boolean;
  onObecnosc: (open: boolean) => void;
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
  wybor,
  lekcje,
  klasy,
  onWybor,
  tryb,
  onTryb,
  obecnoscOtwarta,
  onObecnosc,
  kompakt = false,
  onKompakt,
  onZwin,
  onZamknij,
}: PanelNaglowekProps) {
  const uchwyt = useUchwytPrzeciagania(() => {});

  return (
    <div
      {...uchwyt}
      className="flex shrink-0 cursor-move select-none items-center gap-1 border-b border-gray-800 bg-gray-950 px-2 py-1"
    >
      {!kompakt && (
        <>
      <select
        value={wybor}
        onChange={(e) => onWybor(e.target.value)}
        aria-label="Lekcja"
        title="Lekcja z dzisiejszego planu (albo klasa na zastępstwo)"
        className="shrink-0 rounded-md border border-gray-700 bg-gray-900 px-1 py-1 text-xs font-semibold text-gray-100"
      >
        {lekcje.length > 0 && (
          <optgroup label="Dziś">
            {lekcje.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Inna klasa">
          {klasy.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </optgroup>
      </select>

      <div className="flex shrink-0 overflow-hidden rounded-md border border-gray-700">
        {(['kolo', 'stoper', 'czytanki'] as const).map((t) => (
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
            {t === 'kolo' ? 'Koło' : t === 'stoper' ? 'Stoper' : 'Audio'}
          </button>
        ))}
      </div>
        </>
      )}

      <div className="min-w-0 flex-1" />

      {!kompakt && (
      <button
        type="button"
        onClick={() => onObecnosc(!obecnoscOtwarta)}
        aria-expanded={obecnoscOtwarta}
        title="Obecność i uwagi do dziennika"
        className="shrink-0 rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 hover:text-gray-100"
      >
        Obecność
      </button>
      )}
      {onKompakt && (
        <button
          type="button"
          onClick={() => onKompakt(!kompakt)}
          title={kompakt ? 'Powiększ panel' : 'Zmniejsz do samego czasu'}
          aria-label={kompakt ? 'Powiększ panel' : 'Zmniejsz panel'}
          aria-pressed={kompakt}
          className="shrink-0 rounded-md px-1 py-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          ▭
        </button>
      )}
      <button
        type="button"
        onClick={onZwin}
        title="Zwiń do pigułki (Esc)"
        aria-label="Zwiń do pigułki"
        className="shrink-0 rounded-md px-1 py-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      >
        −
      </button>
      {onZamknij && (
        <button
          type="button"
          onClick={onZamknij}
          title="Zamknij panel"
          aria-label="Zamknij panel"
          className="shrink-0 rounded-md px-1 py-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
