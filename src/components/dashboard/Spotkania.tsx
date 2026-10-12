// Spotkanie w kolumnie dnia planu tygodnia: godzina z lewej (tam, gdzie
// lekcja ma numer), tytul i tag, pod spodem "do Google". Klik w tytul
// otwiera ten sam formularz co "+ spotkanie".

import { useState } from 'react';
import clsx from 'clsx';
import { godzinySpotkania, googleCalendarUrl, type Spotkanie } from '../../lib/spotkania';
import type { NoweSpotkanie } from '../../data/spotkania';

const TAG_COLORS = [
  'border-sky-200 bg-sky-50 text-sky-800',
  'border-violet-200 bg-violet-50 text-violet-800',
  'border-rose-200 bg-rose-50 text-rose-800',
  'border-teal-200 bg-teal-50 text-teal-800',
  'border-orange-200 bg-orange-50 text-orange-800',
  'border-lime-200 bg-lime-50 text-lime-800',
];

/** Ten sam tag ma zawsze ten sam kolor. */
function tagColor(tag: string): string {
  let hash = 0;
  for (const ch of tag.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export function TagChip({ tag }: { tag: string }) {
  return <span className={clsx('rounded border px-1.5 py-px text-xs font-semibold', tagColor(tag))}>{tag}</span>;
}

interface WierszProps {
  spotkanie: Spotkanie;
  tagi: string[];
  onUpdate: (patch: Partial<NoweSpotkanie & { wGoogle: boolean }>) => void;
  onRemove: () => void;
}

export function SpotkanieWiersz({ spotkanie: s, tagi, onUpdate, onRemove }: WierszProps) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <div className="py-2 pl-12">
        <SpotkanieForm
          start={s}
          tagi={tagi}
          onSave={(input) => {
            onUpdate(input);
            setEditing(false);
          }}
          onRemove={onRemove}
          onClose={() => setEditing(false)}
        />
      </div>
    );
  }
  return (
    <article className="group relative -mx-2 flex gap-3 rounded-lg px-2 py-3">
      <div className="w-9 shrink-0 pt-0.5 text-right">
        <div className="text-[13px] font-semibold leading-none tabular-nums text-gray-700">{s.od}</div>
        {s.do && <div className="mt-1 text-[11px] leading-none tabular-nums text-gray-400">{s.do}</div>}
      </div>
      <div className="min-w-0 flex-1">
        {s.tag && (
          <div className="mb-1.5">
            <TagChip tag={s.tag} />
          </div>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="Kliknij, żeby zmienić"
          className="block text-left text-sm font-medium leading-snug text-gray-900 hover:underline"
        >
          {s.tytul}
        </button>
        <div className="mt-1 flex gap-3 text-xs">
          <a
            href={googleCalendarUrl(s)}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (!s.wGoogle) onUpdate({ wGoogle: true });
            }}
            title={s.wGoogle ? 'Już dodane. Klik otworzy Kalendarz Google jeszcze raz.' : `Otwiera Kalendarz Google z gotowym wydarzeniem: ${godzinySpotkania(s)} ${s.tytul}`}
            className={s.wGoogle ? 'text-emerald-700' : 'font-medium text-gray-500 hover:text-gray-900 hover:underline'}
          >
            {s.wGoogle ? '✓ w Google' : 'do Google'}
          </a>
        </div>
      </div>
    </article>
  );
}

interface FormProps {
  start: NoweSpotkanie;
  tagi: string[];
  onSave: (input: NoweSpotkanie) => void;
  onClose: () => void;
  onRemove?: () => void;
}

/** Formularz spotkania: tytul, dzien, od-do, tag. Enter zapisuje, Esc zamyka. */
export function SpotkanieForm({ start, tagi, onSave, onClose, onRemove }: FormProps) {
  const [form, setForm] = useState<NoweSpotkanie>({ ...start, do: start.do ?? '', tag: start.tag ?? '' });
  const set = (patch: Partial<NoweSpotkanie>) => setForm((f) => ({ ...f, ...patch }));
  const ok = form.tytul.trim() !== '' && /^\d{1,2}:\d{2}$/.test(form.od) && form.data !== '';
  const listId = `tagi-${start.data}`;
  const field = 'rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) onSave(form);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      className="space-y-1.5 rounded-lg border border-gray-200 bg-gray-50 p-2"
    >
      <input autoFocus value={form.tytul} onChange={(e) => set({ tytul: e.target.value })} placeholder="Co? np. spotkanie z Neronem" className={clsx(field, 'w-full')} />
      <div className="flex items-center gap-1.5">
        <input type="time" value={form.od} onChange={(e) => set({ od: e.target.value })} aria-label="Od" required className={clsx(field, 'min-w-0 flex-1 tabular-nums')} />
        <span className="text-xs text-gray-400">do</span>
        <input type="time" value={form.do ?? ''} onChange={(e) => set({ do: e.target.value })} aria-label="Do (nieobowiązkowo)" className={clsx(field, 'min-w-0 flex-1 tabular-nums')} />
      </div>
      <div className="flex items-center gap-1.5">
        <input type="date" value={form.data} onChange={(e) => set({ data: e.target.value })} aria-label="Dzień" className={clsx(field, 'min-w-0 flex-1 tabular-nums')} />
        <input value={form.tag ?? ''} onChange={(e) => set({ tag: e.target.value })} list={listId} placeholder="tag" aria-label="Tag" className={clsx(field, 'w-24 min-w-0')} />
        <datalist id={listId}>
          {tagi.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>
      <div className="flex items-center gap-2 pt-0.5 text-xs">
        <button type="submit" disabled={!ok} className="rounded-md bg-accent-600 px-2.5 py-1 font-medium text-white hover:bg-accent-700 disabled:opacity-40">
          Zapisz
        </button>
        <button type="button" onClick={onClose} className="px-1 text-gray-500 hover:text-gray-900">
          Anuluj
        </button>
        {onRemove && (
          <button type="button" onClick={onRemove} className="ml-auto px-1 text-gray-400 hover:text-red-600">
            Usuń
          </button>
        )}
      </div>
    </form>
  );
}
