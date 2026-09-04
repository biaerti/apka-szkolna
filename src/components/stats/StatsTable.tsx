// Tabela statystyk miesiecznych ucznia (sortowanie, rozwijanie zdarzen z mozliwoscia
// usuniecia). Wydzielona z Statistics.tsx, zeby utrzymac limit dlugosci komponentu.

import { Fragment, useState } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import type { RecapEvent } from '../../data/types';
import type { StudentStatsRow } from '../../lib/stats';

export type SortKey = keyof Pick<
  StudentStatsRow,
  'number' | 'lastName' | 'plus' | 'kropka' | 'plomba' | 'hint' | 'pass' | 'uwaga' | 'bilans'
>;

const RESULT_LABEL: Record<string, string> = {
  plus: 'Plus',
  kropka: 'Kropka',
  plomba: 'Plomba',
  pass: 'Pas',
  hint_plomba: 'Podpowiedź (plomba)',
  uwaga: 'Uwaga',
  rozliczenie: 'Rozliczenie zadań',
  jedynka: 'Jedynka',
  piatka: 'Piątka',
};

export function StatsTable({
  rows,
  sortKey,
  sortDir,
  onToggleSort,
  eventsForStudent,
  onRemoveEvent,
}: {
  rows: StudentStatsRow[];
  sortKey: SortKey;
  sortDir: 1 | -1;
  onToggleSort: (key: SortKey) => void;
  eventsForStudent: (studentId: string) => RecapEvent[];
  onRemoveEvent: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (rows.length === 0) {
    return <EmptyState title="Brak uczniów" description="Ta klasa nie ma jeszcze uczniów." />;
  }

  // Aktywna kolumna sortowania dostaje strzalke kierunku - inaczej nauczyciel
  // nie widzi, po czym tabela jest posortowana.
  function headerButton(key: SortKey, label: string) {
    const active = sortKey === key;
    return (
      <button
        onClick={() => onToggleSort(key)}
        className={active ? 'font-semibold text-gray-900 hover:underline' : 'hover:underline'}
      >
        {label}
        {active && <span aria-hidden="true"> {sortDir === 1 ? '↑' : '↓'}</span>}
      </button>
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>{headerButton('number', 'Nr')}</TH>
          <TH>{headerButton('lastName', 'Uczeń')}</TH>
          <TH>{headerButton('plus', 'Plusy')}</TH>
          <TH>{headerButton('kropka', 'Kropki')}</TH>
          <TH>{headerButton('plomba', 'Plomby')}</TH>
          <TH>{headerButton('hint', 'Podpowiedzi')}</TH>
          <TH>{headerButton('pass', 'Pasy')}</TH>
          <TH>{headerButton('uwaga', 'Uwagi')}</TH>
          <TH>{headerButton('bilans', 'Bilans')}</TH>
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
              <TD>{row.kropka}</TD>
              <TD>{row.plomba}</TD>
              <TD>{row.hint}</TD>
              <TD>{row.pass}</TD>
              <TD>{row.uwaga}</TD>
              <TD className="font-semibold">{row.bilans}</TD>
            </TR>
            {expandedId === row.studentId && (
              <TR>
                <td colSpan={9} className="bg-gray-50 px-4 py-2">
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
                            onClick={() => onRemoveEvent(e.id)}
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
  );
}
