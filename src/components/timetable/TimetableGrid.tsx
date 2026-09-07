// Siatka planu: wiersze = godziny lekcyjne, kolumny = pon-pt. Komorka to chip
// z nazwa klasy (kolor jak w kalendarzu) i sala; klik otwiera edytor w miejscu.
// Dzisiejsza kolumna jest podswietlona, trwajaca lekcja - mocniej.

import clsx from 'clsx';
import type { LessonPeriod, SchoolClass, TimetableEntry } from '../../data/types';
import { WEEKDAY_SHORT, weekdayOf, periodStatus, validPeriods } from '../../lib/timetable';
import { classBadgeClasses } from '../calendar/classColor';
import { TimetableCellEditor } from './TimetableCellEditor';

const WEEKDAYS = [1, 2, 3, 4, 5];

export interface EditingCell {
  weekday: number;
  period: number;
}

export interface TimetableGridProps {
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
  classes: SchoolClass[];
  now: Date;
  editing: EditingCell | null;
  defaultRoom: string;
  onEdit: (cell: EditingCell | null) => void;
  onSave: (cell: EditingCell, classId: string, room: string) => void;
}

export function TimetableGrid({ periods, timetable, classes, now, editing, defaultRoom, onEdit, onSave }: TimetableGridProps) {
  const sortedPeriods = [...periods].sort((a, b) => a.no - b.no);
  const today = weekdayOf(now);
  const status = periodStatus(validPeriods(periods), now);
  const currentPeriodNo = status.kind === 'lesson' ? status.period.no : undefined;
  const classById = new Map(classes.map((c) => [c.id, c]));
  const entryAt = (weekday: number, period: number) =>
    timetable.find((e) => e.weekday === weekday && e.period === period);

  if (sortedPeriods.length === 0) {
    return <p className="text-sm text-gray-500">Brak godzin lekcyjnych - dodaj je poniżej, żeby ułożyć plan.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-24 border-b border-gray-200 px-2 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Godzina
            </th>
            {WEEKDAYS.map((d) => (
              <th
                key={d}
                className={clsx(
                  'border-b border-gray-200 px-2 py-2 text-left text-xs font-medium uppercase tracking-wide',
                  d === today ? 'bg-accent-50 text-accent-700' : 'text-gray-500',
                )}
              >
                {WEEKDAY_SHORT[d]}
                {d === today && <span className="ml-1 font-normal normal-case text-accent-600">(dziś)</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPeriods.map((p) => (
            <tr key={p.no}>
              <td className="border-b border-gray-100 px-2 py-1.5 align-top">
                <span className="font-semibold text-gray-900">{p.no}.</span>
                <span className="ml-1 whitespace-nowrap text-xs text-gray-500">
                  {p.start}-{p.end}
                </span>
              </td>
              {WEEKDAYS.map((d) => {
                const entry = entryAt(d, p.no);
                const cls = entry ? classById.get(entry.classId) : undefined;
                const isEditing = editing?.weekday === d && editing.period === p.no;
                const isCurrent = d === today && p.no === currentPeriodNo;
                return (
                  <td
                    key={d}
                    className={clsx(
                      'border-b border-gray-100 px-1.5 py-1.5 align-top',
                      d === today && 'bg-accent-50/60',
                      isCurrent && 'bg-accent-100',
                    )}
                  >
                    {isEditing ? (
                      <TimetableCellEditor
                        entry={entry}
                        classes={classes}
                        defaultRoom={defaultRoom}
                        onSave={(classId, room) => onSave({ weekday: d, period: p.no }, classId, room)}
                        onClose={() => onEdit(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => onEdit({ weekday: d, period: p.no })}
                        aria-label={`${WEEKDAY_SHORT[d]}, lekcja ${p.no}: ${cls ? cls.name : 'brak'}`}
                        className={clsx(
                          'flex h-10 w-full items-center gap-1.5 rounded-md px-1.5 text-left transition-colors hover:bg-gray-100',
                          isCurrent && 'ring-2 ring-accent-500',
                        )}
                      >
                        {cls ? (
                          <>
                            <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${classBadgeClasses(cls.order)}`}>
                              {cls.name}
                            </span>
                            {entry?.room && <span className="text-xs text-gray-500">s. {entry.room}</span>}
                          </>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
