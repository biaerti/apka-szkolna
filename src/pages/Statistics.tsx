import { Fragment, useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { aggregateMonth, toCsv, type StudentStatsRow } from '../lib/stats';
import { monthKey } from '../lib/week';

type SortKey = keyof Pick<StudentStatsRow, 'number' | 'lastName' | 'plus' | 'minus' | 'pass' | 'hint' | 'bilans'>;

const RESULT_LABEL: Record<string, string> = {
  plus: 'Dobrze',
  minus: 'Źle',
  pass: 'Pas',
  hint_minus: 'Podpowiedź',
};

export function Statistics() {
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const recapEvents = useStore((s) => s.recapEvents);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const [classId, setClassId] = useState(sortedClasses[0]?.id ?? '');

  const classStudents = useMemo(
    () => students.filter((st) => st.classId === classId).sort((a, b) => a.number - b.number),
    [students, classId],
  );
  const classStudentIds = useMemo(() => new Set(classStudents.map((st) => st.id)), [classStudents]);

  const months = useMemo(() => {
    const set = new Set<string>();
    set.add(monthKey(new Date()));
    for (const e of recapEvents) {
      if (classStudentIds.has(e.studentId)) set.add(monthKey(new Date(e.at)));
    }
    return [...set].sort().reverse();
  }, [recapEvents, classStudentIds]);

  const [month, setMonth] = useState(months[0] ?? monthKey(new Date()));
  const activeMonth = months.includes(month) ? month : months[0];

  const [sortKey, setSortKey] = useState<SortKey>('number');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const base = aggregateMonth(recapEvents, classStudents, activeMonth ?? monthKey(new Date()));
    const sorted = [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv, 'pl') * sortDir;
      return ((av as number) - (bv as number)) * sortDir;
    });
    return sorted;
  }, [recapEvents, classStudents, activeMonth, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function handleExportCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statystyki-${activeMonth ?? 'brak'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function eventsForStudent(studentId: string) {
    return recapEvents
      .filter((e) => e.studentId === studentId && monthKey(new Date(e.at)) === activeMonth)
      .sort((a, b) => b.at.localeCompare(a.at));
  }

  if (sortedClasses.length === 0) {
    return (
      <div>
        <PageHeader title="Statystyki" />
        <EmptyState title="Brak klas" description="Dodaj klasę, aby zobaczyć statystyki." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Statystyki"
        description="Bilans uczniów per klasa i miesiąc na podstawie zdarzeń powtórki."
        actions={
          <Button variant="secondary" onClick={handleExportCsv} disabled={rows.length === 0}>
            Eksport CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="w-48">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Klasa</label>
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {sortedClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-40">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Miesiąc</label>
          <Select value={activeMonth} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {classStudents.length === 0 ? (
        <EmptyState title="Brak uczniów" description="Ta klasa nie ma jeszcze uczniów." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>
                <button onClick={() => toggleSort('number')} className="hover:underline">
                  Nr
                </button>
              </TH>
              <TH>
                <button onClick={() => toggleSort('lastName')} className="hover:underline">
                  Uczeń
                </button>
              </TH>
              <TH>
                <button onClick={() => toggleSort('plus')} className="hover:underline">
                  Dobrze
                </button>
              </TH>
              <TH>
                <button onClick={() => toggleSort('minus')} className="hover:underline">
                  Źle
                </button>
              </TH>
              <TH>
                <button onClick={() => toggleSort('pass')} className="hover:underline">
                  Pas
                </button>
              </TH>
              <TH>
                <button onClick={() => toggleSort('hint')} className="hover:underline">
                  Podpowiedzi
                </button>
              </TH>
              <TH>
                <button onClick={() => toggleSort('bilans')} className="hover:underline">
                  Bilans
                </button>
              </TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((row) => (
              <Fragment key={row.studentId}>
                <TR className="hover:bg-gray-50">
                  <TD>
                    <button
                      type="button"
                      className="block w-full text-left"
                      onClick={() => setExpandedId((id) => (id === row.studentId ? null : row.studentId))}
                    >
                      {row.number}
                    </button>
                  </TD>
                  <TD className="font-medium text-gray-900">
                    <button
                      type="button"
                      className="block w-full text-left"
                      onClick={() => setExpandedId((id) => (id === row.studentId ? null : row.studentId))}
                    >
                      {row.lastName} {row.firstName}
                    </button>
                  </TD>
                  <TD>{row.plus}</TD>
                  <TD>{row.minus}</TD>
                  <TD>{row.pass}</TD>
                  <TD>{row.hint}</TD>
                  <TD className="font-semibold">{row.bilans}</TD>
                </TR>
                {expandedId === row.studentId && (
                  <TR>
                    <td colSpan={7} className="bg-gray-50 px-4 py-2">
                      <div className="space-y-1 py-1">
                        {eventsForStudent(row.studentId).length === 0 ? (
                          <p className="text-xs text-gray-500">Brak zdarzeń w tym miesiącu.</p>
                        ) : (
                          eventsForStudent(row.studentId).map((e) => (
                            <div key={e.id} className="flex items-center justify-between text-xs text-gray-600">
                              <span>
                                {new Date(e.at).toLocaleString('pl-PL')} - {RESULT_LABEL[e.result] ?? e.result}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeRecapEvent(e.id)}
                                className="text-red-600 hover:underline"
                              >
                                usuń
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                  </TR>
                )}
              </Fragment>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
