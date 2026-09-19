// Siatka lawek w widoku Sala: TABLICA na gorze, trzy kolumny L S P, rzedy w
// dol. Kazda lawka to kafelek z etykieta ("P1") i dwoma miejscami jedno pod
// drugim - na telefonie (390 px) trzy lawki obok siebie maja po ok. 110 px,
// dwa nazwiska obok siebie by sie nie zmiescily.
//
// Ten sam komponent obsluguje zwykly widok (tap = akcje dla ucznia) i tryb
// "Rozsadz" (tap = zaznaczenie miejsca), rozni sie tylko tym, co robi tap
// i czy puste miejsca sa klikalne.

import clsx from 'clsx';
import type { RecapEvent, Student } from '../../data/types';
import type { Desk, SeatPosition } from '../../lib/seating';
import { samePosition, shortName } from '../../lib/seating';
import { resultSymbol } from '../../lib/resultSymbol';

export interface DeskGridProps {
  grid: Desk[][];
  classmates: Student[];
  /** Dzisiejsze zdarzenia po uczniu - male symbole przy nazwisku. */
  todayByStudent: Map<string, RecapEvent[]>;
  editing: boolean;
  selectedPos?: SeatPosition;
  /** Uczen podswietlony po zapisie (krotki flash "wzielo"). */
  flashStudentId?: string | null;
  onTapPlace: (pos: SeatPosition, student?: Student) => void;
}

export function DeskGrid({ grid, classmates, todayByStudent, editing, selectedPos, flashStudentId, onTapPlace }: DeskGridProps) {
  return (
    <div>
      <div className="mb-3 rounded bg-gray-800 py-1 text-center text-xs font-semibold uppercase tracking-widest text-gray-200">
        Tablica
      </div>
      <div className="mb-1 grid grid-cols-3 gap-2 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
        <span>Lewa</span>
        <span>Środek</span>
        <span>Prawa</span>
      </div>
      <div className="space-y-2">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-3 gap-2">
            {row.map((desk) => (
              <div key={desk.label} className="rounded-lg border border-gray-200 bg-white p-1">
                <div className="px-1 text-[10px] font-semibold tabular-nums text-gray-400">{desk.label}</div>
                <div className="space-y-1">
                  {desk.places.map((place) => {
                    const pos: SeatPosition = { column: desk.column, row: desk.row, side: place.side };
                    const selected = selectedPos ? samePosition(selectedPos, pos) : false;
                    const student = place.student;
                    const events = student ? todayByStudent.get(student.id) ?? [] : [];
                    const disabled = !editing && !student;
                    return (
                      <button
                        key={place.side}
                        type="button"
                        disabled={disabled}
                        onClick={() => onTapPlace(pos, student)}
                        aria-label={student ? `${student.lastName} ${student.firstName}, ${desk.label}` : `Wolne miejsce ${desk.label}`}
                        aria-pressed={editing ? selected : undefined}
                        className={clsx(
                          'flex min-h-[2.5rem] w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-left text-sm leading-tight',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                          student ? 'bg-gray-100 text-gray-900 active:bg-accent-100' : 'border border-dashed border-gray-300 text-gray-300',
                          editing && !student && 'active:bg-accent-50',
                          selected && 'ring-2 ring-accent-500 bg-accent-50',
                          flashStudentId && student?.id === flashStudentId && 'bg-emerald-100',
                        )}
                      >
                        <span className="min-w-0 truncate font-medium">{student ? shortName(student, classmates) : ' '}</span>
                        {events.length > 0 && <TodayMarks events={events} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dzisiejsze wyniki ucznia jako ciag symboli ("+ + ▣"), uwaga jako "!". */
export function TodayMarks({ events }: { events: RecapEvent[] }) {
  return (
    <span className="flex shrink-0 gap-0.5 text-xs font-black">
      {events.map((e) => {
        const sym = resultSymbol(e.result);
        return (
          <span
            key={e.id}
            title={sym.label}
            className={clsx(
              e.result === 'plus' && 'text-emerald-600',
              e.result === 'kropka' && 'text-sky-600',
              (e.result === 'plomba' || e.result === 'hint_plomba') && 'text-red-600',
              e.result === 'uwaga' && 'text-orange-600',
              e.result === 'pass' && 'text-amber-600',
            )}
          >
            {sym.symbol}
          </span>
        );
      })}
    </span>
  );
}
