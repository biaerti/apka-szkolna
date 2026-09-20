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
          title="Stoper (S)"
          aria-label="Otwórz stoper"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-950/90 text-gray-300 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-gray-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <StopwatchIcon />
        </button>
      )}
    </div>
  );
}

function StopwatchIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="7" />
      <path d="M9 2h6M12 6V2M17.5 7.5 19 6M12 13l3-2" />
    </svg>
  );
}
