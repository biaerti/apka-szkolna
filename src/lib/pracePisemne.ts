// Prace pisemne uczniow - typy i logika bez sieci (dopasowanie podpisu do ucznia,
// odczyt paczki importu). Dostep do Supabase: src/data/pracePisemne.ts.
//
// Paczke przygotowuje Claude z fotek Bartka: folder z `prace.json` i zdjeciami
// `zdjecia/<klasa>/<plik>.jpg`. Klucze w `dane` sa takie, jak w prace.json
// (snake_case), zeby nic nie trzeba bylo przemapowywac.

import type { Student } from '../data/types';

export type Blad = [napisane: string, poprawnie: string];

export interface InformacjaDlaUcznia {
  brawo: string[];
  popraw: string[];
  nastepnym_razem: string;
}

/** Wszystko, co mowi cos o dziecku - w chmurze zaszyfrowane jednym kawalkiem. */
export interface PracaDane {
  podpis: string;
  plec?: 'd' | 'ch' | '?';
  szablon_z_cwiczen?: boolean;
  transkrypcja: string;
  czesci_listu?: Record<string, boolean | string>;
  akapity?: boolean;
  zwroty_wielka_litera?: string;
  tresc?: string;
  bledy_ortograficzne?: Blad[];
  bledy_interpunkcyjne?: Blad[];
  inne_bledy?: Blad[];
  pismo?: string;
  dlugosc_slow?: number;
  ocena: string;
  uzasadnienie_oceny?: string;
  opinia_dla_nauczyciela: string;
  informacja_dla_ucznia: InformacjaDlaUcznia;
  uwagi?: string;
}

export interface PracaPisemna {
  id: string;
  classId: string;
  studentId: string | null;
  /** Stały klucz zadania, np. "list-chlopcy-z-placu-broni". */
  zadanie: string;
  tytul: string;
  /** RRRR-MM-DD */
  data: string;
  dane: PracaDane;
  /** Ścieżki w buckecie "prace" (losowe nazwy, zaszyfrowane bajty). */
  zdjecia: string[];
}

// --- paczka importu ---------------------------------------------------------------

export interface PaczkaPraca extends PracaDane {
  nr: number;
  /** Nazwy plików w zdjecia/<klasa>/ */
  zdjecia: string[];
}

export interface PaczkaKlasa {
  klasa: string;
  prace: PaczkaPraca[];
}

export interface Paczka {
  zadanie: string;
  tytul: string;
  data: string;
  klasy: PaczkaKlasa[];
}

export function czytajPaczke(json: string): Paczka {
  const p = JSON.parse(json) as Partial<Paczka>;
  if (!p || typeof p.zadanie !== 'string' || typeof p.tytul !== 'string' || !Array.isArray(p.klasy)) {
    throw new Error('To nie jest paczka prac (brak pól zadanie / tytul / klasy w prace.json).');
  }
  return { zadanie: p.zadanie, tytul: p.tytul, data: p.data ?? new Date().toISOString().slice(0, 10), klasy: p.klasy };
}

const RZYMSKIE: Array<[string, string]> = [
  ['viii', '8'], ['vii', '7'], ['vi', '6'], ['iv', '4'], ['v', '5'], ['iii', '3'], ['ii', '2'], ['i', '1'],
];

/** "IV A" / "4 a" / "4A" / "Klasa 4a" -> "4a" */
export function kluczKlasy(nazwa: string): string {
  let s = nazwa.toLowerCase().replace(/klasa/g, '').trim();
  for (const [rz, cyfra] of RZYMSKIE) {
    const m = new RegExp(`^${rz}(?![a-z]{2})\\s*([a-z])?$`).exec(s.replace(/[^a-z0-9 ]/g, '').trim());
    if (m) {
      s = cyfra + (m[1] ?? '');
      break;
    }
  }
  return s.replace(/[^0-9a-z]/g, '');
}

// --- dopasowanie podpisu ------------------------------------------------------------

export function bezPolskich(s: string): string {
  return s
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
}

/** Zdrobnienia, którymi dzieci się podpisują -> pełne imię (bez polskich znaków). */
const ZDROBNIENIA: Record<string, string[]> = {
  ola: ['aleksandra'], ala: ['alicja', 'aleksandra'], olek: ['aleksander'], olus: ['aleksander', 'aleksandra'],
  ania: ['anna'], asia: ['joanna'], basia: ['barbara'], kasia: ['katarzyna'], gosia: ['malgorzata'],
  zosia: ['zofia'], zuzia: ['zuzanna'], madzia: ['magdalena'], marysia: ['maria', 'marianna'], hania: ['hanna'],
  julka: ['julia'], natka: ['natalia'], ewka: ['ewa'], wiktoria: ['wiktoria'], tosia: ['antonina'], lena: ['helena', 'lena'],
  nela: ['aniela', 'kornelia', 'nela'], igusia: ['iga'], amelka: ['amelia'], majka: ['maja'], iza: ['izabela'],
  kuba: ['jakub'], antek: ['antoni'], franek: ['franciszek'], stas: ['stanislaw'], jas: ['jan'], janek: ['jan'],
  wojtek: ['wojciech'], bartek: ['bartosz', 'bartlomiej'], tomek: ['tomasz'], kacperek: ['kacper'], michas: ['michal'],
  maciek: ['maciej'], jedrek: ['jedrzej'], krzys: ['krzysztof'], krzysiek: ['krzysztof'], piotrek: ['piotr'],
  pawel: ['pawel'], szymek: ['szymon'], mati: ['mateusz', 'mateo'], mateuszek: ['mateusz'], adas: ['adam'], tymek: ['tymon', 'tymoteusz'],
  filipek: ['filip'], leon: ['leon'], igor: ['igor'], wiktorek: ['wiktor'], kazio: ['kazimierz'], ignas: ['ignacy'],
  dawidek: ['dawid'], nikodem: ['nikodem'], niko: ['nikodem', 'nikola'], gabi: ['gabriela'], ula: ['urszula'],
};

/** Prefiks wystarczy (np. podpis "Jan K" albo "Kowalsk" bez końcówki). */
function zgodne(slowo: string, wzor: string): boolean {
  if (!slowo || !wzor) return false;
  if (slowo === wzor) return true;
  if (slowo.length >= 3 && wzor.startsWith(slowo)) return true;
  if (wzor.length >= 4 && slowo.startsWith(wzor)) return true;
  return false;
}

function zgodneImie(slowo: string, imie: string): boolean {
  if (zgodne(slowo, imie)) return true;
  return (ZDROBNIENIA[slowo] ?? []).some((pelne) => pelne === imie);
}

/** Punkty: imię 2, nazwisko 3 (łącznie z inicjałem nazwiska: 1). */
export function punktyPodpisu(podpis: string, student: Pick<Student, 'firstName' | 'lastName'>): number {
  const slowa = podpis
    .split(/[\s,.;:!()[\]?„”"-]+/)
    // "4A" przy nazwisku to klasa, nie inicjał
    .filter((s) => !/\d/.test(s))
    .map(bezPolskich)
    .filter((s) => s.length > 0)
    // "Twój kolega", "Pozdrawiam" itp. nie są podpisem
    .filter((s) => !['twoj', 'twoja', 'kolega', 'kolezanka', 'syn', 'corka', 'wnuk', 'wnuczek', 'wnuczka', 'kuzyn', 'kuzynka', 'brak', 'podpisu', 'u', 'gory', 'olowkiem', 'serdecznie', 'pozdrowienia', 'przyjaciel', 'przyjaciolka', 'pozdrawiam', 'brat', 'siostra'].includes(s));
  const imie = bezPolskich(student.firstName);
  const nazwisko = bezPolskich(student.lastName);
  let pkt = 0;
  let imieTrafione = false;
  let nazwiskoTrafione = false;
  for (const s of slowa) {
    if (!imieTrafione && zgodneImie(s, imie)) {
      pkt += 2;
      imieTrafione = true;
    } else if (!nazwiskoTrafione && zgodne(s, nazwisko)) {
      pkt += 3;
      nazwiskoTrafione = true;
    } else if (!nazwiskoTrafione && s.length === 1 && nazwisko.startsWith(s)) {
      pkt += 1;
      nazwiskoTrafione = true;
    }
  }
  return pkt;
}

/**
 * Uczeń, którego podpis wskazuje jednoznacznie, albo null (wtedy Bartek wybiera ręcznie).
 * `zajeci` - uczniowie przypisani już do innej pracy z tej paczki.
 */
export function dopasujUcznia(podpis: string, uczniowie: Student[], zajeci: Set<string> = new Set()): string | null {
  const wyniki = uczniowie
    .filter((s) => s.active && !zajeci.has(s.id))
    .map((s) => ({ id: s.id, pkt: punktyPodpisu(podpis, s) }))
    .filter((w) => w.pkt > 0)
    .sort((a, b) => b.pkt - a.pkt);
  if (wyniki.length === 0) return null;
  if (wyniki.length > 1 && wyniki[1].pkt === wyniki[0].pkt) return null;
  return wyniki[0].id;
}

/** Przypisania dla całej klasy z paczki: najpierw pewniejsze (dłuższe podpisy), potem reszta. */
export function dopasujKlase(prace: Pick<PaczkaPraca, 'podpis'>[], uczniowie: Student[]): (string | null)[] {
  const wynik: (string | null)[] = prace.map(() => null);
  const zajeci = new Set<string>();
  const kolejnosc = prace
    .map((p, i) => ({ i, max: Math.max(0, ...uczniowie.map((s) => punktyPodpisu(p.podpis, s))) }))
    .sort((a, b) => b.max - a.max);
  for (const { i } of kolejnosc) {
    const id = dopasujUcznia(prace[i].podpis, uczniowie, zajeci);
    if (id) {
      wynik[i] = id;
      zajeci.add(id);
    }
  }
  return wynik;
}

// --- do wydruku ------------------------------------------------------------------------

export const CZESCI_LISTU: Array<[klucz: string, nazwa: string]> = [
  ['miejsce_data', 'miejscowość i data'],
  ['naglowek', 'nagłówek'],
  ['wstep', 'wstęp'],
  ['rozwiniecie', 'rozwinięcie'],
  ['zakonczenie', 'zakończenie'],
  ['pozdrowienia', 'pozdrowienia'],
  ['podpis', 'podpis'],
];

export function maCzesc(dane: PracaDane, klucz: string): boolean {
  const v = dane.czesci_listu?.[klucz];
  return typeof v === 'string' ? v.trim().length > 0 : Boolean(v);
}
