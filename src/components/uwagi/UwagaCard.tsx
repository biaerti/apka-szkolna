// Jedna uwaga w kalendarzu tygodnia: kto, z jakiej klasy, o ktorej i za co, plus
// odhaczenie "wpisane do dziennika".
//
// Tresc uwagi edytuje sie w miejscu (klik w tekst -> pole), bo nauczyciel czesto
// dopisuje szczegoly dopiero po lekcji ("rozmawial przez cala kartkowke"), a
// otwieranie modala po to, zeby dopisac pol zdania, byloby droga przez meke.

import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapEvent, SchoolClass, Student } from '../../data/types';
import { uwagaLabel, uwagaLekcja, uwagaTime } from '../../lib/uwagi';
import { useVulcanUwaga, VULCAN_STATE_LABEL } from './useVulcanUwaga';

export interface UwagaCardProps {
  event: RecapEvent;
  student?: Student;
  schoolClass?: SchoolClass;
  onNote: (note: string) => void;
  onWpisane: (wpisane: boolean) => void;
  onRemove: () => void;
}

export function UwagaCard({ event, student, schoolClass, onNote, onWpisane, onRemove }: UwagaCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(event.note ?? '');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const periods = useStore((s) => s.periods);
  const lekcja = uwagaLekcja(event, periods);
  // "VULCAN": dodatek Chrome otwiera formularz uwagi z ta trescia i zatrzymuje
  // sie przed zapisem; po zapisie karta sama sie odhacza (useVulcanUwagaSaved).
  const vulcan = useVulcanUwaga();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    setEditing(false);
    if (draft.trim() !== (event.note ?? '').trim()) onNote(draft.trim());
  }

  const done = !!event.wpisane;

  return (
    <div
      className={`rounded-md border px-2 py-1.5 text-sm ${
        done ? 'border-gray-200 bg-gray-50 text-gray-400' : 'border-amber-200 bg-amber-50 text-gray-800'
      }`}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onWpisane(e.target.checked)}
          title="Wpisane do dziennika"
          aria-label="Wpisane do dziennika"
          className="mt-0.5 shrink-0 rounded border-gray-400"
        />
        <div className="min-w-0 flex-1">
          {/* Nazwisko w calosci, w osobnym wierszu - to ono idzie do dziennika,
              wiec nie moze sie urwac na "Kolesnikowi...". Klasa i godzina pod nim,
              drobnym drukiem: sluza tylko do odtworzenia, ktora to byla lekcja. */}
          <div className={`break-words font-medium leading-tight ${done ? '' : 'text-gray-900'}`}>
            {student ? `${student.lastName} ${student.firstName}` : 'Uczeń usunięty'}
          </div>
          <div className="text-xs text-gray-500">
            {schoolClass?.name ?? ''}
            {lekcja !== undefined && <span className="text-gray-600"> · {lekcja}. lekcja</span>}{' '}
            <span className="tabular-nums text-gray-400">{uwagaTime(event)}</span>
          </div>

          {editing ? (
            <textarea
              ref={inputRef}
              value={draft}
              rows={2}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  commit();
                } else if (e.key === 'Escape') {
                  setDraft(event.note ?? '');
                  setEditing(false);
                }
              }}
              placeholder="Za co ta uwaga?"
              className="mt-1 w-full resize-none rounded border border-gray-300 px-1.5 py-1 text-sm text-gray-800"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(event.note ?? '');
                setEditing(true);
              }}
              title="Kliknij, żeby zmienić treść uwagi"
              className="mt-0.5 block w-full text-left text-sm text-gray-600 hover:text-gray-900"
            >
              {uwagaLabel(event)}
            </button>
          )}
          {!done && (
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => void vulcan.send(event)}
                disabled={vulcan.state === 'sending' || vulcan.state === 'sent'}
                title="Otwórz formularz tej uwagi w VULCANIE (pomocnik Chrome)"
                className="rounded border border-accent-300 bg-white px-2 py-0.5 text-xs font-medium text-accent-700 hover:bg-accent-50 disabled:opacity-60"
              >
                Do VULCANA
              </button>
              {vulcan.state !== 'idle' && (
                <span className={`ml-2 text-xs ${vulcan.state === 'sent' ? 'text-emerald-700' : vulcan.state === 'sending' ? 'text-gray-500' : 'text-red-600'}`}>
                  {VULCAN_STATE_LABEL[vulcan.state]}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Usuń uwagę"
          title="Usuń uwagę"
          className="shrink-0 rounded px-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
