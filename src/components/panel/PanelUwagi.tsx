// Uwagi z plywajacego panelu: lista klasy z liczba uwag w tym miesiacu i
// przyciskiem "Uwaga" przy kazdym nazwisku. To samo, co zakladka "Klasa" w
// prezentacji (PresentClassPanel), ale panel czesto jest jedynym, co nauczyciel
// ma pod reka przy pracy w podreczniku - uwaga musi byc na jedno klikniecie,
// bez wracania do apki.
//
// Kazda pozycja ma tez cofniecie (×), bo w panelu 360 px latwo kliknac obok, a
// uwaga wchodzi do bilansu miesiaca od razu: druga uwaga = brak plusow do konca
// miesiaca (src/lib/recap.ts, canEarnPlus).

import { useState } from 'react';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { monthKey } from '../../lib/week';
import { warningsThisMonth } from '../../lib/recap';

/** Polska liczba mnoga "uwaga/uwagi/uwag" - jak w PresentClassPanel. */
function warningsWord(n: number): string {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return 'uwaga';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'uwagi';
  return 'uwag';
}

export interface PanelUwagiProps {
  classId: string;
  students: Student[];
  onZamknij: () => void;
}

export function PanelUwagi({ classId, students, onZamknij }: PanelUwagiProps) {
  const recapEvents = useStore((s) => s.recapEvents);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);
  const [flashId, setFlashId] = useState<string | null>(null);

  function dodajUwage(studentId: string) {
    addRecapEvent({ studentId, classId, result: 'uwaga' });
    // Krotki flash zamiast modala - widac, ze klikniecie "wzielo".
    setFlashId(studentId);
    window.setTimeout(() => setFlashId((id) => (id === studentId ? null : id)), 500);
  }

  /** Cofa NAJNOWSZA uwage ucznia z biezacego miesiaca - tylko taka liczy sie do eskalacji. */
  function cofnijUwage(studentId: string) {
    const miesiac = monthKey(new Date());
    const ostatnia = recapEvents
      .filter((e) => e.studentId === studentId && e.result === 'uwaga' && monthKey(new Date(e.at)) === miesiac)
      .sort((a, b) => a.at.localeCompare(b.at))
      .pop();
    if (ostatnia) removeRecapEvent(ostatnia.id);
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gray-900">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-3 py-2">
        <span className="text-sm font-medium text-gray-200">Uwagi</span>
        <button type="button" onClick={onZamknij} className="rounded-md bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700">
          Gotowe
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {students.length === 0 ? (
          <p className="p-3 text-xs text-gray-500">Ta klasa nie ma jeszcze uczniów.</p>
        ) : (
          students.map((st) => {
            const count = warningsThisMonth(recapEvents, st.id, new Date());
            const flashing = flashId === st.id;
            return (
              <div key={st.id} className="flex items-center gap-2 border-b border-gray-800 px-3 py-1.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-gray-200">
                    {st.number}. {st.lastName} {st.firstName}
                  </div>
                  {count > 0 && (
                    <div className={`text-xs ${flashing ? 'text-amber-300' : 'text-gray-400'}`}>
                      {count} {warningsWord(count)}
                      {count >= 2 && ' · bez plusów do końca miesiąca'}
                    </div>
                  )}
                </div>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={() => cofnijUwage(st.id)}
                    aria-label={`Cofnij uwagę - ${st.lastName}`}
                    title="Cofnij ostatnią uwagę z tego miesiąca"
                    className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-800 hover:text-gray-200"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dodajUwage(st.id)}
                  className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${
                    flashing ? 'bg-amber-500 text-gray-900' : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                  }`}
                >
                  Uwaga
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
