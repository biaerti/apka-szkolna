import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { classLessonCode } from '../lib/lessonCode';

const SPRITE = '/images/lesson-handouts/polish-topics-sprite.png';
const VISUAL_OFFSET: Record<number, { left: string; top: string }> = {
  12: { left: '0%', top: '0%' },
  16: { left: '-100%', top: '0%' },
  18: { left: '-200%', top: '0%' },
  22: { left: '0%', top: '-100%' },
  25: { left: '-100%', top: '-100%' },
};

function Handout({ title, code, textbookPage, note }: { title: string; code?: string; textbookPage?: number; note?: string }) {
  const visualOffset = textbookPage ? VISUAL_OFFSET[textbookPage] : undefined;
  return (
    <article className="box-border flex h-[148.5mm] flex-col overflow-hidden border-b border-dashed border-gray-400 px-[9mm] py-[7mm] last:border-b-0">
      <header className="mb-3 flex min-h-[38mm] items-stretch gap-5 border-b-2 border-gray-900 pb-3">
        <div className="min-w-0 flex-1 self-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-500">Język polski {code ? `- lekcja ${code}` : ''}</p>
          <h1 className="mt-1 text-[19px] font-bold leading-tight">{title}</h1>
          {textbookPage && <p className="mt-1 text-[10px] text-gray-600">Podręcznik s. {textbookPage}</p>}
        </div>
        {visualOffset && (
          <div
            role="img"
            aria-label="Ilustracja do tematu"
            className="print-color relative h-[34mm] w-[52mm] shrink-0 overflow-hidden rounded-lg"
          >
            <img
              src={SPRITE}
              alt=""
              className="absolute max-w-none"
              style={{ width: '300%', height: '200%', left: visualOffset.left, top: visualOffset.top }}
            />
          </div>
        )}
      </header>
      <div className="whitespace-pre-wrap text-[11px] leading-[1.42] text-gray-900">{note || 'Miejsce na notatkę z lekcji.'}</div>
    </article>
  );
}

export function LessonNotesPrint() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const lessonId = params.get('id') ?? '';
  const classId = params.get('klasa') ?? '';
  const initialCopies = Math.max(1, Math.min(100, Number(params.get('copies')) || 50));
  const [copies, setCopies] = useState(initialCopies);
  const lessons = useStore((state) => state.lessons);
  const lesson = lessons.find((item) => item.id === lessonId);
  const sheets = useMemo(() => Array.from({ length: Math.ceil(copies / 2) }, (_, index) => index), [copies]);
  const code = lesson && classId ? classLessonCode(lessons, lesson, classId) : lesson?.code;

  return (
    <main className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-5 flex max-w-[210mm] items-center justify-between gap-5 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-gray-900">Materiały A5 - po dwie sztuki na kartce A4</p>
          <p className="text-xs text-gray-500">
            Dla {copies} uczniów powstanie {Math.ceil(copies / 2)} kartek A4. Po wydruku przetnij je wzdłuż przerywanej linii.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Liczba uczniów
          <Input
            type="number"
            min={1}
            max={100}
            className="w-20"
            value={copies}
            onChange={(event) => setCopies(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
          />
        </label>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>Wróć</Button>
          <Button onClick={() => window.print()} disabled={!lesson}>Drukuj {copies} szt.</Button>
        </div>
      </div>

      {lesson ? sheets.map((sheet) => (
        <div key={sheet} className="lesson-notes-page mx-auto mb-8 h-[297mm] w-[210mm] bg-white shadow-lg print:mb-0 print:shadow-none">
          <Handout title={lesson.title} code={code} textbookPage={lesson.textbookPage} note={lesson.notebookNote} />
          {sheet * 2 + 1 < copies ? (
            <Handout title={lesson.title} code={code} textbookPage={lesson.textbookPage} note={lesson.notebookNote} />
          ) : <div className="h-[148.5mm]" />}
        </div>
      )) : (
        <p className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center text-sm text-gray-600">Nie znaleziono materiału do wydruku. Wróć do listy lekcji i wybierz „Materiały A5”.</p>
      )}
    </main>
  );
}
