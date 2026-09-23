// "Film" przy lekcji: szybki podglad filmiku lekcyjnego bez wchodzenia w
// prezentacje - jedno klikniecie z listy lekcji mowi tez od razu, ktory temat
// w ogole ma film. W prezentacji ten sam mp4 gra slajd `video`.

import { useEffect, useState } from 'react';
import type { Lesson } from '../../data/types';
import { filmikById, filmikUrl } from '../../data/filmiki';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

/** Slajdy `video` lekcji z wybranym filmem - to od nich zalezy, czy pokazujemy przycisk "Film". */
export function lessonFilmIds(lesson: Lesson): string[] {
  return lesson.slides.flatMap((slide) => (slide.kind === 'video' && slide.videoId ? [slide.videoId] : []));
}

function Filmik({ videoId }: { videoId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    filmikUrl(videoId)
      .then((next) => {
        if (!cancelled) setUrl(next);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const title = filmikById(videoId)?.title;
  return (
    <div>
      {title && <p className="mb-1.5 text-sm font-medium text-gray-700">{title}</p>}
      {url ? (
        <video src={url} controls preload="metadata" className="w-full rounded-lg bg-black" />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500">
          {error ?? 'Ładuję film...'}
        </div>
      )}
    </div>
  );
}

export function LessonFilmModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Film do lekcji"
      widthClassName="max-w-2xl"
      footer={<Button onClick={onClose}>Zamknij</Button>}
    >
      <p className="mb-3 text-sm text-gray-500">
        {lesson.code && <span className="mr-1.5 font-semibold tabular-nums text-gray-600">{lesson.code}</span>}
        {lesson.title}
      </p>
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        {lessonFilmIds(lesson).map((videoId) => (
          <Filmik key={videoId} videoId={videoId} />
        ))}
      </div>
    </Modal>
  );
}
