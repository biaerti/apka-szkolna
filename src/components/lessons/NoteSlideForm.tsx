import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type NoteSlide = Extract<Slide, { kind: 'note' }>;

export function NoteSlideForm({ slide, onChange }: { slide: NoteSlide; onChange: (next: NoteSlide) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł (opcjonalnie)</label>
        <Input
          value={slide.title ?? ''}
          onChange={(e) => onChange({ ...slide, title: e.target.value || undefined })}
          placeholder="Notatka do zeszytu"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Treść</label>
        <Textarea rows={8} value={slide.body} onChange={(e) => onChange({ ...slide, body: e.target.value })} />
      </div>
    </div>
  );
}
