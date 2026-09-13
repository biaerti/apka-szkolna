import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { classLessonCode } from '../lib/lessonCode';
import { parseMarkdownLite, type MdBlock, type MdInline } from '../lib/markdownLite';

const SECTION_COLORS = ['#0f9f9b', '#206dd3', '#ff5f62', '#f5b72b'];

const THEMES: Record<number, { accent: string; pale: string }> = {
  12: { accent: '#ff5f62', pale: '#fff0ef' },
  16: { accent: '#206dd3', pale: '#eef5ff' },
  18: { accent: '#0f9f9b', pale: '#eaf9f7' },
  22: { accent: '#6c3cc5', pale: '#f4f0ff' },
  25: { accent: '#d97706', pale: '#fff7df' },
};

interface HandoutSection {
  title: string;
  blocks: MdBlock[];
}

function sectionsFromNote(note?: string): HandoutSection[] {
  const blocks = parseMarkdownLite(note ?? '');
  const sections: HandoutSection[] = [];
  let current: HandoutSection | undefined;

  for (const block of blocks) {
    if (block.type === 'heading') {
      current = { title: block.inline.map((node) => node.text).join(''), blocks: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { title: 'Najważniejsze', blocks: [] };
      sections.push(current);
    }
    current.blocks.push(block);
  }

  return sections.length > 0 ? sections : [{ title: 'Notatka', blocks: [{ type: 'paragraph', inline: [{ type: 'text', text: 'Miejsce na notatkę z lekcji.' }] }] }];
}

function InlineText({ nodes }: { nodes: MdInline[] }) {
  return <>{nodes.map((node, index) => node.type === 'bold' ? <strong key={index}>{node.text}</strong> : <span key={index}>{node.text}</span>)}</>;
}

function NoteBlock({ block, color }: { block: MdBlock; color: string }) {
  if (block.type === 'paragraph') return <p><InlineText nodes={block.inline} /></p>;
  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <ListTag className="space-y-0.5" aria-label={block.ordered ? 'Lista numerowana' : 'Lista'}>
        {block.items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="shrink-0 font-bold" style={{ color }}>{block.ordered ? `${index + 1}.` : '•'}</span>
            <span><InlineText nodes={item} /></span>
          </li>
        ))}
      </ListTag>
    );
  }
  return null;
}

function NotebookMark({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 112 76" className="h-[25mm] w-[38mm] shrink-0" aria-hidden="true">
      <path d="M18 17c16-7 29-4 38 3v45c-11-7-24-9-38-3z" fill="#fff" stroke="#17243a" strokeWidth="2.5" />
      <path d="M94 17c-16-7-29-4-38 3v45c11-7 24-9 38-3z" fill="#fff" stroke="#17243a" strokeWidth="2.5" />
      <path d="M56 20v45" stroke="#17243a" strokeWidth="2.5" />
      <path d="M26 29h21M26 38h21M65 29h21M65 38h21" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <rect x="73" y="4" width="12" height="48" rx="5" fill="#f5b72b" stroke="#17243a" strokeWidth="2" transform="rotate(18 79 28)" />
      <path d="m69 53 3-12 8 3z" fill="#ff5f62" stroke="#17243a" strokeWidth="2" />
      <circle cx="15" cy="10" r="5" fill={accent} />
      <path d="M98 10v10M93 15h10" stroke="#0f9f9b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Handout({ title, code, textbookPage, note }: { title: string; code?: string; textbookPage?: number; note?: string }) {
  const sections = sectionsFromNote(note);
  const theme = (textbookPage && THEMES[textbookPage]) || { accent: '#4f46e5', pale: '#eef2ff' };

  return (
    <article className="print-color box-border flex h-[210mm] w-[148.5mm] shrink-0 flex-col overflow-hidden border-r border-dashed border-slate-400 bg-[#fffdf8] px-[8mm] py-[7mm] last:border-r-0">
      <header className="mb-[4mm] flex min-h-[34mm] items-center gap-[4mm] rounded-[5mm] px-[6mm] py-[4mm]" style={{ backgroundColor: theme.pale }}>
        <div className="min-w-0 flex-1">
          <h1 className="text-[20px] font-bold leading-[1.08] tracking-[-0.02em] text-[#15243a]">{title}</h1>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.06em]" style={{ color: theme.accent }}>
            {code ? `Lekcja ${code}` : 'Język polski'}{textbookPage ? ` - podręcznik s. ${textbookPage}` : ''}
          </p>
        </div>
        <NotebookMark accent={theme.accent} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-[2.6mm]">
        {sections.map((section, index) => {
          const color = index === 0 ? theme.accent : SECTION_COLORS[(index - 1) % SECTION_COLORS.length];
          return (
            <section key={`${section.title}-${index}`} className="overflow-hidden rounded-[3.2mm] border border-[#dce4ec] bg-white">
              <h2 className="px-[4mm] py-[1.8mm] text-[10px] font-bold uppercase leading-none text-white" style={{ backgroundColor: color }}>
                {section.title}
              </h2>
              <div className="space-y-1.5 px-[4mm] py-[2.3mm] text-[10.5px] leading-[1.28] text-[#15243a]">
                {section.blocks.map((block, blockIndex) => <NoteBlock key={blockIndex} block={block} color={color} />)}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-[3mm] flex items-center justify-between border-t-2 pt-[1.8mm] text-[8px] font-bold uppercase" style={{ borderColor: theme.accent, color: theme.accent }}>
        <span>Przeczytaj - zasłoń - powiedz z pamięci</span>
        <span>{code ?? ''}</span>
      </footer>
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
    <main className="min-h-screen overflow-x-auto bg-gray-100 py-8 print:min-h-0 print:overflow-visible print:bg-white print:py-0">
      <div className="no-print mx-auto mb-5 flex w-[min(297mm,calc(100vw-2rem))] flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="min-w-[17rem] flex-1">
          <p className="text-sm font-semibold text-gray-900">Dwie pionowe notatki A5 na kartce A4</p>
          <p className="text-xs text-gray-500">
            Notatki A5: {copies}. Kartki A4: {sheets.length}. Drukuj poziomo i przetnij kartkę wzdłuż środkowej linii.
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
        <div key={sheet} className="lesson-notes-page mx-auto mb-8 flex h-[210mm] w-[297mm] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.16)] print:mb-0 print:shadow-none">
          <Handout title={lesson.title} code={code} textbookPage={lesson.textbookPage} note={lesson.notebookNote} />
          {sheet * 2 + 1 < copies ? (
            <Handout title={lesson.title} code={code} textbookPage={lesson.textbookPage} note={lesson.notebookNote} />
          ) : <div className="h-[210mm] w-[148.5mm]" />}
        </div>
      )) : (
        <p className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center text-sm text-gray-600">Nie znaleziono notatki do wydruku. Wróć do listy lekcji i wybierz „Notatka A5”.</p>
      )}
    </main>
  );
}
