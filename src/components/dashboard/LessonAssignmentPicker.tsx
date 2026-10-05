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
  /** Checkbox "juz byla" - zrobiona w tej klasie albo z powrotem do zrobienia. */
  onToggleDone: (lessonId: string, done: boolean) => void;
  onClose: () => void;
}

export function LessonAssignmentPicker({ label, lessons, classId, selectedLessonId, onSelect, onClear, onToggleDone, onClose }: Props) {
  const grade = lessons[0]?.grade ?? '';
  const sections = useMemo(() => lessonSections(lessons), [lessons]);
  // Bez zapamietanego dzialu otwieramy dzial pierwszej lekcji, ktora jeszcze nie byla.
  const suggested = lessons.find((lesson) => lessonProgress(lesson, classId).status !== 'done') ?? lessons[0];
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
        <div className="space-y-0.5">
          {active?.lessons.map((lesson) => {
            const progress = lessonProgress(lesson, classId);
            const slots = slotsFromProgress(progress);
            const selected = lesson.id === selectedLessonId;
            // Checkbox "juz byla" = status zrobiona. Zaznaczonej nie da sie
            // wybrac na godzine - trzeba ja najpierw odznaczyc.
            const done = progress.status === 'done';
            const locked = done && !selected;
            const note = selected ? 'wybrana tutaj' : !done && slots.length > 0 ? `będzie cz. ${slots.length + 1}` : null;

            return (
              <div
                key={lesson.id}
                className={clsx('flex min-h-11 items-center gap-1 rounded-lg', selected ? 'bg-accent-100' : !locked && 'hover:bg-gray-50')}
              >
                <label className="flex shrink-0 cursor-pointer items-center self-stretch pl-3 pr-1" title={done ? 'Już była - odznacz, żeby znów dało się wybrać' : 'Zaznacz, jeśli już była'}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={(event) => onToggleDone(lesson.id, event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-500 focus:ring-accent-500"
                    aria-label={`${lesson.title} - już była`}
                  />
                </label>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => select(lesson.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 self-stretch rounded-lg px-2 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-500 disabled:cursor-default"
                >
                  <span className={clsx('w-10 shrink-0 text-xs tabular-nums', locked ? 'text-gray-300' : selected ? 'font-semibold text-accent-700' : 'text-gray-400')}>{lesson.code ?? '–'}</span>
                  <span className={clsx('min-w-0 flex-1 text-sm leading-5', locked ? 'text-gray-400 line-through decoration-gray-300' : 'font-medium text-gray-900')}>{lesson.title}</span>
                  {note && <span className={clsx('shrink-0 text-xs', selected ? 'text-accent-700' : 'text-gray-500')}>{note}</span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
