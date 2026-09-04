import { useState } from 'react';
import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

type TaskSlide = Extract<Slide, { kind: 'task' }>;

const TIMER_PRESETS = [
  { label: 'Brak', value: '' },
  { label: '1 minuta', value: '60' },
  { label: '2 minuty', value: '120' },
  { label: '3 minuty', value: '180' },
  { label: '5 minut', value: '300' },
  { label: '10 minut', value: '600' },
  { label: 'Własny...', value: 'custom' },
];

export function TaskSlideForm({ slide, onChange }: { slide: TaskSlide; onChange: (next: TaskSlide) => void }) {
  const knownValues = TIMER_PRESETS.map((p) => p.value).filter((v) => v && v !== 'custom');
  const currentTimerStr = slide.timerSec ? String(slide.timerSec) : '';
  const [customMode, setCustomMode] = useState(currentTimerStr !== '' && !knownValues.includes(currentTimerStr));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Kod zadania</label>
          <Input value={slide.code} onChange={(e) => onChange({ ...slide, code: e.target.value })} placeholder="Z1" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł (opcjonalnie)</label>
          <Input
            value={slide.title ?? ''}
            onChange={(e) => onChange({ ...slide, title: e.target.value || undefined })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Treść</label>
        <Textarea rows={6} value={slide.body} onChange={(e) => onChange({ ...slide, body: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Strona podręcznika</label>
          <Input
            type="number"
            min={1}
            value={slide.page ?? ''}
            onChange={(e) => onChange({ ...slide, page: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Numer ćwiczenia</label>
          <Input
            value={slide.exerciseNo ?? ''}
            onChange={(e) => onChange({ ...slide, exerciseNo: e.target.value || undefined })}
            placeholder="4"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Stoper (czas na zadanie)</label>
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
