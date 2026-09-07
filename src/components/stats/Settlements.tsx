// Widok "Do rozliczenia": uczniowie z kompletem plomb (jedynka) albo kompletem
// plusow (piatka). Plusy, kropki i plomby rozliczamy na koniec miesiaca (patrz
// src/data/zasady.ts) - to miejsce nauczyciel odwiedza wtedy i wystawia ocene.

import { useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapResult } from '../../data/types';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { settlementRows, type SettlementRow } from '../../lib/stats';

type PendingType = Extract<RecapResult, 'jedynka' | 'piatka'>;
interface Pending {
  type: PendingType;
  row: SettlementRow;
}

const CONFIRM_COPY: Record<PendingType, { title: string; message: (name: string) => string; confirmLabel: string }> = {
  jedynka: {
    title: 'Wystawić jedynkę?',
    message: (name) => `${name} zebrał/-a komplet plomb w tym miesiącu. Plomby zostaną zamienione na ocenę niedostateczną.`,
    confirmLabel: 'Jedynka',
  },
  piatka: {
    title: 'Wystawić piątkę?',
    message: (name) => `${name} zebrał/-a komplet plusów. Plusy zostaną zamienione na ocenę bardzo dobrą.`,
    confirmLabel: 'Piątka',
  },
};

export function Settlements({ classId }: { classId: string }) {
  const students = useStore((s) => s.students);
  const recapEvents = useStore((s) => s.recapEvents);
  const settings = useStore((s) => s.settings);
  const addRecapEvent = useStore((s) => s.addRecapEvent);

  const classStudents = useMemo(
    () => students.filter((st) => st.classId === classId).sort((a, b) => a.number - b.number),
    [students, classId],
  );

  const rows = useMemo(
    () => settlementRows(recapEvents, classStudents, settings),
    [recapEvents, classStudents, settings],
  );

  const [pending, setPending] = useState<Pending | null>(null);

  function confirmPending() {
    if (!pending) return;
    addRecapEvent({ studentId: pending.row.student.id, classId, result: pending.type });
    setPending(null);
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="Nikt nic nie zbiera"
        description="Żaden uczeń w tej klasie nie ma obecnie kompletu plomb ani plusów do rozliczenia."
      />
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const fullName = `${row.student.firstName} ${row.student.lastName}`;
        return (
          <div key={row.student.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="font-medium text-gray-900">
              {row.student.number}. {row.student.lastName} {row.student.firstName}
            </p>

            {row.earnedOne && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Zebrał/-a komplet plomb ({row.plomby}) - można wystawić jedynkę.
                </p>
                <div className="mt-3">
                  <Button variant="danger" size="sm" onClick={() => setPending({ type: 'jedynka', row })}>
                    Jedynka
                  </Button>
                </div>
              </div>
            )}

            {row.earnedFive && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Zebrał/-a komplet plusów ({row.plusy}) - można wystawić piątkę.</p>
                <div className="mt-2">
                  <Button variant="primary" size="sm" onClick={() => setPending({ type: 'piatka', row })}>
                    Piątka
                  </Button>
                </div>
              </div>
            )}

            {pending && pending.row.student.id === row.student.id && (
              <ConfirmDialog
                open
                title={CONFIRM_COPY[pending.type].title}
                message={CONFIRM_COPY[pending.type].message(fullName)}
                confirmLabel={CONFIRM_COPY[pending.type].confirmLabel}
                danger={pending.type === 'jedynka'}
                onConfirm={confirmPending}
                onCancel={() => setPending(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
