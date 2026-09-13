import { useState } from 'react';
import { StopwatchBar } from '../slides/StopwatchBar';

export function PresentationTimer({
  onRecap,
  visible,
  onVisibleChange,
}: {
  onRecap: boolean;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}) {
  const [timerSec, setTimerSec] = useState(5 * 60);

  return (
    <div
      className={`fixed z-50 ${onRecap ? 'bottom-8 left-4' : 'left-3 top-3'}`}
      onClick={(event) => event.stopPropagation()}
      data-presentation-timer
    >
      {visible ? (
        <StopwatchBar
          key={timerSec}
          compact
          timerSec={timerSec}
          onAdjust={(delta) => setTimerSec((value) => Math.max(60, value + delta))}
          onRemove={() => onVisibleChange(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => onVisibleChange(true)}
          title="Dodaj stoper do prezentacji (S)"
          className="rounded-lg bg-gray-950/90 px-3 py-2 text-sm font-semibold text-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-gray-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          + stoper <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-300">S</kbd>
        </button>
      )}
    </div>
  );
}
