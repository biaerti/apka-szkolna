// Obecnosc z plywajacego panelu: lista klasy, klik w nazwisko = nieobecny /
// obecny. Nieobecny tego dnia nie trafia na zadne kolo (panel, szuflada w
// prezentacji, kolo powtorzeniowe) - patrz useAttendance i src/lib/attendance.ts.
//
// Przy kazdym nazwisku jest tez 💬 - uwaga do dziennika wpisana wlasnymi slowami.
// Uwaga nie ma zadnych skutkow w grze: laduje w zakladce "Uwagi" apki webowej
// (z klasa i numerem lekcji), a apka przypomina, zeby przepisac ja do dziennika.
// Panel jest glownie na lekcji, dziennik - po lekcjach.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { toDateKey } from '../../lib/dates';
import { UWAGA_PRESETS, uwagaLabel } from '../../lib/uwagi';

export interface PanelObecnoscProps {
  classId: string;
  /** Podpis klasy i lekcji do naglowka, np. "IV A · 3. lekcja". */
  podpis: string;
  students: Student[];
  absentSet: Set<string>;
  onTogglePresent: (studentId: string) => void;
  onZamknij: () => void;
}

export function PanelObecnosc({ classId, podpis, students, absentSet, onTogglePresent, onZamknij }: PanelObecnoscProps) {
  const recapEvents = useStore((s) => s.recapEvents);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);
  const [piszeDla, setPiszeDla] = useState<string | null>(null);

  // Dzisiejsze uwagi w tej klasie, po uczniach - widac, co juz wpisane z tej lekcji.
  const uwagiDzis = useMemo(() => {
    const dzis = toDateKey(new Date());
    const map = new Map<string, typeof recapEvents>();
    for (const e of recapEvents) {
      if (e.result !== 'uwaga' || e.classId !== classId || toDateKey(new Date(e.at)) !== dzis) continue;
      map.set(e.studentId, [...(map.get(e.studentId) ?? []), e]);
    }
    return map;
  }, [recapEvents, classId]);

  const nieobecni = students.filter((st) => absentSet.has(st.id)).length;

  function zapiszUwage(student: Student, note: string) {
    addRecapEvent({ studentId: student.id, classId, result: 'uwaga', note });
    setPiszeDla(null);
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gray-900">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-800 px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-200">Obecność · {podpis}</p>
          <p className="text-xs text-gray-500">
            {nieobecni > 0 ? `nieobecni: ${nieobecni}` : 'wszyscy obecni'} · klik w nazwisko
          </p>
        </div>
        <button type="button" onClick={onZamknij} className="shrink-0 rounded-md bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700">
          Gotowe
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {students.length === 0 ? (
          <p className="p-3 text-xs text-gray-500">Ta klasa nie ma jeszcze uczniów.</p>
        ) : (
          students.map((st) => {
            const absent = absentSet.has(st.id);
            const uwagi = uwagiDzis.get(st.id) ?? [];
            const pisze = piszeDla === st.id;
            return (
              <div key={st.id} className="border-b border-gray-800">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => onTogglePresent(st.id)}
                    title={absent ? 'Nieobecny/a - kliknij, żeby przywrócić' : 'Kliknij, żeby zaznaczyć nieobecność'}
                    className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left hover:bg-gray-800"
                  >
                    <span className="w-5 shrink-0 text-right text-xs tabular-nums text-gray-500">{st.number}.</span>
                    <span className={`min-w-0 flex-1 truncate text-sm ${absent ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
                      {st.lastName} {st.firstName}
                    </span>
                    {absent && (
                      <span className="shrink-0 rounded bg-red-900/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-300">
                        nb
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPiszeDla(pisze ? null : st.id)}
                    aria-label={`Uwaga do dziennika - ${st.lastName}`}
                    aria-expanded={pisze}
                    title="Uwaga do dziennika"
                    className={`mr-2 shrink-0 rounded-md px-2 py-1 text-sm ${
                      pisze || uwagi.length > 0 ? 'bg-amber-600/30 text-amber-200' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    💬{uwagi.length > 1 ? <span className="ml-0.5 text-xs">{uwagi.length}</span> : null}
                  </button>
                </div>

                {uwagi.map((e) => (
                  <div key={e.id} className="flex items-center gap-2 pb-1.5 pl-10 pr-3 text-xs text-amber-200/90">
                    <span className="min-w-0 flex-1 truncate">{uwagaLabel(e)}</span>
                    <button
                      type="button"
                      onClick={() => removeRecapEvent(e.id)}
                      aria-label="Usuń uwagę"
                      title="Usuń uwagę"
                      className="shrink-0 rounded px-1 text-gray-500 hover:bg-gray-800 hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {pisze && <PoleUwagi onZapisz={(note) => zapiszUwage(st, note)} onAnuluj={() => setPiszeDla(null)} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/** Pole na tresc uwagi: wpisz i Enter, albo jeden z gotowcow. Esc zamyka. */
function PoleUwagi({ onZapisz, onAnuluj }: { onZapisz: (note: string) => void; onAnuluj: () => void }) {
  const [tekst, setTekst] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  return (
    <div className="space-y-1.5 px-3 pb-2 pl-10">
      <div className="flex gap-1.5">
        <input
          ref={inputRef}
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && tekst.trim()) {
              e.preventDefault();
              onZapisz(tekst.trim());
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onAnuluj();
            }
          }}
          placeholder="Za co uwaga? (Enter)"
          className="min-w-0 flex-1 rounded-md bg-gray-800 px-2 py-1 text-sm text-gray-100 placeholder:text-gray-500"
        />
        <button
          type="button"
          disabled={!tekst.trim()}
          onClick={() => onZapisz(tekst.trim())}
          className="shrink-0 rounded-md bg-amber-600 px-2 py-1 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-40"
        >
          Zapisz
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {UWAGA_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onZapisz(p)}
            className="rounded bg-gray-800 px-1.5 py-0.5 text-[11px] text-gray-300 hover:bg-gray-700"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
