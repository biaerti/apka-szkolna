// Lewa kolumna ekranu powtorki: kolo fortuny albo lista "po kolei" + przycisk
// losowania. Wydzielone z RecapSession.tsx, zeby komponent zmiescil sie w
// limicie 250 linii. Sam pilnuje rozmiaru kola (ResizeObserver na kontenerze).

import { useEffect, useRef, useState } from 'react';
import { SequentialPicker } from './SequentialPicker';
import { Wheel } from './Wheel';
import type { RecapSessionState } from './useRecapSession';

export interface RecapWheelPanelProps {
  session: RecapSessionState;
}

export function RecapWheelPanel({ session }: RecapWheelPanelProps) {
  const wheelAreaRef = useRef<HTMLDivElement>(null);
  const [wheelSize, setWheelSize] = useState(360);

  useEffect(() => {
    const el = wheelAreaRef.current;
    if (!el) return;
    function recompute(width: number, height: number) {
      const size = Math.max(120, Math.min(width - 16, height - 16));
      setWheelSize(size);
    }
    recompute(el.clientWidth, el.clientHeight);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        recompute(width, height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="flex min-h-0 flex-col items-center justify-center gap-2 border-r border-gray-800 px-2 py-2"
      style={{ width: '50%' }}
    >
      <div ref={wheelAreaRef} className="flex min-h-0 w-full flex-1 items-center justify-center">
        {session.pool.length === 0 && !session.currentStudent ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-gray-300">Wszyscy obecni uczniowie już odpowiadali.</p>
            <button
              type="button"
              onClick={session.startNewRound}
              className="rounded-md bg-accent-600 px-5 py-2.5 text-lg font-medium hover:bg-accent-700"
            >
              zacznij nową rundę
            </button>
          </div>
        ) : session.pickMode === 'sequential' ? (
          <SequentialPicker
            students={session.presentStudents}
            usedCount={session.usedCount}
            warningsFor={session.warningsFor}
            nextStudentId={session.pool[0]?.student.id ?? null}
            currentStudentId={session.currentStudent?.id ?? null}
          />
        ) : (
          <Wheel
            /* Migawka puli z momentu losowania (displayPool), a nie zywa pula -
               inaczej wylosowany sektor gasnie natychmiast po wpisaniu oceny. */
            entries={session.displayPool}
            spinning={session.spinning}
            targetAngle={session.wheelTarget}
            spinToken={session.spinToken}
            spinSec={session.settings.wheelSpinSec}
            onSpinEnd={session.handleSpinEnd}
            size={wheelSize}
            highlightKey={session.currentEntry?.key ?? null}
          />
        )}
      </div>

      <button
        type="button"
        onClick={session.pickNext}
        disabled={!session.canSpin}
        className="shrink-0 rounded-lg bg-accent-600 px-8 py-2.5 text-xl font-semibold hover:bg-accent-700 disabled:opacity-40"
      >
        {session.pickMode === 'sequential' ? 'Następny uczeń (Spacja)' : 'Kręć (Spacja)'}
      </button>
    </div>
  );
}
