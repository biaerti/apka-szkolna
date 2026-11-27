// Silnik kursu "Polski od zera" (szkola.klippi.pl/od-zera). Czyste funkcje bez Reacta:
// z listy slow i zdan lekcji (src/data/odzera) robi zadania, sprawdza odpowiedzi,
// liczy powtorki (pudelka Leitnera jak w study-mate), XP, poziom, serie i gwiazdki.
// Ekrany: src/pages/odzera/. Plan kursu: docs/kurs-od-zera-plan.md.

import { DZIALY, LEKCJE, type DzialOZ, type JezykOZ, type LekcjaOZ, type ZasadaOZ } from '../data/odzera';
import { wymowa } from './odzeraWymowa';

// ---------------------------------------------------------------- karty

/** Jedno slowo albo zdanie kursu - to, co uczen poznaje i powtarza (fiszka). */
export interface Karta {
  /** Id fiszki i nazwa nagrania (slug polskiego tekstu). */
  id: string;
  pl: string;
  e: string;
  ru: string;
  ua: string;
  wym?: { ru?: string; ua?: string };
  lektor?: string;
  zdanie: boolean;
  lekcja: number;
}

const BEZ_OGONKOW: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };

/** Nazwa pliku nagrania - taka sama jak slug() w tools/odzera-audio.py. */
export function slugOZ(tekst: string): string {
  return tekst
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => BEZ_OGONKOW[c])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function audioUrl(k: { pl: string } | string): string {
  return `/audio/odzera/${slugOZ(typeof k === 'string' ? k : k.pl)}.mp3`;
}

function zbudujKarty(): Map<string, Karta> {
  const m = new Map<string, Karta>();
  for (const l of LEKCJE) {
    for (const s of l.slowa) {
      const id = slugOZ(s.pl);
      if (!m.has(id)) m.set(id, { id, pl: s.pl, e: s.e, ru: s.ru, ua: s.ua, wym: s.wym, lektor: s.lektor, zdanie: false, lekcja: l.nr });
    }
    for (const z of l.zdania ?? []) {
      const id = slugOZ(z.pl);
      if (!m.has(id)) m.set(id, { id, pl: z.pl, e: z.e ?? '💬', ru: z.ru, ua: z.ua, lektor: z.lektor, zdanie: true, lekcja: l.nr });
    }
  }
  return m;
}

export const KARTY: Map<string, Karta> = zbudujKarty();

export function kartyLekcji(nr: number): Karta[] {
  return [...KARTY.values()].filter((k) => k.lekcja === nr);
}

export function kartyDzialu(d: DzialOZ): Karta[] {
  const nry = new Set(d.lekcje.map((l) => l.nr));
  return [...KARTY.values()].filter((k) => nry.has(k.lekcja));
}

export function tlum(k: { ru: string; ua: string }, j: JezykOZ): string {
  return k[j];
}

export function wymowaKarty(k: Karta, j: JezykOZ): string {
  return k.wym?.[j] ?? wymowa(k.pl, j);
}

// ---------------------------------------------------------------- losowanie

/** Generator liczb z ziarnem (mulberry32) - te same zadania przy tym samym ziarnie. */
export function rng(ziarno: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < ziarno.length; i++) {
    h = Math.imul(h ^ ziarno.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function tasuj<T>(lista: T[], r: () => number): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------- zadania

export type TypZadania =
  | 'zasada'
  | 'poznaj'
  | 'sluchaj'
  | 'obrazek'
  | 'czytaj'
  | 'tlumacz'
  | 'pary'
  | 'litery'
  | 'zdanie'
  | 'napisz';

export type Zadanie =
  | { typ: 'zasada'; klucz: string; zasada: ZasadaOZ; przyklady: Karta[] }
  | { typ: 'poznaj'; klucz: string; karta: Karta }
  | { typ: 'sluchaj' | 'obrazek' | 'czytaj' | 'tlumacz'; klucz: string; karta: Karta; opcje: Karta[] }
  | { typ: 'pary'; klucz: string; karty: Karta[] }
  | { typ: 'litery' | 'zdanie'; klucz: string; karta: Karta; kafelki: string[] }
  | { typ: 'napisz'; klucz: string; karta: Karta };

export const OCENIANE: TypZadania[] = ['sluchaj', 'obrazek', 'czytaj', 'tlumacz', 'pary', 'litery', 'zdanie', 'napisz'];

export function oceniane(z: Zadanie): boolean {
  return OCENIANE.includes(z.typ);
}

/** Karty, ktore zadanie sprawdza (do fiszek i do bledow). */
export function kartyZadania(z: Zadanie): Karta[] {
  if (z.typ === 'pary') return z.karty;
  if (z.typ === 'zasada') return [];
  return [z.karta];
}

/** Polecenie zadania po polsku (z nagraniem) i w jezyku ucznia. */
export const POLECENIA: Record<TypZadania, { pl: string; ru: string; ua: string }> = {
  zasada: { pl: 'Popatrz i posłuchaj.', ru: 'Посмотри и послушай.', ua: 'Подивись і послухай.' },
  poznaj: { pl: 'Posłuchaj i powtórz.', ru: 'Послушай и повтори вслух.', ua: 'Послухай і повтори вголос.' },
  sluchaj: { pl: 'Posłuchaj i wybierz obrazek.', ru: 'Послушай и выбери картинку.', ua: 'Послухай і вибери малюнок.' },
  obrazek: { pl: 'Wybierz słowo.', ru: 'Выбери слово.', ua: 'Вибери слово.' },
  czytaj: { pl: 'Przeczytaj i wybierz obrazek.', ru: 'Прочитай и выбери картинку.', ua: 'Прочитай і вибери малюнок.' },
  tlumacz: { pl: 'Co to znaczy?', ru: 'Что это значит?', ua: 'Що це означає?' },
  pary: { pl: 'Połącz w pary.', ru: 'Соедини пары.', ua: "З'єднай пари." },
  litery: { pl: 'Ułóż słowo.', ru: 'Составь слово из букв.', ua: 'Склади слово з літер.' },
  zdanie: { pl: 'Ułóż zdanie.', ru: 'Составь предложение.', ua: 'Склади речення.' },
  napisz: { pl: 'Napisz, co słyszysz.', ru: 'Напиши, что слышишь.', ua: 'Напиши, що чуєш.' },
};

export const POLECENIE_ZESZYT = { pl: 'Przepisz do zeszytu.', ru: 'Перепиши в тетрадь.', ua: 'Перепиши в зошит.' };

/** Tekst bez interpunkcji na koncach (do kafelkow i porownan). */
export function bezInterpunkcji(t: string): string {
  return t.replace(/[.,!?;:…„”"«»()]/g, '').replace(/\s+/g, ' ').trim();
}

/** Slowo nadaje sie do ukladania z liter: jedno slowo, 3-9 liter. */
export function doLiter(k: Karta): boolean {
  const t = bezInterpunkcji(k.pl);
  return !k.zdanie && !t.includes(' ') && [...t].length >= 3 && [...t].length <= 9;
}

/** Do pisania ze sluchu: slowo albo krotki zwrot (najwyzej 3 wyrazy). */
export function doPisania(k: Karta): boolean {
  return bezInterpunkcji(k.pl).split(' ').length <= (k.zdanie ? 4 : 3);
}

const MYLONE: Record<string, string> = { l: 'ł', ł: 'l', z: 'ż', ż: 'z', o: 'ó', ó: 'o', u: 'ó', s: 'ś', c: 'ć', n: 'ń', e: 'ę', a: 'ą', y: 'i', i: 'y', h: 'ch' };

/** Rozsypane litery slowa + 1-2 litery do pomylenia (l/ł, z/ż, o/ó). */
export function kafelkiLiter(k: Karta, r: () => number): string[] {
  const litery = [...bezInterpunkcji(k.pl).toLowerCase()];
  const myl = tasuj(
    litery.map((l) => MYLONE[l]).filter((x): x is string => Boolean(x) && x.length === 1 && !litery.includes(x)),
    r,
  );
  const dodatkowe = [...new Set(myl)].slice(0, litery.length > 5 ? 2 : 1);
  let wynik = tasuj([...litery, ...dodatkowe], r);
  // nie pokazujemy od razu dobrej kolejnosci
  if (wynik.join('') === litery.join('') && litery.length > 1) wynik = [...wynik.slice(1), wynik[0]];
  return wynik;
}

/** Rozsypane wyrazy zdania + 1 wyraz z innego zdania. */
export function kafelkiZdania(k: Karta, inne: Karta[], r: () => number): string[] {
  const wyrazy = bezInterpunkcji(k.pl).split(' ');
  const obce = tasuj(
    inne.flatMap((x) => bezInterpunkcji(x.pl).split(' ')).filter((w) => !wyrazy.some((y) => y.toLowerCase() === w.toLowerCase())),
    r,
  );
  const dodatkowe = obce.length ? [obce[0]] : [];
  let wynik = tasuj([...wyrazy, ...dodatkowe], r);
  if (wynik.slice(0, wyrazy.length).join(' ') === wyrazy.join(' ') && wyrazy.length > 1) wynik = [...wynik.slice(1), wynik[0]];
  return wynik;
}

/** 3 bledne opcje do karty: inny obrazek, inny tekst, inne tlumaczenie; najpierw z tej samej lekcji. */
export function dystraktory(k: Karta, pula: Karta[], r: () => number, ile = 3): Karta[] {
  const pasuje = (x: Karta) =>
    x.id !== k.id && x.e !== k.e && x.zdanie === k.zdanie && x.ru !== k.ru && x.ua !== k.ua && bezInterpunkcji(x.pl) !== bezInterpunkcji(k.pl);
  const blisko = tasuj(pula.filter((x) => pasuje(x) && x.lekcja === k.lekcja), r);
  const dalej = tasuj(pula.filter((x) => pasuje(x) && x.lekcja !== k.lekcja), r);
  const wynik: Karta[] = [];
  for (const x of [...blisko, ...dalej]) {
    if (wynik.length >= ile) break;
    if (wynik.some((y) => y.e === x.e)) continue;
    wynik.push(x);
  }
  return wynik;
}

/** Karty dostepne jako opcje: wszystko z lekcji do `nr` wlacznie (zeby opcje byly znajome). */
export function pulaDo(nr: number): Karta[] {
  return [...KARTY.values()].filter((k) => k.lekcja <= nr);
}

function wybor(
  typ: 'sluchaj' | 'obrazek' | 'czytaj' | 'tlumacz',
  k: Karta,
  pula: Karta[],
  r: () => number,
  sufiks = '',
): Zadanie | null {
  const ile = typ === 'tlumacz' ? 2 : 3;
  const zle = dystraktory(k, pula, r, ile);
  if (zle.length < Math.min(ile, 2)) return null;
  return { typ, klucz: `${typ}:${k.id}${sufiks}`, karta: k, opcje: tasuj([k, ...zle], r) };
}

/** Etap "Nowe": zasady, potem slowa po 3 (poznaj x3 + posluchaj i wybierz), na koncu zdania. */
export function zadaniaNowe(l: LekcjaOZ, r: () => number): Zadanie[] {
  const out: Zadanie[] = [];
  const pula = pulaDo(l.nr);
  for (const [i, z] of (l.zasady ?? []).entries()) {
    out.push({
      typ: 'zasada',
      klucz: `zasada:${l.nr}:${i}`,
      zasada: z,
      przyklady: z.przyklady.map((p) => KARTY.get(slugOZ(p))).filter((x): x is Karta => Boolean(x)),
    });
  }
  const slowa = kartyLekcji(l.nr).filter((k) => !k.zdanie);
  for (let i = 0; i < slowa.length; i += 3) {
    const grupa = slowa.slice(i, i + 3);
    for (const k of grupa) out.push({ typ: 'poznaj', klucz: `poznaj:${k.id}`, karta: k });
    for (const k of tasuj(grupa, r)) {
      const z = wybor('sluchaj', k, pula, r, ':n');
      if (z) out.push(z);
    }
  }
  for (const k of kartyLekcji(l.nr).filter((x) => x.zdanie)) out.push({ typ: 'poznaj', klucz: `poznaj:${k.id}`, karta: k });
  return out;
}

/**
 * Etap "Ćwiczenia": od rozpoznawania do pisania. Krotka wersja (tryb dom) ma
 * ok. 16 zadan, pelna (lekcja 45 min) ok. 28.
 */
export function zadaniaCwiczenia(l: LekcjaOZ, r: () => number, krotko = false): Zadanie[] {
  const pula = pulaDo(l.nr);
  const karty = kartyLekcji(l.nr);
  const slowa = tasuj(karty.filter((k) => !k.zdanie), r);
  const zdania = tasuj(karty.filter((k) => k.zdanie), r);
  const a: Zadanie[] = [];
  const b: Zadanie[] = [];
  const c: Zadanie[] = [];
  slowa.forEach((k, i) => {
    const z = wybor(i % 2 ? 'czytaj' : 'obrazek', k, pula, r);
    if (z) a.push(z);
  });
  const pary = (grupa: Karta[], n: number): Zadanie | null =>
    grupa.length >= 3 ? { typ: 'pary', klucz: `pary:${l.nr}:${n}`, karty: grupa } : null;
  const p1 = pary(slowa.slice(0, 4), 1);
  if (p1) a.push(p1);
  for (const k of slowa) {
    if (doLiter(k)) b.push({ typ: 'litery', klucz: `litery:${k.id}`, karta: k, kafelki: kafelkiLiter(k, r) });
    else {
      const z = wybor('tlumacz', k, pula, r);
      if (z) b.push(z);
    }
  }
  for (const k of zdania) {
    const z = wybor('tlumacz', k, pula, r);
    if (z) b.push(z);
  }
  const p2 = pary(slowa.slice(4, 8).length >= 3 ? slowa.slice(4, 8) : slowa.slice(-4), 2);
  if (p2) c.push(p2);
  for (const k of zdania) c.push({ typ: 'zdanie', klucz: `zdanie:${k.id}`, karta: k, kafelki: kafelkiZdania(k, zdania, r) });
  // pisanie: w pierwszych lekcjach mniej (dziecko dopiero poznaje litery)
  const ilePisania = l.nr <= 6 ? 3 : 5;
  for (const k of slowa.filter(doPisania).slice(0, ilePisania)) c.push({ typ: 'napisz', klucz: `napisz:${k.id}`, karta: k });

  let wynik = [...tasuj(a, r), ...tasuj(b, r), ...tasuj(c, r)];
  if (krotko) {
    // co drugie zadanie z rozpoznawania i ukladania, cale pisanie zostaje
    const krotkieA = tasuj(a, r).slice(0, Math.ceil(a.length / 2));
    const krotkieB = tasuj(b, r).slice(0, Math.ceil(b.length / 2));
    const krotkieC = tasuj(c, r).slice(0, Math.ceil(c.length * 0.7));
    wynik = [...krotkieA, ...krotkieB, ...krotkieC];
  }
  return wynik;
}

/** Zadanie do jednej karty wedlug tego, jak dobrze uczen ja zna (pudelko 0-4). */
export function zadanieDoKarty(k: Karta, box: number, pula: Karta[], r: () => number, sufiks: string): Zadanie | null {
  if (k.zdanie) {
    if (box <= 1) return wybor('tlumacz', k, pula, r, sufiks);
    const inne = pula.filter((x) => x.zdanie && x.id !== k.id);
    return { typ: 'zdanie', klucz: `zdanie:${k.id}${sufiks}`, karta: k, kafelki: kafelkiZdania(k, tasuj(inne, r).slice(0, 3), r) };
  }
  if (box <= 0) return wybor('sluchaj', k, pula, r, sufiks);
  if (box === 1) return wybor(r() < 0.5 ? 'czytaj' : 'sluchaj', k, pula, r, sufiks);
  if (box === 2) return doLiter(k) && r() < 0.5 ? { typ: 'litery', klucz: `litery:${k.id}${sufiks}`, karta: k, kafelki: kafelkiLiter(k, r) } : wybor('obrazek', k, pula, r, sufiks);
  if (doPisania(k)) return { typ: 'napisz', klucz: `napisz:${k.id}${sufiks}`, karta: k };
  return wybor('obrazek', k, pula, r, sufiks);
}

/** Test na koniec dzialu ("Sprawdź się"): ok. 20 zadan z calego dzialu, bez powtarzania. */
export function zadaniaTestu(d: DzialOZ, r: () => number): Zadanie[] {
  const ostatnia = Math.max(...d.lekcje.map((l) => l.nr));
  const pula = pulaDo(ostatnia);
  const karty = kartyDzialu(d);
  const slowa = tasuj(karty.filter((k) => !k.zdanie), r);
  const zdania = tasuj(karty.filter((k) => k.zdanie), r);
  const out: Zadanie[] = [];
  const dodaj = (z: Zadanie | null) => z && out.push(z);
  slowa.slice(0, 6).forEach((k) => dodaj(wybor('sluchaj', k, pula, r, ':t')));
  slowa.slice(6, 10).forEach((k) => dodaj(wybor('czytaj', k, pula, r, ':t')));
  slowa.slice(10, 13).forEach((k) => dodaj(wybor('obrazek', k, pula, r, ':t')));
  zdania.slice(0, 3).forEach((k) => dodaj(wybor('tlumacz', k, pula, r, ':t')));
  zdania.slice(3, 6).forEach((k) => out.push({ typ: 'zdanie', klucz: `zdanie:${k.id}:t`, karta: k, kafelki: kafelkiZdania(k, zdania, r) }));
  slowa
    .slice(13)
    .filter(doPisania)
    .slice(0, 4)
    .forEach((k) => out.push({ typ: 'napisz', klucz: `napisz:${k.id}:t`, karta: k }));
  return tasuj(out, r);
}

// ---------------------------------------------------------------- sprawdzanie

export type Ocena = 'dobrze' | 'ogonki' | 'zle';

const normuj = (t: string) => bezInterpunkcji(t).toLowerCase().replace(/[‘’`]/g, "'");
const zlozOgonki = (t: string) => t.replace(/[ąćęłńóśźż]/g, (c) => BEZ_OGONKOW[c]);

/** Sprawdza wpisany tekst: dobrze / dobrze bez polskich liter / zle. Wielka litera i kropka nie licza sie. */
export function sprawdzTekst(wpisane: string, wzor: string): Ocena {
  const a = normuj(wpisane);
  const b = normuj(wzor);
  if (a === b) return 'dobrze';
  if (zlozOgonki(a) === zlozOgonki(b)) return 'ogonki';
  return 'zle';
}

// ---------------------------------------------------------------- powtorki (fiszki)

export interface Fiszka {
  item: string;
  box: number;
  /** Data YYYY-MM-DD, od kiedy powtarzac. */
  due: string;
  last_known: boolean | null;
}

export const ODSTEPY_DNI = [1, 2, 4, 7, 14];

/** Fiszki na dzis: termin minal, najpierw najstarsze i najslabsze. Tylko karty, ktore sa w kursie. */
export function fiszkiNaDzis(fiszki: Fiszka[], dzis: string, limit = 15): Fiszka[] {
  return fiszki
    .filter((f) => f.due <= dzis && KARTY.has(f.item))
    .sort((a, b) => (a.due === b.due ? a.box - b.box : a.due < b.due ? -1 : 1))
    .slice(0, limit);
}

/** Etap "Powtórka": po jednym zadaniu na fiszke, rodzaj zadania wg pudelka. */
export function zadaniaPowtorki(fiszki: Fiszka[], r: () => number): Zadanie[] {
  const maxLekcja = Math.max(1, ...fiszki.map((f) => KARTY.get(f.item)?.lekcja ?? 1));
  const pula = pulaDo(maxLekcja);
  const out: Zadanie[] = [];
  for (const f of fiszki) {
    const k = KARTY.get(f.item);
    if (!k) continue;
    const z = zadanieDoKarty(k, f.box, pula, r, ':p');
    if (z) out.push(z);
  }
  return tasuj(out, r);
}

/**
 * Etap "Do dzwonka": kolejne zadanie z kart juz poznanych, czesciej slabe
 * (niskie pudelko, bledy). `ostatnie` - id kart z ostatnich zadan, zeby sie nie powtarzaly.
 */
export function zadanieDzwonek(pula: Karta[], fiszki: Map<string, Fiszka>, r: () => number, ostatnie: string[], n: number): Zadanie | null {
  const kandydaci = pula.filter((k) => !ostatnie.includes(k.id));
  const lista = kandydaci.length ? kandydaci : pula;
  if (!lista.length) return null;
  const wagi = lista.map((k) => {
    const f = fiszki.get(k.id);
    const box = f?.box ?? 0;
    return (5 - box) ** 2 + (f?.last_known === false ? 6 : 0);
  });
  let los = r() * wagi.reduce((s, w) => s + w, 0);
  let k = lista[lista.length - 1];
  for (let i = 0; i < lista.length; i++) {
    los -= wagi[i];
    if (los <= 0) {
      k = lista[i];
      break;
    }
  }
  const box = fiszki.get(k.id)?.box ?? 0;
  // co kilka zadan troche trudniej niz pudelko (zeby nie bylo nudno)
  const poziom = Math.min(4, box + (r() < 0.35 ? 1 : 0));
  const maxLekcja = Math.max(...pula.map((x) => x.lekcja));
  return zadanieDoKarty(k, poziom, pulaDo(maxLekcja), r, `:d${n}`);
}

// ---------------------------------------------------------------- postep, XP, seria

export interface WynikOZ {
  lekcja: number;
  czesc: 'powtorka' | 'lekcja' | 'zeszyt' | 'dzwonek';
  punkty: number;
  maks: number;
  xp: number;
  sekundy: number | null;
  ukonczona: boolean;
  created_at: string;
}

export const XP_ZA_ZADANIE = 10;
export const XP_ZA_POPRAWKE = 4;
export const XP_ZA_LEKCJE = 30;
export const XP_ZA_ZESZYT = 15;

export function sumaXp(wyniki: WynikOZ[]): number {
  return wyniki.reduce((s, w) => s + (w.xp ?? 0), 0);
}

/** Poziom: 1 od 0 XP, 2 od 100, 3 od 300, 4 od 600, 5 od 1000... (kazdy o 100 dluzszy). */
export function poziom(xp: number): { poziom: number; od: number; do: number } {
  let n = 1;
  while (50 * (n + 1) * n <= xp) n++;
  return { poziom: n, od: 50 * n * (n - 1), do: 50 * (n + 1) * n };
}

export function gwiazdki(punkty: number, maks: number): 0 | 1 | 2 | 3 {
  if (maks <= 0) return 0;
  const p = punkty / maks;
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : 1;
}

export function lekcjaZrobiona(nr: number, wyniki: WynikOZ[]): boolean {
  return wyniki.some((w) => w.lekcja === nr && w.czesc === 'lekcja' && w.ukonczona);
}

/** Najlepszy wynik lekcji (do gwiazdek na mapie). */
export function najlepszyWynik(nr: number, wyniki: WynikOZ[]): WynikOZ | null {
  const proby = wyniki.filter((w) => w.lekcja === nr && w.czesc === 'lekcja' && w.ukonczona);
  if (!proby.length) return null;
  return proby.reduce((a, b) => (b.punkty / Math.max(1, b.maks) > a.punkty / Math.max(1, a.maks) ? b : a));
}

export type StanLekcji = 'zrobiona' | 'teraz' | 'otwarta' | 'zamknieta' | 'wkrotce';

/**
 * Stan kazdej lekcji kursu. `odblokowane` = null w trybie dom (po kolei, bez zegara).
 * "teraz" = pierwsza niezrobiona lekcja, jesli wolno ja zaczac.
 */
export function stanyLekcji(wyniki: WynikOZ[], odblokowane: number | null): Map<number, StanLekcji> {
  const m = new Map<number, StanLekcji>();
  let teraz = false;
  for (const l of LEKCJE) {
    if (lekcjaZrobiona(l.nr, wyniki)) {
      m.set(l.nr, 'zrobiona');
      continue;
    }
    const wolno = odblokowane === null ? !teraz : l.nr <= odblokowane && !teraz;
    if (wolno) {
      m.set(l.nr, 'teraz');
      teraz = true;
    } else if (odblokowane !== null && l.nr <= odblokowane) {
      m.set(l.nr, 'otwarta');
    } else {
      m.set(l.nr, 'zamknieta');
    }
  }
  return m;
}

export function nastepnaLekcja(wyniki: WynikOZ[], odblokowane: number | null): LekcjaOZ | null {
  const stany = stanyLekcji(wyniki, odblokowane);
  return LEKCJE.find((l) => stany.get(l.nr) === 'teraz') ?? null;
}

/** Klucz dnia YYYY-MM-DD w czasie polskim. */
export function dzienPL(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(d);
}

/**
 * Seria: ile kolejnych "dni nauki" z rzedu uczen cos zrobil. Dni nauki to dni
 * tygodnia z polskim (tryb lekcja) albo pon-pt (tryb dom); inne dni serii nie
 * przerywaja. Dzisiaj, jeszcze bez nauki, tez jej nie przerywa.
 */
export function seria(aktywne: Set<string>, dniNauki: number[], dzis: Date): number {
  const dni = dniNauki.length ? dniNauki : [1, 2, 3, 4, 5];
  let n = 0;
  const d = new Date(dzis);
  for (let i = 0; i < 400; i++) {
    const klucz = dzienPL(d);
    const dow = ((d.getDay() + 6) % 7) + 1;
    if (aktywne.has(klucz)) n++;
    else if (dni.includes(dow) && i > 0) break;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// ---------------------------------------------------------------- zeszyt

/** Linijki do zeszytu: slowa i zdania z tlumaczeniem, inne linijki bez zmian. */
export function linieZeszytu(l: LekcjaOZ, j: JezykOZ): Array<{ pl: string; tlum?: string }> {
  return (l.zeszyt ?? []).map((pl) => {
    const k = KARTY.get(slugOZ(pl));
    return k ? { pl, tlum: tlum(k, j) } : { pl };
  });
}

export function dzialLekcjiNr(nr: number): DzialOZ | undefined {
  return DZIALY.find((d) => d.lekcje.some((l) => l.nr === nr));
}
