import type { Slide } from '../../data/types';

export function ImageSlideView({ slide }: { slide: Extract<Slide, { kind: 'image' }> }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-10 py-10">
      {slide.url ? (
        <img src={slide.url} alt={slide.caption ?? ''} className="max-h-[75%] max-w-full rounded-lg object-contain" />
      ) : (
        <div className="flex h-2/3 w-2/3 items-center justify-center rounded-lg border-2 border-dashed border-gray-600 text-2xl text-gray-400">
          Brak obrazu
        </div>
      )}
      {slide.caption && <p className="text-2xl text-gray-300">{slide.caption}</p>}
    </div>
  );
}
