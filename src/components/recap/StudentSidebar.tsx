// Zwijany pasek boczny: lista uczniow klasy z bilansem miesiaca oraz
// oznaczeniem "juz byl" / "nieobecny" / eskalacji uwag. Umozliwia tez
// odhaczenie obecnosci.

import type { Student } from '../../data/types';
import type { MonthBalance } from '../../lib/recap';
import { warnLevel, warnLevelLabel, wheelEntriesFor } from '../../lib/recap';

export interface StudentSidebarProps {
  open: boolean;
  onToggleOpen: () => void;
  students: Student[];
  usedCount: Map<string, number>;
  warningsFor: (studentId: string) => number;
  absentSet: Set<string>;
  currentStudentId: string | null;
  balanceFor: (studentId: string) => MonthBalance;
  onTogglePresent: (studentId: string) => void;
  /** false w trybie bez ocen - ukrywa bilans +/- i pokazuje tylko "już był/a". Domyslnie true. */
  showBalance?: boolean;
}

/**
 * Jedna liczba z podpisem. Wczesniej bilans byl skrotem "+0 .0 p0 pas0", ktorego
 * nauczyciel nie potrafil odczytac - liczby musza sie tlumaczyc same.
 */
function Tally({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="flex flex-col items-center leading-tight">
      <span className={`${color} text-sm font-semibold`}>{value}</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </span>
  );
}

export function StudentSidebar({
  open,
  onToggleOpen,
  students,
  usedCount,
  warningsFor,
  absentSet,
  currentStudentId,
  balanceFor,
  onTogglePresent,
  showBalance = true,
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
    <div className="flex h-full w-80 flex-col border-l border-gray-700 bg-gray-900 text-sm text-gray-200">
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
        <span className="font-medium">
          Uczniowie
          {showBalance && <span className="ml-2 text-xs font-normal text-gray-400">bilans tego miesiąca</span>}
        </span>
        <button type="button" onClick={onToggleOpen} className="text-gray-400 hover:text-gray-200">
          zwiń
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {students.map((st) => {
          const balance = balanceFor(st.id);
          const absent = absentSet.has(st.id);
          const warnings = warningsFor(st.id);
          const totalEntries = wheelEntriesFor(warnings);
          const used = (usedCount.get(st.id) ?? 0) >= totalEntries;
          const level = warnLevel(warnings);
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
              <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-gray-400">
                {showBalance && (
                  <span className="flex items-center gap-1.5">
                    <Tally label="plusy" value={balance.plus} color="text-emerald-400" />
                    <Tally label="kropki" value={balance.kropka} color="text-sky-400" />
                    <Tally label="plomby" value={balance.plombyTotal} color="text-red-400" />
                    <Tally label="pasy" value={balance.pass} color="text-amber-400" />
                  </span>
                )}
                {level !== 'none' && <span className="text-amber-400">{warnLevelLabel(level)}</span>}
                <span>{absent ? 'nieobecny/a' : used ? 'już był/a' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
