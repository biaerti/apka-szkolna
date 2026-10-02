// Widok "Do rozliczenia": rozliczenie wybranego miesiaca. Kazde pelne 3 plusy
// (settings.plusesForFive) to piatka, kazde pelne 3 plomby to jedynka, a reszta
// przechodzi na nastepny miesiac (src/lib/stats.ts: settlementRows). Nic nie
// zapisuje - nauczyciel czyta liste klasie i wpisuje oceny w dzienniku.

import { useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import { Select } from '../ui/Select';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import { nextMonthKey, settlementRows } from '../../lib/stats';
import { monthKey } from '../../lib/week';

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
}

/** "wrzesień 2026" -> "wrzesień" itp., do naglowkow kolumn. */
function shortMonth(key: string): string {
  return monthLabel(key).split(' ')[0];
}

export function Settlements({ classId }: { classId: string }) {
  const students = useStore((s) => s.students);
  const recapEvents = useStore((s) => s.recapEvents);
  const settings = useStore((s) => s.settings);

  const classStudents = useMemo(
    () => students.filter((st) => st.classId === classId).sort((a, b) => a.number - b.number),
    [students, classId],
  );
  const studentIds = useMemo(() => new Set(classStudents.map((s) => s.id)), [classStudents]);

  const current = monthKey(new Date());
  const months = useMemo(() => {
    const set = new Set<string>([current]);
    for (const e of recapEvents) if (studentIds.has(e.studentId)) set.add(monthKey(new Date(e.at)));
    return [...set].sort().reverse();
  }, [recapEvents, studentIds, current]);

  // Domyslnie ostatni ZAKONCZONY miesiac - rozliczamy po jego koncu.
  const [month, setMonth] = useState(() => months.find((m) => m < current) ?? current);
  const activeMonth = months.includes(month) ? month : months[0];

  const rows = useMemo(
    () => settlementRows(recapEvents, classStudents, settings, activeMonth),
    [recapEvents, classStudents, settings, activeMonth],
  );

  const fives = rows.filter((r) => r.piatki > 0);
  const ones = rows.filter((r) => r.jedynki > 0);
  const anyPlomby = rows.some((r) => r.plombyIn + r.plombyMonth > 0);
  const name = (r: (typeof rows)[number]) => `${r.student.lastName} ${r.student.firstName}`;
  const now = shortMonth(activeMonth);
  const next = shortMonth(nextMonthKey(activeMonth));

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Rozliczany miesiąc</label>
        <Select className="w-56" value={activeMonth} onChange={(e) => setMonth(e.target.value)}>
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </Select>
      </div>

      <p className="text-sm text-gray-500">
        Każde {settings.plusesForFive} plusy to piątka, każde {settings.plombyForOne} plomby to jedynka. Reszta
        przechodzi na {next}.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-900">Piątki za {now} ({fives.length})</p>
          {fives.length === 0 ? (
            <p className="mt-1 text-sm text-green-800">Nikt nie uzbierał kompletu.</p>
          ) : (
            <ul className="mt-2 space-y-0.5 text-sm text-green-900">
              {fives.map((r) => (
                <li key={r.student.id}>
                  {r.student.number}. {name(r)}
                  {r.piatki > 1 ? ` - ${r.piatki} piątki` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
        {(ones.length > 0 || anyPlomby) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-900">Jedynki za {now} ({ones.length})</p>
            {ones.length === 0 ? (
              <p className="mt-1 text-sm text-red-800">Nikt nie ma kompletu plomb.</p>
            ) : (
              <ul className="mt-2 space-y-0.5 text-sm text-red-900">
                {ones.map((r) => (
                  <li key={r.student.id}>
                    {r.student.number}. {name(r)}
                    {r.jedynki > 1 ? ` - ${r.jedynki} jedynki` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Nr</TH>
            <TH>Uczeń</TH>
            <TH className="text-center">Plusy z poprz.</TH>
            <TH className="text-center">Plusy ({now})</TH>
            <TH className="text-center">Piątki</TH>
            <TH className="text-center">Plusy na {next}</TH>
            {anyPlomby && <TH className="text-center">Plomby</TH>}
            {anyPlomby && <TH className="text-center">Plomby na {next}</TH>}
          </TR>
        </THead>
        <TBody>
          {rows.map((r) => (
            <TR key={r.student.id} className={r.piatki > 0 ? 'bg-green-50/60' : undefined}>
              <TD>{r.student.number}</TD>
              <TD className="font-medium">{name(r)}</TD>
              <TD className="text-center text-gray-500">{r.plusyIn || '-'}</TD>
              <TD className="text-center">{r.plusyMonth || '-'}</TD>
              <TD className="text-center font-semibold text-green-700">{r.piatki || ''}</TD>
              <TD className="text-center font-semibold">{r.plusyOut || '-'}</TD>
              {anyPlomby && (
                <TD className="text-center">{r.plombyIn + r.plombyMonth || '-'}</TD>
              )}
              {anyPlomby && <TD className="text-center font-semibold text-red-700">{r.plombyOut || '-'}</TD>}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
