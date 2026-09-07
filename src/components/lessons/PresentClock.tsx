// Zegar na ekranie projektora: aktualna godzina i - na podstawie dzwonkow z
// zakladki "Plan" - ile zostalo do konca lekcji ("do końca 23 min"), a na
// przerwie kiedy zaczyna sie nastepna. Poza planem sama godzina. Dyskretny:
// ciemne polprzezroczyste tlo, nie przechwytuje klikniec (slajdy przewija
// sie klikiem w polowy ekranu). Ostatnie 5 min bursztynowe, ostatnia minuta
// czerwona - nauczyciel widzi katem oka, ze czas konczyc.

import clsx from 'clsx';
import { useStore } from '../../data/store';
import { formatHm, formatRemaining, periodStatus } from '../../lib/timetable';
import { useNow } from '../timetable/useNow';

const WARN_SEC = 5 * 60;
const ALERT_SEC = 60;

export interface PresentClockProps {
  /**
   * Gdzie wisi: domyslnie prawy gorny rog. Na slajdzie kola (recap) prawy
   * gorny rog zajmuja przyciski paska RecapToolbar, a caly prawy bok - panel
   * uczniow z bilansem; wolny jest lewy gorny rog pod paskiem (nad kolem,
   * obok jego pustego naroznika), wiec tam idzie zegar.
   */
  position?: 'top-right' | 'top-left';
}

export function PresentClock({ position = 'top-right' }: PresentClockProps) {
  const periods = useStore((s) => s.periods);
  const now = useNow(1000);
  const status = periodStatus(periods, now);
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  let detail = '';
  let tone = 'text-gray-300';
  if (status.kind === 'lesson') {
    detail = `do końca ${formatRemaining(status.remainingSec)}`;
    if (status.remainingSec <= ALERT_SEC) tone = 'text-red-400 font-semibold';
    else if (status.remainingSec <= WARN_SEC) tone = 'text-amber-300';
  } else if (status.kind === 'break') {
    detail = `przerwa · ${formatHm(status.startsAtMin)} za ${formatRemaining(status.remainingSec)}`;
  }

  return (
    <div
      aria-live="off"
      className={clsx(
        'pointer-events-none fixed z-50 rounded-md bg-gray-900/70 px-2.5 py-1 leading-tight',
        position === 'top-right' ? 'right-2 top-2 text-right' : 'left-2 top-9 text-left',
      )}
    >
      <div className="text-2xl font-semibold tabular-nums text-gray-100">{time}</div>
      {detail && <div className={clsx('text-xs tabular-nums', tone)}>{detail}</div>}
    </div>
  );
}
