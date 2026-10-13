// Zapis "Tablicy dzialu" - tabela tablice (scena Excalidraw jako jsonb).
// Jak zadania.ts: poza store i silnikiem sync, bo to pojedyncze dokumenty
// zyjace w chmurze. Kopia leci zawsze tez do localStorage - bez chmury (tryb
// "tylko ta przegladarka") albo przed migracja 0038 tablica i tak dziala.

import { getSupabase, isSupabaseConfigured } from './supabase';

/** Scena Excalidraw: elementy i wklejone obrazki. Typy trzyma komponent tablicy. */
export interface ScenaTablicy {
  elements: unknown[];
  files: Record<string, unknown>;
}

const localKey = (id: string) => `apka-szkolna:tablica:${id}`;

function czytajLokalnie(id: string): ScenaTablicy | null {
  try {
    const raw = localStorage.getItem(localKey(id));
    return raw ? (JSON.parse(raw) as ScenaTablicy) : null;
  } catch {
    return null;
  }
}

function zapiszLokalnie(id: string, scena: ScenaTablicy): boolean {
  try {
    localStorage.setItem(localKey(id), JSON.stringify(scena));
    return true;
  } catch {
    return false; // tryb prywatny albo za duze obrazki
  }
}

export async function wczytajTablice(id: string): Promise<ScenaTablicy | null> {
  if (!isSupabaseConfigured()) return czytajLokalnie(id);
  const { data, error } = await getSupabase().from('tablice').select('scena').eq('id', id).maybeSingle();
  if (error) return czytajLokalnie(id);
  return (data?.scena as ScenaTablicy | undefined) ?? czytajLokalnie(id);
}

/** Zwraca, gdzie zapisano: 'chmura' albo 'przegladarka'. */
export async function zapiszTablice(id: string, scena: ScenaTablicy): Promise<'chmura' | 'przegladarka'> {
  const lokalnie = zapiszLokalnie(id, scena);
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from('tablice').upsert({ id, scena });
    if (!error) return 'chmura';
  }
  if (!lokalnie) throw new Error('Nie udało się zapisać tablicy.');
  return 'przegladarka';
}
