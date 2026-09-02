// Zwijany pasek boczny: lista uczniow klasy z bilansem miesiaca oraz
// oznaczeniem "juz byl" / "nieobecny". Umozliwia tez odhaczenie obecnosci.

import type { Student } from '../../data/types';
import type { MonthBalance } from '../../lib/recap';

export interface StudentSidebarProps {
  open: boolean;
  onToggleOpen: () => void;
  students: Student[];
  usedIds: Set<string>;
  absentSet: Set<string>;
  currentStudentId: string | null;
  balanceFor: (studentId: string) => MonthBalance;
  onTogglePresent: (studentId: string) => void;
}

export function StudentSidebar({
  open,
  onToggleOpen,
  students,
  usedIds,
  absentSet,
  currentStudentId,
  balanceFor,
  onTogglePresent,
}: StudentSidebarProps) {
  if (!open) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-md bg-gray-800 px-2 py-4 text-xs text-gray-300 hover:bg-gray-700"
      >
        uczniowie
      </button>
    );
  }

  return (
    <div className="flex h-full w-72 flex-col border-l border-gray-700 bg-gray-900 text-sm text-gray-200">
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
        <span className="font-medium">Uczniowie</span>
        <button type="button" onClick={onToggleOpen} className="text-gray-400 hover:text-gray-200">
          zwiń
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {students.map((st) => {
          const balance = balanceFor(st.id);
          const absent = absentSet.has(st.id);
          const used = usedIds.has(st.id);
          const active = st.id === currentStudentId;
          return (
            <div
              key={st.id}
              className={`flex items-center justify-between gap-2 border-b border-gray-800 px-3 py-2 ${
                active ? 'bg-accent-900/40' : ''
              }`}
            >
              <label className="flex flex-1 items-center gap-2">
                <input
                  type="checkbox"
                  checked={!absent}
                  onChange={() => onTogglePresent(st.id)}
                  className="rounded border-gray-500"
                />
                <span className={absent ? 'text-gray-500 line-through' : ''}>
                  {st.lastName} {st.firstName}
                </span>
              </label>
              <div className="flex shrink-0 flex-col items-end text-xs text-gray-400">
                <span>
                  +{balance.plus} -{balance.minus} p{balance.pass}
                </span>
                <span>
                  {absent ? 'nieobecny' : used ? 'już był' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
