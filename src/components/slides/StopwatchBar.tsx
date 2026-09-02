import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from './useCountdown';
import { Button } from '../ui/Button';

export function StopwatchBar({ timerSec }: { timerSec: number }) {
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
        </div>
      )}
    </div>
  );
}
