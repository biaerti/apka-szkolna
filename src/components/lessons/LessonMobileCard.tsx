import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import type { Lesson, LessonPeriod, LessonProgress, LessonSlot } from '../../data/types';
import { isCurrentSlot, slotDisplayLabel, type LessonSlotOption } from '../../lib/lessonSlots';
import { lessonMaterialType } from '../../lib/lessonMaterial';
import { Button } from '../ui/Button';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './lessonStatus';
import { LessonSlotPicker } from './LessonSlotPicker';
import { lessonFilmIds } from './LessonFilmModal';

interface Props {
  lesson: Lesson;
  classId: string;
  progress: LessonProgress;
  displayCode?: string;
  slots: LessonSlot[];
  slotOptions: LessonSlotOption[];
  periods: LessonPeriod[];
  now: Date;
  currentSlotId?: string;
  suggestCurrentSlot: boolean;
  onAddSlot: (slot: LessonSlot) => void;
  onRemoveSlot: (slotId: string) => void;
  onSetStatus: (status: LessonProgress['status']) => void;
  onShowPlan: () => void;
  onShowFilm: () => void;
}

export function LessonMobileCard(p: Props) {
  const navigate = useNavigate();
  const rowIsNow = Boolean(p.currentSlotId && p.slots.some((slot) => slot.id === p.currentSlotId));
  const query = `klasa=${p.classId}&typ=${lessonMaterialType(p.lesson)}`;

  return (
    <article className={clsx('rounded-xl border p-4', rowIsNow ? 'border-accent-300 bg-accent-50' : 'border-gray-200 bg-white')}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-500">{p.displayCode ?? p.lesson.code}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-5 text-gray-950">{p.lesson.title}</h3>
          {p.lesson.textbookPage && <p className="mt-1 text-xs text-gray-500">Podręcznik s. {p.lesson.textbookPage}</p>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {p.slots.map((slot, index) => {
          const now = isCurrentSlot(slot, p.periods, p.now);
          return (
            <div key={slot.id} className={clsx('inline-flex min-h-10 items-stretch overflow-hidden rounded-lg border text-sm font-medium', now ? 'border-accent-300 bg-accent-100 text-accent-900' : 'border-gray-200 bg-gray-50 text-gray-700')}>
              <button type="button" onClick={() => navigate(`/dziennik?data=${slot.date}&lekcja=${slot.period}&klasa=${p.classId}&material=${p.lesson.id}`)} className="px-3 py-2 text-left">
                {now ? 'Teraz' : slotDisplayLabel(slot, p.periods, p.now)}{index > 0 ? ` · cz. ${index + 1}` : ''}
              </button>
              <button type="button" onClick={() => p.onRemoveSlot(slot.id)} aria-label={`Usuń slot ${slotDisplayLabel(slot, p.periods, p.now)}`} className="border-l border-gray-200 px-2 py-2 text-xs text-gray-500">Usuń</button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <LessonSlotPicker
            idPrefix={`lesson-slot-mobile-${p.lesson.id}-${p.classId}`}
            options={p.slotOptions}
            assignedSlots={p.slots}
            now={p.now}
            suggestCurrentSlot={p.suggestCurrentSlot}
            onAdd={p.onAddSlot}
            mobile
          />
        </div>
        <select value={p.progress.status} onChange={(event) => p.onSetStatus(event.target.value as LessonProgress['status'])} className={clsx('min-h-11 rounded-lg border-0 px-3 text-sm font-semibold ring-1 ring-inset ring-black/5', STATUS_BADGE_CLASSES[p.progress.status])}>
          {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <div className="flex justify-end gap-1">
          {p.lesson.teacherPlan && <Button size="sm" variant="ghost" onClick={p.onShowPlan}>Plan</Button>}
          {lessonFilmIds(p.lesson).length > 0 && <Button size="sm" variant="ghost" onClick={p.onShowFilm}>Film</Button>}
          <Button size="sm" variant="secondary" onClick={() => navigate(`/lekcje/${p.lesson.id}/pokaz/${p.classId}?${query}`)}>Pokaż</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/lekcje/${p.lesson.id}/edytuj?${query}`)}>Edytuj</Button>
        </div>
      </div>
    </article>
  );
}
