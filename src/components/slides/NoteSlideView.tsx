// Slajd "Notatka do zeszytu" - zamyka lekcje. Celowo jasne tlo (kartka
// w liniaturze), w odroznieniu od reszty ciemnej prezentacji.
// Linie liniatury: czysty CSS przez repeating-linear-gradient w atrybucie
// style (bez :has(), bez color-mix() - Chrome 109 na szkolnym komputerze).

import type { Slide } from '../../data/types';
import { RichText } from './RichText';

const RULED_LINES_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 64px)',
  backgroundPosition: '0 120px',
};

export function NoteSlideView({ slide }: { slide: Extract<Slide, { kind: 'note' }> }) {
  return (
    <div className="flex h-full flex-col bg-amber-50 px-20 py-14 text-gray-900" style={RULED_LINES_STYLE}>
      <h2 className="mb-8 text-5xl font-bold text-gray-900">{slide.title || 'Notatka do zeszytu'}</h2>

      <RichText text={slide.body} className="flex-1 space-y-4 text-[34px] leading-[64px] text-gray-800" />

      <p className="mt-6 text-center text-2xl font-semibold text-gray-500">Przepisz do zeszytu</p>
    </div>
  );
}
