// Edytowalna lista godzin lekcyjnych (dzwonki): numer, od, do, usun.
// Kazda zmiana idzie od razu do store (setPeriods calej listy) - bez osobnego
// "Zapisz", bo to trzy pola na wiersz. Niepoprawny czas ma czerwona ramke i
// jest pomijany przy liczeniu "co teraz" (patrz validPeriods).

import { useState } from 'react';
import clsx from 'clsx';
import type { LessonPeriod } from '../../data/types';
import { DEFAULT_PERIODS } from '../../data/timetableSeed';
import { formatHm, parseHm } from '../../lib/timetable';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmDialog } from '../ui/ConfirmDialog';

const LESSON_MIN = 45;
const BREAK_MIN = 5;

export interface PeriodsEditorProps {
  periods: LessonPeriod[];
  onChange: (list: LessonPeriod[]) => void;
}

/** Nowa godzina doklejana na koncu: 5 min po ostatniej, 45 min dlugosci. */
function nextPeriod(list: LessonPeriod[]): LessonPeriod {
  const last = [...list].sort((a, b) => a.no - b.no).pop();
  const no = last ? last.no + 1 : 1;
  const lastEnd = last ? parseHm(last.end) : NaN;
  const start = Number.isNaN(lastEnd) ? 8 * 60 : lastEnd + BREAK_MIN;
  return { no, start: formatHm(start), end: formatHm(start + LESSON_MIN) };
}

export function PeriodsEditor({ periods, onChange }: PeriodsEditorProps) {
  const [resetOpen, setResetOpen] = useState(false);
  const sorted = [...periods].sort((a, b) => a.no - b.no);

  function update(no: number, patch: Partial<LessonPeriod>) {
    onChange(periods.map((p) => (p.no === no ? { ...p, ...patch } : p)));
  }

  function changeNo(no: number, nextNo: number) {
    if (Number.isNaN(nextNo) || nextNo < 0 || periods.some((p) => p.no === nextNo)) return;
    update(no, { no: nextNo });
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Godziny lekcyjne</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onChange([...periods, nextPeriod(periods)])}>
            Dodaj godzinę
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setResetOpen(true)}>
            Przywróć domyślne
          </Button>
        </div>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">Brak godzin. Dodaj pierwszą albo przywróć domyślne dzwonki.</p>
      ) : (
        <ul className="max-w-md space-y-1.5">
          {sorted.map((p) => {
            const startOk = !Number.isNaN(parseHm(p.start));
            const endOk = !Number.isNaN(parseHm(p.end)) && (!startOk || parseHm(p.end) > parseHm(p.start));
            return (
              <li key={p.no} className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={p.no}
                  onChange={(e) => changeNo(p.no, Number(e.target.value))}
                  aria-label="Numer lekcji"
                  className="w-16 px-2 py-1 text-center"
                />
                <Input
                  value={p.start}
                  onChange={(e) => update(p.no, { start: e.target.value })}
                  aria-label="Od"
                  placeholder="8:00"
                  className={clsx('w-20 px-2 py-1 text-center', !startOk && 'border-red-400')}
                />
                <span className="text-gray-400">-</span>
                <Input
                  value={p.end}
                  onChange={(e) => update(p.no, { end: e.target.value })}
                  aria-label="Do"
                  placeholder="8:45"
                  className={clsx('w-20 px-2 py-1 text-center', !endOk && 'border-red-400')}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onChange(periods.filter((x) => x.no !== p.no))}
                  aria-label={`Usuń lekcję ${p.no}`}
                >
                  Usuń
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      <ConfirmDialog
        open={resetOpen}
        title="Przywrócić domyślne dzwonki?"
        message="Lista godzin wróci do dzwonków 1-6 (8:00-13:15). Plan (klasy w komórkach) zostaje bez zmian."
        confirmLabel="Przywróć"
        danger={false}
        onConfirm={() => {
          onChange(DEFAULT_PERIODS);
          setResetOpen(false);
        }}
        onCancel={() => setResetOpen(false)}
      />
    </section>
  );
}
