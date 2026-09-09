// Tryb KOLO plywajacego panelu: kolo, przycisk Krec, ramka z nazwiskiem i dwie
// oceny (plus / kropka). Naglowek (klasa, tryb, uwagi, zwin) jest wspolny dla
// obu trybow i siedzi w PanelNaglowek - tu jest samo cialo panelu.
//
// Uklad jest siostra TaskWheelDrawer (szuflada w prezentacji) - te same zasady
// kola na lekcji i ta sama kolejnosc elementow - ale scisniety do okna ~360 px.

import { useState } from 'react';
import { resultSymbol } from '../../lib/resultSymbol';
import { Wheel } from '../recap/Wheel';
import { TaskWheelAttendance } from '../lessons/TaskWheelAttendance';
import type { TaskWheelState } from '../lessons/useTaskWheel';

export interface PanelWheelProps {
  wheel: TaskWheelState;
  /** Adnotacja zapisywana przy plusie/kropce (np. "podrecznik"). */
  adnotacja: string;
}

export function PanelWheel({ wheel, adnotacja }: PanelWheelProps) {
  const [obecnoscOtwarta, setObecnoscOtwarta] = useState(false);

  const student = wheel.currentStudent;
  const ocenaZablokowana = !student || wheel.graded;
  const pulaPusta = wheel.pool.length === 0 && (!student || wheel.graded);
  // V A nie ma jeszcze wgranej listy - "wszyscy juz odpowiadali" byloby wtedy
  // myllace, bo nie ma kogo losowac, a nie: kazdy juz byl.
  const klasaPusta = wheel.classStudents.length === 0;

  return (
    <>
      <div className="flex min-h-0 flex-1 items-center justify-center px-2 py-1">
        <Wheel
          entries={wheel.entries}
          spinning={wheel.spinning}
          targetAngle={wheel.wheelTarget}
          spinToken={wheel.spinToken}
          spinSec={wheel.settings.wheelSpinSec}
          onSpinEnd={wheel.handleSpinEnd}
          size={300}
          highlightKey={wheel.currentEntry?.key ?? null}
        />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1 px-3">
        {pulaPusta ? (
          <>
            <p className="text-center text-xs text-gray-400">
              {klasaPusta ? 'Ta klasa nie ma jeszcze uczniów' : 'Wszyscy obecni już dziś odpowiadali'}
            </p>
            {!klasaPusta && !wheel.allowRepeats && (
              <button
                type="button"
                onClick={() => wheel.setAllowRepeats(true)}
                className="rounded-lg bg-accent-600 px-5 py-1.5 text-base font-semibold text-white hover:bg-accent-700"
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
            className="w-full rounded-lg bg-accent-600 py-2 text-lg font-semibold text-white hover:bg-accent-700 disabled:opacity-40"
          >
            Kręć (Spacja)
          </button>
        )}
      </div>

      <div className="shrink-0 px-3 pt-2">
        {student ? (
          <div className="relative rounded-xl border-4 border-accent-400 bg-accent-900/40 px-2 py-1 text-center">
            <span className="absolute right-1.5 top-0.5 text-[10px] font-semibold tabular-nums text-accent-300/80">
              nr {student.number}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-accent-300">Odpowiada</p>
            <p className="text-2xl font-bold leading-tight text-white">
              {student.firstName} {student.lastName}
            </p>
          </div>
        ) : (
          <p className="py-2 text-center text-2xl font-bold leading-tight text-gray-600">Kręć kołem</p>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 px-3 pt-2">
        <button
          type="button"
          onClick={() => wheel.grade('plus', adnotacja)}
          disabled={ocenaZablokowana}
          className="rounded-lg bg-emerald-600 py-2 text-base font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          <span className="mr-1.5 font-black">{resultSymbol('plus').symbol}</span>
          Dobrze
          <span className="block text-[10px] font-normal opacity-75">klawisz 1</span>
        </button>
        <button
          type="button"
          onClick={() => wheel.grade('kropka', adnotacja)}
          disabled={ocenaZablokowana}
          className="rounded-lg bg-sky-600 py-2 text-base font-semibold text-white hover:bg-sky-500 disabled:opacity-40"
        >
          <span className="mr-1.5 font-black">{resultSymbol('kropka').symbol}</span>
          Kropka
          <span className="block text-[10px] font-normal opacity-75">klawisz 2</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center justify-between px-3 py-2 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={wheel.resetPool}
            disabled={!wheel.canReset}
            title="Wszyscy wracają na koło - kasuje tylko skreślenia, oceny i obecność zostają"
            className="rounded-md bg-gray-800 px-2 py-1 hover:bg-gray-700 disabled:opacity-40"
          >
            Reset
          </button>
          {wheel.canUndo && (
            <button
              type="button"
              onClick={wheel.undoLast}
              title="Cofnij ostatnią ocenę (Ctrl+Z)"
              className="rounded-md bg-gray-800 px-2 py-1 hover:bg-gray-700"
            >
              Cofnij
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setObecnoscOtwarta((v) => !v)}
          aria-expanded={obecnoscOtwarta}
          className="rounded-md bg-gray-800 px-2 py-1 hover:bg-gray-700"
        >
          Obecność {obecnoscOtwarta ? '▴' : '▾'}
        </button>
      </div>

      {obecnoscOtwarta && (
        <div className="max-h-[45%] shrink-0 overflow-y-auto border-t border-gray-800 px-3 py-2">
          <TaskWheelAttendance
            students={wheel.classStudents}
            absentSet={wheel.absentSet}
            usedFor={wheel.usedFor}
            onTogglePresent={wheel.togglePresent}
          />
        </div>
      )}
    </>
  );
}
