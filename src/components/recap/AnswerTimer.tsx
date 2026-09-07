// Stoper odpowiedzi na ekranie kola: ile czasu ma wylosowany uczen.
// Startuje SAM przy kazdym nowym uczniu i zatrzymuje sie po wystawieniu oceny.
// Niczego nie ocenia i nie przelacza - to tylko licznik na projektorze, decyzja
// zawsze nalezy do nauczyciela. Dlugosc ustawia sie w Ustawieniach
// (Settings.answerTimerSec, 0 = bez stopera).
//
// Odliczanie idzie przez ten sam hook co stoper zadan na slajdach
// (useCountdown -> src/lib/timer.ts), zeby nie mnozyc dwoch implementacji.

import { useEffect } from 'react';
import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from '../slides/useCountdown';

export interface AnswerTimerProps {
  /** Wylosowany uczen - zmiana id restartuje odliczanie od poczatku. */
  studentId: string;
  totalSec: number;
  /** true po wystawieniu oceny - stoper przestaje liczyc, ale zostaje na ekranie. */
  stopped?: boolean;
}

export function AnswerTimer({ studentId, totalSec, stopped }: AnswerTimerProps) {
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(totalSec);

  // Nowy uczen (albo zmieniona dlugosc w ustawieniach) = odliczanie od zera.
  useEffect(() => {
    reset();
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, totalSec]);

  // Ocena wystawiona - nie ma po co dalej odliczac (uczen zostaje na ekranie do
  // nastepnego losowania).
  useEffect(() => {
    if (stopped) pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopped]);

  const isLow = !finished && remainingSec <= 5;

  function handleClick() {
    if (finished) {
      reset();
      start();
    } else if (running) {
      pause();
    } else {
      start();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Kliknij: pauza, wznowienie, a po czasie - licz od nowa"
      className={clsx(
        'absolute left-3 top-2 rounded-lg px-3 py-0.5 text-3xl font-bold tabular-nums',
        finished
          ? 'animate-pulse bg-red-600 text-white'
          : isLow
            ? 'animate-pulse text-red-400'
            : running
              ? 'text-accent-200'
              : 'text-accent-300/60',
      )}
    >
      {formatMmSs(remainingSec)}
    </button>
  );
}
