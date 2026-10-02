// Tabela bilansu klasy: sumy od poczatku, przyciski +/- (reczna korekta),
// "Rozlicz" przy komplecie plusow/plomb i rozwijana lista zdarzen z datami.

import { Fragment, useState, type ReactNode } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import type { RecapEvent } from '../../data/types';
import type { EditableResult, StudentStatsRow } from '../../lib/stats';

export type SortKey = keyof Pick<StudentStatsRow, 'number' | 'lastName' | 'plus' | 'kropka' | 'plomba' | 'pass' | 'uwaga'>;

const RESULT_LABEL: Record<string, string> = {
  plus: 'Plus',
  kropka: 'Kropka',
  plomba: 'Plomba',
  pass: 'Pas',
  hint_plomba: 'Plomba (podpowiadanie)',
  uwaga: 'Uwaga',
  ostrzezenie: 'Ostrzeżenie',
  // 'rozliczenie' juz nie jest tworzone przez UI (stary system zadan naprawczych),
  // ale historyczne zdarzenia tego typu wciaz siedza w Supabase i musza sie wyswietlic.
  rozliczenie: 'Rozliczenie zadań',
  jedynka: 'Jedynka (rozliczone plomby)',
  piatka: 'Piątka (rozliczone plusy)',
};

const RESULT_CLASS: Record<string, string> = {
  plus: 'text-green-700',
  piatka: 'font-semibold text-green-800',
  plomba: 'text-red-700',
  hint_plomba: 'text-red-700',
  jedynka: 'font-semibold text-red-800',
};

/** Mala para przyciskow +/- przy liczbie. */
function EditCell({ value, onAdd, onRemove, strong }: { value: number; onAdd: () => void; onRemove: () => void; strong?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={onRemove}
        disabled={value <= 0}
        aria-label="Odejmij"
        className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 text-xs leading-none text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>
      <span className={`w-6 text-center tabular-nums ${strong ? 'text-base font-bold' : ''}`}>{value}</span>
      <button
        type="button"
        onClick={onAdd}
        aria-label="Dodaj"
        className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 text-xs leading-none text-gray-600 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}

export function StatsTable({
  rows,
  sortKey,
  sortDir,
  onToggleSort,
  eventsForStudent,
  onRemoveEvent,
  onAdjust,
  onSettle,
  undoSettleFor,
  onUndoSettle,
  eventFilter,
}: {
  rows: StudentStatsRow[];
  sortKey: SortKey;
  sortDir: 1 | -1;
  onToggleSort: (key: SortKey) => void;
  eventsForStudent: (studentId: string) => RecapEvent[];
  onRemoveEvent: (id: string) => void;
  onAdjust: (studentId: string, result: EditableResult, delta: 1 | -1) => void;
  onSettle: (studentId: string, result: 'piatka' | 'jedynka') => void;
  /** Uczen, przy ktorym pokazac "cofnij" po ostatnim rozliczeniu. */
  undoSettleFor: string | null;
  onUndoSettle: () => void;
  /** Filtr miesiaca nad lista zdarzen ucznia. */
  eventFilter: ReactNode;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (rows.length === 0) {
    return <EmptyState title="Brak uczniów" description="Ta klasa nie ma jeszcze uczniów." />;
  }

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

  const toggle = (id: string) => setExpandedId((cur) => (cur === id ? null : id));

  return (
    <Table>
      <THead>
        <TR>
          <TH>{headerButton('number', 'Nr')}</TH>
          <TH>{headerButton('lastName', 'Uczeń')}</TH>
          <TH className="text-center">{headerButton('plus', 'Plusy')}</TH>
          <TH className="text-center">Rozlicz</TH>
          <TH className="text-center">{headerButton('kropka', 'Kropki')}</TH>
          <TH className="text-center">{headerButton('plomba', 'Plomby')}</TH>
          <TH className="text-center">{headerButton('pass', 'Pasy (ten mies.)')}</TH>
          <TH className="text-center">{headerButton('uwaga', 'Uwagi')}</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((row) => {
          const events = expandedId === row.studentId ? eventsForStudent(row.studentId) : [];
          return (
            <Fragment key={row.studentId}>
              <TR className={row.doPiatki > 0 ? 'bg-green-50 hover:bg-green-100/60' : 'hover:bg-gray-50'}>
                <TD>
                  <button type="button" className="block w-full text-left" onClick={() => toggle(row.studentId)}>
                    {row.number}
                  </button>
                </TD>
                <TD className="font-medium text-gray-900">
                  <button type="button" className="block w-full text-left" onClick={() => toggle(row.studentId)}>
                    {row.lastName} {row.firstName}
                  </button>
                </TD>
                <TD>
                  <EditCell
                    strong
                    value={row.plus}
                    onAdd={() => onAdjust(row.studentId, 'plus', 1)}
                    onRemove={() => onAdjust(row.studentId, 'plus', -1)}
                  />
                </TD>
                <TD className="text-center">
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {row.doPiatki > 0 && (
                      <button
                        type="button"
                        onClick={() => onSettle(row.studentId, 'piatka')}
                        className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-700"
                      >
                        Rozlicz piątkę
                      </button>
                    )}
                    {row.doJedynki > 0 && (
                      <button
                        type="button"
                        onClick={() => onSettle(row.studentId, 'jedynka')}
                        className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
                      >
                        Rozlicz jedynkę
                      </button>
                    )}
                    {undoSettleFor === row.studentId && (
                      <button type="button" onClick={onUndoSettle} className="text-xs text-gray-500 underline hover:text-gray-800">
                        cofnij
                      </button>
                    )}
                  </div>
                </TD>
                {(['kropka', 'plomba', 'pass', 'uwaga'] as const).map((key) => (
                  <TD key={key}>
                    <EditCell
                      value={row[key]}
                      onAdd={() => onAdjust(row.studentId, key, 1)}
                      onRemove={() => onAdjust(row.studentId, key, -1)}
                    />
                  </TD>
                ))}
              </TR>
              {expandedId === row.studentId && (
                <TR>
                  <td colSpan={8} className="bg-gray-50 px-4 py-2">
                    <div className="mb-2">{eventFilter}</div>
                    <div className="space-y-1 pb-1">
                      {events.length === 0 ? (
                        <p className="text-xs text-gray-500">Brak zdarzeń.</p>
                      ) : (
                        events.map((e) => (
                          <div key={e.id} className="flex items-center justify-between gap-3 text-xs text-gray-600">
                            <span>
                              {new Date(e.at).toLocaleDateString('pl-PL')}{' '}
                              <span className="text-gray-400">
                                {new Date(e.at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                              </span>{' '}
                              - <span className={RESULT_CLASS[e.result] ?? ''}>{RESULT_LABEL[e.result] ?? e.result}</span>
                              {e.note ? <span className="text-gray-400"> ({e.note})</span> : null}
                            </span>
                            <button type="button" onClick={() => onRemoveEvent(e.id)} className="text-red-600 hover:underline">
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
          );
        })}
      </TBody>
    </Table>
  );
}
