// Lista zadan na pulpicie - tabela zadania.
//
// Jak wazneInfo.ts: poza store zustand i silnikiem sync, bo to prosta lista
// zyjaca w chmurze. Zmiany widac od razu (stan lokalny), zapis leci w tle;
// przy bledzie lista wraca do stanu z chmury. Po powrocie do karty lista
// czyta sie od nowa, zeby zadanie dopisane na telefonie pojawilo sie na
// komputerze. Bez chmury (tryb "tylko ta przegladarka") lista zyje w localStorage.

import { useCallback, useEffect, useState } from 'react';
import { newId } from './id';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Zadanie } from '../lib/zadania';

interface ZadanieRow {
  id: string;
  tekst: string;
  data: string | null;
  lekcja: number | null;
  klasa_id: string | null;
  zrobione: boolean;
  created_at: string;
}

function rowToZadanie(r: ZadanieRow): Zadanie {
  return { id: r.id, tekst: r.tekst, data: r.data, lekcja: r.lekcja, klasaId: r.klasa_id, zrobione: r.zrobione, createdAt: r.created_at };
}

function zadanieToRow(z: Zadanie): ZadanieRow {
  return { id: z.id, tekst: z.tekst, data: z.data, lekcja: z.lekcja, klasa_id: z.klasaId, zrobione: z.zrobione, created_at: z.createdAt };
}

const LOCAL_KEY = 'apka-szkolna:zadania';

function localRead(): Zadanie[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as Zadanie[];
  } catch {
    return [];
  }
}

function localWrite(list: Zadanie[]): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    // np. tryb prywatny - lista zyje do odswiezenia
  }
}

async function fetchZadania(): Promise<Zadanie[]> {
  if (!isSupabaseConfigured()) return localRead();
  const { data, error } = await getSupabase().from('zadania').select('*').order('created_at');
  if (error) throw new Error(error.message);
  return (data as ZadanieRow[]).map(rowToZadanie);
}

export type NoweZadanie = Pick<Zadanie, 'tekst' | 'data' | 'lekcja' | 'klasaId'>;

export interface UseZadaniaResult {
  zadania: Zadanie[];
  error: string | null;
  add: (input: NoweZadanie) => void;
  toggle: (id: string) => void;
  remove: (ids: string[]) => void;
}

export function useZadania(): UseZadaniaResult {
  const [zadania, setZadania] = useState<Zadanie[]>(() => (isSupabaseConfigured() ? [] : localRead()));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setZadania(await fetchZadania());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
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

  /** Zmiana od razu na ekranie, potem zapis; bez chmury zapis do localStorage. */
  function change(next: (list: Zadanie[]) => Zadanie[], remote: () => PromiseLike<{ error: { message: string } | null }>) {
    setZadania((list) => {
      const updated = next(list);
      if (!isSupabaseConfigured()) localWrite(updated);
      return updated;
    });
    if (!isSupabaseConfigured()) return;
    void Promise.resolve(remote()).then(
      ({ error: err }) => {
        if (err) {
          setError(`Nie zapisałem zadania: ${err.message}`);
          void reload();
        }
      },
      () => {
        setError('Nie zapisałem zadania - brak połączenia');
        void reload();
      },
    );
  }

  function add(input: NoweZadanie) {
    const tekst = input.tekst.trim();
    if (!tekst) return;
    const zadanie: Zadanie = { ...input, tekst, id: newId(), zrobione: false, createdAt: new Date().toISOString() };
    change((list) => [...list, zadanie], () => getSupabase().from('zadania').insert(zadanieToRow(zadanie)));
  }

  function toggle(id: string) {
    const current = zadania.find((z) => z.id === id);
    if (!current) return;
    const zrobione = !current.zrobione;
    change(
      (list) => list.map((z) => (z.id === id ? { ...z, zrobione } : z)),
      () => getSupabase().from('zadania').update({ zrobione }).eq('id', id),
    );
  }

  function remove(ids: string[]) {
    if (ids.length === 0) return;
    change(
      (list) => list.filter((z) => !ids.includes(z.id)),
      () => getSupabase().from('zadania').delete().in('id', ids),
    );
  }

  return { zadania, error, add, toggle, remove };
}
