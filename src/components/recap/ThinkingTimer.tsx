import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from '../slides/useCountdown';

export function ThinkingTimer({ questionId }: { questionId?: string }) {
  const [totalSec, setTotalSec] = useState(30);
  const [visible, setVisible] = useState(false);
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(totalSec);

  useEffect(() => {
    setVisible(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  function begin(seconds: number) {
    setTotalSec(seconds);
    setVisible(true);
  }

  function toggleTimer() {
    if (finished) {
      reset();
      start();
      return;
    }
    if (running) pause();
    else start();
  }

  useEffect(() => {
    if (!visible) return;
    reset();
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, totalSec]);

  if (!visible) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-sm text-gray-400">
        <span>Czas dla wszystkich:</span>
        {[30, 60, 120].map((seconds) => (
          <button
            key={seconds}
            type="button"
            onClick={() => begin(seconds)}
            className="rounded-md border border-gray-600 px-3 py-1 text-gray-200 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {seconds < 60 ? `${seconds} s` : `${seconds / 60} min`}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center justify-between rounded-lg bg-gray-800 px-3 py-2">
      <span className="text-base font-semibold text-gray-200">Każdy myśli i zapisuje swoją odpowiedź</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTimer}
          className={clsx(
            'rounded-md px-3 py-1 font-mono text-3xl font-bold tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            finished ? 'animate-pulse bg-red-600 text-white' : remainingSec <= 5 ? 'text-red-400' : 'text-accent-200',
          )}
          title={finished ? 'Uruchom ponownie' : running ? 'Pauza' : 'Wznów'}
        >
          {formatMmSs(remainingSec)}
        </button>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            reset();
          }}
          className="rounded-md border border-gray-600 px-2 py-1 text-sm text-gray-300 hover:bg-gray-700"
        >
          Schowaj
        </button>
      </div>
    </div>
  );
}
