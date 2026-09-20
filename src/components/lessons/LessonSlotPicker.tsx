import { useEffect, useMemo, useState } from 'react';
import type { LessonSlot } from '../../data/types';
import { toDateKey } from '../../lib/dates';
import { slotDayLabel, type LessonSlotOption } from '../../lib/lessonSlots';

interface Props {
  idPrefix: string;
  options: LessonSlotOption[];
  assignedSlots: LessonSlot[];
  now: Date;
  suggestCurrentSlot: boolean;
  onAdd: (slot: LessonSlot) => void;
  mobile?: boolean;
}

export function LessonSlotPicker({ idPrefix, options, assignedSlots, now, suggestCurrentSlot, onAdd, mobile = false }: Props) {
  const today = toDateKey(now);
  const [selectedDate, setSelectedDate] = useState(today);
  const available = useMemo(
    () => options.filter((option) => !assignedSlots.some((slot) => slot.id === option.id)),
    [assignedSlots, options],
  );
  const dates = useMemo(
    () => Array.from(new Set([today, ...available.map((option) => option.date)])).sort(),
    [available, today],
  );
  const hours = available.filter((option) => option.date === selectedDate);
  const current = suggestCurrentSlot ? hours.find((option) => option.isNow) : undefined;

  useEffect(() => {
    setSelectedDate(today);
  }, [idPrefix, today]);

  const size = mobile ? 'min-h-11 px-3 text-sm' : 'min-h-8 px-2 text-xs';

  return (
    <div className="inline-flex max-w-full items-stretch overflow-hidden rounded-md border border-dashed border-accent-300 bg-white focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100">
      <label className="sr-only" htmlFor={`${idPrefix}-date`}>Dzień lekcji</label>
      <select
        id={`${idPrefix}-date`}
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        className={`${size} max-w-[8.5rem] border-0 bg-transparent font-semibold text-gray-700 outline-none hover:bg-accent-50`}
      >
        {dates.map((date) => <option key={date} value={date}>{slotDayLabel(date, now)}</option>)}
      </select>

      <span aria-hidden="true" className="my-1.5 w-px shrink-0 bg-gray-200" />

      <label className="sr-only" htmlFor={`${idPrefix}-time`}>Godzina lekcji</label>
      <select
        id={`${idPrefix}-time`}
        value=""
        disabled={hours.length === 0}
        onChange={(event) => {
          const option = hours.find((item) => item.id === event.target.value);
          if (option) onAdd({ id: option.id, date: option.date, period: option.period });
        }}
        className={`${size} max-w-[8rem] border-0 bg-transparent font-semibold outline-none hover:bg-accent-50 disabled:text-gray-400 ${current ? 'text-accent-700' : 'text-gray-700'}`}
      >
        <option value="">{current ? `Teraz · ${timeOf(current)}` : hours.length > 0 ? 'Godzina' : 'Brak lekcji'}</option>
        {hours.map((option) => (
          <option key={option.id} value={option.id}>{option.isNow ? `Teraz · ${timeOf(option)}` : timeOf(option)}</option>
        ))}
      </select>
    </div>
  );
}

function timeOf(option: LessonSlotOption): string {
  const parts = option.label.split(' · ');
  return parts[parts.length - 1] ?? option.label;
}
