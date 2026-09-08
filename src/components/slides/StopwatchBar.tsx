import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from './useCountdown';
import { Button } from '../ui/Button';

// Stoper zadania. `onAdjust` (opcjonalne) pokazuje przy stojacym stoperze
// przyciski -1 / +1 min: nauczyciel dobiera czas do klasy juz na lekcji,
// bez wchodzenia w edytor (tak jak kolko czasu na slajdzie tematu).
export function StopwatchBar({ timerSec, onAdjust }: { timerSec: number; onAdjust?: (deltaSec: number) => void }) {
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(timerSec);
  const isLow = remainingSec < 10 && remainingSec > 0;

  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-6 rounded-xl px-8 py-4',
        finished ? 'animate-pulse bg-red-700' : 'bg-black/40',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className={clsx(
          'font-mono text-6xl font-bold tabular-nums',
          finished ? 'text-white' : isLow ? 'animate-pulse text-red-500' : 'text-white',
        )}
      >
        {formatMmSs(remainingSec)}
      </span>
      {finished ? (
        <span className="text-2xl font-semibold text-white">Czas minął</span>
      ) : (
        <div className="flex gap-2">
          {!running ? (
            <Button size="lg" onClick={start}>
              Start
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={pause}>
              Pauza
            </Button>
          )}
          <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" onClick={reset}>
            Reset
          </Button>
          {onAdjust && !running && (
            <>
              <Button
                size="lg"
                variant="ghost"
                className="text-gray-300 hover:bg-white/10"
                onClick={() => onAdjust(-60)}
                disabled={timerSec <= 60}
                title="Minuta mniej"
              >
                -1 min
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-gray-300 hover:bg-white/10"
                onClick={() => onAdjust(60)}
                title="Minuta więcej"
              >
                +1 min
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
