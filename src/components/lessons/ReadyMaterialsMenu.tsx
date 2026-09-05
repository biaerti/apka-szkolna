// Gotowe materialy (lekcja zapoznawcza, powtorki) jako menu obok "Nowa lekcja"
// oraz jako przyciski pustego stanu rocznika. Wstawiaja sie raz na rocznik -
// wszystkie klasy rownolegle widza je od razu, nie trzeba nic kopiowac.

import { useState } from 'react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Menu, type MenuItem } from '../ui/Menu';
import { ChevronDownIcon } from '../ui/icons';
import type { ReadyMaterial } from './useReadyMaterials';
import type { RefreshMatch } from './refreshMaterials';

interface Props {
  /** Nazwy klas rocznika, np. "IV A, IV B, IV C". */
  classNames: string;
  materials: ReadyMaterial[];
  refreshMatches: RefreshMatch[];
  onRefresh: () => void;
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
      onSelect: () => setRefreshOpen(true),
    },
  ];

  const refreshMessage =
    refreshMatches.length === 0
      ? ''
      : `Zaktualizowane zostaną: ${refreshMatches.map((m) => `„${m.oldLesson.title}"`).join(', ')}. ` +
        'Podmienia się tylko treść (tytuł, slajdy, pytania). Postęp klas i zapisane plusy, kropki, plomby i pasy zostają.';

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

      <ConfirmDialog
        open={refreshOpen}
        title="Odśwież wstawione materiały"
        message={refreshMessage}
        confirmLabel="Odśwież"
        danger={false}
        onCancel={() => setRefreshOpen(false)}
        onConfirm={() => {
          onRefresh();
          setRefreshOpen(false);
        }}
      />
    </>
  );
}
