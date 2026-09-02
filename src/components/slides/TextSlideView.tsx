import type { Slide } from '../../data/types';
import { RichText } from './RichText';

export function TextSlideView({ slide }: { slide: Extract<Slide, { kind: 'text' }> }) {
  return (
    <div className="flex h-full flex-col justify-center gap-6 px-20 py-16">
      {slide.title && <h2 className="text-5xl font-bold text-white">{slide.title}</h2>}
      <RichText
        text={slide.body}
        className="space-y-4 text-[32px] leading-snug text-gray-100 [&_ul]:space-y-2 [&_ol]:space-y-2"
      />
    </div>
  );
}
