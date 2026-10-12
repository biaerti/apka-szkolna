// Spotkania w planie tygodnia - tabela spotkania.
//
// Tak samo jak zadania.ts: stan lokalny od razu, zapis do chmury w tle,
// przy bledzie lista wraca do stanu z chmury, po powrocie do karty czyta sie
// od nowa. Bez chmury lista zyje w localStorage.

import { useCallback, useEffect, useState } from 'react';
import { newId } from './id';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Spotkanie } from '../lib/spotkania';

interface SpotkanieRow {
  id: string;
  tytul: string;
  data: string;
  od: string;
  do_godz: string | null;
  tag: string | null;
  w_google: boolean;
  created_at: string;
}

function rowToSpotkanie(r: SpotkanieRow): Spotkanie {
  return { id: r.id, tytul: r.tytul, data: r.data, od: r.od, do: r.do_godz, tag: r.tag, wGoogle: r.w_google, createdAt: r.created_at };
}

function spotkanieToRow(s: Spotkanie): SpotkanieRow {
  return { id: s.id, tytul: s.tytul, data: s.data, od: s.od, do_godz: s.do, tag: s.tag, w_google: s.wGoogle, created_at: s.createdAt };
}

function patchToRow(patch: Partial<NoweSpotkanie & { wGoogle: boolean }>): Partial<SpotkanieRow> {
  const row: Partial<SpotkanieRow> = {};
  if (patch.tytul !== undefined) row.tytul = patch.tytul;
  if (patch.data !== undefined) row.data = patch.data;
  if (patch.od !== undefined) row.od = patch.od;
  if (patch.do !== undefined) row.do_godz = patch.do;
  if (patch.tag !== undefined) row.tag = patch.tag;
  if (patch.wGoogle !== undefined) row.w_google = patch.wGoogle;
  return row;
}

const LOCAL_KEY = 'apka-szkolna:spotkania';

function localRead(): Spotkanie[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as Spotkanie[];
  } catch {
    return [];
  }
}

function localWrite(list: Spotkanie[]): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    // np. tryb prywatny - lista zyje do odswiezenia
  }
}

async function fetchSpotkania(): Promise<Spotkanie[]> {
  if (!isSupabaseConfigured()) return localRead();
  const { data, error } = await getSupabase().from('spotkania').select('*').order('data').order('od');
  if (error) throw new Error(error.message);
  return (data as SpotkanieRow[]).map(rowToSpotkanie);
}

export type NoweSpotkanie = Pick<Spotkanie, 'tytul' | 'data' | 'od' | 'do' | 'tag'>;

export interface UseSpotkaniaResult {
  spotkania: Spotkanie[];
  error: string | null;
  add: (input: NoweSpotkanie) => void;
  update: (id: string, patch: Partial<NoweSpotkanie & { wGoogle: boolean }>) => void;
  remove: (id: string) => void;
}

/** Puste pola na null, tytul i tag bez spacji na brzegach. */
function clean(input: NoweSpotkanie): NoweSpotkanie {
  return { tytul: input.tytul.trim(), data: input.data, od: input.od, do: input.do || null, tag: input.tag?.trim() || null };
}

export function useSpotkania(): UseSpotkaniaResult {
  const [spotkania, setSpotkania] = useState<Spotkanie[]>(() => (isSupabaseConfigured() ? [] : localRead()));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setSpotkania(await fetchSpotkania());
      setError(null);
    } catch (err) {
      setError(`Spotkania: ${err instanceof Error ? err.message : 'nieznany błąd'}`);
    }
  }, []);

  useEffect(() => {
    void reload();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void reload();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [reload]);

  function change(next: (list: Spotkanie[]) => Spotkanie[], remote: () => PromiseLike<{ error: { message: string } | null }>) {
    setSpotkania((list) => {
      const updated = next(list);
      if (!isSupabaseConfigured()) localWrite(updated);
      return updated;
    });
    if (!isSupabaseConfigured()) return;
    void Promise.resolve(remote()).then(
      ({ error: err }) => {
        if (err) {
          setError(`Nie zapisałem spotkania: ${err.message}`);
          void reload();
        }
      },
      () => {
        setError('Nie zapisałem spotkania - brak połączenia');
        void reload();
      },
    );
  }

  function add(input: NoweSpotkanie) {
    const fields = clean(input);
    if (!fields.tytul || !fields.od) return;
    const spotkanie: Spotkanie = { ...fields, id: newId(), wGoogle: false, createdAt: new Date().toISOString() };
    change((list) => [...list, spotkanie], () => getSupabase().from('spotkania').insert(spotkanieToRow(spotkanie)));
  }

  function update(id: string, patch: Partial<NoweSpotkanie & { wGoogle: boolean }>) {
    const current = spotkania.find((s) => s.id === id);
    if (!current) return;
    const fields = { ...patch, ...('tytul' in patch ? clean({ ...current, ...patch }) : {}) };
    if (fields.tytul === '') return;
    change(
      (list) => list.map((s) => (s.id === id ? { ...s, ...fields } : s)),
      () => getSupabase().from('spotkania').update(patchToRow(fields)).eq('id', id),
    );
  }

  function remove(id: string) {
    change(
      (list) => list.filter((s) => s.id !== id),
      () => getSupabase().from('spotkania').delete().eq('id', id),
    );
  }

  return { spotkania, error, add, update, remove };
}
