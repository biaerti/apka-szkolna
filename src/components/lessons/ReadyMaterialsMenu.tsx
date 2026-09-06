// Gotowe materialy (lekcja zapoznawcza, powtorki) jako menu obok "Nowa lekcja"
// oraz jako przyciski pustego stanu rocznika. Wstawiaja sie raz na rocznik -
// wszystkie klasy rownolegle widza je od razu, nie trzeba nic kopiowac.

import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Modal } from '../ui/Modal';
import { Menu, type MenuItem } from '../ui/Menu';
import { ChevronDownIcon } from '../ui/icons';
import type { ReadyMaterial } from './useReadyMaterials';
import type { ClassifiedRefreshMatch } from './refreshMaterials';

interface Props {
  /** Nazwy klas rocznika, np. "IV A, IV B, IV C". */
  classNames: string;
  materials: ReadyMaterial[];
  refreshMatches: ClassifiedRefreshMatch[];
  onRefresh: (confirmedManualIds?: ReadonlySet<string>) => void;
  /** 'menu' - przycisk z rozwijana lista; 'buttons' - plaskie przyciski do pustego stanu. */
  variant: 'menu' | 'buttons';
}

/** "Wstaw" dla calego materialu, "Uzupelnij" gdy czesc lekcji juz jest w roczniku. */
function czasownik(m: ReadyMaterial): string {
  return m.missingCount < m.lessonCount ? 'Uzupełnij' : 'Wstaw';
}

export function ReadyMaterialsMenu({ classNames, materials, refreshMatches, onRefresh, variant }: Props) {
  const [pending, setPending] = useState<ReadyMaterial | null>(null);
  const [refreshOpen, setRefreshOpen] = useState(false);
  // Lekcje "manually-edited", ktore nauczyciel mimo ostrzezenia zaznaczyl do
  // nadpisania - domyslnie zadna nie jest zaznaczona.
  const [confirmedManualIds, setConfirmedManualIds] = useState<Set<string>>(new Set());

  const codeNewer = useMemo(() => refreshMatches.filter((m) => m.classification === 'code-newer'), [refreshMatches]);
  const manuallyEdited = useMemo(
    () => refreshMatches.filter((m) => m.classification === 'manually-edited'),
    [refreshMatches],
  );

  const refreshHint =
    refreshMatches.length === 0
      ? 'Nic do odświeżenia'
      : `${refreshMatches.length} ${refreshMatches.length === 1 ? 'lekcja ma' : 'lekcje mają'} nowszą wersję`;

  const items: MenuItem[] = [
    ...materials.map<MenuItem>((m) => ({
      label: m.label,
      hint: m.alreadyInserted ? 'Już wstawione' : m.description,
      disabled: m.alreadyInserted,
      onSelect: () => setPending(m),
    })),
    'separator',
    {
      label: 'Odśwież wstawione materiały',
      hint: refreshHint,
      disabled: refreshMatches.length === 0,
      onSelect: () => {
        setConfirmedManualIds(new Set());
        setRefreshOpen(true);
      },
    },
  ];

  function toggleManual(id: string) {
    setConfirmedManualIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      {variant === 'menu' ? (
        <Menu
          items={items}
          renderTrigger={(props) => (
            <Button variant="secondary" {...props}>
              Gotowe materiały
              <ChevronDownIcon className="-mr-1 text-gray-400" />
            </Button>
          )}
        />
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {materials
            .filter((m) => !m.alreadyInserted)
            .map((m) => (
              <Button key={m.key} variant="secondary" onClick={() => setPending(m)}>
                {czasownik(m)}: {m.label.toLowerCase()}
              </Button>
            ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        title={pending ? `${czasownik(pending)}: ${pending.label.toLowerCase()}` : ''}
        message={pending ? `${pending.description} Pojawi się w: ${classNames}. Postęp każda klasa ma osobny.` : ''}
        confirmLabel={pending ? czasownik(pending) : 'Wstaw'}
        danger={false}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          pending?.insert();
          setPending(null);
        }}
      />

      <Modal
        open={refreshOpen}
        onClose={() => setRefreshOpen(false)}
        title="Odśwież wstawione materiały"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRefreshOpen(false)}>
              Anuluj
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onRefresh(confirmedManualIds);
                setRefreshOpen(false);
              }}
            >
              Odśwież
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-gray-600">
          {codeNewer.length > 0 && (
            <div>
              <p>
                Zaktualizowane zostaną: {codeNewer.map((m) => `„${m.oldLesson.title}"`).join(', ')}. Podmienia się
                tylko treść (tytuł, slajdy, pytania). Postęp klas i zapisane plusy, kropki, plomby i pasy zostają.
              </p>
            </div>
          )}

          {manuallyEdited.length > 0 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="mb-2 font-medium text-amber-800">
                Te lekcje były zmieniane ręcznie - odświeżenie nadpisze Twoje zmiany:
              </p>
              <div className="space-y-1.5">
                {manuallyEdited.map((m) => (
                  <label
                    key={m.oldLesson.id}
                    className="flex cursor-pointer items-start gap-2 text-amber-900"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-amber-300 text-accent-600 focus:ring-accent-500"
                      checked={confirmedManualIds.has(m.oldLesson.id)}
                      onChange={() => toggleManual(m.oldLesson.id)}
                    />
                    <span>„{m.oldLesson.title}" - nadpisz mimo ręcznych zmian</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
