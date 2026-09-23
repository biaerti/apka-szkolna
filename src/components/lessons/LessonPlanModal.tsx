// "Plan" przy lekcji: sciagawka nauczyciela - co czytamy, o czym powiedziec,
// jak wyjasnic, co narysowac na tablicy i jaka notatka zamyka lekcje. Okno
// otwiera sie z listy lekcji (takze na telefonie), nigdy na ekranie
// prezentacji - projektor jest zwykle powielonym ekranem laptopa.

import type { Lesson } from '../../data/types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RichText } from '../slides/RichText';

export function LessonPlanModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Plan lekcji"
      widthClassName="max-w-2xl"
      footer={<Button onClick={onClose}>Zamknij</Button>}
    >
      <p className="mb-3 text-sm text-gray-500">
        {lesson.code && <span className="mr-1.5 font-semibold tabular-nums text-gray-600">{lesson.code}</span>}
        {lesson.title}
      </p>
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <RichText
          text={lesson.teacherPlan ?? ''}
          className="space-y-2 text-sm leading-6 text-gray-800 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:text-gray-950 [&_h3]:mt-3 [&_ol]:block [&_ul]:block [&_ol]:pl-5 [&_ul]:pl-5"
        />
      </div>
    </Modal>
  );
}
