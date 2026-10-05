// Zegar na ekranie projektora: aktualna godzina i - na podstawie dzwonkow z
// zakladki "Plan" - ile zostalo do konca lekcji ("do końca 23 min"), a na
// przerwie kiedy zaczyna sie nastepna. Poza planem sama godzina. Dyskretny:
// ciemne polprzezroczyste tlo, nie przechwytuje klikniec (slajdy przewija
// sie klikiem w polowy ekranu). Ostatnie 5 min bursztynowe, ostatnia minuta
// czerwona - nauczyciel widzi katem oka, ze czas konczyc. Pod spodem
// przypomnienie o dyzurze (src/data/dyzury.ts): "po lekcji: dyżur" w trakcie
// lekcji, "dyżur teraz" na przerwie. Do tego sala z planu: "po lekcji: sala 35",
// gdy nastepna lekcja jest gdzie indziej, a na przerwie sala najblizszej lekcji.
// I obiad (src/data/obiady.ts): "po lekcji: obiad 4c · 10 os. · sami".

import clsx from 'clsx';
import { dyzuryNa } from '../../data/dyzury';
import { useStore } from '../../data/store';
import { dutyStatus } from '../../lib/dyzury';
import { obiadLabel, obiadStatus } from '../../lib/obiady';
import { formatHm, formatRemaining, nextRoom, periodStatus } from '../../lib/timetable';
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
  const timetable = useStore((s) => s.timetable);
  const classes = useStore((s) => s.classes);
  const now = useNow(1000);
  const status = periodStatus(periods, now);
  const duty = dutyStatus(dyzuryNa(now), periods, now);
  const obiad = obiadStatus(timetable, classes, periods, now);
  const room = nextRoom(timetable, periods, now);
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
        'pointer-events-none fixed z-50 rounded-lg bg-gray-900/80 px-3 py-1.5 leading-tight shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
        position === 'top-right' ? 'right-5 top-3 text-right' : 'left-5 top-10 text-left',
      )}
    >
      <div className="text-3xl font-semibold tabular-nums tracking-[-0.02em] text-gray-100">{time}</div>
      {detail && <div className={clsx('text-sm tabular-nums', tone)}>{detail}</div>}
      {duty.kind !== 'none' && (
        <div className="mt-0.5 text-sm font-semibold text-amber-300">
          {duty.kind === 'after-lesson' ? 'po lekcji: dyżur' : 'dyżur teraz'} · {duty.duty.place}
        </div>
      )}
      {obiad.kind !== 'none' && (
        <div className="mt-0.5 text-sm font-semibold text-emerald-300">
          {obiad.kind === 'after-lesson' ? 'po lekcji: obiad' : 'obiad teraz'} · {obiadLabel(obiad.obiad)}
        </div>
      )}
      {room && (
        <div className={clsx('mt-0.5 text-sm font-semibold', room.kind === 'after-lesson' ? 'text-sky-300' : 'text-gray-300')}>
          {room.kind === 'after-lesson' ? 'po lekcji: sala' : 'następna lekcja: sala'} {room.room}
        </div>
      )}
    </div>
  );
}
