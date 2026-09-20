import clsx from 'clsx';
import type { ReactNode } from 'react';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from './useCountdown';

// Stoper zadania. `onAdjust` (opcjonalne) pokazuje przy stojacym stoperze
// przyciski -1 / +1 min: nauczyciel dobiera czas do klasy juz na lekcji,
// bez wchodzenia w edytor (tak jak kolko czasu na slajdzie tematu).
//
// `compact` = wersja do rogu slajdu zadania: mniejszy czas i mniejsze przyciski,
// zeby pasek zmiescil sie obok tresci, a nie pod nia.
export function StopwatchBar({
  timerSec,
  onAdjust,
  onRemove,
  compact = false,
}: {
  timerSec: number;
  onAdjust?: (deltaSec: number) => void;
  onRemove?: () => void;
  compact?: boolean;
}) {
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(timerSec);
  const isLow = remainingSec < 10 && remainingSec > 0;
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-xl',
        compact ? 'gap-2 px-2.5 py-1.5' : 'gap-4 px-5 py-3',
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
        <div className="flex items-center gap-1">
          {!running ? (
            <TimerIconButton label="Uruchom" onClick={start} compact={compact} primary><PlayIcon /></TimerIconButton>
          ) : (
            <TimerIconButton label="Pauza" onClick={pause} compact={compact} primary><PauseIcon /></TimerIconButton>
          )}
          <TimerIconButton label="Resetuj" onClick={reset} compact={compact}><ResetIcon /></TimerIconButton>
          {onAdjust && !running && (
            <>
              <button
                type="button"
                onClick={() => onAdjust(-60)}
                disabled={timerSec <= 60}
                title="Minuta mniej"
                aria-label="Minuta mniej"
                className={adjustClasses(compact)}
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => onAdjust(60)}
                title="Minuta więcej"
                aria-label="Minuta więcej"
                className={adjustClasses(compact)}
              >
                +1
              </button>
            </>
          )}
        </div>
      )}
      {onRemove && (
        <TimerIconButton label="Schowaj stoper" onClick={onRemove} compact={compact}><CloseIcon /></TimerIconButton>
      )}
    </div>
  );
}

function TimerIconButton({
  label,
  onClick,
  compact,
  primary = false,
  children,
}: {
  label: string;
  onClick: () => void;
  compact: boolean;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={clsx(
        'flex items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        compact ? 'h-8 w-8' : 'h-11 w-11',
        primary ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'text-white/90 hover:bg-white/10 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

function adjustClasses(compact: boolean): string {
  return clsx(
    'rounded-md font-semibold tabular-nums text-gray-300 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30',
    compact ? 'h-8 min-w-8 px-1 text-xs' : 'h-11 min-w-10 px-1.5 text-sm',
  );
}

function TimerIcon({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" width={19} height={19} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

function PlayIcon() { return <TimerIcon><path d="m9 7 8 5-8 5V7Z" /></TimerIcon>; }
function PauseIcon() { return <TimerIcon><path d="M9 7v10M15 7v10" /></TimerIcon>; }
function ResetIcon() { return <TimerIcon><path d="M5 8V4m0 0h4M5 4a8 8 0 1 1-1 9" /></TimerIcon>; }
function CloseIcon() { return <TimerIcon><path d="m8 8 8 8M16 8l-8 8" /></TimerIcon>; }
