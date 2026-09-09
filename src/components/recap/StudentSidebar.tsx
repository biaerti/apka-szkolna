// Zwijany pasek boczny: lista uczniow klasy z bilansem miesiaca oraz
// oznaczeniem "juz byl" / "nieobecny". Umozliwia tez odhaczenie obecnosci.
//
// "Juz byl/a" jest CZERWONE i przekreslone - dokladnie tak samo jak sektor na
// kole (Wheel.tsx). Jeden kolor znaczy w calej aplikacji to samo: ta osoba
// wypada z losowania do konca rundy.

import type { RecapResult, Student } from '../../data/types';
import type { MonthBalance } from '../../lib/recap';
import { resultSymbol } from '../../lib/resultSymbol';

export interface StudentSidebarProps {
  open: boolean;
  onToggleOpen: () => void;
  students: Student[];
  usedCount: Map<string, number>;
  absentSet: Set<string>;
  currentStudentId: string | null;
  balanceFor: (studentId: string) => MonthBalance;
  onTogglePresent: (studentId: string) => void;
  /** false w trybie bez ocen - ukrywa bilans +/- i pokazuje tylko "już był/a". Domyslnie true. */
  showBalance?: boolean;
}

/**
 * Jedna liczba z podpisem. Wczesniej bilans byl skrotem "+0 .0 p0 pas0", ktorego
 * nauczyciel nie potrafil odczytac - liczby musza sie tlumaczyc same. Symbol
 * (src/lib/resultSymbol.ts) stoi PRZY slowie, a nie zamiast niego: dzieci ucza
 * sie znaku, a podpis wciaz mowi wprost, co to za liczba.
 */
function Tally({ label, value, result }: { label: string; value: number; result: RecapResult }) {
  const sym = resultSymbol(result);
  return (
    <span className="flex flex-col items-center leading-tight">
      <span className={`${sym.color} text-base font-semibold`}>{value}</span>
      <span className="text-[11px] text-gray-500">
        <span className={`font-bold ${sym.color}`}>{sym.symbol}</span> {label}
      </span>
    </span>
  );
}

export function StudentSidebar({
  open,
  onToggleOpen,
  students,
  usedCount,
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
    <div className="flex h-full w-[22rem] flex-col border-l border-gray-700 bg-gray-900 text-base text-gray-200">
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
          const used = (usedCount.get(st.id) ?? 0) >= 1;
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
                <span
                  className={
                    absent ? 'text-gray-500 line-through' : used ? 'text-red-400 line-through' : ''
                  }
                >
                  {st.lastName} {st.firstName}
                </span>
              </label>
              <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-gray-400">
                {showBalance && (
                  <span className="flex items-center gap-1.5">
                    <Tally label="plusy" value={balance.plus} result="plus" />
                    <Tally label="kropki" value={balance.kropka} result="kropka" />
                    <Tally label="plomby" value={balance.plombyTotal} result="plomba" />
                    <Tally label="pasy" value={balance.pass} result="pass" />
                  </span>
                )}
                {absent ? <span>nieobecny/a</span> : used ? <span className="text-red-400">już był/a</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
