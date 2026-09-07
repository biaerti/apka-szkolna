// Tryb STOPER plywajacego panelu: odliczanie w dol z wlasnym poleceniem.
//
// Po co: przy pracy w multipodreczniku duza czesc lekcji to "macie 5 minut na
// przeczytanie tego tekstu". Dotad stoper byl tylko na slajdzie zadania w
// prezentacji apki - a przy podreczniku prezentacji nie ma. Panel lezy nad
// podrecznikiem, wiec i polecenie, i czas widzi cala klasa.
//
// Dwa rozmiary (srodkowy przycisk w naglowku, jak w pasku okna Windows):
// - pelny - polecenie, czas, ustawianie dlugosci, Start i Od nowa;
// - KOMPAKT - tylko czas i (jesli jest) polecenie. Sterowanie idzie wtedy
//   klikiem w sam czas (jak w AnswerTimer na ekranie kola) albo spacja.
//   Polecenie jest tu SAMYM TEKSTEM, nie polem: pustej ramki z podpowiedzia nie
//   ma po co pokazywac klasie, a wpisuje sie je w widoku pelnym.
//
// Odliczanie nie siedzi tutaj, tylko w Panel (useCountdown) - dzieki temu
// stoper leci dalej po przelaczeniu na kolo i po zwinieciu panelu do pigulki
// (pigulka pokazuje wtedy pozostaly czas).

import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';

export interface PanelStoperProps {
  polecenie: string;
  onPolecenie: (tekst: string) => void;
  minuty: number;
  onMinuty: (minuty: number) => void;
  remainingSec: number;
  running: boolean;
  finished: boolean;
  onStart: () => void;
  onPauza: () => void;
  onReset: () => void;
  /** Wersja bez ustawien i przyciskow - samo polecenie i czas. */
  kompakt: boolean;
}

const MIN_MINUT = 1;
const MAX_MINUT = 60;

export function PanelStoper({
  polecenie,
  onPolecenie,
  minuty,
  onMinuty,
  remainingSec,
  running,
  finished,
  onStart,
  onPauza,
  onReset,
  kompakt,
}: PanelStoperProps) {
  const koncowka = !finished && remainingSec <= 10 && remainingSec > 0;
  // Zmiana dlugosci w trakcie odliczania zeruje stoper (useCountdown ->
  // 'setTotal'), wiec pola czasu chowamy, gdy stoper chodzi.
  const mozeZmieniacCzas = !running;

  function przestaw(delta: number) {
    onMinuty(Math.min(MAX_MINUT, Math.max(MIN_MINUT, minuty + delta)));
  }

  /** Klik w czas: start, pauza, a po uplywie - licz od nowa. */
  function klikWCzas() {
    if (finished) onReset();
    else if (running) onPauza();
    else onStart();
  }

  const czas = (
    <button
      type="button"
      onClick={klikWCzas}
      title="Kliknij: start, pauza, a po czasie - licz od nowa"
      className={clsx(
        'font-bold tabular-nums leading-none',
        finished
          ? 'animate-pulse text-red-400'
          : koncowka
            ? 'animate-pulse text-red-300'
            : running
              ? 'text-white'
              : 'text-gray-400',
      )}
      style={{ fontSize: kompakt ? 'clamp(36px, 15vw, 56px)' : 'clamp(56px, 22vw, 96px)' }}
    >
      {formatMmSs(remainingSec)}
    </button>
  );

  if (kompakt) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-1">
        {polecenie.trim() !== '' && (
          <p className="mb-2 w-full shrink-0 truncate text-center text-lg text-gray-200">{polecenie}</p>
        )}
        {czas}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2">
      <input
        value={polecenie}
        onChange={(e) => onPolecenie(e.target.value)}
        placeholder="Polecenie, np. Czytamy tekst ze s. 12"
        aria-label="Polecenie"
        className="w-full shrink-0 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-center text-base text-gray-100 placeholder:text-gray-600"
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2">
        {czas}
        {finished && <p className="mt-2 text-xl font-bold text-red-400">Koniec czasu</p>}
      </div>

      {mozeZmieniacCzas && (
        <div className="mb-2 flex shrink-0 items-center justify-center gap-2 text-gray-300">
          <button
            type="button"
            onClick={() => przestaw(-1)}
            disabled={minuty <= MIN_MINUT}
            aria-label="Minuta mniej"
            className="rounded-md bg-gray-800 px-3 py-1 text-lg leading-none hover:bg-gray-700 disabled:opacity-40"
          >
            −
          </button>
          <input
            type="number"
            min={MIN_MINUT}
            max={MAX_MINUT}
            value={minuty}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) onMinuty(Math.min(MAX_MINUT, Math.max(MIN_MINUT, Math.round(v))));
            }}
            aria-label="Minuty"
            className="w-16 rounded-md border border-gray-700 bg-gray-950 px-2 py-1 text-center text-base tabular-nums text-gray-100"
          />
          <span className="text-sm text-gray-500">min</span>
          <button
            type="button"
            onClick={() => przestaw(1)}
            disabled={minuty >= MAX_MINUT}
            aria-label="Minuta więcej"
            className="rounded-md bg-gray-800 px-3 py-1 text-lg leading-none hover:bg-gray-700 disabled:opacity-40"
          >
            +
          </button>
        </div>
      )}

      <div className="grid shrink-0 grid-cols-2 gap-2">
        <button
          type="button"
          onClick={running ? onPauza : onStart}
          disabled={finished}
          className="rounded-lg bg-accent-600 py-2.5 text-lg font-semibold text-white hover:bg-accent-700 disabled:opacity-40"
        >
          {running ? 'Pauza' : 'Start'}
          <span className="block text-[10px] font-normal opacity-75">spacja</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-gray-700 py-2.5 text-lg font-semibold text-white hover:bg-gray-600"
        >
          Od nowa
        </button>
      </div>
    </div>
  );
}
