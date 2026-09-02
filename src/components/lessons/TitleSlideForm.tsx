import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';

type TitleSlide = Extract<Slide, { kind: 'title' }>;

export function TitleSlideForm({ slide, onChange }: { slide: TitleSlide; onChange: (next: TitleSlide) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł</label>
        <Input value={slide.title} onChange={(e) => onChange({ ...slide, title: e.target.value })} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Podtytuł (opcjonalnie)</label>
        <Input
          value={slide.subtitle ?? ''}
          onChange={(e) => onChange({ ...slide, subtitle: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
