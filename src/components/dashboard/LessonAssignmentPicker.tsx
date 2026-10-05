import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Lesson } from '../../data/types';
import { lessonProgress } from '../../lib/grade';
import { lessonSections } from '../../lib/lessonMaterial';
import { slotsFromProgress } from '../../lib/lessonSlots';
import { Modal } from '../ui/Modal';

// Ostatnio otwarty dzial, osobno dla rocznika (kl. 4 i 5 maja inne dzialy):
// jak Bartek jest w Rozdziale I, picker otwiera sie od razu tam.
const SECTION_KEY = 'apka-szkolna-temat-dzial';

function readSection(grade: string): string | null {
  try {
    return (JSON.parse(localStorage.getItem(SECTION_KEY) ?? '{}') as Record<string, string>)[grade] ?? null;
  } catch {
    return null;
  }
}

function rememberSection(grade: string, key: string) {
  try {
    const all = JSON.parse(localStorage.getItem(SECTION_KEY) ?? '{}') as Record<string, string>;
    localStorage.setItem(SECTION_KEY, JSON.stringify({ ...all, [grade]: key }));
  } catch {
    /* bez pamieci picker otworzy sie na dziale wybranej albo nastepnej lekcji */
  }
}

interface Props {
  /** Np. "IV B · wtorek 6.10 · 1. lekcja". */
  label: string;
  lessons: Lesson[];
  classId: string;
  selectedLessonId?: string;
  onSelect: (lessonId: string) => void;
  onClear?: () => void;
  onClose: () => void;
}

export function LessonAssignmentPicker({ label, lessons, classId, selectedLessonId, onSelect, onClear, onClose }: Props) {
  const grade = lessons[0]?.grade ?? '';
  const sections = useMemo(() => lessonSections(lessons), [lessons]);
  const suggested = lessons.find((lesson) => lessonProgress(lesson, classId).status === 'planned')
    ?? lessons.find((lesson) => lessonProgress(lesson, classId).status === 'in_progress')
    ?? lessons[0];
  const suggestedSection = sections.find((section) => section.lessons.some((lesson) => lesson.id === suggested?.id));
  const selectedSection = sections.find((section) => section.lessons.some((lesson) => lesson.id === selectedLessonId));
  const remembered = sections.find((section) => section.key === readSection(grade));
  const [activeKey, setActiveKey] = useState(selectedSection?.key ?? remembered?.key ?? suggestedSection?.key ?? sections[0]?.key ?? '');
  const active = sections.find((section) => section.key === activeKey) ?? sections[0];

  function openSection(key: string) {
    setActiveKey(key);
    rememberSection(grade, key);
  }

  function select(lessonId: string) {
    if (active) rememberSection(grade, active.key);
    onSelect(lessonId);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Wybierz temat · ${label}`}
      widthClassName="max-w-2xl"
      footer={
        <>
          {selectedLessonId && onClear && (
            <button type="button" onClick={onClear} className="mr-auto rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
              Usuń temat z tej godziny
            </button>
          )}
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            Zamknij
          </button>
        </>
      }
    >
      <div className="-mx-1 mb-3">
        <div role="tablist" aria-label="Dział materiału" className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              role="tab"
              aria-selected={section.key === active?.key}
              onClick={() => openSection(section.key)}
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

      <div role="tabpanel" className="-mx-2 max-h-[60vh] overflow-y-auto px-1">
        <div className="space-y-1">
          {active?.lessons.map((lesson) => {
            const progress = lessonProgress(lesson, classId);
            const slots = slotsFromProgress(progress);
            const selected = lesson.id === selectedLessonId;
            const suggestedNext = lesson.id === suggested?.id;
            // Juz byla w tej klasie (zrobiona, w trakcie, pominieta albo ma godzine
            // w planie) - wyszarzona, zeby do wyboru wyrozniały sie te jeszcze nieruszone.
            const muted = progress.status !== 'planned' || slots.length > 0;
            let state: string | null = null;
            if (selected) state = 'Wybrana tutaj';
            else if (progress.status === 'done') state = 'Zrobiona';
            else if (progress.status === 'skipped') state = 'Pominięta';
            else if (progress.status === 'in_progress') state = slots.length > 0 ? `W trakcie · ponownie będzie cz. ${slots.length + 1}` : 'W trakcie';
            else if (slots.length > 0) state = `W planie · ponownie będzie cz. ${slots.length + 1}`;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => select(lesson.id)}
                className={clsx(
                  'flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-500',
                  selected ? 'bg-accent-100 text-accent-950' : 'hover:bg-gray-50',
                )}
              >
                <span className={clsx('w-10 shrink-0 text-xs font-semibold tabular-nums', selected ? 'text-accent-700' : muted ? 'text-gray-300' : 'text-gray-400')}>{lesson.code ?? '–'}</span>
                <span className="min-w-0 flex-1">
                  <span className={clsx('block text-sm leading-5', muted && !selected ? 'font-normal text-gray-400' : 'font-semibold text-gray-900')}>{lesson.title}</span>
                  {state && <span className={clsx('mt-0.5 block text-xs', muted && !selected ? 'text-gray-400' : 'text-gray-500')}>{state}</span>}
                </span>
                {suggestedNext && !selected && <span className="shrink-0 rounded-full bg-accent-50 px-2 py-1 text-[11px] font-semibold text-accent-700">Następna</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
