// Wazne info dla rodzicow - dostep do tabel wazne_info / wazne_info_paczki.
//
// Celowo poza store zustand i silnikiem sync (diff, mappers, snapshoty): to
// prosta lista, ktora zyje w chmurze i nie musi dzialac offline. Zakladka
// czyta ja przy wejsciu (useWazneInfo), a kazda zmiana idzie od razu do
// Supabase i odswieza liste. Bez chmury (tryb "tylko ta przegladarka", np.
// podglad --mode przeglad) lista zyje w localStorage z paroma punktami demo,
// a "Sprawdź skrzynkę" nie dziala - skrzynke czyta funkcja serverless.

import { useCallback, useEffect, useState } from 'react';
import { newId } from './id';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { PullResult, WazneInfo, WazneInfoPaczka, WazneInfoPunkt } from '../lib/wazneInfoExtract';

interface WazneInfoRow {
  id: string;
  message_id: string | null;
  nadawca: string | null;
  temat: string | null;
  otrzymano: string | null;
  tytul: string;
  tresc: string;
  termin: string | null;
  linki: unknown;
  status: WazneInfo['status'];
  paczka_id: string | null;
  created_at: string;
}

function rowToInfo(r: WazneInfoRow): WazneInfo {
  return {
    id: r.id,
    messageId: r.message_id,
    nadawca: r.nadawca,
    temat: r.temat,
    otrzymano: r.otrzymano,
    tytul: r.tytul,
    tresc: r.tresc,
    termin: r.termin,
    linki: Array.isArray(r.linki) ? r.linki.filter((l): l is string => typeof l === 'string') : [],
    status: r.status,
    paczkaId: r.paczka_id,
    createdAt: r.created_at,
  };
}

// --- tryb lokalny (bez Supabase) --------------------------------------------

const LOCAL_KEY = 'apka-szkolna:wazne-info';

interface LocalData {
  punkty: WazneInfo[];
  paczki: WazneInfoPaczka[];
}

function localSeed(): LocalData {
  const now = new Date().toISOString();
  const zaTydzien = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const jutro = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  return {
    punkty: [
      {
        id: newId(),
        messageId: 'demo-1',
        nadawca: 'Kaszubińska Bożena',
        temat: 'Konkurs Zdolny Ślązak',
        otrzymano: now,
        tytul: 'Konkurs Zdolny Ślązak - karty zgłoszenia',
        tresc: 'Etap szkolny z języka polskiego 15 października o 10:00. Karty zgłoszenia z podpisami rodziców oddajemy do 9 października.',
        termin: zaTydzien,
        linki: ['https://zdolnyslazak.edu.pl/?site=start'],
        status: 'nowe',
        paczkaId: null,
        createdAt: now,
      },
      {
        id: newId(),
        messageId: null,
        nadawca: null,
        temat: null,
        otrzymano: null,
        tytul: 'Zdjęcia klasowe',
        tresc: 'Jutro fotograf - proszę o schludny strój.',
        termin: jutro,
        linki: [],
        status: 'nowe',
        paczkaId: null,
        createdAt: now,
      },
    ],
    paczki: [],
  };
}

function localRead(): LocalData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as LocalData;
  } catch {
    // brak localStorage albo zepsute dane - zaczynamy od demo
  }
  const seed = localSeed();
  localWrite(seed);
  return seed;
}

function localWrite(data: LocalData): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {
    // np. tryb prywatny - trudno, dane zyja do odswiezenia
  }
}

function localUpdate(fn: (d: LocalData) => void): void {
  const d = localRead();
  fn(d);
  localWrite(d);
}

// --- odczyt / zapis -----------------------------------------------------------

export async function fetchWazneInfo(): Promise<{ punkty: WazneInfo[]; paczki: WazneInfoPaczka[] }> {
  if (!isSupabaseConfigured()) return localRead();
  const supabase = getSupabase();
  const [p, k] = await Promise.all([
    supabase.from('wazne_info').select('*').order('created_at', { ascending: false }),
    supabase.from('wazne_info_paczki').select('*').order('wyslano', { ascending: false }).limit(50),
  ]);
  if (p.error) throw new Error(p.error.message);
  if (k.error) throw new Error(k.error.message);
  return {
    punkty: (p.data as WazneInfoRow[]).map(rowToInfo),
    paczki: k.data as WazneInfoPaczka[],
  };
}

export type WazneInfoPatch = Partial<WazneInfoPunkt & { status: WazneInfo['status'] }>;

export async function updateWazneInfo(id: string, patch: WazneInfoPatch): Promise<void> {
  if (!isSupabaseConfigured()) {
    localUpdate((d) => {
      d.punkty = d.punkty.map((p) => (p.id === id ? { ...p, ...patch } : p));
    });
    return;
  }
  const { error } = await getSupabase().from('wazne_info').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function insertWazneInfo(punkt: WazneInfoPunkt): Promise<void> {
  if (!isSupabaseConfigured()) {
    localUpdate((d) => {
      d.punkty.unshift({
        id: newId(),
        ...punkt,
        messageId: null,
        nadawca: null,
        temat: null,
        otrzymano: null,
        status: 'nowe',
        paczkaId: null,
        createdAt: new Date().toISOString(),
      });
    });
    return;
  }
  const { error } = await getSupabase()
    .from('wazne_info')
    .insert({ id: newId(), ...punkt, status: 'nowe' });
  if (error) throw new Error(error.message);
}

export async function deleteWazneInfo(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    localUpdate((d) => {
      d.punkty = d.punkty.filter((p) => p.id !== id);
    });
    return;
  }
  const { error } = await getSupabase().from('wazne_info').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Zapisuje paczke (tekst wyslany na WhatsAppa) i oznacza jej punkty jako wyslane. */
export async function createPaczka(ids: string[], tekst: string): Promise<void> {
  const id = newId();
  if (!isSupabaseConfigured()) {
    localUpdate((d) => {
      d.paczki.unshift({ id, tekst, wyslano: new Date().toISOString() });
      d.punkty = d.punkty.map((p) => (ids.includes(p.id) ? { ...p, status: 'wyslane', paczkaId: id } : p));
    });
    return;
  }
  const supabase = getSupabase();
  const { error } = await supabase.from('wazne_info_paczki').insert({ id, tekst });
  if (error) throw new Error(error.message);
  const { error: e2 } = await supabase.from('wazne_info').update({ status: 'wyslane', paczka_id: id }).in('id', ids);
  if (e2) throw new Error(e2.message);
}

/** Woła funkcje serverless, ktora czyta skrzynke szkola@klippi.pl. */
export async function pullFromMail(): Promise<PullResult> {
  if (!isSupabaseConfigured()) throw new Error('Sprawdzanie skrzynki działa tylko po zalogowaniu do chmury');
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Zaloguj się w apce');
  const res = await fetch('/api/wazne-info-pull', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = (await res.json().catch(() => ({}))) as PullResult & { error?: string };
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

export interface UseWazneInfoResult {
  punkty: WazneInfo[];
  paczki: WazneInfoPaczka[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** Lista punktow i paczek z chmury; `reload` po kazdej zmianie. */
export function useWazneInfo(): UseWazneInfoResult {
  const [punkty, setPunkty] = useState<WazneInfo[]>([]);
  const [paczki, setPaczki] = useState<WazneInfoPaczka[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await fetchWazneInfo();
      setPunkty(data.punkty);
      setPaczki(data.paczki);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { punkty, paczki, loading, error, reload };
}
