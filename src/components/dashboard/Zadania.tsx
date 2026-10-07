// Klocki listy zadan na pulpicie: wiersz z ptaszkiem, pole "dopisz" i
// przycisk "Do zrobienia" z lista ogolna (bez dnia i lekcji).

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { zadaniaOgolne, type Zadanie } from '../../lib/zadania';
import type { NoweZadanie, UseZadaniaResult } from '../../data/zadania';

interface ListaProps {
  items: Zadanie[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  /** Dopisek przed trescia, np. "pon 5.10 · IV A". */
  prefix?: (z: Zadanie) => string | undefined;
  className?: string;
}

export function ZadaniaLista({ items, onToggle, onRemove, prefix, className }: ListaProps) {
  if (items.length === 0) return null;
  return (
    <ul className={clsx('space-y-1', className)}>
      {items.map((z) => (
        <li key={z.id} className="group flex items-start gap-2 text-sm leading-snug">
          <input
            type="checkbox"
            checked={z.zrobione}
            onChange={() => onToggle(z.id)}
            aria-label={z.zrobione ? `Odznacz: ${z.tekst}` : `Zrobione: ${z.tekst}`}
            className="mt-[3px] h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent-600"
          />
          <span className={clsx('min-w-0 flex-1 break-words', z.zrobione ? 'text-gray-400 line-through' : 'text-gray-800')}>
            {prefix?.(z) && <span className="mr-1 text-xs text-amber-700">{prefix(z)}</span>}
            {z.tekst}
          </span>
          <button
            type="button"
            onClick={() => onRemove(z.id)}
            aria-label={`Usuń: ${z.tekst}`}
            title="Usuń"
            className="shrink-0 px-1 text-gray-300 opacity-0 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

interface DodajProps {
  onAdd: (tekst: string) => void;
  onClose: () => void;
  placeholder?: string;
}

/** Pole do szybkiego dopisywania: Enter dodaje i czysci pole, Esc zamyka. */
export function DodajZadanie({ onAdd, onClose, placeholder = 'Co zrobić? Enter dodaje' }: DodajProps) {
  const [tekst, setTekst] = useState('');
  // Esc porzuca wpisany tekst - blur, ktory przychodzi zaraz po nim, nic nie dodaje.
  const cancelled = useRef(false);
  return (
    <input
      autoFocus
      value={tekst}
      onChange={(e) => setTekst(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && tekst.trim()) {
          onAdd(tekst);
          setTekst('');
        }
        if (e.key === 'Escape') {
          cancelled.current = true;
          onClose();
        }
      }}
      onBlur={() => {
        if (tekst.trim() && !cancelled.current) onAdd(tekst);
        onClose();
      }}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none"
    />
  );
}

/** "Do zrobienia (N)" w naglowku pulpitu - ogolna lista, nieprzypieta do dnia. */
export function ZadaniaOgolnePrzycisk({ zadania, add, toggle, remove }: Pick<UseZadaniaResult, 'zadania' | 'add' | 'toggle' | 'remove'>) {
  const [open, setOpen] = useState(false);
  const [tekst, setTekst] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const items = zadaniaOgolne(zadania);
  const otwarte = items.filter((z) => !z.zrobione).length;
  const zrobione = items.filter((z) => z.zrobione);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function submit() {
    const input: NoweZadanie = { tekst, data: null, lekcja: null, klasaId: null };
    add(input);
    setTekst('');
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={clsx('rounded-md px-2 py-1 font-medium hover:bg-gray-100 hover:text-gray-900', open ? 'bg-gray-100 text-gray-900' : 'text-gray-600')}
      >
        Do zrobienia{otwarte > 0 ? ` (${otwarte})` : ''}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-80 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg">
          <input
            autoFocus
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tekst.trim()) submit();
            }}
            placeholder="Dopisz i Enter"
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none"
          />
          {items.length === 0 ? (
            <p className="mt-3 text-xs text-gray-400">
              Pusto. Zadanie na konkretny dzień albo lekcję dopiszesz w planie: „+ zadanie”.
            </p>
          ) : (
            <ZadaniaLista items={items} onToggle={toggle} onRemove={(id) => remove([id])} className="mt-3 max-h-80 overflow-y-auto" />
          )}
          {zrobione.length > 0 && (
            <button type="button" onClick={() => remove(zrobione.map((z) => z.id))} className="mt-3 text-xs text-gray-400 hover:text-gray-700">
              Usuń zrobione ({zrobione.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
