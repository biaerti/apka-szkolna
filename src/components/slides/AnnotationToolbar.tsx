import clsx from 'clsx';
import { useEffect, useState, type ReactNode } from 'react';
import { ANNOTATION_COLORS, ANNOTATION_SIZES, type AnnotationTool } from './annotations';
import type { SlideAnnotations } from './useSlideAnnotations';

const TOOLS: Array<{ value: AnnotationTool; label: string; hint: string; icon: ReactNode }> = [
  { value: 'pen', label: 'Pióro', hint: 'Rysowanie odręczne (R)', icon: <PenIcon /> },
  { value: 'marker', label: 'Zakreślacz', hint: 'Przezroczyste zakreślenie', icon: <MarkerIcon /> },
  { value: 'line', label: 'Linia', hint: 'Przeciągnij, aby narysować prostą linię (L)', icon: <LineIcon /> },
  { value: 'text', label: 'Tekst', hint: 'Kliknij w slajd, aby dodać dopisek (T)', icon: <TextIcon /> },
  { value: 'eraser', label: 'Gumka', hint: 'Kliknij lub przeciągnij po adnotacjach', icon: <EraserIcon /> },
];

function ToolButton({ active, label, hint, icon, onClick }: { active: boolean; label: string; hint: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={hint}
      onClick={onClick}
      className={clsx(
        'flex h-11 min-w-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        active ? 'bg-white text-gray-950' : 'text-gray-200 hover:bg-white/10 hover:text-white',
      )}
    >
      {icon}
      <span className="hidden 2xl:inline">{label}</span>
    </button>
  );
}

export function AnnotationToolbar({ ann }: { ann: SlideAnnotations }) {
  const open = ann.tool !== 'off';
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!confirmClear) return;
    const timer = window.setTimeout(() => setConfirmClear(false), 2500);
    return () => window.clearTimeout(timer);
  }, [confirmClear]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="toolbar"
      aria-label="Narzędzia tablicy i adnotacji"
      className="absolute bottom-7 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1.5 rounded-xl bg-gray-950/95 p-2 text-white shadow-[0_14px_36px_rgba(0,0,0,0.45)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1" aria-label="Narzędzie">
        {TOOLS.map((tool) => (
          <ToolButton key={tool.value} active={ann.tool === tool.value} label={tool.label} hint={tool.hint} icon={tool.icon} onClick={() => ann.setTool(tool.value)} />
        ))}
      </div>
      <Divider />
      <div className="flex items-center gap-1" aria-label="Kolor">
        {ANNOTATION_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            title={`Kolor: ${color.label}`}
            aria-label={`Kolor: ${color.label}`}
            aria-pressed={ann.color === color.value}
            onClick={() => ann.setColor(color.value)}
            className={clsx(
              'relative h-9 w-9 rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
              ann.color === color.value && 'after:absolute after:inset-[-4px] after:rounded-full after:border-2 after:border-white',
            )}
            style={{ backgroundColor: color.value, boxShadow: color.value === '#111827' ? 'inset 0 0 0 1px rgba(255,255,255,.35)' : undefined }}
          />
        ))}
      </div>
      <Divider />
      <div className="flex h-11 items-center rounded-lg bg-white/5 p-1" aria-label="Rozmiar">
        {ANNOTATION_SIZES.map((size, index) => (
          <button
            key={size.label}
            type="button"
            aria-label={`Rozmiar: ${size.label}`}
            aria-pressed={ann.sizeIndex === index}
            title={`Rozmiar: ${size.label}`}
            onClick={() => ann.setSizeIndex(index)}
            className={clsx('flex h-9 w-9 items-center justify-center rounded-md text-gray-200 hover:bg-white/10', ann.sizeIndex === index && 'bg-white/15 text-white')}
          >
            <span className="rounded-full bg-current" style={{ width: 3 + index * 4, height: 3 + index * 4 }} />
          </button>
        ))}
      </div>
      <Divider />
      <button type="button" onClick={ann.undo} disabled={ann.shapes.length === 0} title="Cofnij (Ctrl+Z)" aria-label="Cofnij" className={actionClasses}><UndoIcon /></button>
      <button
        type="button"
        disabled={ann.shapes.length === 0}
        title={confirmClear ? 'Kliknij ponownie, aby usunąć wszystkie adnotacje' : 'Wyczyść slajd'}
        onClick={() => {
          if (confirmClear) {
            ann.clearSlide();
            setConfirmClear(false);
          } else setConfirmClear(true);
        }}
        className={clsx(actionClasses, confirmClear && 'w-auto bg-red-500/20 px-3 text-red-200')}
      >
        <TrashIcon />
        {confirmClear && <span className="ml-2 text-sm font-semibold">Na pewno?</span>}
      </button>
      <button type="button" onClick={() => ann.setTool('off')} title="Zakończ pisanie (Esc)" className="ml-0.5 h-11 rounded-lg bg-white px-4 text-sm font-bold text-gray-950 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Gotowe</button>
    </div>
  );
}

const actionClasses = 'flex h-11 w-11 items-center justify-center rounded-lg text-gray-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-35';

function Divider() { return <span aria-hidden="true" className="mx-0.5 h-8 w-px bg-white/15" />; }
function Icon({ children }: { children: ReactNode }) { return <svg viewBox="0 0 24 24" width={21} height={21} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{children}</svg>; }
function PenIcon() { return <Icon><path d="m4 20 4.4-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.4 16 4 20Z"/><path d="m14.8 6.7 3 3"/></Icon>; }
function MarkerIcon() { return <Icon><path d="m5 15 8.8-8.8 4 4L9 19H5v-4Z"/><path d="m3 21h10"/><path d="m12.3 7.7 4 4"/></Icon>; }
function LineIcon() { return <Icon><path d="M5 19 19 5"/><circle cx="5" cy="19" r="1.5"/><circle cx="19" cy="5" r="1.5"/></Icon>; }
function TextIcon() { return <Icon><path d="M5 6V4h14v2M12 4v16M8 20h8"/></Icon>; }
function EraserIcon() { return <Icon><path d="m7 18-3-3 9-10a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3l-7 7H7Z"/><path d="m10 8 7 7M7 18h13"/></Icon>; }
function UndoIcon() { return <Icon><path d="M9 8H4V3"/><path d="M4 8c2.1-2.7 4.8-4 8-4a8 8 0 1 1-7.4 11"/></Icon>; }
function TrashIcon() { return <Icon><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></Icon>; }
