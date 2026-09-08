// Pasek rysowania w rogu prezentacji. Domyslnie zwiniety do jednego przycisku
// "Rysuj" - na lekcji przez wiekszosc czasu nikt nie rysuje, a slajd ma byc
// czysty. Skroty: R wlacza/wylacza pioro, T dopisek, Esc chowa pasek.

import clsx from 'clsx';
import type { ReactNode } from 'react';
import { ANNOTATION_COLORS, ANNOTATION_SIZES, type AnnotationTool } from './annotations';
import type { SlideAnnotations } from './useSlideAnnotations';

const TOOLS: Array<{ value: AnnotationTool; label: string; title: string }> = [
  { value: 'pen', label: 'Pióro', title: 'Rysowanie odręczne (R)' },
  { value: 'marker', label: 'Zakreślacz', title: 'Grube, przezroczyste zakreślenie' },
  { value: 'text', label: 'Tekst', title: 'Kliknij w slajd i wpisz tekst (T)' },
  { value: 'eraser', label: 'Gumka', title: 'Kliknij kreskę lub dopisek, żeby go usunąć' },
];

function BarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={clsx(
        'rounded-md px-3 py-1.5 text-sm font-medium',
        active ? 'bg-accent-500 text-white' : 'text-gray-300 hover:bg-white/10',
      )}
    >
      {children}
    </button>
  );
}

export function AnnotationToolbar({ ann }: { ann: SlideAnnotations }) {
  const open = ann.tool !== 'off';
  const size = ANNOTATION_SIZES[ann.sizeIndex] ?? ANNOTATION_SIZES[1];

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          ann.setTool('pen');
        }}
        title="Rysuj i dopisuj na slajdzie (R)"
        className="absolute bottom-16 left-4 z-40 rounded-md bg-gray-800/60 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800/90"
      >
        Rysuj
      </button>
    );
  }

  return (
    <div
      className="absolute bottom-16 left-4 z-40 flex items-center gap-1 rounded-lg bg-gray-900/90 p-1.5 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {TOOLS.map((t) => (
        <BarButton key={t.value} active={ann.tool === t.value} title={t.title} onClick={() => ann.setTool(t.value)}>
          {t.label}
        </BarButton>
      ))}

      <span className="mx-1 h-6 w-px bg-white/15" />

      {ANNOTATION_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          title={`Kolor: ${c.label}`}
          aria-label={`Kolor: ${c.label}`}
          onClick={() => ann.setColor(c.value)}
          className={clsx(
            'h-6 w-6 rounded-full border-2',
            ann.color === c.value ? 'border-white' : 'border-white/25',
          )}
          style={{ backgroundColor: c.value }}
        />
      ))}

      <span className="mx-1 h-6 w-px bg-white/15" />

      <button
        type="button"
        onClick={ann.cycleSize}
        title={`Grubość: ${size.label} - kliknij, żeby zmienić`}
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-300 hover:bg-white/10"
      >
        <span
          className="rounded-full bg-current"
          style={{ width: 4 + ann.sizeIndex * 5, height: 4 + ann.sizeIndex * 5 }}
        />
      </button>

      <span className="mx-1 h-6 w-px bg-white/15" />

      <BarButton onClick={ann.undo} title="Cofnij ostatnią kreskę (Ctrl+Z)">
        Cofnij
      </BarButton>
      <BarButton onClick={ann.clearSlide} title="Usuń wszystko z tego slajdu">
        Wyczyść
      </BarButton>
      <BarButton onClick={() => ann.setTool('off')} title="Schowaj pasek, wróć do klikania slajdów (Esc)">
        Gotowe
      </BarButton>
    </div>
  );
}
