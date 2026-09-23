// Lewa kolumna ekranu powtorki: kolo fortuny albo lista "po kolei" + przycisk
// losowania. Wydzielone z RecapSession.tsx, zeby komponent zmiescil sie w
// limicie 250 linii. Sam pilnuje rozmiaru kola (ResizeObserver na kontenerze).
//
// Kolo jest na ekranie do konca rundy - takze wtedy, gdy wszyscy juz
// odpowiadali (wszystkie sektory na czerwono). Wtedy zmienia sie tylko przycisk
// pod kolem: zamiast "Krec" pojawia sie "zacznij nowa runde".

import { useEffect, useRef, useState } from 'react';
import { SeatingPicker } from './SeatingPicker';
import { SequentialPicker } from './SequentialPicker';
import { Wheel } from './Wheel';
import type { PickMode, RecapSessionState } from './useRecapSession';

// Szybka zmiana widoku wprost nad kolem - to samo, co "wybór ucznia" w pasku,
// ale duze i pod reka. Lista = po kolei wg numeru z dziennika.
const VIEWS: Array<{ mode: PickMode; label: string }> = [
  { mode: 'wheel', label: 'koło' },
  { mode: 'sequential', label: 'lista' },
  { mode: 'sala', label: 'sala' },
];

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

  // Runda skonczona: nikogo juz nie da sie wylosowac i nikt nie czeka na ocene.
  const roundOver = session.pool.length === 0 && (!session.currentStudent || session.graded);

  return (
    <div
      className="relative flex min-h-0 flex-col items-center justify-center gap-2 border-r border-gray-800 px-2 py-2"
      style={{ width: '50%' }}
    >
      <div className="absolute right-2 top-2 z-10 flex rounded-lg border border-gray-700 bg-gray-950/80 p-0.5 text-sm">
        {VIEWS.map((view) => (
          <button
            key={view.mode}
            type="button"
            onClick={() => session.setPickMode(view.mode)}
            disabled={session.spinning}
            aria-pressed={session.pickMode === view.mode}
            className={
              session.pickMode === view.mode
                ? 'rounded-md bg-gray-700 px-3 py-1 font-semibold text-white'
                : 'rounded-md px-3 py-1 text-gray-400 hover:text-gray-200 disabled:opacity-40'
            }
          >
            {view.label}
          </button>
        ))}
      </div>
      <div ref={wheelAreaRef} className="flex min-h-0 w-full flex-1 items-center justify-center">
        {session.pickMode === 'sequential' ? (
          <SequentialPicker
            students={session.presentStudents}
            usedCount={session.usedCount}
            nextStudentId={session.pool[0]?.student.id ?? null}
            currentStudentId={session.currentStudent?.id ?? null}
          />
        ) : session.pickMode === 'sala' ? (
          <SeatingPicker
            classId={session.classId}
            students={session.classStudents}
            absentSet={session.absentSet}
            usedCount={session.usedCount}
            currentStudentId={session.currentStudent?.id ?? null}
            spinning={session.spinning}
            spinToken={session.spinToken}
            targetStudentId={session.salaTargetId}
            onSpinEnd={session.handleSpinEnd}
          />
        ) : (
          <Wheel
            /* Wszystkie wpisy rundy, nie sama pula losowania - kto juz
               odpowiadal, zostaje na kole na czerwono. */
            entries={session.entries}
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

      {roundOver ? (
        <div className="flex shrink-0 flex-col items-center gap-1">
          <p className="text-base text-gray-400">Wszyscy obecni uczniowie już odpowiadali.</p>
          <button
            type="button"
            onClick={session.startNewRound}
            className="rounded-lg bg-accent-600 px-8 py-2.5 text-xl font-semibold hover:bg-accent-700"
          >
            zacznij nową rundę
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={session.pickNext}
          disabled={!session.canSpin}
          className="shrink-0 rounded-lg bg-accent-600 px-8 py-2.5 text-xl font-semibold hover:bg-accent-700 disabled:opacity-40"
        >
          {session.pickMode === 'sequential' ? 'Następny uczeń (Spacja)' : session.pickMode === 'sala' ? 'Losuj (Spacja)' : 'Kręć (Spacja)'}
        </button>
      )}
    </div>
  );
}
