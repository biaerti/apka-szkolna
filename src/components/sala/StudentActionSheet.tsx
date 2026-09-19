// Dolny arkusz po tapie w ucznia w widoku Sala: cztery duze przyciski w
// zasiegu kciuka - Plus, Kropka, Plomba, Uwaga. Trzy pierwsze zapisuja od
// razu, Uwaga rozwija gotowce (te same, co w kole i w panelu).
//
// To celowo nie jest Modal ze srodka ekranu: na telefonie trzymanym jedna
// reka gorna polowa ekranu jest poza kciukiem.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { RecapResult, Student } from '../../data/types';
import { resultSymbol } from '../../lib/resultSymbol';
import { UwagaNoteChoices } from '../uwagi/UwagaNoteChoices';

export type SalaGrade = Extract<RecapResult, 'plus' | 'kropka' | 'plomba'>;

export interface StudentActionSheetProps {
  student: Student | null;
  seatLabel?: string;
  onGrade: (student: Student, result: SalaGrade) => void;
  onUwaga: (student: Student, note: string) => void;
  onClose: () => void;
}

const GRADES: Array<{ result: SalaGrade; label: string; className: string }> = [
  { result: 'plus', label: 'Plus', className: 'bg-emerald-600 text-white active:bg-emerald-700' },
  { result: 'kropka', label: 'Kropka', className: 'bg-sky-600 text-white active:bg-sky-700' },
  { result: 'plomba', label: 'Plomba', className: 'bg-red-600 text-white active:bg-red-700' },
];

export function StudentActionSheet({ student, seatLabel, onGrade, onUwaga, onClose }: StudentActionSheetProps) {
  const [uwaga, setUwaga] = useState(false);

  // Kazde otwarcie zaczyna od czterech przyciskow, nie od gotowcow uwagi.
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
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <p className="text-lg font-semibold text-gray-900">
            {student.lastName} {student.firstName}
          </p>
          <p className="text-sm tabular-nums text-gray-500">
            nr {student.number}
            {seatLabel && <> · {seatLabel}</>}
          </p>
        </div>

        {uwaga ? (
          <UwagaNoteChoices
            onPick={(note) => {
              onUwaga(student, note);
              onClose();
            }}
            onCancel={() => setUwaga(false)}
          />
        ) : (
          <div className="grid grid-cols-4 gap-2">
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
            <button
              type="button"
              onClick={() => setUwaga(true)}
              className="rounded-xl bg-orange-700 px-1 py-4 text-base font-semibold text-white active:bg-orange-800"
            >
              <span className="block text-2xl font-black">!</span>
              Uwaga
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
