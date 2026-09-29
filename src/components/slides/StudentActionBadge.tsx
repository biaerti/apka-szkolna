import clsx from 'clsx';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { StudentAction } from '../../data/types';
import { STUDENT_ACTION_OPTIONS } from '../../lib/slideStudentAction';
import { ZeszytIcon } from './ZeszytBadge';

/**
 * Prezentacja podaje tu funkcje zmieniajaca plakietke biezacego slajdu - wtedy
 * plakietka jest klikalna i rozwija liste (Do zeszytu / Ustnie / ...). Poza
 * prezentacja (podglad, edytor) kontekstu nie ma i plakietka jest zwykla.
 */
export const StudentActionEditContext = createContext<((action: StudentAction, text: string) => void) | null>(null);

const ACTION_COPY: Record<StudentAction, { label: string; detail: string }> = {
  copy: { label: 'Przepisz', detail: 'Przepisz treść slajdu' },
  'write-answer': { label: 'Zapisz odpowiedź', detail: 'Nie przepisuj polecenia' },
  oral: { label: 'Przygotuj odpowiedź', detail: 'Nic nie zapisuj' },
  look: { label: 'Patrz', detail: 'Nic nie zapisuj' },
  textbook: { label: 'W podręczniku', detail: 'Uzupełnij w podręczniku' },
};

function EyeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 24c5-8 11-12 19-12s14 4 19 12c-5 8-11 12-19 12S10 32 5 24Z" />
      <circle cx="24" cy="24" r="6" />
    </svg>
  );
}

function SpeechIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M8 10h32v23H22l-9 7v-7H8Z" strokeLinejoin="round" />
      <path d="M15 18h18M15 25h12" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      <path d="M5 11c7-3 13-2 19 3v24c-6-5-12-6-19-3z" />
      <path d="M43 11c-7-3-13-2-19 3v24c6-5 12-6 19-3z" />
    </svg>
  );
}

function BadgeFace({ action, text }: { action: StudentAction; text?: string }) {
  const copy = ACTION_COPY[action];
  const notebook = action === 'copy' || action === 'write-answer';
  return (
    <div
      className={clsx(
        'flex max-w-[430px] items-center gap-3 rounded-xl border-2 px-4 py-2 text-left',
        notebook
          ? 'border-amber-400/80 bg-amber-400/15 text-amber-200'
          : 'border-sky-400/70 bg-sky-400/10 text-sky-100',
      )}
    >
      {notebook ? <ZeszytIcon className="h-10 w-10 shrink-0" /> : action === 'oral' ? <SpeechIcon /> : action === 'textbook' ? <BookIcon /> : <EyeIcon />}
      <span className="min-w-0">
        <span className="block text-2xl font-bold uppercase leading-tight tracking-wide">{text?.trim() || copy.label}</span>
        <span className="block text-lg leading-tight opacity-80">{copy.detail}</span>
      </span>
    </div>
  );
}

export function StudentActionBadge({ action, text }: { action: StudentAction; text?: string }) {
  const onChange = useContext(StudentActionEditContext);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  if (!onChange) return <BadgeFace action={action} text={text} />;

  // Klik nie moze przejsc do prezentacji (klik w slajd = nastepny/poprzedni slajd).
  return (
    <div ref={rootRef} className="relative z-30" onClick={(e) => e.stopPropagation()}>
      <button type="button" title="Zmień: do zeszytu / ustnie / ..." onClick={() => setOpen((v) => !v)} className="block rounded-xl hover:brightness-125">
        <BadgeFace action={action} text={text} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
          {STUDENT_ACTION_OPTIONS.map((opt) => (
            <button
              key={opt.action}
              type="button"
              onClick={() => {
                onChange(opt.action, opt.text);
                setOpen(false);
              }}
              className={clsx(
                'block w-full px-5 py-3 text-left text-2xl hover:bg-gray-800',
                opt.action === action ? 'font-bold text-white' : 'text-gray-300',
              )}
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Stare `zeszyt: true` zachowuje dotychczasowe znaczenie bez migracji danych. */
export function resolvedStudentAction(
  action: StudentAction | undefined,
  legacyNotebook: boolean | undefined,
  legacyMeaning: Extract<StudentAction, 'copy' | 'write-answer'>,
): StudentAction | undefined {
  return action ?? (legacyNotebook ? legacyMeaning : undefined);
}
