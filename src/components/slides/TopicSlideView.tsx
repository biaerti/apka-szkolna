// Slajd "Temat lekcji" - to, co klasa zapisuje w zeszycie na poczatku lekcji.
// Jasne tlo w liniature (jak notatka) mowi bez slow: "to sie przepisuje".
//
// Kod lekcji (np. 4.3) jest tu ogromny, tak jak kod zadania na slajdzie `task`:
// dziecko zapisuje "Temat 4.3", a po miesiacach potrafi po tym kodzie odnalezc
// w zeszycie wlasciwa lekcje. Tresc tematu bierzemy z samego slajdu, a gdy jej
// nie ma - z tematu lekcji do dziennika (SlideView podaje go jako lessonTopic),
// zeby zeszyt i dziennik mowily to samo.

import type { Slide } from '../../data/types';
import { fitFontSize } from './fitText';

const RULED_LINES_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 64px)',
  backgroundPosition: '0 140px',
};

export function TopicSlideView({
  slide,
  code,
  lessonTopic,
}: {
  slide: Extract<Slide, { kind: 'topic' }>;
  code?: string;
  lessonTopic?: string;
}) {
  const topic = (slide.topic || lessonTopic || '').trim();
  const topicSize = fitFontSize(topic, { width: 1080, height: 300, min: 32, max: 84, lineHeight: 1.25 });

  return (
    <div className="flex h-full flex-col bg-amber-50 px-16 py-10 text-gray-900" style={RULED_LINES_STYLE}>
      <div className="flex items-center gap-6">
        <span className="text-3xl font-semibold uppercase tracking-widest text-gray-500">Temat</span>
        {code && (
          <span className="rounded-2xl border-4 border-accent-500 px-7 py-2 text-[80px] font-bold leading-none tabular-nums text-accent-700">
            {code}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center">
        <p className="font-bold leading-snug text-gray-900" style={{ fontSize: topicSize }}>
          {topic || 'Temat lekcji'}
        </p>
      </div>

      <p className="text-center text-3xl font-semibold text-gray-500">
        {slide.note?.trim() || 'Zapiszcie temat z kodem i dzisiejszą datą w zeszycie'}
      </p>
    </div>
  );
}
