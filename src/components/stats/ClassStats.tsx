// Bilans klasy (/klasy/:id, zakladka "Bilans"): suma plusow, kropek, plomb i uwag
// od poczatku, bez podzialu na miesiace. Kto ma komplet plusow, ma podswietlony
// przycisk "Rozlicz" - zapisuje piatke i zabiera 3 plusy (src/lib/stats.ts).
// Lista zdarzen ucznia (klik w nazwisko) ma daty i filtr po miesiacach.

import { useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { classBalance, findLatestEventId, toCsv, type EditableResult } from '../../lib/stats';
import { monthKey } from '../../lib/week';
import { StatsTable, type SortKey } from './StatsTable';
import type { RecapEvent, Student } from '../../data/types';

/** Etykieta miesiaca po polsku, np. "wrzesień 2026" z klucza "2026-09". */
function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
}

export function ClassStats({ classId, students }: { classId: string; students: Student[] }) {
  const recapEvents = useStore((s) => s.recapEvents);
  const settings = useStore((s) => s.settings);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);

  const studentIds = useMemo(() => new Set(students.map((st) => st.id)), [students]);

  // Miesiace, w ktorych cos zapisano - tylko do filtra listy zdarzen ucznia.
  const months = useMemo(() => {
    const set = new Set<string>();
    for (const e of recapEvents) if (studentIds.has(e.studentId)) set.add(monthKey(new Date(e.at)));
    return [...set].sort().reverse();
  }, [recapEvents, studentIds]);
  const [eventMonth, setEventMonth] = useState<string>('');

  const [sortKey, setSortKey] = useState<SortKey>('number');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  // Ostatnie "Rozlicz" w tej sesji - do szybkiego cofniecia pomylki.
  const [lastSettled, setLastSettled] = useState<{ eventId: string; studentId: string } | null>(null);

  const rows = useMemo(() => {
    const base = classBalance(recapEvents, students, settings);
    return [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv, 'pl') * sortDir;
      return ((av as number) - (bv as number)) * sortDir;
    });
  }, [recapEvents, students, settings, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      // Liczby od najwiekszej - "kto ma najwiecej plusow" to najczestsze pytanie.
      setSortDir(key === 'number' || key === 'lastName' ? 1 : -1);
    }
  }

  function handleExportCsv() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilans-${monthKey(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const eventsForStudent = (studentId: string) =>
    recapEvents
      .filter((e) => e.studentId === studentId && (!eventMonth || monthKey(new Date(e.at)) === eventMonth))
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  /** "+" dodaje zdarzenie (reczna korekta), "-" kasuje najnowsze tego typu (pasy: z tego miesiaca). */
  function handleAdjust(studentId: string, result: EditableResult, delta: 1 | -1) {
    if (delta === 1) {
      addRecapEvent({ studentId, classId, result });
      return;
    }
    const types: RecapEvent['result'][] = result === 'plomba' ? ['plomba', 'hint_plomba'] : [result];
    const id = findLatestEventId(recapEvents, studentId, types, result === 'pass' ? monthKey(new Date()) : undefined);
    if (id) removeRecapEvent(id);
  }

  function handleSettle(studentId: string, result: 'piatka' | 'jedynka') {
    const event = addRecapEvent({ studentId, classId, result });
    setLastSettled({ eventId: event.id, studentId });
  }

  function handleUndoSettle() {
    if (!lastSettled) return;
    removeRecapEvent(lastSettled.eventId);
    setLastSettled(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-3xl text-sm text-gray-500">
          Plusy i plomby sumują się od początku roku. Kto ma {settings.plusesForFive} plusy, ma przycisk „Rozlicz” -
          kliknięcie zabiera {settings.plusesForFive} plusy, a Ty wpisujesz piątkę do dziennika. Kliknij nazwisko, żeby
          zobaczyć listę z datami.
        </p>
        <Button variant="secondary" onClick={handleExportCsv}>
          Eksport CSV
        </Button>
      </div>

      <StatsTable
        rows={rows}
        sortKey={sortKey}
        sortDir={sortDir}
        onToggleSort={toggleSort}
        eventsForStudent={eventsForStudent}
        onRemoveEvent={removeRecapEvent}
        onAdjust={handleAdjust}
        onSettle={handleSettle}
        undoSettleFor={lastSettled?.studentId ?? null}
        onUndoSettle={handleUndoSettle}
        eventFilter={
          <label className="flex items-center gap-2 text-xs text-gray-500">
            Pokaż:
            <Select className="h-7 w-44 py-0 text-xs" value={eventMonth} onChange={(e) => setEventMonth(e.target.value)}>
              <option value="">wszystkie miesiące</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </Select>
          </label>
        }
      />
    </div>
  );
}
