// "Plan" przy lekcji: sciagawka nauczyciela - co czytamy, o czym powiedziec,
// jak wyjasnic, co narysowac na tablicy i jaka notatka zamyka lekcje. Okno
// otwiera sie z listy lekcji (takze na telefonie), nigdy na ekranie
// prezentacji - projektor jest zwykle powielonym ekranem laptopa.
// Plan da sie tez poprawic na miejscu, bez wchodzenia w edytor lekcji.

import { useState } from 'react';
import type { Lesson } from '../../data/types';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RichText } from '../slides/RichText';

export function LessonPlanModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  // Zmiana planu NIE oznacza lekcji jako edytowanej recznie - inaczej automat
  // przestalby ja odswiezac. Plan nauczyciela przetrwa odswiezenie, gdy kod
  // nie ma wlasnego planu (useReadyMaterials.applyRefresh).
  const updateLesson = useStore((s) => s.updateLesson);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lesson.teacherPlan ?? '');

  function save() {
    updateLesson(lesson.id, { teacherPlan: draft.trim() || undefined });
    setEditing(false);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Plan lekcji"
      widthClassName="max-w-2xl"
      footer={
        editing ? (
          <>
            <Button variant="secondary" onClick={() => { setDraft(lesson.teacherPlan ?? ''); setEditing(false); }}>
              Anuluj
            </Button>
            <Button onClick={save}>Zapisz</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setEditing(true)}>Edytuj</Button>
            <Button onClick={onClose}>Zamknij</Button>
          </>
        )
      }
    >
      <p className="mb-3 text-sm text-gray-500">
        {lesson.code && <span className="mr-1.5 font-semibold tabular-nums text-gray-600">{lesson.code}</span>}
        {lesson.title}
      </p>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={18}
          autoFocus
          placeholder="Co czytamy, o czym powiedzieć, jak wyjaśnić, co narysować na tablicy."
          className="max-h-[70vh] w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-6 shadow-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
        />
      ) : (
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <RichText
            text={lesson.teacherPlan ?? ''}
            className="space-y-2 text-sm leading-6 text-gray-800 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:text-gray-950 [&_h3]:mt-3 [&_ol]:block [&_ul]:block [&_ol]:pl-5 [&_ul]:pl-5"
          />
        </div>
      )}
    </Modal>
  );
}
