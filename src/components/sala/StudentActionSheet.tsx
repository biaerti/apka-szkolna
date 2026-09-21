// Dolny arkusz po tapie w ucznia w widoku Sala: duze przyciski w zasiegu
// kciuka. Gorny rzad to oceny - Plus, Kropka, Plomba - i zapisuje od razu.
// Dolny rzad to zachowanie: Ostrzezenie (zapis od razu) i Uwaga, ktora
// rozwija gotowce (te same, co w kole i w panelu).
//
// Ostrzezenie wisi przy uczniu z lekcji na lekcje i moze byc ich kilka
// (najpierw "uwazaj", potem "ostatni raz", dopiero potem uwaga), wiec
// przycisk nigdy sie nie blokuje, a pod przyciskami jest "Zdejmij
// ostrzezenie" - inaczej nie dalo by sie go cofnac po zamknieciu arkusza.
//
// Pod nazwiskiem stoi "Dzis:" z dzisiejszymi wpisami SLOWAMI ("P pas"),
// zeby symbol przy nazwisku w lawce dalo sie rozszyfrowac bez legendy.
//
// To celowo nie jest Modal ze srodka ekranu: na telefonie trzymanym jedna
// reka gorna polowa ekranu jest poza kciukiem.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { RecapEvent, RecapResult, Student } from '../../data/types';
import { resultSymbol } from '../../lib/resultSymbol';
import { UwagaNoteChoices } from '../uwagi/UwagaNoteChoices';

export type SalaGrade = Extract<RecapResult, 'plus' | 'kropka' | 'plomba'>;

export interface StudentActionSheetProps {
  student: Student | null;
  seatLabel?: string;
  /** Ile ostrzezen juz wisi - przy >0 dochodzi "Zdejmij ostrzezenie". */
  ostrzezenia?: number;
  /** Dzisiejsze zdarzenia ucznia - linijka "Dzis:" pod nazwiskiem. */
  todayEvents?: RecapEvent[];
  onGrade: (student: Student, result: SalaGrade) => void;
  onOstrzezenie: (student: Student) => void;
  onZdejmijOstrzezenie: (student: Student) => void;
  onUwaga: (student: Student, note: string) => void;
  onClose: () => void;
}

const GRADES: Array<{ result: SalaGrade; label: string; className: string }> = [
  { result: 'plus', label: 'Plus', className: 'bg-emerald-600 text-white active:bg-emerald-700' },
  { result: 'kropka', label: 'Kropka', className: 'bg-sky-600 text-white active:bg-sky-700' },
  { result: 'plomba', label: 'Plomba', className: 'bg-red-600 text-white active:bg-red-700' },
];

export function StudentActionSheet({
  student,
  seatLabel,
  ostrzezenia = 0,
  todayEvents = [],
  onGrade,
  onOstrzezenie,
  onZdejmijOstrzezenie,
  onUwaga,
  onClose,
}: StudentActionSheetProps) {
  const [uwaga, setUwaga] = useState(false);

  // Kazde otwarcie zaczyna od przyciskow, nie od gotowcow uwagi.
  useEffect(() => {
    setUwaga(false);
  }, [student]);

  useEffect(() => {
    if (!student) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [student, onClose]);

  if (!student) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-label={`${student.lastName} ${student.firstName}`}
        className="w-full max-w-lg rounded-t-2xl bg-white px-4 pb-6 pt-3 shadow-xl"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <p className="text-lg font-semibold text-gray-900">
            {student.lastName} {student.firstName}
          </p>
          <p className="text-sm tabular-nums text-gray-500">
            nr {student.number}
            {seatLabel && <> · ławka {seatLabel}</>}
          </p>
        </div>
        {(todayEvents.length > 0 || ostrzezenia > 0) && (
          <p className="mb-2 text-sm text-gray-600">
            {ostrzezenia > 0 && (
              <span className="mr-2 font-medium text-amber-700">
                {resultSymbol('ostrzezenie').symbol} {ostrzezenia === 1 ? 'ostrzeżenie' : `${ostrzezenia} ostrzeżenia`}
              </span>
            )}
            {todayEvents.length > 0 && (
              <>
                Dziś:{' '}
                {todayEvents.map((e, i) => {
                  const sym = resultSymbol(e.result);
                  return (
                    <span key={e.id}>
                      {i > 0 && ', '}
                      <span className="font-black">{sym.symbol}</span> {sym.label}
                    </span>
                  );
                })}
              </>
            )}
          </p>
        )}
        <div className="mb-2" />

        {uwaga ? (
          <UwagaNoteChoices
            onPick={(note) => {
              onUwaga(student, note);
              onClose();
            }}
            onCancel={() => setUwaga(false)}
          />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.result}
                  type="button"
                  onClick={() => {
                    onGrade(student, g.result);
                    onClose();
                  }}
                  className={`rounded-xl px-1 py-4 text-base font-semibold ${g.className}`}
                >
                  <span className="block text-2xl font-black">{resultSymbol(g.result).symbol}</span>
                  {g.label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onOstrzezenie(student);
                  onClose();
                }}
                className="rounded-xl bg-amber-500 px-1 py-4 text-base font-semibold text-white active:bg-amber-600"
              >
                <span className="block text-2xl font-black">{resultSymbol('ostrzezenie').symbol}</span>
                {ostrzezenia > 0 ? 'Kolejne ostrzeżenie' : 'Ostrzeżenie'}
              </button>
              <button
                type="button"
                onClick={() => setUwaga(true)}
                className="rounded-xl bg-orange-700 px-1 py-4 text-base font-semibold text-white active:bg-orange-800"
              >
                <span className="block text-2xl font-black">!</span>
                Uwaga
              </button>
            </div>
            {ostrzezenia > 0 && (
              <button
                type="button"
                onClick={() => {
                  onZdejmijOstrzezenie(student);
                  onClose();
                }}
                className="mt-3 w-full py-1 text-sm text-gray-500 underline-offset-2 active:text-gray-900 active:underline"
              >
                {ostrzezenia === 1 ? 'Zdejmij ostrzeżenie' : 'Zdejmij ostatnie ostrzeżenie'}
              </button>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
