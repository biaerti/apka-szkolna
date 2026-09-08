import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from './useCountdown';
import { Button } from '../ui/Button';

// Stoper zadania. `onAdjust` (opcjonalne) pokazuje przy stojacym stoperze
// przyciski -1 / +1 min: nauczyciel dobiera czas do klasy juz na lekcji,
// bez wchodzenia w edytor (tak jak kolko czasu na slajdzie tematu).
//
// `compact` = wersja do rogu slajdu zadania: mniejszy czas i mniejsze przyciski,
// zeby pasek zmiescil sie obok tresci, a nie pod nia.
export function StopwatchBar({
  timerSec,
  onAdjust,
  compact = false,
}: {
  timerSec: number;
  onAdjust?: (deltaSec: number) => void;
  compact?: boolean;
}) {
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(timerSec);
  const isLow = remainingSec < 10 && remainingSec > 0;
  const btnSize = compact ? 'md' : 'lg';

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-xl',
        compact ? 'gap-3 px-4 py-2' : 'gap-6 px-8 py-4',
        finished ? 'animate-pulse bg-red-700' : 'bg-black/40',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className={clsx(
          'font-mono font-bold tabular-nums',
          compact ? 'text-4xl' : 'text-6xl',
          finished ? 'text-white' : isLow ? 'animate-pulse text-red-500' : 'text-white',
        )}
      >
        {formatMmSs(remainingSec)}
      </span>
      {finished ? (
        <span className={clsx('font-semibold text-white', compact ? 'text-xl' : 'text-2xl')}>Czas minął</span>
      ) : (
        <div className={clsx('flex', compact ? 'gap-1' : 'gap-2')}>
          {!running ? (
            <Button size={btnSize} onClick={start}>
              Start
            </Button>
          ) : (
            <Button size={btnSize} variant="secondary" onClick={pause}>
              Pauza
            </Button>
          )}
          <Button size={btnSize} variant="ghost" className="text-white hover:bg-white/10" onClick={reset}>
            Reset
          </Button>
          {onAdjust && !running && (
            <>
              <Button
                size={btnSize}
                variant="ghost"
                className="text-gray-300 hover:bg-white/10"
                onClick={() => onAdjust(-60)}
                disabled={timerSec <= 60}
                title="Minuta mniej"
              >
                -1
              </Button>
              <Button
                size={btnSize}
                variant="ghost"
                className="text-gray-300 hover:bg-white/10"
                onClick={() => onAdjust(60)}
                title="Minuta więcej"
              >
                +1
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
