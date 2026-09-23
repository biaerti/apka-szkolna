// Widok trybu "rozkład klasy": lawki jak w zakladce Sala (tablica na dole,
// rzad 1 tuz nad nia), ale w ciemnym motywie powtorki. Losowanie to skaczace
// podswietlenie: przez chwile przeskakuje po obecnych, jeszcze niewybranych
// uczniach, a na koncu zatrzymuje sie na wylosowanej osobie i dopiero wtedy
// zglasza koniec animacji (onSpinEnd) - tak jak kolo ujawnia nazwisko dopiero,
// gdy stanie.
//
// Stany miejsc jak w pozostalych trybach: kto juz odpowiadal, jest na
// czerwono i przekreslony (SequentialPicker/Wheel), nieobecni sa wygaszeni,
// wolne miejsca ledwo zaznaczone. Uczniowie obecni bez lawki laduja w pasku
// "Bez lawki" pod siatka - ich tez da sie wylosowac.

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { buildDeskGrid, deskName, podpisRozmiar, unseatedStudents } from '../../lib/seating';

export interface SeatingPickerProps {
  classId: string;
  /** Aktywni uczniowie klasy - takze nieobecni (sa na planie, tylko wygaszeni). */
  students: Student[];
  absentSet: Set<string>;
  usedCount: Map<string, number>;
  currentStudentId: string | null;
  spinning: boolean;
  spinToken: number;
  /** Uczen, na ktorym ma sie zatrzymac podswietlenie (ustawiany przy losowaniu). */
  targetStudentId: string | null;
  onSpinEnd: () => void;
}

/** Czas skakania podswietlenia - krotszy niz kolo, bo nie ma tu rozpedzania. */
const HOP_TOTAL_MS = 1600;
const HOP_STEP_MS = 110;
/** Pauza na wylosowanym uczniu, zanim ujawnimy nazwisko w panelu pytania. */
const LANDING_MS = 350;

export function SeatingPicker({
  classId,
  students,
  absentSet,
  usedCount,
  currentStudentId,
  spinning,
  spinToken,
  targetStudentId,
  onSpinEnd,
}: SeatingPickerProps) {
  const seats = useStore((s) => s.seats);
  const grid = buildDeskGrid(seats, students, classId);
  const bezLawki = unseatedStudents(seats, students, classId);

  // Podswietlenie animacji (id ucznia). Poza animacja: null.
  const [hopId, setHopId] = useState<string | null>(null);

  // Najswiezsze dane dla timerow animacji - bez restartu efektu przy kazdym
  // renderze (efekt zalezy tylko od spinToken).
  const animRef = useRef({ students, absentSet, usedCount, targetStudentId, onSpinEnd });
  animRef.current = { students, absentSet, usedCount, targetStudentId, onSpinEnd };
  const startedTokenRef = useRef(0);

  useEffect(() => {
    // Animacja rusza wylacznie na NOWY token (swiezo nacisniete "Losuj") -
    // wejscie na slajd albo powrot z innego trybu nie kreci niczym samo.
    if (spinToken === 0 || spinToken === startedTokenRef.current || !spinning) return;
    startedTokenRef.current = spinToken;
    const { students: st, absentSet: absent, usedCount: used, targetStudentId: target } = animRef.current;
    const candidates = st.filter((s) => !absent.has(s.id) && (used.get(s.id) ?? 0) < 1).map((s) => s.id);
    let elapsed = 0;
    let last: string | null = null;
    const interval = window.setInterval(() => {
      elapsed += HOP_STEP_MS;
      if (elapsed >= HOP_TOTAL_MS) {
        window.clearInterval(interval);
        setHopId(target);
        window.setTimeout(() => {
          setHopId(null);
          animRef.current.onSpinEnd();
        }, LANDING_MS);
        return;
      }
      if (candidates.length > 1) {
        let next = last;
        while (next === last) next = candidates[Math.floor(Math.random() * candidates.length)];
        last = next;
        setHopId(next);
      } else {
        setHopId(candidates[0] ?? target);
      }
    }, HOP_STEP_MS);
    return () => window.clearInterval(interval);
  }, [spinToken, spinning]);

  function placeClasses(student: Student | undefined): string {
    if (!student) return 'border border-dashed border-gray-800 text-transparent';
    if (student.id === hopId) return 'bg-accent-500 text-white';
    if (!spinning && student.id === currentStudentId) return 'bg-accent-600 font-semibold text-white';
    if (absentSet.has(student.id)) return 'text-gray-600 opacity-50';
    if ((usedCount.get(student.id) ?? 0) >= 1) return 'text-red-400 line-through';
    return 'bg-gray-800 text-gray-200';
  }

  return (
    <div className="flex h-full w-full max-w-2xl flex-col justify-center gap-1.5 overflow-y-auto p-1">
      {[...grid].reverse().map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-3 gap-1.5">
          {row.map((desk) => (
            <div key={desk.label} className="rounded-lg border border-gray-700 bg-gray-900/70 p-0.5">
              <div className="px-1 text-[10px] font-semibold tabular-nums text-gray-500">{desk.label}</div>
              <div className="grid grid-cols-2 gap-1">
                {desk.places.map((place) => {
                  const podpis = place.student ? deskName(place.student, students) : '·';
                  return (
                    <div
                      key={place.side}
                      className={clsx(
                        'truncate rounded-md px-0.5 py-1.5 text-center leading-tight',
                        // Te same progi rozmiaru pisma co w widoku Sala -
                        // "Maksymilian" ma byc caly, nie uciety.
                        podpisRozmiar(podpis),
                        placeClasses(place.student),
                      )}
                    >
                      {podpis}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
      {bezLawki.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs uppercase tracking-wide text-gray-500">Bez ławki:</span>
          {bezLawki.map((st) => (
            <span key={st.id} className={clsx('rounded-md px-2 py-1 text-sm', placeClasses(st))}>
              {deskName(st, students)}
            </span>
          ))}
        </div>
      )}
      <div className="rounded bg-gray-700 py-0.5 text-center text-[11px] font-semibold uppercase tracking-widest text-gray-300">
        Tablica
      </div>
    </div>
  );
}
