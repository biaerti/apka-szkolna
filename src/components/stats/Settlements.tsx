// Widok "Do rozliczenia": stan na dzis. Liczy wszystkie plusy i plomby od
// ostatniego rozliczenia (bez ciecia na miesiace - rozliczenie jest wtedy, kiedy
// nauczyciel je zapisze). Kazde 3 plusy to piatka, 3 plomby to jedynka, reszta
// przechodzi dalej (src/lib/stats.ts: settlementRows). Lista "kto ile ma" jest
// do przeczytania klasie, gdy dzieci pytaja.

import { useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { settlementNote, settlementRows, type SettlementRow } from '../../lib/stats';

const name = (r: SettlementRow) => `${r.student.lastName} ${r.student.firstName}`;

function plusWord(n: number): string {
  if (n === 1) return 'plus';
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return 'plusy';
  return 'plusów';
}

function plombaWord(n: number): string {
  if (n === 1) return 'plomba';
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return 'plomby';
  return 'plomb';
}

/** Grupy "2 plusy: A, B" - od najwiekszej liczby, bez zer. */
function groupBy(rows: SettlementRow[], value: (r: SettlementRow) => number): [number, SettlementRow[]][] {
  const map = new Map<number, SettlementRow[]>();
  for (const r of rows) {
    const v = value(r);
    if (v > 0) map.set(v, [...(map.get(v) ?? []), r]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

function NameList({ rows }: { rows: SettlementRow[] }) {
  return <span>{rows.map((r) => `${r.student.number}. ${name(r)}`).join(', ')}</span>;
}

export function Settlements({ classId }: { classId: string }) {
  const students = useStore((s) => s.students);
  const recapEvents = useStore((s) => s.recapEvents);
  const settings = useStore((s) => s.settings);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmUndo, setConfirmUndo] = useState(false);

  const classStudents = useMemo(
    () => students.filter((st) => st.classId === classId).sort((a, b) => a.number - b.number),
    [students, classId],
  );

  const rows = useMemo(
    () => settlementRows(recapEvents, classStudents, settings),
    [recapEvents, classStudents, settings],
  );

  const fives = rows.filter((r) => r.piatki > 0);
  const ones = rows.filter((r) => r.jedynki > 0);
  const plusGroups = groupBy(rows, (r) => r.plusyReszta);
  const plombaGroups = groupBy(rows, (r) => r.plombyReszta);
  const nobodyPlus = rows.filter((r) => r.plusy === 0);

  // Ostatnie zapisane rozliczenie tej klasy - do cofniecia, gdyby klik byl pomylkowy.
  const lastSettlement = useMemo(() => {
    const own = recapEvents.filter(
      (e) => e.classId === classId && (e.result === 'piatka' || e.result === 'jedynka') && e.note?.startsWith('Rozliczenie'),
    );
    if (own.length === 0) return null;
    const latest = own.reduce((a, b) => (new Date(a.at) > new Date(b.at) ? a : b));
    return { note: latest.note as string, ids: own.filter((e) => e.note === latest.note).map((e) => e.id) };
  }, [recapEvents, classId]);

  function saveSettlement() {
    const note = settlementNote(new Date());
    for (const r of rows) {
      for (let i = 0; i < r.piatki; i++) addRecapEvent({ studentId: r.student.id, classId, result: 'piatka', note });
      for (let i = 0; i < r.jedynki; i++) addRecapEvent({ studentId: r.student.id, classId, result: 'jedynka', note });
    }
    setConfirmSave(false);
  }

  function undoSettlement() {
    lastSettlement?.ids.forEach((id) => removeRecapEvent(id));
    setConfirmUndo(false);
  }

  const toSave = fives.reduce((n, r) => n + r.piatki, 0) + ones.reduce((n, r) => n + r.jedynki, 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Liczą się wszystkie plusy od ostatniego rozliczenia, także te z bieżącego miesiąca. Każde{' '}
        {settings.plusesForFive} plusy to piątka, każde {settings.plombyForOne} plomby to jedynka, a reszta przechodzi
        dalej. Gdy wpiszesz oceny do dziennika, kliknij „Zapisz rozliczenie”.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-900">Piątka ({fives.length})</p>
          {fives.length === 0 ? (
            <p className="mt-1 text-sm text-green-800">Nikt nie ma teraz kompletu plusów.</p>
          ) : (
            <ul className="mt-2 space-y-0.5 text-sm text-green-900">
              {fives.map((r) => (
                <li key={r.student.id}>
                  {r.student.number}. {name(r)}
                  {r.piatki > 1 ? ` - ${r.piatki} piątki` : ''}
                  {r.plusyReszta > 0 ? ` (zostaje ${r.plusyReszta} ${plusWord(r.plusyReszta)})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
        {ones.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-900">Jedynka ({ones.length})</p>
            <ul className="mt-2 space-y-0.5 text-sm text-red-900">
              {ones.map((r) => (
                <li key={r.student.id}>
                  {r.student.number}. {name(r)}
                  {r.jedynki > 1 ? ` - ${r.jedynki} jedynki` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="font-semibold text-gray-900">
          Kto ile ma {fives.length > 0 || ones.length > 0 ? 'po rozliczeniu' : 'teraz'}
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-800">
          {plusGroups.map(([n, group]) => (
            <li key={`p${n}`}>
              <span className="font-semibold">
                {n} {plusWord(n)}:
              </span>{' '}
              <NameList rows={group} />
            </li>
          ))}
          {plombaGroups.map(([n, group]) => (
            <li key={`m${n}`} className="text-red-800">
              <span className="font-semibold">
                {n} {plombaWord(n)}:
              </span>{' '}
              <NameList rows={group} />
            </li>
          ))}
          {nobodyPlus.length > 0 && (
            <li className="text-gray-500">
              <span className="font-semibold">Bez plusów:</span> <NameList rows={nobodyPlus} />
            </li>
          )}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={() => setConfirmSave(true)} disabled={toSave === 0}>
          Zapisz rozliczenie
        </Button>
        {lastSettlement && (
          <Button variant="secondary" onClick={() => setConfirmUndo(true)}>
            Cofnij: {lastSettlement.note.toLowerCase()}
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmSave}
        title="Zapisać rozliczenie?"
        message={`Piątki (${fives.reduce((n, r) => n + r.piatki, 0)}) i jedynki (${ones.reduce((n, r) => n + r.jedynki, 0)}) zostaną zapisane jako wystawione - każda zabierze komplet plusów lub plomb, reszta zostaje uczniom na dalej.`}
        confirmLabel="Zapisz"
        onConfirm={saveSettlement}
        onCancel={() => setConfirmSave(false)}
      />
      <ConfirmDialog
        open={confirmUndo}
        title="Cofnąć rozliczenie?"
        message={`${lastSettlement?.note ?? ''}: piątki i jedynki z tego rozliczenia zostaną usunięte, a plusy i plomby wrócą uczniom.`}
        confirmLabel="Cofnij"
        onConfirm={undoSettlement}
        onCancel={() => setConfirmUndo(false)}
      />
    </div>
  );
}
