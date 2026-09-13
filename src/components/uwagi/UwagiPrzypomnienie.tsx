// Przypominajka "do wpisania do dziennika" - male okienko w rogu apki webowej.
//
// Uwagi pisze sie na lekcji w plywajacym panelu (albo przy kole), a do
// dziennika wpisuje po lekcjach. Zeby nic nie zginelo, apka sama pokazuje, co
// jeszcze czeka: kto, klasa, dzien, numer lekcji i tresc - i pozwala odhaczyc
// "wpisane" od razu tutaj, bez wchodzenia w zakladke "Uwagi".
//
// Zwiniete okienko nie wraca przy kazdym odswiezeniu, tylko gdy dojdzie NOWA
// uwaga (id spoza zapamietanych). Na stronie /uwagi go nie ma - tam jest cala lista.

import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../data/store';
import { useTodayEventsPull } from '../../data/remote/useTodayEventsPull';
import type { RecapEvent } from '../../data/types';
import { formatPl } from '../../lib/dates';
import { uwagaLabel, uwagaLekcja } from '../../lib/uwagi';

const KLUCZ_ZWINIETE = 'apka-szkolna:uwagi-przypomnienie:zwiniete';
const WIDOCZNYCH = 5;

/** Uwagi jeszcze niewpisane do dziennika, od najstarszej. */
export function useUwagiDoWpisania(): RecapEvent[] {
  const recapEvents = useStore((s) => s.recapEvents);
  return useMemo(
    () => recapEvents.filter((e) => e.result === 'uwaga' && !e.wpisane).sort((a, b) => a.at.localeCompare(b.at)),
    [recapEvents],
  );
}

function czytajZwiniete(): Set<string> {
  try {
    const raw = localStorage.getItem(KLUCZ_ZWINIETE);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function UwagiPrzypomnienie() {
  const location = useLocation();
  const uwagi = useUwagiDoWpisania();
  const students = useStore((s) => s.students);
  const classes = useStore((s) => s.classes);
  const periods = useStore((s) => s.periods);
  const updateRecapEvent = useStore((s) => s.updateRecapEvent);

  // Uwagi z panelu na lekcji maja sie tu pojawic bez przeladowania strony.
  useTodayEventsPull(60000);

  // Id uwag widocznych w chwili zwiniecia. Nowa uwaga spoza tej listy rozwija okienko.
  const [zwiniete, setZwiniete] = useState<Set<string>>(czytajZwiniete);
  const rozwiniete = uwagi.some((e) => !zwiniete.has(e.id));

  useEffect(() => {
    try {
      localStorage.setItem(KLUCZ_ZWINIETE, JSON.stringify([...zwiniete]));
    } catch {
      // Brak localStorage - okienko po prostu wroci po odswiezeniu.
    }
  }, [zwiniete]);

  const studentById = useMemo(() => new Map(students.map((st) => [st.id, st])), [students]);
  const classById = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);

  if (uwagi.length === 0 || location.pathname.startsWith('/uwagi')) return null;

  if (!rozwiniete) {
    return (
      <button
        type="button"
        onClick={() => setZwiniete(new Set())}
        className="fixed bottom-4 left-60 z-40 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 shadow-md hover:bg-amber-100"
      >
        💬 do dziennika: {uwagi.length}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-60 z-40 w-80 rounded-lg border border-amber-300 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-3 py-2">
        <span className="text-sm font-semibold text-amber-900">Wpisz do dziennika ({uwagi.length})</span>
        <button
          type="button"
          onClick={() => setZwiniete(new Set(uwagi.map((e) => e.id)))}
          title="Zwiń - wróci, gdy dojdzie nowa uwaga"
          className="rounded px-1.5 text-amber-700 hover:bg-amber-100"
        >
          −
        </button>
      </div>
      <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
        {uwagi.slice(0, WIDOCZNYCH).map((e) => {
          const st = studentById.get(e.studentId);
          const lekcja = uwagaLekcja(e, periods);
          return (
            <li key={e.id} className="flex items-start gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={false}
                onChange={() => updateRecapEvent(e.id, { wpisane: true })}
                title="Wpisane do dziennika"
                aria-label="Wpisane do dziennika"
                className="mt-1 shrink-0 rounded border-gray-400"
              />
              <div className="min-w-0 flex-1 text-sm">
                <div className="font-medium text-gray-900">{st ? `${st.lastName} ${st.firstName}` : 'Uczeń usunięty'}</div>
                <div className="text-xs text-gray-500">
                  {classById.get(e.classId)?.name ?? ''} · {formatPl(new Date(e.at))}
                  {lekcja !== undefined ? `, ${lekcja}. lekcja` : ''}
                </div>
                <div className="text-gray-700">{uwagaLabel(e)}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-gray-100 px-3 py-1.5 text-right">
        <Link to="/uwagi" className="text-xs font-medium text-accent-700 hover:underline">
          {uwagi.length > WIDOCZNYCH ? `wszystkie (${uwagi.length})` : 'zakładka Uwagi'} →
        </Link>
      </div>
    </div>
  );
}
