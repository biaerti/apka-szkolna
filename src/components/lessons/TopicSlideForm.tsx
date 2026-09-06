// Slajd "Temat lekcji": puste pole = temat brany z lekcji (pole "Temat do
// wpisania w dzienniku"), zeby zeszyt ucznia i dziennik mowily to samo.
// Kod lekcji (np. 4.3) dokladamy automatycznie - nie da sie go tu wpisac.

import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

type TopicSlide = Extract<Slide, { kind: 'topic' }>;

export function TopicSlideForm({
  slide,
  onChange,
  lessonTopic,
  lessonCode,
}: {
  slide: TopicSlide;
  onChange: (next: TopicSlide) => void;
  lessonTopic?: string;
  lessonCode?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Kod lekcji na slajdzie: <span className="font-semibold text-gray-700">{lessonCode ?? '(brak)'}</span> - nadaje
        się sam i już się nie zmienia.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Temat do zapisania w zeszycie</label>
        <Textarea
          rows={3}
          value={slide.topic ?? ''}
          onChange={(e) => onChange({ ...slide, topic: e.target.value || undefined })}
          placeholder={lessonTopic || 'Puste = temat z lekcji (pole "Temat do wpisania w dzienniku")'}
        />
        <p className="mt-1 text-xs text-gray-500">
          Puste pole = temat z lekcji: {lessonTopic || '(uzupełnij temat lekcji wyżej)'}
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Polecenie na dole (opcjonalnie)</label>
        <Input
          value={slide.note ?? ''}
          onChange={(e) => onChange({ ...slide, note: e.target.value || undefined })}
          placeholder="Zapiszcie temat z kodem i dzisiejszą datą w zeszycie"
        />
      </div>
    </div>
  );
}
