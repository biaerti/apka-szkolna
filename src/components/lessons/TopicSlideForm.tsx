// Slajd "Temat lekcji": puste pole = temat brany z lekcji (pole "Temat do
// wpisania w dzienniku"), zeby zeszyt ucznia i dziennik mowily to samo.
// Kod lekcji (np. 4.3) dokladamy automatycznie - nie da sie go tu wpisac.

import { useState } from 'react';
import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

type TopicSlide = Extract<Slide, { kind: 'topic' }>;

const TIMER_PRESETS = [
  { label: 'Brak', value: '' },
  { label: '1 minuta', value: '60' },
  { label: '2 minuty', value: '120' },
  { label: '3 minuty', value: '180' },
  { label: '5 minut', value: '300' },
  { label: '10 minut', value: '600' },
  { label: 'Własny...', value: 'custom' },
];

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
  const knownValues = TIMER_PRESETS.map((p) => p.value).filter((v) => v && v !== 'custom');
  const currentTimerStr = slide.timerSec ? String(slide.timerSec) : '';
  const [customMode, setCustomMode] = useState(currentTimerStr !== '' && !knownValues.includes(currentTimerStr));

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
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Stoper (czas na zapisanie tematu)</label>
        <Select
          value={customMode ? 'custom' : currentTimerStr}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'custom') {
              setCustomMode(true);
              return;
            }
            setCustomMode(false);
            onChange({ ...slide, timerSec: v ? Number(v) : undefined });
          }}
        >
          {TIMER_PRESETS.map((p) => (
            <option key={p.value || 'none'} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
        {customMode && (
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              min={1}
              className="w-32"
              value={slide.timerSec ?? ''}
              onChange={(e) => onChange({ ...slide, timerSec: e.target.value ? Number(e.target.value) : undefined })}
            />
            <span className="text-sm text-gray-500">sekund</span>
          </div>
        )}
      </div>
    </div>
  );
}
