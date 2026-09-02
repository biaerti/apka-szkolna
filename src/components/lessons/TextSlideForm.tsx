import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type TextSlide = Extract<Slide, { kind: 'text' }>;

export function TextSlideForm({ slide, onChange }: { slide: TextSlide; onChange: (next: TextSlide) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł (opcjonalnie)</label>
        <Input
          value={slide.title ?? ''}
          onChange={(e) => onChange({ ...slide, title: e.target.value || undefined })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Treść</label>
        <Textarea
          rows={10}
          value={slide.body}
          onChange={(e) => onChange({ ...slide, body: e.target.value })}
          placeholder={'Akapit.\n\n- punkt listy\n- kolejny punkt\n\n**pogrubienie** w tekście'}
        />
        <p className="mt-1 text-xs text-gray-500">
          Puste linie rozdzielają akapity. Listy: linie zaczynające się od "- " lub "1. ". Pogrubienie: **tekst**.
        </p>
      </div>
    </div>
  );
}
