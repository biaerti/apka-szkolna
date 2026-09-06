// Tabela statystyk miesiecznych ucznia (sortowanie, rozwijanie zdarzen z mozliwoscia
// usuniecia). Wydzielona z Statistics.tsx, zeby utrzymac limit dlugosci komponentu.

import { Fragment, useState } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Menu } from '../ui/Menu';
import { MoreIcon } from '../ui/icons';
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
  monthLabel,
  onResetStudent,
}: {
  rows: StudentStatsRow[];
  sortKey: SortKey;
  sortDir: 1 | -1;
  onToggleSort: (key: SortKey) => void;
  eventsForStudent: (studentId: string) => RecapEvent[];
  onRemoveEvent: (id: string) => void;
  /** Etykieta biezacego miesiaca (np. "wrzesień 2026") do tresci potwierdzenia resetu. */
  monthLabel: string;
  /** "Wyzeruj bilans ucznia" - kasuje zdarzenia tego ucznia z biezacego miesiaca. */
  onResetStudent: (studentId: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingReset, setPendingReset] = useState<StudentStatsRow | null>(null);

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
    <>
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
          <TH className="w-10">
            <span className="sr-only">Akcje</span>
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
              <TD>{row.kropka}</TD>
              <TD>{row.plomba}</TD>
              <TD>{row.hint}</TD>
              <TD>{row.pass}</TD>
              <TD>{row.uwaga}</TD>
              <TD className="font-semibold">{row.bilans}</TD>
              <TD className="text-right">
                <Menu
                  items={[
                    {
                      label: 'Wyzeruj bilans ucznia',
                      danger: true,
                      onSelect: () => setPendingReset(row),
                    },
                  ]}
                  renderTrigger={(props) => (
                    <button
                      type="button"
                      {...props}
                      aria-label={`Więcej akcji: ${row.firstName} ${row.lastName}`}
                      title="Więcej"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    >
                      <MoreIcon />
                    </button>
                  )}
                />
              </TD>
            </TR>
            {expandedId === row.studentId && (
              <TR>
                <td colSpan={10} className="bg-gray-50 px-4 py-2">
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

    <ConfirmDialog
      open={!!pendingReset}
      title="Wyzeruj bilans ucznia"
      message={
        pendingReset
          ? `Usunięte zostaną wszystkie plusy, kropki, plomby, pasy i uwagi ${pendingReset.firstName} ${pendingReset.lastName} zapisane w ${monthLabel}. Tej operacji nie da się cofnąć.`
          : ''
      }
      confirmLabel="Wyzeruj"
      onCancel={() => setPendingReset(null)}
      onConfirm={() => {
        if (pendingReset) onResetStudent(pendingReset.studentId);
        setPendingReset(null);
      }}
    />
    </>
  );
}
