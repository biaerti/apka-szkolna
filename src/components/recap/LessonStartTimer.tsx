import { useEffect } from 'react';
import clsx from 'clsx';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from '../slides/useCountdown';

const PREPARATION_SECONDS = 90;

export function LessonStartTimer({ onContinue }: { onContinue: () => void }) {
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(PREPARATION_SECONDS);

  useEffect(() => {
    start();
    // Stoper ma ruszyc tylko przy pierwszym pokazaniu ekranu przygotowania.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function restart() {
    reset();
    start();
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 px-8 text-white">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold leading-tight sm:text-7xl">Przygotuj się do lekcji</h1>
        <p className="mt-5 text-2xl text-gray-300 sm:text-3xl">
          Wyjmij zeszyt, podręcznik i przybory. Po sygnale zaczynamy powtórkę.
        </p>

        <button
          type="button"
          onClick={running ? pause : start}
          className={clsx(
            'mt-10 rounded-2xl px-10 py-5 font-mono text-8xl font-bold tabular-nums outline-none focus-visible:ring-4 focus-visible:ring-white sm:text-9xl',
            finished ? 'bg-red-700 text-white' : 'bg-gray-900 text-accent-200 hover:bg-gray-800',
          )}
          aria-label={running ? 'Zatrzymaj stoper przygotowania' : 'Uruchom stoper przygotowania'}
        >
          {formatMmSs(remainingSec)}
        </button>

        <p className="mt-4 text-lg text-gray-400">
          {finished ? 'Czas minął. Zaczynamy powtórkę.' : running ? 'Kliknij czas, aby zatrzymać.' : 'Stoper zatrzymany.'}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={restart}
            className="rounded-xl border border-gray-600 px-6 py-3 text-xl font-semibold text-gray-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Od nowa 1:30
          </button>
          <button
            type="button"
            onClick={onContinue}
            className={clsx(
              'rounded-xl px-8 py-3 text-xl font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white',
              finished ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-accent-600 hover:bg-accent-500',
            )}
          >
            Przejdź do koła
          </button>
        </div>
      </div>
    </div>
  );
}
