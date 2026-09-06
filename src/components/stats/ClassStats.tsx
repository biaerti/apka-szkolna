// Bilans miesiaca dla jednej klasy: wybor miesiaca, tabela uczniow i eksport CSV.
// Siedzi w widoku klasy (/klasy/:id), bo nauczyciel chcial miec statystyki tam,
// gdzie uczniowie - osobnej zakladki "Statystyki" juz nie ma.

import { useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { aggregateMonth, toCsv } from '../../lib/stats';
import { monthKey } from '../../lib/week';
import { StatsTable, type SortKey } from './StatsTable';
import type { Student } from '../../data/types';

/** Etykieta miesiaca po polsku, np. "wrzesień 2026" z klucza "2026-09". */
function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  const name = new Date(year, month - 1, 1).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
  return name;
}

export function ClassStats({ classId, students }: { classId: string; students: Student[] }) {
  const recapEvents = useStore((s) => s.recapEvents);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);
  const resetBalance = useStore((s) => s.resetBalance);

  const studentIds = useMemo(() => new Set(students.map((st) => st.id)), [students]);

  // Miesiace, dla ktorych cokolwiek zapisano, plus zawsze biezacy.
  const months = useMemo(() => {
    const set = new Set<string>();
    set.add(monthKey(new Date()));
    for (const e of recapEvents) {
      if (studentIds.has(e.studentId)) set.add(monthKey(new Date(e.at)));
    }
    return [...set].sort().reverse();
  }, [recapEvents, studentIds]);

  const [month, setMonth] = useState(months[0] ?? monthKey(new Date()));
  const activeMonth = months.includes(month) ? month : months[0] ?? monthKey(new Date());

  const [sortKey, setSortKey] = useState<SortKey>('number');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [resetClassOpen, setResetClassOpen] = useState(false);

  const eventsToResetCount = useMemo(
    () => recapEvents.filter((e) => e.classId === classId && monthKey(new Date(e.at)) === activeMonth).length,
    [recapEvents, classId, activeMonth],
  );

  const rows = useMemo(() => {
    const base = aggregateMonth(recapEvents, students, activeMonth);
    return [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv, 'pl') * sortDir;
      return ((av as number) - (bv as number)) * sortDir;
    });
  }, [recapEvents, students, activeMonth, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function handleExportCsv() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilans-${activeMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const eventsForStudent = (studentId: string) =>
    recapEvents
      .filter((e) => e.studentId === studentId && monthKey(new Date(e.at)) === activeMonth)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Miesiąc</label>
          <Select className="w-56" value={activeMonth} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportCsv}>
            Eksport CSV
          </Button>
          <Button variant="danger" onClick={() => setResetClassOpen(true)} disabled={eventsToResetCount === 0}>
            Wyzeruj bilans
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Pasy, uwagi i bilans liczą się pełnymi miesiącami i zerują 1. dnia miesiąca. Kliknij wiersz, żeby
        zobaczyć pojedyncze zdarzenia.
      </p>

      <StatsTable
        rows={rows}
        sortKey={sortKey}
        sortDir={sortDir}
        onToggleSort={toggleSort}
        eventsForStudent={eventsForStudent}
        onRemoveEvent={removeRecapEvent}
        monthLabel={monthLabel(activeMonth)}
        onResetStudent={(studentId) => resetBalance(classId, activeMonth, studentId)}
      />

      <ConfirmDialog
        open={resetClassOpen}
        title="Wyzeruj bilans klasy"
        message={`Usunięte zostaną wszystkie plusy, kropki, plomby, pasy i uwagi całej klasy zapisane w ${monthLabel(activeMonth)} (${eventsToResetCount} ${eventsToResetCount === 1 ? 'zdarzenie' : 'zdarzeń'}). Poprzednie miesiące zostają bez zmian. Tej operacji nie da się cofnąć.`}
        confirmLabel="Wyzeruj"
        onCancel={() => setResetClassOpen(false)}
        onConfirm={() => {
          resetBalance(classId, activeMonth);
          setResetClassOpen(false);
        }}
      />
    </div>
  );
}
