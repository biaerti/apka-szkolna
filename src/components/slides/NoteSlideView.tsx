// Slajd "Notatka do zeszytu" - zamyka lekcje. Celowo jasne tlo (kartka
// w liniaturze), w odroznieniu od reszty ciemnej prezentacji.
// Linie liniatury: czysty CSS przez repeating-linear-gradient w atrybucie
// style (bez :has(), bez color-mix() - Chrome 109 na szkolnym komputerze).

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';

const RULED_LINES_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 64px)',
  backgroundPosition: '0 120px',
};

export function NoteSlideView({ slide }: { slide: Extract<Slide, { kind: 'note' }> }) {
  const scale = useSlideFontScale();
  // Notatka jest przepisywana z tablicy, wiec ma byc tak duza, jak sie da -
  // rozmiar dobieramy do dlugosci tresci (fitText.ts), w pikselach kartki 1280x720.
  const bodySize = fitFontSize(slide.body, { width: 1120, height: 480, min: 28, max: 72, scale, lineHeight: 1.6 });

  return (
    <div className="flex h-full flex-col bg-amber-50 px-20 py-12 text-gray-900" style={RULED_LINES_STYLE}>
      <h2 className="mb-6 text-6xl font-bold text-gray-900">{slide.title || 'Notatka do zeszytu'}</h2>

      <RichText
        text={slide.body}
        className="flex-1 space-y-[0.5em] leading-[1.6] text-gray-800"
        style={{ fontSize: bodySize }}
      />

      <p className="mt-4 text-center text-3xl font-semibold text-gray-500">Przepisz do zeszytu</p>
    </div>
  );
}
