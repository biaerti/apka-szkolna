// Widok trybu "po kolei": duza lista uczniow w kolejnosci numerow z dziennika.
// Nastepny w kolejnosci jest podswietlony, ci ktorzy juz wyczerpali wszystkie
// swoje wejscia do rundy (patrz wheelEntriesFor - uczen z 3 uwagami ma dwa
// wejscia) sa wyszarzeni, nieobecni/niegotowi sa pominieci (filtrowani wczesniej).

import type { Student } from '../../data/types';
import { warnLevel, warnLevelLabel, wheelEntriesFor } from '../../lib/recap';

export interface SequentialPickerProps {
  students: Student[];
  usedCount: Map<string, number>;
  warningsFor: (studentId: string) => number;
  nextStudentId: string | null;
  currentStudentId: string | null;
}

export function SequentialPicker({
  students,
  usedCount,
  warningsFor,
  nextStudentId,
  currentStudentId,
}: SequentialPickerProps) {
  if (students.length === 0) {
    return <p className="text-lg text-gray-400">Brak obecnych uczniów.</p>;
  }

  return (
    <div className="flex h-full w-full max-w-md flex-col overflow-y-auto rounded-xl border border-gray-700 bg-gray-900/70 p-2">
      {students.map((st) => {
        const warnings = warningsFor(st.id);
        const totalEntries = wheelEntriesFor(warnings);
        const used = (usedCount.get(st.id) ?? 0) >= totalEntries;
        const isDouble = totalEntries > 1;
        const isNext = st.id === nextStudentId;
        const isCurrent = st.id === currentStudentId;
        const level = warnLevel(warnings);
        return (
          <div
            key={st.id}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-lg ${
              isCurrent
                ? 'bg-accent-600 font-semibold text-white'
                : isNext
                  ? 'bg-accent-900/50 text-white'
                  : used
                    ? 'text-gray-500'
                    : isDouble
                      ? 'text-amber-300'
                      : 'text-gray-200'
            }`}
          >
            <span className="w-8 shrink-0 text-right tabular-nums opacity-70">{st.number}.</span>
            <span className={used && !isCurrent ? 'line-through' : ''}>
              {st.lastName} {st.firstName}
            </span>
            {isDouble && <span className="text-xs text-amber-300">({warnLevelLabel(level)})</span>}
            {used && !isCurrent && <span className="ml-auto text-xs text-gray-500">już był/a</span>}
            {isNext && !isCurrent && <span className="ml-auto text-xs text-accent-200">następny/a</span>}
          </div>
        );
      })}
    </div>
  );
}
