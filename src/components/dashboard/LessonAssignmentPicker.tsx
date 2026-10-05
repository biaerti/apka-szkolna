import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Lesson } from '../../data/types';
import { lessonProgress } from '../../lib/grade';
import { lessonSections } from '../../lib/lessonMaterial';
import { slotsFromProgress } from '../../lib/lessonSlots';

interface Props {
  lessons: Lesson[];
  classId: string;
  selectedLessonId?: string;
  onSelect: (lessonId: string) => void;
  onClear?: () => void;
  onClose: () => void;
}

export function LessonAssignmentPicker({ lessons, classId, selectedLessonId, onSelect, onClear, onClose }: Props) {
  const sections = useMemo(() => lessonSections(lessons), [lessons]);
  const suggested = lessons.find((lesson) => lessonProgress(lesson, classId).status === 'planned')
    ?? lessons.find((lesson) => lessonProgress(lesson, classId).status === 'in_progress')
    ?? lessons[0];
  const suggestedSection = sections.find((section) => section.lessons.some((lesson) => lesson.id === suggested?.id));
  const selectedSection = sections.find((section) => section.lessons.some((lesson) => lesson.id === selectedLessonId));
  const [activeKey, setActiveKey] = useState(selectedSection?.key ?? suggestedSection?.key ?? sections[0]?.key ?? '');
  const active = sections.find((section) => section.key === activeKey) ?? sections[0];

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-accent-200 bg-white shadow-[0_10px_24px_-18px_rgba(30,41,59,0.55)]">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-3 py-2.5">
        <div>
          <p className="text-sm font-semibold text-gray-950">Wybierz temat</p>
          <p className="text-xs text-gray-500">Najpierw dział, potem lekcja</p>
        </div>
        <button type="button" onClick={onClose} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
          Zamknij
        </button>
      </div>

      <div className="overflow-x-auto border-b border-gray-200 p-2">
        <div role="tablist" aria-label="Dział materiału" className="flex min-w-max gap-1 rounded-lg bg-gray-100 p-1">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              role="tab"
              aria-selected={section.key === active?.key}
              onClick={() => setActiveKey(section.key)}
              className={clsx(
                'min-h-10 rounded-md px-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-500',
                section.key === active?.key ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {section.label} <span className="ml-1 tabular-nums text-gray-400">{section.lessons.length}</span>
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" className="max-h-80 overflow-y-auto p-2">
        <div className="space-y-1">
          {active?.lessons.map((lesson) => {
            const progress = lessonProgress(lesson, classId);
            const slots = slotsFromProgress(progress);
            const selected = lesson.id === selectedLessonId;
            const suggestedNext = lesson.id === suggested?.id;
            const muted = progress.status === 'done' || slots.length > 0;
            let state: string | null = null;
            if (selected) state = 'Wybrana tutaj';
            else if (progress.status === 'done') state = 'Zrobiona';
            else if (progress.status === 'in_progress') state = slots.length > 0 ? `W trakcie · ponownie będzie cz. ${slots.length + 1}` : 'W trakcie';
            else if (slots.length > 0) state = `W planie · ponownie będzie cz. ${slots.length + 1}`;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelect(lesson.id)}
                className={clsx(
                  'flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-500',
                  selected ? 'bg-accent-100 text-accent-950' : 'hover:bg-gray-50',
                  muted && !selected && 'text-gray-500',
                )}
              >
                <span className={clsx('w-10 shrink-0 text-xs font-semibold tabular-nums', selected ? 'text-accent-700' : 'text-gray-400')}>{lesson.code ?? '–'}</span>
                <span className="min-w-0 flex-1">
                  <span className={clsx('block text-sm font-semibold leading-5', muted && !selected ? 'text-gray-500' : 'text-gray-900')}>{lesson.title}</span>
                  {state && <span className="mt-0.5 block text-xs text-gray-500">{state}</span>}
                </span>
                {suggestedNext && !selected && <span className="shrink-0 rounded-full bg-accent-50 px-2 py-1 text-[11px] font-semibold text-accent-700">Następna</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedLessonId && onClear && (
        <div className="border-t border-gray-200 p-2">
          <button type="button" onClick={onClear} className="min-h-11 w-full rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
            Usuń temat z tej godziny
          </button>
        </div>
      )}
    </div>
  );
}
