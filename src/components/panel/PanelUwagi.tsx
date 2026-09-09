// Uwagi z plywajacego panelu: lista klasy z liczba uwag w tym miesiacu i
// przyciskiem "Uwaga" przy kazdym nazwisku. To samo, co zakladka "Klasa" w
// prezentacji (PresentClassPanel), ale panel czesto jest jedynym, co nauczyciel
// ma pod reka przy pracy w podreczniku - uwaga musi byc na dwa klikniecia:
// nazwisko i gotowa tresc.
//
// Uwaga NIE ma juz skutkow w grze (koniec eskalacji) - to przypominajka, zeby
// po lekcjach wpisac ja do dziennika. Dlatego od razu prosimy o tresc: bez niej
// wieczorem zostaje samo nazwisko i data. Calosc laduje w zakladce "Uwagi"
// (src/pages/Uwagi.tsx), tam tez sie ja odhacza jako wpisana.
//
// Kazda pozycja ma cofniecie (×), bo w panelu 360 px latwo kliknac obok.

import { useState } from 'react';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { monthKey } from '../../lib/week';
import { warningsThisMonth } from '../../lib/recap';
import { UwagaNoteChoices } from '../uwagi/UwagaNoteChoices';

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
  const [wybrany, setWybrany] = useState<Student | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  function dodajUwage(student: Student, note: string) {
    addRecapEvent({ studentId: student.id, classId, result: 'uwaga', note });
    setWybrany(null);
    // Krotki flash zamiast modala - widac, ze klikniecie "wzielo".
    setFlashId(student.id);
    window.setTimeout(() => setFlashId((id) => (id === student.id ? null : id)), 500);
  }

  /** Cofa NAJNOWSZA uwage ucznia z biezacego miesiaca. */
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

      {wybrany ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <UwagaNoteChoices
            tone="dark"
            title={`${wybrany.lastName} ${wybrany.firstName}`}
            onPick={(note) => dodajUwage(wybrany, note)}
            onCancel={() => setWybrany(null)}
          />
        </div>
      ) : (
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
                        {count} {warningsWord(count)} w tym miesiącu
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
                    onClick={() => setWybrany(st)}
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
      )}
    </div>
  );
}
