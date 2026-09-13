import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';

function NoteSheet({ title, code, textbookPage, exercisePage, note }: { title: string; code?: string; textbookPage?: number; exercisePage?: number; note?: string }) {
  return (
    <article className="box-border flex h-[148.5mm] flex-col overflow-hidden border-b border-dashed border-gray-400 p-[10mm] last:border-b-0">
      <header className="mb-5 border-b-2 border-gray-900 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">Język polski {code ? `- lekcja ${code}` : ''}</p>
        <h1 className="mt-1 text-xl font-bold leading-tight">{title}</h1>
        <p className="mt-1 text-xs text-gray-600">
          {textbookPage ? `Podręcznik s. ${textbookPage}` : ''}{exercisePage ? ` - ćwiczenia s. ${exercisePage}` : ''}
        </p>
      </header>
      <div className="whitespace-pre-wrap text-[13px] leading-7 text-gray-900">{note || 'Miejsce na notatkę z lekcji.'}</div>
    </article>
  );
}

export function LessonNotesPrint() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const wanted = (params.get('ids') ?? '').split(',').filter(Boolean).slice(0, 2);
  const lessons = useStore((state) => state.lessons);
  const selected = wanted.map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-5 flex max-w-[210mm] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-gray-900">Dwie notatki A5 na jednej kartce A4</p>
          <p className="text-xs text-gray-500">Po wydrukowaniu przetnij kartkę wzdłuż przerywanej linii.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>Wróć do lekcji</Button>
          <Button onClick={() => window.print()} disabled={selected.length !== 2}>Drukuj 2 notatki</Button>
        </div>
      </div>
      {selected.length === 2 ? (
        <div className="lesson-notes-page mx-auto h-[297mm] w-[210mm] bg-white shadow-lg print:shadow-none">
          {selected.map((lesson) => lesson && <NoteSheet key={lesson.id} title={lesson.title} code={lesson.code} textbookPage={lesson.textbookPage} exercisePage={lesson.exercisePage} note={lesson.notebookNote} />)}
        </div>
      ) : (
        <p className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center text-sm text-gray-600">Wróć do listy lekcji i zaznacz dokładnie dwa tematy.</p>
      )}
    </main>
  );
}
