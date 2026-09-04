// Sekcja "Gotowe materialy" na ekranie Lekcje: wstawianie lekcji zapoznawczej i
// powtorki klas 1-3 oraz (WAZNE) odswiezanie juz wstawionych materialow, gdy
// tresc w kodzie zdazyla sie poprawic (np. bledny tytul albo zla odpowiedz).
// Wydzielone z Lessons.tsx, zeby zmiescic sie w limicie 250 linii na komponent.

import { useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { RefreshMatch } from './refreshMaterials';

export function ReadyMaterialsPanel({
  className,
  introAvailable,
  introAlreadyInserted,
  recap13AlreadyInserted,
  refreshMatches,
  onInsertIntro,
  onInsertRecap13,
  onRefresh,
}: {
  className: string;
  introAvailable: boolean;
  introAlreadyInserted: boolean;
  recap13AlreadyInserted: boolean;
  refreshMatches: RefreshMatch[];
  onInsertIntro: () => void;
  onInsertRecap13: () => void;
  onRefresh: () => void;
}) {
  const [recapConfirmOpen, setRecapConfirmOpen] = useState(false);
  const [introConfirmOpen, setIntroConfirmOpen] = useState(false);
  const [refreshConfirmOpen, setRefreshConfirmOpen] = useState(false);

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
        <Button
          variant="secondary"
          disabled={recap13AlreadyInserted}
          onClick={() => setRecapConfirmOpen(true)}
        >
          {recap13AlreadyInserted ? 'Powtórka klas 1-3 - już wstawione' : 'Wstaw powtórkę klas 1-3'}
        </Button>
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
        open={recapConfirmOpen}
        title="Wstaw powtórkę klas 1-3"
        message={`Do klasy ${className} zostaną dodane 3 lekcje-prezentacje (fonetyka/ortografia, gramatyka/interpunkcja, formy wypowiedzi) i 3 zestawy pytań do koła fortuny. Kontynuować?`}
        confirmLabel="Wstaw"
        danger={false}
        onCancel={() => setRecapConfirmOpen(false)}
        onConfirm={() => {
          onInsertRecap13();
          setRecapConfirmOpen(false);
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
