// UWAGI - kalendarz tygodnia z uwagami do przepisania do dziennika.
//
// Po co osobna zakladka (menu ma byc krotkie): uwaga wpisana w trakcie lekcji
// jest przypominajka, a nie kara w grze - po ostatniej lekcji nauczyciel siada
// i przepisuje ja do dziennika. Zeby to zrobic, musi widziec CALY tydzien naraz,
// z klasa, godzina i trescia. Ani lekcje, ani widok klasy tego nie pokazuja:
// tam uwagi sa rozsypane po uczniach, a nie ulozone po dniach.
//
// Kolumna = dzien. Zolta karta = do wpisania, szara = juz wpisana. Sobota i
// niedziela pojawiaja sie tylko wtedy, gdy naprawde cos w nich jest (wyjazd,
// zastepstwo) - normalny tydzien to piec kolumn.

import { useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { UwagaCard } from '../components/uwagi/UwagaCard';
import { addDays, formatPl, isToday, toDateKey, weekDays } from '../lib/dates';
import { doWpisania, uwagiByDay } from '../lib/uwagi';

export function Uwagi() {
  const recapEvents = useStore((s) => s.recapEvents);
  const students = useStore((s) => s.students);
  const classes = useStore((s) => s.classes);
  const updateRecapEvent = useStore((s) => s.updateRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);

  // Kotwica tygodnia - przesuwana strzalkami. Trzymamy dowolny dzien tygodnia,
  // a weekDays sam znajduje poniedzialek.
  const [anchor, setAnchor] = useState(() => new Date());

  const days = useMemo(() => weekDays(anchor), [anchor]);
  const byDay = useMemo(() => uwagiByDay(recapEvents, days), [recapEvents, days]);

  const studentById = useMemo(() => new Map(students.map((st) => [st.id, st])), [students]);
  const classById = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);

  // Weekend tylko wtedy, gdy cos w nim jest - pusta sobota i niedziela zabieraja
  // polowe szerokosci ekranu i nic nie mowia.
  const shown = days.filter((d, i) => i < 5 || (byDay.get(toDateKey(d))?.length ?? 0) > 0);

  const weekEvents = shown.flatMap((d) => byDay.get(toDateKey(d)) ?? []);
  const zostalo = doWpisania(weekEvents);

  const monday = days[0];
  const sunday = days[6];
  const zakres = `${monday.getDate()} ${monthName(monday)} - ${sunday.getDate()} ${monthName(sunday)} ${sunday.getFullYear()}`;

  return (
    <div>
      <PageHeader
        title="Uwagi"
        description="Uwagi z lekcji do przepisania do dziennika. Odhacz to, co już wpisane."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setAnchor((d) => addDays(d, -7))}>
              ← poprzedni
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setAnchor(new Date())}>
              ten tydzień
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setAnchor((d) => addDays(d, 7))}>
              następny →
            </Button>
          </div>
        }
      />

      <div className="mb-3 flex items-baseline gap-3">
        <span className="text-sm font-medium text-gray-700">{zakres}</span>
        <span className={`text-sm ${zostalo > 0 ? 'font-semibold text-amber-700' : 'text-gray-500'}`}>
          {zostalo > 0 ? `do wpisania do dziennika: ${zostalo}` : 'wszystko wpisane'}
        </span>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}>
        {shown.map((day) => {
          const key = toDateKey(day);
          const uwagi = byDay.get(key) ?? [];
          return (
            <div key={key} className="flex min-w-0 flex-col gap-2">
              <div
                className={`rounded-md px-2 py-1 text-sm font-medium ${
                  isToday(day) ? 'bg-accent-50 text-accent-700' : 'text-gray-600'
                }`}
              >
                {formatPl(day)}
              </div>
              {uwagi.length === 0 ? (
                <p className="px-2 text-xs text-gray-400">-</p>
              ) : (
                uwagi.map((event) => (
                  <UwagaCard
                    key={event.id}
                    event={event}
                    student={studentById.get(event.studentId)}
                    schoolClass={classById.get(event.classId)}
                    onNote={(note) => updateRecapEvent(event.id, { note: note || undefined })}
                    onWpisane={(wpisane) => updateRecapEvent(event.id, { wpisane: wpisane || undefined })}
                    onRemove={() => removeRecapEvent(event.id)}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Skrocona nazwa miesiaca po polsku ("wrz") - do zakresu dat w naglowku. */
function monthName(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', { month: 'short' }).format(date);
}
