// Slajd "Notatka do zeszytu" - zamyka lekcje. Celowo jasne tlo (kartka
// w liniaturze), w odroznieniu od reszty ciemnej prezentacji.
// Linie liniatury: czysty CSS przez repeating-linear-gradient w atrybucie
// style (bez :has(), bez color-mix() - Chrome 109 na szkolnym komputerze).

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { ZeszytIcon } from './ZeszytBadge';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';
import { StopwatchBar } from './StopwatchBar';

const RULED_LINES_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 64px)',
  backgroundPosition: '0 120px',
};

const TEMAT_PREFIX = '**Temat:** ';

/**
 * "Temat: Czas na czasownik" -> "Temat: 4.11. Czas na czasownik" - w zeszycie
 * temat ma stac dokladnie tak, jak na slajdzie tematu (z kodem lekcji).
 */
export function withLessonCode(body: string, code?: string): string {
  if (!code || !body.startsWith(TEMAT_PREFIX)) return body;
  const rest = body.slice(TEMAT_PREFIX.length);
  if (rest.startsWith(`${code}.`)) return body;
  return `${TEMAT_PREFIX}${code}. ${rest}`;
}

export function NoteSlideView({ slide, code }: { slide: Extract<Slide, { kind: 'note' }>; code?: string }) {
  const scale = useSlideFontScale();
  const body = withLessonCode(slide.body, code);
  // Notatka jest przepisywana z tablicy, wiec ma byc tak duza, jak sie da -
  // rozmiar dobieramy do dlugosci tresci (fitText.ts), w pikselach kartki 1280x720.
  const bodySize = fitFontSize(body, { width: 1120, height: 480, min: 28, max: 72, scale, lineHeight: 1.6 });

  return (
    <div className="flex h-full flex-col bg-amber-50 px-20 py-12 text-gray-900" style={RULED_LINES_STYLE}>
      <h2 className="mb-6 text-6xl font-bold text-gray-900">{slide.title || 'Notatka do zeszytu'}</h2>

      <RichText
        text={body}
        className="flex-1 space-y-[0.5em] leading-[1.6] text-gray-800"
        style={{ fontSize: bodySize }}
      />

      {/* Ta sama ikonka co plakietka "do zeszytu" na ciemnych slajdach - jedna umowa. */}
      <div className="mt-4 flex items-center justify-center gap-8">
        <p className="flex items-center gap-3 text-3xl font-semibold text-gray-500">
          <ZeszytIcon className="h-10 w-10 text-amber-600" />
          Przepisz do zeszytu
        </p>
        {slide.timerSec ? <StopwatchBar key={slide.id} timerSec={slide.timerSec} compact autoStart /> : null}
      </div>
    </div>
  );
}
