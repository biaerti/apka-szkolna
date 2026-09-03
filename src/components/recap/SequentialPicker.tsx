// Widok trybu "po kolei": duza lista uczniow w kolejnosci numerow z dziennika.
// Nastepny w kolejnosci jest podswietlony, ci ktorzy juz odpowiadali - wyszarzeni,
// nieobecni sa pominieci (nie trafiaja do tej listy - filtrowani wczesniej).

import type { Student } from '../../data/types';

export interface SequentialPickerProps {
  students: Student[];
  usedIds: Set<string>;
  nextStudentId: string | null;
  currentStudentId: string | null;
}

export function SequentialPicker({ students, usedIds, nextStudentId, currentStudentId }: SequentialPickerProps) {
  if (students.length === 0) {
    return <p className="text-lg text-gray-400">Brak obecnych uczniów.</p>;
  }

  return (
    <div className="flex h-full w-full max-w-md flex-col overflow-y-auto rounded-xl border border-gray-700 bg-gray-900/70 p-2">
      {students.map((st) => {
        const used = usedIds.has(st.id);
        const isNext = st.id === nextStudentId;
        const isCurrent = st.id === currentStudentId;
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
                    : 'text-gray-200'
            }`}
          >
            <span className="w-8 shrink-0 text-right tabular-nums opacity-70">{st.number}.</span>
            <span className={used && !isCurrent ? 'line-through' : ''}>
              {st.lastName} {st.firstName}
            </span>
            {used && !isCurrent && <span className="ml-auto text-xs text-gray-500">już był/a</span>}
            {isNext && !isCurrent && <span className="ml-auto text-xs text-accent-200">następny/a</span>}
          </div>
        );
      })}
    </div>
  );
}
