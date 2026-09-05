// Jeden wiersz listy lekcji rocznika, ogladany z perspektywy jednej klasy
// (status i "Pokaz" dotycza tej klasy). Kolejnosc zmienia sie przeciaganiem za
// uchwyt; wersja klawiaturowa ("wyzej/nizej") siedzi w menu "wiecej".
// Zestaw pytan do kola jest czescia wiersza, nie osobna lista - nauczyciel
// mysli "powtorka z tego tematu", nie "zestaw nr 3".

import { useRef, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import type { Lesson, LessonProgress } from '../../data/types';
import { Button } from '../ui/Button';
import { Menu, type MenuItem } from '../ui/Menu';
import { GripIcon, MoreIcon } from '../ui/icons';
import { TD } from '../ui/Table';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './lessonStatus';
import { copyToClipboard } from '../../lib/clipboard';

export interface LessonRowProps {
  lesson: Lesson;
  classId: string;
  progress: LessonProgress;
  index: number;
  total: number;
  questionCount: number | null; // null = lekcja nie ma zestawu pytan
  dropIndicator: 'above' | 'below' | null;
  onDragStart: () => void;
  onDragOver: (position: 'above' | 'below') => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onSetStatus: (status: LessonProgress['status']) => void;
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

  async function copyRegister() {
    const text = curriculum.length > 0 ? `${registerTopic}\nKody: ${curriculum.join(', ')}` : registerTopic;
    await copyToClipboard(text);
  }

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
      <TD className="!px-1 tabular-nums text-gray-400">{index + 1}</TD>
      <TD>
        <p className={clsx('truncate font-medium', isSkipped ? 'text-gray-500 line-through' : 'text-gray-900')}>
          {lesson.title}
        </p>
        <p className="mt-0.5 flex items-center gap-x-1.5 text-xs text-gray-500">
          <span className="shrink-0 tabular-nums">{plural(lesson.slides.length, 'slajd', 'slajdy', 'slajdów')}</span>
          <span aria-hidden="true">·</span>
          {questionCount === null ? (
            <button type="button" onClick={p.onAddQuestions} className="shrink-0 text-accent-600 hover:underline">
              dodaj pytania do koła
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/pytania/${lesson.questionSetId}?lekcja=${lesson.id}`)}
              className="shrink-0 text-accent-600 hover:underline"
            >
              <span className="tabular-nums">{plural(questionCount, 'pytanie', 'pytania', 'pytań')}</span> w kole
            </button>
          )}
          <span aria-hidden="true">·</span>
          <span className="min-w-0 flex-1 truncate" title={registerTopic}>
            Dziennik: {registerTopic}
            {curriculum.length > 0 ? ` (${curriculum.join(', ')})` : ''}
          </span>
          <button type="button" onClick={copyRegister} className="shrink-0 text-accent-600 hover:underline">
            Kopiuj
          </button>
        </p>
      </TD>
      <TD className="whitespace-nowrap">
        <span
          className={clsx('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', STATUS_BADGE_CLASSES[progress.status])}
          title={isDone && progress.doneDate ? `Zrobiona ${progress.doneDate}` : undefined}
        >
          {STATUS_LABELS[progress.status]}
        </span>
      </TD>
      <TD className="whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/pokaz/${classId}`)}>
            Pokaż
          </Button>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj?klasa=${classId}`)}>
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
