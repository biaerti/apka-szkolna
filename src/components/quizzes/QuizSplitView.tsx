// Widok projektora "pytanie | odpowiedź" (klawisz P na pokazie kartkówki):
// kartka 1280x720 skalowana transformem jak slajdy lekcji, z lewej pytanie, z
// prawej pole na odpowiedź. Po kartce pisze się narzędziami adnotacji - wejście
// w ten widok włącza od razu narzędzie "Tekst", więc klik w prawą połowę
// otwiera pole, a Enter zapisuje. Notatki trzymają się pytania: strzałka w
// prawo i powrót pokazują to, co było napisane.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { QuizQuestion } from '../../data/types';
import { SLIDE_H, SLIDE_W, fitFontSize } from '../slides/fitText';
import { useSlideFontScale } from '../slides/useSlideFontScale';
import { AnnotationLayer } from '../slides/AnnotationLayer';
import type { SlideAnnotations } from '../slides/useSlideAnnotations';
import { pointsLabel, questionPoints } from '../../lib/quiz';

export function QuizSplitView({
  question,
  index,
  total,
  showAnswers,
  ann,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  showAnswers: boolean;
  ann: SlideAnnotations;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const fontScale = useSlideFontScale();

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const update = () => {
      const next = Math.min(element.clientWidth / SLIDE_W, element.clientHeight / SLIDE_H);
      setScale(next > 0 ? next : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fontSize = useMemo(
    () => fitFontSize(question.text, { width: 540, height: 500, min: 28, max: 68, scale: fontScale, lineHeight: 1.3 }),
    [question.text, fontScale],
  );

  return (
    <div ref={frameRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="relative overflow-hidden" style={{ width: SLIDE_W * scale, height: SLIDE_H * scale }}>
        <div
          className="absolute left-0 top-0 flex overflow-hidden bg-gray-950 text-gray-100"
          style={{ width: SLIDE_W, height: SLIDE_H, transformOrigin: 'top left', transform: `scale(${scale})` }}
        >
          <div className="flex w-1/2 flex-col justify-center px-12 py-10">
            <p className="mb-4 text-[26px] font-medium text-accent-300">
              {index + 1} / {total}
              <span className="ml-4 text-gray-500">{pointsLabel(questionPoints(question))}</span>
            </p>
            <p className="whitespace-pre-line" style={{ fontSize, lineHeight: 1.3 }}>
              {question.text}
            </p>
            {showAnswers && question.answer && (
              <p className="mt-6 text-[30px] text-emerald-300">Odp.: {question.answer}</p>
            )}
          </div>
          <div className="relative w-1/2 border-l border-gray-800">
            {/* Kropkowana podkładka jak na tablicy - widać, że ta połowa jest do pisania. */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(156,163,175,.3) 1.25px, transparent 1.25px)', backgroundSize: '28px 28px' }}
            />
            <p className="pointer-events-none absolute left-10 top-8 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
              Odpowiedź
            </p>
          </div>
          <AnnotationLayer ann={ann} />
        </div>
      </div>
    </div>
  );
}
