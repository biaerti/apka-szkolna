import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Lesson, LessonSlot } from '../../data/types';
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

const WEEKDAY_SHORT = ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];

function shortDate(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${day}.${String(month).padStart(2, '0')}`;
}

function slotLabel(slot: LessonSlot): string {
  return `${WEEKDAY_SHORT[new Date(`${slot.date}T12:00:00`).getDay()]} ${shortDate(slot.date)} · ${slot.period}. lek.`;
}

interface Props {
  /** Np. "IV B · wtorek 6.10 · 1. lekcja". */
  label: string;
  /** Godzina, na ktora wybieramy ("RRRR-MM-DD-N", jak LessonSlot.id). */
  slotId: string;
  lessons: Lesson[];
  classId: string;
  selectedLessonId?: string;
  onSelect: (lessonId: string) => void;
  onClear?: () => void;
  onClose: () => void;
}

export function LessonAssignmentPicker({ label, slotId, lessons, classId, selectedLessonId, onSelect, onClear, onClose }: Props) {
  const grade = lessons[0]?.grade ?? '';
  const sections = useMemo(() => lessonSections(lessons), [lessons]);
  // Bez zapamietanego dzialu otwieramy dzial pierwszej lekcji, ktora jeszcze nie byla.
  const suggested = lessons.find((lesson) => {
    const progress = lessonProgress(lesson, classId);
    return progress.status !== 'done' && slotsFromProgress(progress).length === 0;
  }) ?? lessons[0];
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
            const elsewhere = slots.filter((slot) => slot.id !== slotId);
            // Juz byla (godzina na planie albo zrobiona na stronie Lekcje) - szara,
            // ale dalej do klikniecia: wtedy wchodzi jako kolejna czesc.
            const used = elsewhere.length > 0 || progress.status === 'done';
            const muted = used && !selected;
            const where = elsewhere.length > 0
              ? elsewhere.map(slotLabel).join(', ')
              : progress.status === 'done' ? `zrobiona${progress.doneDate ? ` ${shortDate(progress.doneDate)}` : ''}` : '';
            const nextPart = selected ? slots.findIndex((slot) => slot.id === slotId) + 1 : slots.length + 1;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => select(lesson.id)}
                className={clsx(
                  'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-500',
                  selected ? 'bg-accent-100' : 'hover:bg-gray-50',
                )}
              >
                <span className={clsx('w-10 shrink-0 text-xs tabular-nums', selected ? 'font-semibold text-accent-700' : muted ? 'text-gray-300' : 'text-gray-400')}>{lesson.code ?? '–'}</span>
                <span className={clsx('min-w-0 flex-1 text-sm leading-5', muted ? 'text-gray-400' : 'font-medium text-gray-900')}>
                  {lesson.title}
                  {selected && nextPart > 1 && <span className="ml-1 text-accent-700">cz. {nextPart}</span>}
                </span>
                <span className={clsx('shrink-0 text-right text-xs leading-4', selected ? 'text-accent-700' : 'text-gray-400')}>
                  {selected ? 'tutaj' : where}
                  {muted && elsewhere.length > 0 && <span className="block text-gray-500">wybierz → cz. {nextPart}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
