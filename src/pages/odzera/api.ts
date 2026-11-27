// Kurs "Polski od zera": rozmowa z baza (funkcje od_zera_* z migracji 0046).
// Konto jest wspolne z portalem /uczen (ten sam klucz w localStorage), wiec kto
// zalogowal sie w portalu, nie loguje sie drugi raz. Wyniki, ktorych nie udalo
// sie wyslac (slaby internet w szkole), czekaja w localStorage i ida przy
// nastepnym starcie albo gdy wroci internet (jak kolejka w study-mate).

import { getSupabase } from '../../data/supabase';
import type { JezykOZ } from '../../data/odzera';
import { ODSTEPY_DNI, type Fiszka, type WynikOZ } from '../../lib/odzera';
import type { KontoUcznia } from '../portal/konto';

export interface StanKursu {
  tryb: 'lekcja' | 'dom' | null;
  jezyk: JezykOZ;
  login: string | null;
  /** Tryb lekcja: ile lekcji otwartych; tryb dom: null. */
  odblokowane: number | null;
  start: string | null;
  /** Czas serwera - do poprawki zegara telefonu. */
  teraz: string;
  /** Trwajaca godzina polskiego (tryb lekcja). */
  lekcja_od: string | null;
  lekcja_do: string | null;
  /** Poczatek nastepnej godziny polskiego. */
  nastepna: string | null;
  dni_polskiego: number[];
  wyniki: WynikOZ[];
  fiszki: Fiszka[];
}

export interface Zapis {
  lekcja: number;
  czesc: WynikOZ['czesc'];
  punkty: number;
  maks: number;
  xp: number;
  bledy: Array<{ pl: string; wpisane?: string }>;
  sekundy: number;
  ukonczona: boolean;
  fiszki: Array<{ i: string; k: boolean }>;
}

export async function zaloguj(login: string, haslo: string): Promise<KontoUcznia | 'zle' | 'blad'> {
  const { data, error } = await getSupabase().rpc('portal_zaloguj', { p_login: login, p_haslo: haslo });
  if (error) return 'blad';
  const k = (data as Array<{ id: string; jezyk: string; polski: boolean; klasa: string | null }> | null)?.[0];
  if (!k) return 'zle';
  return {
    id: k.id,
    haslo: haslo.trim().toLowerCase(),
    login: login.trim().toLowerCase(),
    jezyk: k.jezyk === 'es' ? 'es' : 'ua',
    polski: k.polski,
    klasa: k.klasa,
  };
}

export async function pobierzStan(konto: KontoUcznia): Promise<StanKursu | 'haslo' | 'blad'> {
  const { data, error } = await getSupabase().rpc('od_zera_stan', { p_id: konto.id, p_haslo: konto.haslo });
  if (error) return error.code === '28P01' ? 'haslo' : 'blad';
  const s = data as StanKursu;
  return { ...s, dni_polskiego: s.dni_polskiego ?? [], wyniki: s.wyniki ?? [], fiszki: s.fiszki ?? [] };
}

const kluczKolejki = (id: string) => `odzera-kolejka-${id}`;

function wczytajKolejke(id: string): Zapis[] {
  try {
    return JSON.parse(localStorage.getItem(kluczKolejki(id)) ?? '[]') as Zapis[];
  } catch {
    return [];
  }
}

function zapiszKolejke(id: string, lista: Zapis[]): void {
  try {
    if (lista.length) localStorage.setItem(kluczKolejki(id), JSON.stringify(lista));
    else localStorage.removeItem(kluczKolejki(id));
  } catch {
    // pelna pamiec - trudno, wynik przepadnie
  }
}

async function wyslij(konto: KontoUcznia, z: Zapis): Promise<boolean> {
  const { error } = await getSupabase().rpc('od_zera_zapisz', {
    p_id: konto.id,
    p_haslo: konto.haslo,
    p_lekcja: z.lekcja,
    p_czesc: z.czesc,
    p_punkty: z.punkty,
    p_maks: z.maks,
    p_xp: z.xp,
    p_bledy: z.bledy.slice(0, 200),
    p_sekundy: Math.round(z.sekundy),
    p_ukonczona: z.ukonczona,
    p_fiszki: z.fiszki.slice(0, 400),
  });
  return !error;
}

/** Wysyla wyniki, ktore czekaja w telefonie. Zwraca, ile jeszcze czeka. */
export async function wyslijZaleglosci(konto: KontoUcznia): Promise<number> {
  const lista = wczytajKolejke(konto.id);
  const zostaje: Zapis[] = [];
  for (const z of lista) {
    if (!(await wyslij(konto, z))) zostaje.push(z);
  }
  zapiszKolejke(konto.id, zostaje);
  return zostaje.length;
}

/** Zapis etapu lekcji. Gdy sie nie uda - do kolejki (wyslemy pozniej). */
export async function zapisz(konto: KontoUcznia, z: Zapis): Promise<boolean> {
  try {
    if (await wyslij(konto, z)) return true;
  } catch {
    // brak sieci
  }
  zapiszKolejke(konto.id, [...wczytajKolejke(konto.id), z]);
  return false;
}

/** Ta sama zmiana fiszek co w bazie (od_zera_zapisz) - zeby ekran od razu sie zgadzal. */
export function zmienFiszki(fiszki: Fiszka[], zmiany: Array<{ i: string; k: boolean }>, dzis: string, juzDzis: Set<string>): Fiszka[] {
  const m = new Map(fiszki.map((f) => [f.item, { ...f }]));
  const plus = (dni: number) => {
    const d = new Date(`${dzis}T12:00:00`);
    d.setDate(d.getDate() + dni);
    return d.toISOString().slice(0, 10);
  };
  for (const { i, k } of zmiany) {
    const f = m.get(i);
    if (!f) {
      const box = k ? 1 : 0;
      m.set(i, { item: i, box, due: plus(ODSTEPY_DNI[box]), last_known: k });
    } else if (!k) {
      m.set(i, { ...f, box: 0, due: plus(1), last_known: false });
    } else if (!juzDzis.has(i)) {
      const box = Math.min(f.box + 1, 4);
      m.set(i, { ...f, box, due: plus(ODSTEPY_DNI[box]), last_known: true });
    }
    juzDzis.add(i);
  }
  return [...m.values()];
}
