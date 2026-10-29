// Ktora klasa robila juz ktory arkusz wyrownawczy - tabela arkusze_postep
// (0040_arkusze_postep.sql). Jak tablice.ts: poza store i silnikiem sync, a kopia
// leci zawsze tez do localStorage - bez chmury albo przed migracja tez dziala.
// Zmiany, ktore nie doszly do chmury, czekaja w "oczekuje" i ida przy nastepnym wczytaniu.

import { getSupabase, isSupabaseConfigured } from './supabase';

/** "arkusz|klasa" -> data zrobienia ("RRRR-MM-DD"). */
export type PostepArkuszy = Record<string, string>;
/** "arkusz|klasa" -> data albo null (odznaczone), jeszcze niewyslane. */
type Oczekujace = Record<string, string | null>;

const LOCAL_KEY = 'apka-szkolna:arkusze-postep';
const OCZEKUJE_KEY = 'apka-szkolna:arkusze-postep-oczekuje';

export const kluczPostepu = (arkusz: string, classId: string) => `${arkusz}|${classId}`;

function czytaj<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function zapisz(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // tryb prywatny - zostaje sama chmura
  }
}

async function wyslij(id: string, doneOn: string | null): Promise<boolean> {
  const [arkusz, classId] = id.split('|');
  const tabela = getSupabase().from('arkusze_postep');
  const { error } = doneOn
    ? await tabela.upsert({ id, arkusz, class_id: classId, done_on: doneOn })
    : await tabela.delete().eq('id', id);
  return !error;
}

export async function wczytajPostepArkuszy(): Promise<PostepArkuszy> {
  const lokalnie = czytaj<PostepArkuszy>(LOCAL_KEY) ?? {};
  if (!isSupabaseConfigured()) return lokalnie;
  const oczekuje = czytaj<Oczekujace>(OCZEKUJE_KEY) ?? {};
  for (const [id, doneOn] of Object.entries(oczekuje)) {
    if (await wyslij(id, doneOn)) delete oczekuje[id];
  }
  zapisz(OCZEKUJE_KEY, oczekuje);
  const { data, error } = await getSupabase().from('arkusze_postep').select('id, done_on');
  if (error || !data) return lokalnie;
  const postep: PostepArkuszy = {};
  for (const row of data as Array<{ id: string; done_on: string }>) postep[row.id] = row.done_on;
  zapisz(LOCAL_KEY, postep);
  return postep;
}

/** `doneOn` = data zrobienia albo null, gdy odznaczamy. Zwraca, gdzie zapisano. */
export async function ustawPostepArkusza(
  arkusz: string,
  classId: string,
  doneOn: string | null,
): Promise<'chmura' | 'przegladarka'> {
  const id = kluczPostepu(arkusz, classId);
  const lokalnie = czytaj<PostepArkuszy>(LOCAL_KEY) ?? {};
  if (doneOn) lokalnie[id] = doneOn;
  else delete lokalnie[id];
  zapisz(LOCAL_KEY, lokalnie);
  if (isSupabaseConfigured() && (await wyslij(id, doneOn))) return 'chmura';
  zapisz(OCZEKUJE_KEY, { ...(czytaj<Oczekujace>(OCZEKUJE_KEY) ?? {}), [id]: doneOn });
  return 'przegladarka';
}
