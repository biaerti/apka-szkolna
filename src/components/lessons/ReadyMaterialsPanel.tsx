// Sekcja "Gotowe materialy" na ekranie Lekcje: wstawianie lekcji zapoznawczej i
// gotowych powtorek oraz (WAZNE) odswiezanie juz wstawionych materialow, gdy
// tresc w kodzie zdazyla sie poprawic (np. bledny tytul albo zla odpowiedz).
// Wydzielone z Lessons.tsx, zeby zmiescic sie w limicie 250 linii na komponent.
//
// Lista powtorek przychodzi z useReadyMaterials - panel nie wie, ile ich jest.

import { useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { RefreshMatch } from './refreshMaterials';
import type { ReadyRecap } from './useReadyMaterials';

export function ReadyMaterialsPanel({
  className,
  introAvailable,
  introAlreadyInserted,
  recaps,
  refreshMatches,
  onInsertIntro,
  onRefresh,
}: {
  className: string;
  introAvailable: boolean;
  introAlreadyInserted: boolean;
  recaps: ReadyRecap[];
  refreshMatches: RefreshMatch[];
  onInsertIntro: () => void;
  onRefresh: () => void;
}) {
  const [openRecapKey, setOpenRecapKey] = useState<string | null>(null);
  const [introConfirmOpen, setIntroConfirmOpen] = useState(false);
  const [refreshConfirmOpen, setRefreshConfirmOpen] = useState(false);
  const openRecap = recaps.find((r) => r.key === openRecapKey) ?? null;

  const refreshMessage =
    refreshMatches.length === 0
      ? ''
      : `W klasie ${className} zostanie zaktualizowanych ${refreshMatches.length} ` +
        `${refreshMatches.length === 1 ? 'lekcja' : 'lekcje'}: ` +
        refreshMatches.map((m) => `"${m.oldLesson.title}" → "${m.newLesson.title}"`).join(', ') +
        '. Status lekcji, data wykonania i zapisane zdarzenia powtórki (plusy/plomby/pasy) zostaną ' +
        'zachowane - podmieniona zostanie tylko treść (tytuł, slajdy, pytania). Kontynuować?';

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Gotowe materiały</h2>
      <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-4">
        <Button
          variant="secondary"
          disabled={introAlreadyInserted || !introAvailable}
          onClick={() => setIntroConfirmOpen(true)}
        >
          {introAlreadyInserted ? 'Lekcja zapoznawcza - już wstawione' : 'Wstaw lekcję zapoznawczą'}
        </Button>
        {recaps.map((recap) => (
          <Button
            key={recap.key}
            variant="secondary"
            disabled={recap.alreadyInserted}
            onClick={() => setOpenRecapKey(recap.key)}
          >
            {recap.alreadyInserted ? `${recap.name} - już wstawione` : `Wstaw ${recap.insertLabel}`}
          </Button>
        ))}
        <Button
          variant="secondary"
          disabled={refreshMatches.length === 0}
          title={
            refreshMatches.length === 0
              ? 'Nie znaleziono w tej klasie wstawionych wcześniej materiałów do odświeżenia'
              : undefined
          }
          onClick={() => setRefreshConfirmOpen(true)}
        >
          Odśwież gotowe materiały{refreshMatches.length > 0 ? ` (${refreshMatches.length})` : ''}
        </Button>
      </div>

      <ConfirmDialog
        open={!!openRecap}
        title={openRecap ? `Wstaw ${openRecap.insertLabel}` : ''}
        message={
          openRecap
            ? `Do klasy ${className} zostaną dodane 3 lekcje-prezentacje (${openRecap.contents}) i 3 zestawy pytań do koła fortuny. Kontynuować?`
            : ''
        }
        confirmLabel="Wstaw"
        danger={false}
        onCancel={() => setOpenRecapKey(null)}
        onConfirm={() => {
          openRecap?.insert();
          setOpenRecapKey(null);
        }}
      />

      <ConfirmDialog
        open={introConfirmOpen}
        title="Wstaw lekcję zapoznawczą"
        message={`Do klasy ${className} zostanie dodana lekcja zapoznawcza wraz z zestawem pytań "Poznajmy się". Kontynuować?`}
        confirmLabel="Wstaw"
        danger={false}
        onCancel={() => setIntroConfirmOpen(false)}
        onConfirm={() => {
          onInsertIntro();
          setIntroConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        open={refreshConfirmOpen}
        title="Odśwież gotowe materiały"
        message={refreshMessage}
        confirmLabel="Odśwież"
        danger={false}
        onCancel={() => setRefreshConfirmOpen(false)}
        onConfirm={() => {
          onRefresh();
          setRefreshConfirmOpen(false);
        }}
      />
    </div>
  );
}
