// Szuflada kola NA LEKCJI - prawa kolumna obok slajdu zadania (nie overlay):
// zadanie zostaje glownym elementem ekranu, a kolo jest "gdzies obok". Od
// gory: naglowek z kodem zadania, kolo (Wheel z modulu recap, rozmiar z
// ResizeObservera), przycisk "Krec", ramka "Odpowiada" z duzym nazwiskiem i
// dwa przyciski oceny: plus (dobrze) i kropka (slabo albo wcale) - nic wiecej,
// na lekcji nie ma plomby ani pasa (src/lib/recap.ts, LessonWheelResult).
//
// Stan (useTaskWheel) siedzi w LessonPresent - szuflada tylko go rysuje, wiec
// zmiana slajdu nie kasuje losowania. Klawisze (Spacja/1/2/Backspace) obsluguje
// usePresentKeys; tu sa tylko klikniecia.

import { useEffect, useRef, useState } from 'react';
import { resultSymbol } from '../../lib/resultSymbol';
import { Wheel } from '../recap/Wheel';
import { TaskWheelAttendance } from './TaskWheelAttendance';
import type { TaskWheelState } from './useTaskWheel';

export interface TaskWheelDrawerProps {
  wheel: TaskWheelState;
  /** Kod biezacego zadania (Z1, Z2...) - do naglowka i adnotacji zdarzenia. */
  taskCode: string;
  onClose: () => void;
}

export function TaskWheelDrawer({ wheel, taskCode, onClose }: TaskWheelDrawerProps) {
  const wheelAreaRef = useRef<HTMLDivElement>(null);
  const [wheelSize, setWheelSize] = useState(300);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  useEffect(() => {
    const el = wheelAreaRef.current;
    if (!el) return;
    function recompute(width: number, height: number) {
      setWheelSize(Math.max(120, Math.min(width - 8, height - 8)));
    }
    recompute(el.clientWidth, el.clientHeight);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) recompute(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const student = wheel.currentStudent;
  const gradeDisabled = !student || wheel.graded;
  const poolEmpty = wheel.pool.length === 0 && (!student || wheel.graded);

  return (
    <div
      className="flex h-full w-[30vw] min-w-[380px] shrink-0 flex-col border-l border-gray-700 bg-gray-900 text-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-gray-700 px-3 py-2">
        <span className="text-sm font-medium">
          Koło na lekcji <span className="text-gray-500">·</span>{' '}
          <span className="font-bold text-accent-300">{taskCode}</span>
        </span>
        <button type="button" onClick={onClose} aria-label="Zamknij koło" className="text-gray-400 hover:text-gray-200">
          ✕
        </button>
      </div>

      <div ref={wheelAreaRef} className="flex min-h-0 flex-1 items-center justify-center px-2 py-2">
        <Wheel
          entries={wheel.entries}
          spinning={wheel.spinning}
          targetAngle={wheel.wheelTarget}
          spinToken={wheel.spinToken}
          spinSec={wheel.settings.wheelSpinSec}
          onSpinEnd={wheel.handleSpinEnd}
          size={wheelSize}
          highlightKey={wheel.currentEntry?.key ?? null}
        />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1 px-3">
        {poolEmpty ? (
          <>
            <p className="text-center text-sm text-gray-400">Wszyscy obecni już dziś odpowiadali</p>
            {!wheel.allowRepeats && (
              <button
                type="button"
                onClick={() => wheel.setAllowRepeats(true)}
                className="rounded-lg bg-accent-600 px-6 py-2 text-lg font-semibold text-white hover:bg-accent-700"
              >
                kręć mimo to
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={wheel.spin}
            disabled={!wheel.canSpin}
            className="rounded-lg bg-accent-600 px-8 py-2 text-xl font-semibold text-white hover:bg-accent-700 disabled:opacity-40"
          >
            Kręć (Spacja)
          </button>
        )}
      </div>

      <div className="shrink-0 px-3 pt-2">
        {student ? (
          <div className="relative rounded-xl border-4 border-accent-400 bg-accent-900/40 px-3 py-2 text-center">
            <span className="absolute right-2 top-1 text-xs font-semibold tabular-nums text-accent-300/80">
              nr {student.number}
            </span>
            <p className="text-xs uppercase tracking-widest text-accent-300">Odpowiada</p>
            <p className="font-bold leading-tight text-white" style={{ fontSize: 'clamp(28px, 2.6vw, 48px)' }}>
              {student.firstName} {student.lastName}
            </p>
          </div>
        ) : (
          <p className="py-2 text-center font-bold leading-tight text-gray-500" style={{ fontSize: 'clamp(28px, 2.6vw, 48px)' }}>
            Kręć kołem
          </p>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 px-3 pt-2">
        <button
          type="button"
          onClick={() => wheel.grade('plus', taskCode)}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-emerald-600 px-2 py-2.5 text-xl font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          <span className="mr-2 font-black">{resultSymbol('plus').symbol}</span>
          Dobrze
          <span className="block text-xs font-normal opacity-75">klawisz 1</span>
        </button>
        <button
          type="button"
          onClick={() => wheel.grade('kropka', taskCode)}
          disabled={gradeDisabled}
          className="whitespace-nowrap rounded-lg bg-sky-600 px-2 py-2.5 text-xl font-semibold text-white hover:bg-sky-500 disabled:opacity-40"
        >
          <span className="mr-2 font-black">{resultSymbol('kropka').symbol}</span>
          Kropka
          <span className="block text-xs font-normal opacity-75">słabo albo wcale · klawisz 2</span>
        </button>
      </div>

      {/* pb-6: pasek postepu (PresentProgressBar) lezy na dole calego ekranu,
          takze pod szuflada - dolny rzad nie moze na niego nachodzic. */}
      <div className="flex shrink-0 items-center justify-between px-3 pb-6 pt-2 text-xs text-gray-400">
        <div>
          {wheel.canUndo && (
            <button type="button" onClick={wheel.undoLast} className="rounded-md bg-gray-800 px-2 py-1 hover:bg-gray-700">
              Cofnij (Ctrl+Z)
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAttendanceOpen((v) => !v)}
          aria-expanded={attendanceOpen}
          className="rounded-md bg-gray-800 px-2 py-1 hover:bg-gray-700"
        >
          Obecność {attendanceOpen ? '▴' : '▾'}
        </button>
      </div>

      {attendanceOpen && (
        <div className="-mt-4 max-h-[30%] shrink-0 overflow-y-auto border-t border-gray-800 px-3 pb-6 pt-2">
          <TaskWheelAttendance
            students={wheel.classStudents}
            absentSet={wheel.absentSet}
            usedFor={wheel.usedFor}
            onTogglePresent={wheel.togglePresent}
          />
        </div>
      )}
    </div>
  );
}
