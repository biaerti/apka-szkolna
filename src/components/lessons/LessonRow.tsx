// Jeden wiersz listy lekcji rocznika, ogladany z perspektywy jednej klasy
// (status i "Pokaz" dotycza tej klasy). Kolejnosc zmienia sie przeciaganiem za
// uchwyt; wersja klawiaturowa ("wyzej/nizej") siedzi w menu "wiecej".
// Zestaw pytan do kola jest czescia wiersza, nie osobna lista - nauczyciel
// mysli "powtorka z tego tematu", nie "zestaw nr 3".

import { useRef, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import type { Lesson, LessonPeriod, LessonProgress, LessonSlot } from '../../data/types';
import { Button } from '../ui/Button';
import { Menu, type MenuItem } from '../ui/Menu';
import { GripIcon, MoreIcon, WheelIcon } from '../ui/icons';
import { TD } from '../ui/Table';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './lessonStatus';
import { resolveRecapMode } from '../../lib/recap';
import { lessonMaterialType } from '../../lib/lessonMaterial';
import { isCurrentSlot, slotDisplayLabel, type LessonSlotOption } from '../../lib/lessonSlots';
import { LessonSlotPicker } from './LessonSlotPicker';

export interface LessonRowProps {
  lesson: Lesson;
  classId: string;
  progress: LessonProgress;
  index: number;
  total: number;
  questionCount: number | null; // null = lekcja nie ma zestawu pytan
  displayCode?: string;
  dropIndicator: 'above' | 'below' | null;
  onDragStart: () => void;
  onDragOver: (position: 'above' | 'below') => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onSetStatus: (status: LessonProgress['status']) => void;
  slots: LessonSlot[];
  slotOptions: LessonSlotOption[];
  periods: LessonPeriod[];
  now: Date;
  currentSlotId?: string;
  suggestCurrentSlot: boolean;
  onAddSlot: (slot: LessonSlot) => void;
  onRemoveSlot: (slotId: string) => void;
  onShowRegister: () => void;
  onShowPlan: () => void;
  onShowQuestions: () => void;
  onAddQuestions: () => void;
  onDuplicate: () => void;
  onCopyToGrade: (() => void) | null;
  onRemove: () => void;
}

export function LessonRow(p: LessonRowProps) {
  const { lesson, classId, progress, index, total, questionCount } = p;
  const navigate = useNavigate();
  const dragFromHandle = useRef(false);
  const registerTopic = lesson.registerTopic || lesson.title;
  const curriculum = lesson.curriculum ?? [];
  // Temat do dziennika rowny tytulowi (bez numeru z podrecznika) nic nie wnosi
  // w wierszu - zostaje w oknie z menu "wiecej".
  const bezNumeru = (t: string) => t.replace(/^[\d-]+\.\s*/, '');
  const pokazDziennik = curriculum.length > 0 || bezNumeru(registerTopic) !== bezNumeru(lesson.title);
  // Lekcja zapoznawcza: jej kolo to tryb 'demo' (patrz resolveRecapMode) - nie
  // ma z czego robic powtorki na ocene.
  const isIntroLesson = lesson.slides.some((s) => s.kind === 'recap' && resolveRecapMode(s) === 'demo');
  const listQuery = `klasa=${classId}&typ=${lessonMaterialType(lesson)}`;
  const isTextbook = lessonMaterialType(lesson) === 'textbook';
  const rowIsNow = Boolean(p.currentSlotId && p.slots.some((slot) => slot.id === p.currentSlotId));

  function handleDragStart(e: DragEvent<HTMLTableRowElement>) {
    if (!dragFromHandle.current) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', lesson.id);
    p.onDragStart();
  }

  function handleDragOver(e: DragEvent<HTMLTableRowElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    p.onDragOver(e.clientY < rect.top + rect.height / 2 ? 'above' : 'below');
  }

  const isDone = progress.status === 'done';
  const isSkipped = progress.status === 'skipped';
  const menu: MenuItem[] = [
    isDone || isSkipped
      ? { label: 'Przywróć do zrobienia', onSelect: () => p.onSetStatus('planned') }
      : { label: 'Oznacz jako zrobioną', onSelect: () => p.onSetStatus('done') },
    ...(!isDone && !isSkipped ? [{ label: 'Pomiń w tej klasie', onSelect: () => p.onSetStatus('skipped') }] : []),
    'separator',
    // Podglad "co ta lekcja ma" bez wchodzenia w edytor: temat i kody do
    // dziennika (do skopiowania) oraz pytania w dwoch grupach (Z1..., PZ1...).
    { label: 'Kody podstawy programowej', onSelect: p.onShowRegister, hint: 'Temat do dziennika i kody - do skopiowania' },
    { label: 'Zestaw pytań', onSelect: p.onShowQuestions, hint: 'Zadania z lekcji i pytania powtórzeniowe' },
    'separator',
    { label: 'Przesuń wyżej', onSelect: () => p.onMove('up'), disabled: index === 0 },
    { label: 'Przesuń niżej', onSelect: () => p.onMove('down'), disabled: index === total - 1 },
    'separator',
    { label: 'Duplikuj', onSelect: p.onDuplicate },
    ...(p.onCopyToGrade ? [{ label: 'Skopiuj do innego rocznika', onSelect: p.onCopyToGrade }] : []),
    'separator',
    { label: 'Usuń lekcję', onSelect: p.onRemove, danger: true, hint: 'Dla wszystkich klas rocznika' },
  ];

  return (
    <tr
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.preventDefault();
        p.onDrop();
      }}
      onDragEnd={() => {
        dragFromHandle.current = false;
        p.onDragEnd();
      }}
      className={clsx(
        'group relative transition-colors',
        p.dropIndicator === 'above' && 'shadow-[inset_0_2px_0_0_#4f46e5]',
        p.dropIndicator === 'below' && 'shadow-[inset_0_-2px_0_0_#4f46e5]',
        rowIsNow && 'bg-accent-50/70',
        isSkipped && 'text-gray-400',
      )}
    >
      <TD className="!px-1 text-gray-300">
        <button
          type="button"
          aria-label="Przeciągnij, aby zmienić kolejność"
          title="Przeciągnij, aby zmienić kolejność"
          onMouseDown={() => {
            dragFromHandle.current = true;
          }}
          className="flex h-7 w-6 cursor-grab items-center justify-center rounded text-gray-300 hover:bg-gray-100 hover:text-gray-500 active:cursor-grabbing"
        >
          <GripIcon />
        </button>
      </TD>
      {/* Kod lekcji ("4.3") - ten sam, ktory dzieci maja w zeszytach. */}
      <TD className="!px-1 whitespace-nowrap tabular-nums text-gray-500">{p.displayCode ?? lesson.code ?? index + 1}</TD>
      <TD>
        <p className={clsx('truncate font-medium', isSkipped ? 'text-gray-500 line-through' : 'text-gray-900')}>
          {lesson.title}
        </p>
        <p className="mt-0.5 flex items-center gap-x-1.5 text-xs text-gray-500">
          {/* Plan dla nauczyciela: co czytamy, jak wyjasnic, co na tablicy. */}
          {lesson.teacherPlan && (
            <>
              <button
                type="button"
                onClick={p.onShowPlan}
                title="Co czytamy, jak wyjaśnić, co na tablicy - tylko dla ciebie"
                className="shrink-0 rounded border border-accent-200 bg-accent-50 px-1.5 py-0.5 font-medium text-accent-700 hover:bg-accent-100"
              >
                Plan lekcji
              </button>
              <span aria-hidden="true">·</span>
            </>
          )}
          {lesson.textbookPage && (
            <>
              <span className="shrink-0 font-medium text-gray-600">Podręcznik s. {lesson.textbookPage}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          {!isTextbook && <><span className="shrink-0 tabular-nums">{plural(lesson.slides.length, 'slajd', 'slajdy', 'slajdów')}</span><span aria-hidden="true">·</span></>}
          {questionCount === null ? (
            <button type="button" onClick={p.onAddQuestions} className="shrink-0 text-accent-600 hover:underline">
              dodaj pytania do koła
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate(`/pytania/${lesson.questionSetId}?lekcja=${lesson.id}`)}
                className="shrink-0 text-accent-600 hover:underline"
              >
                <span className="tabular-nums">{plural(questionCount, 'pytanie', 'pytania', 'pytań')}</span> w kole
              </button>
              {questionCount > 0 && !isIntroLesson && (
                <>
                  {/* Kolo POWTORZENIOWE - pytania z tej lekcji, pelne ocenianie, na
                      poczatku nastepnej lekcji (patrz src/lib/recap.ts). Dawny przycisk
                      "Kolo" (tryb po-lekcji) USUNIETY - kolo na lekcji kreci sie ze
                      slajdu zadania w prezentacji, nie z listy lekcji. Ukryte tylko dla
                      lekcji zapoznawczej (kolo demo / "Przedstaw się" - powtorka na
                      ocene z pytan "Poznajmy się" nie ma sensu). */}
                  <button
                    type="button"
                    onClick={() => navigate(`/powtorka/${classId}/${lesson.questionSetId}?tryb=powtorzeniowe`)}
                    title="Uruchom koło powtórzeniowe (pełne ocenianie) z tymi pytaniami"
                    aria-label="Uruchom koło powtórzeniowe"
                    className="inline-flex shrink-0 items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-gray-600 hover:bg-gray-100"
                  >
                    <WheelIcon className="shrink-0" />
                    Koło powt.
                  </button>
                </>
              )}
            </>
          )}
          {/* Skrot do dziennika: podglad w wierszu, a pelny temat i kody (do
              zaznaczenia i skopiowania) w oknie z menu "wiecej". */}
          {pokazDziennik && (
            <>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={p.onShowRegister}
                title="Pokaż temat do dziennika i kody podstawy programowej"
                className="min-w-0 flex-1 truncate text-left hover:text-accent-700 hover:underline"
              >
                Dziennik: {registerTopic}
                {curriculum.length > 0 ? ` (${curriculum.join(', ')})` : ''}
              </button>
            </>
          )}
        </p>
      </TD>
      <TD>
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {p.slots.map((slot, slotIndex) => {
            const now = isCurrentSlot(slot, p.periods, p.now);
            return (
              <div key={slot.id} className={clsx('inline-flex min-h-8 items-stretch overflow-hidden rounded-md border text-xs font-medium', now ? 'border-accent-300 bg-accent-100 text-accent-900' : 'border-gray-200 bg-gray-50 text-gray-700')}>
                <button type="button" onClick={() => navigate(`/dziennik?data=${slot.date}&lekcja=${slot.period}&klasa=${classId}&material=${lesson.id}`)} className="px-2 py-1 hover:bg-black/5">
                  {now ? 'Teraz' : slotDisplayLabel(slot, p.periods, p.now)}{slotIndex > 0 ? ` · cz. ${slotIndex + 1}` : ''}
                </button>
                <button type="button" onClick={() => p.onRemoveSlot(slot.id)} aria-label={`Usuń slot ${slotDisplayLabel(slot, p.periods, p.now)}`} className="border-l border-current/15 px-1.5 py-1 text-[10px] opacity-60 hover:bg-black/5 hover:opacity-100">
                  Usuń
                </button>
              </div>
            );
          })}
          <LessonSlotPicker
            idPrefix={`lesson-slot-${lesson.id}-${classId}`}
            options={p.slotOptions}
            assignedSlots={p.slots}
            now={p.now}
            suggestCurrentSlot={p.suggestCurrentSlot}
            onAdd={p.onAddSlot}
          />
        </div>
      </TD>
      <TD className="whitespace-nowrap">
        <label className="sr-only" htmlFor={`lesson-status-${lesson.id}-${classId}`}>Status lekcji: {lesson.title}</label>
        <select
          id={`lesson-status-${lesson.id}-${classId}`}
          value={progress.status}
          onChange={(event) => p.onSetStatus(event.target.value as LessonProgress['status'])}
          title={isDone && progress.doneDate ? `Zrobiona ${progress.doneDate}` : 'Zmień status dla tej klasy'}
          className={clsx(
            'w-28 cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ring-1 ring-inset ring-black/5 focus:ring-2 focus:ring-accent-500',
            STATUS_BADGE_CLASSES[progress.status],
          )}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </TD>
      <TD className="whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          {isTextbook && (
            <Button size="sm" variant="ghost" onClick={() => navigate(`/lekcje/notatki/druk?id=${lesson.id}&klasa=${classId}&copies=50`)}>
              Notatka A5
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/pokaz/${classId}?${listQuery}`)}>Pokaż</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj?${listQuery}`)}>
            Edytuj
          </Button>
          <Menu
            items={menu}
            renderTrigger={(props) => (
              <button
                type="button"
                {...props}
                aria-label={`Więcej akcji: ${lesson.title}`}
                title="Więcej"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                <MoreIcon />
              </button>
            )}
          />
        </div>
      </TD>
    </tr>
  );
}

/** Polska liczba mnoga: 1 slajd, 2-4 slajdy, 5+ slajdow (z wyjatkiem 12-14). */
export function plural(n: number, one: string, few: string, many: string): string {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return `1 ${one}`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}
