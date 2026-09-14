import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { classLessonCode } from '../lib/lessonCode';
import { parseMarkdownLite, type MdBlock, type MdInline } from '../lib/markdownLite';
import type { Slide, SlideArt } from '../data/types';

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

function FillableText({ text }: { text: string }) {
  return <>{text.split(/(\{\{[^{}]+\}\})/g).filter(Boolean).map((part, index) => {
    const match = /^\{\{(.+)\}\}$/.exec(part);
    if (!match) return <span key={index}>{part}</span>;
    const answer = match[1];
    const width = Math.min(18, Math.max(5, answer.length * 0.62));
    return (
      <span
        key={index}
        aria-label="puste miejsce do uzupełnienia"
        className="mx-0.5 inline-block h-[1.05em] border-b-2 border-dotted align-baseline"
        style={{ borderColor: '#64748b', width: `${width}em` }}
      />
    );
  })}</>;
}

function InlineText({ nodes }: { nodes: MdInline[] }) {
  return <>{nodes.map((node, index) => node.type === 'bold'
    ? <strong key={index}><FillableText text={node.text} /></strong>
    : <FillableText key={index} text={node.text} />)}</>;
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

type TaskSlide = Extract<Slide, { kind: 'task' }>;

function ConceptDiagram({ art, accent }: { art?: SlideArt; accent: string }) {
  if (art === 'swiatPrzedstawiony') {
    return (
      <svg viewBox="0 0 136 86" className="h-[22mm] w-[35mm] shrink-0" aria-label="Schemat elementów świata przedstawionego">
        <path d="M68 43 30 20M68 43l38-23M68 43 30 67M68 43l38 24" stroke="#94a3b8" strokeWidth="2" />
        <rect x="44" y="29" width="48" height="28" rx="8" fill={accent} />
        <text x="68" y="40" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">ŚWIAT</text>
        <text x="68" y="50" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">OPOWIEŚCI</text>
        {[[4, 8, 'CZAS'], [100, 8, 'MIEJSCE'], [2, 58, 'KTO?'], [101, 58, 'CO?']].map(([x, y, label]) => (
          <g key={String(label)}>
            <rect x={Number(x)} y={Number(y)} width="33" height="17" rx="5" fill="white" stroke={accent} strokeWidth="1.5" />
            <text x={Number(x) + 16.5} y={Number(y) + 11.5} textAnchor="middle" fill="#15243a" fontSize="7" fontWeight="700">{label}</text>
          </g>
        ))}
      </svg>
    );
  }

  if (art === 'narrator' || art === 'wiersz') {
    return (
      <svg viewBox="0 0 136 86" className="h-[22mm] w-[35mm] shrink-0" aria-label="Schemat osoby mówiącej w tekście">
        <circle cx="27" cy="43" r="18" fill="white" stroke={accent} strokeWidth="2" />
        <circle cx="27" cy="37" r="5" fill={accent} />
        <path d="M17 53c2-8 18-8 20 0" fill={accent} />
        <path d="M48 43h27" stroke="#94a3b8" strokeWidth="2" />
        <path d="m70 37 7 6-7 6" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <path d="M82 21h45v44H82z" fill="white" stroke={accent} strokeWidth="2" />
        <path d="M90 31h28M90 40h22M90 49h27M90 58h18" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        <text x="27" y="72" textAnchor="middle" fill="#15243a" fontSize="7" fontWeight="700">KTO MÓWI?</text>
      </svg>
    );
  }

  if (art === 'zeszyt' || art === 'wiadomosc') {
    return (
      <svg viewBox="0 0 136 86" className="h-[22mm] w-[35mm] shrink-0" aria-label="Schemat wyboru formy notatki">
        <rect x="47" y="30" width="42" height="26" rx="7" fill={accent} />
        <text x="68" y="47" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">CEL</text>
        <path d="M47 43H24m65 0h23M68 30V14M68 56v16" stroke="#94a3b8" strokeWidth="2" />
        <text x="3" y="46" fill="#15243a" fontSize="7" fontWeight="700">PUNKTY</text>
        <text x="113" y="46" fill="#15243a" fontSize="7" fontWeight="700">TABELA</text>
        <text x="68" y="10" textAnchor="middle" fill="#15243a" fontSize="7" fontWeight="700">MAPA</text>
        <text x="68" y="82" textAnchor="middle" fill="#15243a" fontSize="7" fontWeight="700">RYSUNEK</text>
      </svg>
    );
  }

  if (art === 'dwuznak' || art === 'sylaby') {
    return (
      <svg viewBox="0 0 136 86" className="h-[22mm] w-[35mm] shrink-0" aria-label="Schemat liter, głosek i sylab">
        <rect x="5" y="19" width="48" height="48" rx="10" fill="white" stroke={accent} strokeWidth="2" />
        <text x="29" y="49" textAnchor="middle" fill={accent} fontSize="25" fontWeight="700">SZ</text>
        <path d="M58 43h23" stroke="#94a3b8" strokeWidth="2" />
        <path d="m76 37 7 6-7 6" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="105" cy="43" r="21" fill={accent} />
        <text x="105" y="48" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">1</text>
        <text x="29" y="78" textAnchor="middle" fill="#15243a" fontSize="7" fontWeight="700">2 LITERY</text>
        <text x="105" y="78" textAnchor="middle" fill="#15243a" fontSize="7" fontWeight="700">1 GŁOSKA</text>
      </svg>
    );
  }

  if (art === 'opis') {
    return (
      <svg viewBox="0 0 136 86" className="h-[22mm] w-[35mm] shrink-0" aria-label="Schemat działania epitetu">
        <rect x="6" y="28" width="42" height="30" rx="7" fill="white" stroke={accent} strokeWidth="2" />
        <text x="27" y="47" textAnchor="middle" fill="#15243a" fontSize="10" fontWeight="700">LAS</text>
        <path d="M53 43h27" stroke="#94a3b8" strokeWidth="2" />
        <path d="m75 37 7 6-7 6" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <rect x="87" y="18" width="43" height="50" rx="8" fill={accent} />
        <text x="108.5" y="37" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">CIEMNY</text>
        <text x="108.5" y="47" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">WILGOTNY</text>
        <text x="108.5" y="57" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">LAS</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 112 76" className="h-[22mm] w-[35mm] shrink-0" aria-hidden="true">
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

function TaskBlock({ task, color, index }: { task: TaskSlide; color: string; index: number }) {
  const blocks = parseMarkdownLite(task.body);
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[3mm] border border-[#cad5e2] bg-white">
      <div className="flex shrink-0 items-center justify-between gap-2 px-[3mm] py-[1.2mm] text-white" style={{ backgroundColor: color }}>
        <h3 className="text-[8.3px] font-bold uppercase leading-none">{task.code}. Zadanie</h3>
        <span className="text-[6.8px] font-bold uppercase tracking-[0.04em]">{index + 1}/3</span>
      </div>
      <div className="overflow-hidden px-[3mm] py-[1.5mm] text-[8px] leading-[1.14] text-[#15243a]">
        {blocks.map((block, blockIndex) => <NoteBlock key={blockIndex} block={block} color={color} />)}
      </div>
    </section>
  );
}

function Handout({ title, code, textbookPage, note, slides }: { title: string; code?: string; textbookPage?: number; note?: string; slides: Slide[] }) {
  const sections = sectionsFromNote(note);
  const theme = (textbookPage && THEMES[textbookPage]) || { accent: '#4f46e5', pale: '#eef2ff' };
  const blankCount = note?.match(/\{\{[^{}]+\}\}/g)?.length ?? 0;
  const tasks = slides.filter((slide): slide is TaskSlide => slide.kind === 'task').slice(0, 3);
  const explainer = slides.find((slide): slide is Extract<Slide, { kind: 'text' }> => slide.kind === 'text' && Boolean(slide.art));
  const topicArt = explainer?.art ?? tasks.find((task) => task.art)?.art;

  return (
    <article className="print-color box-border flex h-[210mm] w-[148.5mm] shrink-0 flex-col overflow-hidden border-r border-dashed border-slate-400 bg-[#fffdf8] px-[8mm] py-[7mm] last:border-r-0">
      <header className="mb-[2.8mm] flex min-h-[26mm] items-center gap-[3mm] rounded-[4mm] px-[5mm] py-[2.5mm]" style={{ backgroundColor: theme.pale }}>
        <div className="min-w-0 flex-1">
          <h1 className="text-[16px] font-bold leading-[1.05] tracking-[-0.02em] text-[#15243a]">{title}</h1>
          <p className="mt-1.5 text-[7.5px] font-bold uppercase tracking-[0.05em]" style={{ color: theme.accent }}>
            {code ? `Lekcja ${code}` : 'Język polski'}{textbookPage ? ` - podręcznik s. ${textbookPage}` : ''}
          </p>
        </div>
        <ConceptDiagram art={topicArt} accent={theme.accent} />
      </header>

      <div className="mb-[2.5mm] grid h-[52mm] shrink-0 grid-cols-2 gap-[2mm]">
        {sections.map((section, index) => {
          const color = index === 0 ? theme.accent : SECTION_COLORS[(index - 1) % SECTION_COLORS.length];
          return (
            <section key={`${section.title}-${index}`} className="overflow-hidden rounded-[2.5mm] border border-[#dce4ec] bg-white">
              <h2 className="px-[3mm] py-[1.35mm] text-[8px] font-bold uppercase leading-none text-white" style={{ backgroundColor: color }}>
                {section.title}
              </h2>
              <div className="space-y-1 px-[3mm] py-[1.6mm] text-[8.3px] leading-[1.16] text-[#15243a]">
                {section.blocks.map((block, blockIndex) => <NoteBlock key={blockIndex} block={block} color={color} />)}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mb-[1.5mm] flex items-center justify-between">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.04em] text-[#15243a]">Zrób tutaj</h2>
        <span className="text-[7.5px] font-semibold text-[#57657a]">Odpowiedzi zapisz na prawej stronie zeszytu</span>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-3 gap-[1.5mm]">
        {tasks.map((task, index) => (
          <TaskBlock key={task.id} task={task} color={index === 0 ? theme.accent : SECTION_COLORS[1]} index={index} />
        ))}
      </div>

      <footer className="mt-[2mm] flex items-center justify-between border-t-2 pt-[1.3mm] text-[7px] font-bold uppercase" style={{ borderColor: theme.accent, color: theme.accent }}>
        <span>{blankCount > 0 ? `Uzupełnij ${blankCount} pola - zrób Z1, Z2 i Z3 - sprawdź` : 'Przeczytaj - zrób Z1, Z2 i Z3 - sprawdź'}</span>
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
          <Handout title={lesson.title} code={code} textbookPage={lesson.textbookPage} note={lesson.notebookNote} slides={lesson.slides} />
          {sheet * 2 + 1 < copies ? (
            <Handout title={lesson.title} code={code} textbookPage={lesson.textbookPage} note={lesson.notebookNote} slides={lesson.slides} />
          ) : <div className="h-[210mm] w-[148.5mm]" />}
        </div>
      )) : (
        <p className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center text-sm text-gray-600">Nie znaleziono notatki do wydruku. Wróć do listy lekcji i wybierz „Notatka A5”.</p>
      )}
    </main>
  );
}
