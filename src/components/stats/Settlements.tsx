// Widok "Do rozliczenia": uczniowie z kompletem plomb (zadania naprawcze albo
// jedynka) lub kompletem plusow (piatka). Zasada: 3 plomby to NIE od razu jedynka -
// uczen dostaje zadania naprawcze z pytan, na ktore nie umial odpowiedziec.

import { useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapResult } from '../../data/types';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { copyToClipboard } from '../../lib/clipboard';
import { settlementRows, type SettlementRow } from '../../lib/stats';

type PendingType = Extract<RecapResult, 'rozliczenie' | 'jedynka' | 'piatka'>;
interface Pending {
  type: PendingType;
  row: SettlementRow;
}

const CONFIRM_COPY: Record<PendingType, { title: string; message: (name: string) => string; confirmLabel: string }> = {
  rozliczenie: {
    title: 'Zaznaczyć jako rozliczone?',
    message: (name) => `${name} przyniósł/-a rozwiązania zadań naprawczych. Licznik plomb zostanie wyzerowany.`,
    confirmLabel: 'Rozliczone',
  },
  jedynka: {
    title: 'Wystawić jedynkę?',
    message: (name) => `${name} nie oddał/-a zadań naprawczych. Plomby zostaną zamienione na ocenę niedostateczną.`,
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
  const questions = useStore((s) => s.questions);
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function questionTexts(ids: string[]): string[] {
    return ids
      .map((id) => questions.find((q) => q.id === id)?.text)
      .filter((text): text is string => Boolean(text));
  }

  async function handleCopy(row: SettlementRow) {
    const texts = questionTexts(row.plombyQuestionIds);
    const date = new Date().toLocaleDateString('pl-PL');
    const header = `Zadania naprawcze - ${row.student.firstName} ${row.student.lastName} (${date})`;
    const body = texts
      .map((text, i) => `${i + 1}. ${text}\nOdpowiedź: ______________________________`)
      .join('\n\n');
    const ok = await copyToClipboard(`${header}\n\n${body}`);
    if (ok) {
      setCopiedId(row.student.id);
      window.setTimeout(() => setCopiedId((id) => (id === row.student.id ? null : id)), 2000);
    }
  }

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
        const texts = questionTexts(row.plombyQuestionIds);
        const fullName = `${row.student.firstName} ${row.student.lastName}`;
        return (
          <div key={row.student.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="font-medium text-gray-900">
              {row.student.number}. {row.student.lastName} {row.student.firstName}
            </p>

            {row.owesTasks && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Zebrał/-a komplet plomb ({row.plomby}). 3 plomby to nie od razu jedynka - najpierw zadania
                  naprawcze: przyniesie rozwiązania na następną lekcję - kliknij „Rozliczone”; nie przyniesie -
                  kliknij „Jedynka”.
                </p>
                {texts.length > 0 && (
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
                    {texts.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ol>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleCopy(row)} disabled={texts.length === 0}>
                    {copiedId === row.student.id ? 'Skopiowano' : 'Kopiuj zadania'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setPending({ type: 'rozliczenie', row })}>
                    Rozliczone
                  </Button>
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
