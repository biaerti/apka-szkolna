// Kurs "Polski krok po kroku": postepy ucznia i rytm tygodnia.
// - lekcja tygodnia: najnowsza lekcja z `od` <= dzis, termin = niedziela przed
//   nastepna lekcja (w przerwie swiatecznej wychodza dwa tygodnie),
// - proby jednej lekcji: ile, najlepsza, ostatnia, czas,
// - bledy zgrupowane wedlug reguly (ó / u, rz / ż, ł / l...) - z podpowiedzi
//   w src/lib/dyktando.ts, tych samych, ktore uczen widzi po bledzie,
// - gotowe uwagi nauczyciela z tlumaczeniem (UA / ES).

import { DYKTANDA, type DyktandoLekcja, type Jezyk } from '../data/dyktanda';
import { porownajSlowo } from './dyktando';

// ---------- tydzien ----------

function przesun(key: string, dni: number): string {
  const [r, m, d] = key.split('-').map(Number);
  const data = new Date(Date.UTC(r, m - 1, d + dni));
  return data.toISOString().slice(0, 10);
}

/** Dni od `a` do `b` (YYYY-MM-DD). */
export function dniMiedzy(a: string, b: string): number {
  const ms = (k: string) => {
    const [r, m, d] = k.split('-').map(Number);
    return Date.UTC(r, m - 1, d);
  };
  return Math.round((ms(b) - ms(a)) / 86_400_000);
}

export interface LekcjaTygodnia {
  lekcja: DyktandoLekcja;
  /** Pierwszy dzien (poniedzialek, `od`). */
  od: string;
  /** Ostatni dzien na zrobienie (niedziela przed nastepna lekcja). */
  termin: string;
  /** Ile dni zostalo do terminu wlacznie z dzisiaj (1 = dzis ostatni dzien). */
  dniDoTerminu: number;
}

/** Termin lekcji: dzien przed nastepna lekcja, a ostatnia lekcja - tydzien. */
export function terminLekcji(lekcja: DyktandoLekcja, lekcje: DyktandoLekcja[] = DYKTANDA): string {
  const nastepna = [...lekcje].sort((a, b) => a.nr - b.nr).find((l) => l.nr > lekcja.nr);
  return nastepna ? przesun(nastepna.od, -1) : przesun(lekcja.od, 6);
}

/** Lekcja tego tygodnia albo null (przed kursem i po jego koncu). */
export function lekcjaTygodnia(dzis: string, lekcje: DyktandoLekcja[] = DYKTANDA): LekcjaTygodnia | null {
  const otwarte = [...lekcje].sort((a, b) => a.nr - b.nr).filter((l) => l.od <= dzis);
  const lekcja = otwarte[otwarte.length - 1];
  if (!lekcja) return null;
  const termin = terminLekcji(lekcja, lekcje);
  if (termin < dzis) return null;
  return { lekcja, od: lekcja.od, termin, dniDoTerminu: dniMiedzy(dzis, termin) + 1 };
}

/** "29.11" z YYYY-MM-DD. */
export function dzienMiesiac(key: string): string {
  const [, m, d] = key.split('-');
  return `${Number(d)}.${m}`;
}

// ---------- proby ----------

export interface BladKursu {
  wzor: string;
  wpisane: string | null;
}

export interface ProbaKursu {
  lekcja: string;
  punkty: number;
  maks: number;
  sekundy?: number | null;
  created_at: string;
  bledy?: BladKursu[];
}

export interface PodsumowanieProb<T extends ProbaKursu> {
  ile: number;
  najlepsza: T;
  ostatnia: T;
  /** Od najstarszej. */
  proby: T[];
}

export const procent = (p: Pick<ProbaKursu, 'punkty' | 'maks'>) => (p.maks > 0 ? p.punkty / p.maks : 0);

export function podsumujProby<T extends ProbaKursu>(wszystkie: T[], lekcjaId: string): PodsumowanieProb<T> | null {
  const proby = wszystkie.filter((w) => w.lekcja === lekcjaId).sort((a, b) => a.created_at.localeCompare(b.created_at));
  if (proby.length === 0) return null;
  // Przy rownym wyniku "najlepsza" to pozniejsza (swiezsze bledy).
  const najlepsza = proby.reduce((best, p) => (procent(p) >= procent(best) ? p : best));
  return { ile: proby.length, najlepsza, ostatnia: proby[proby.length - 1], proby };
}

/** "6 min", "45 s". */
export function czasProby(sekundy: number | null | undefined): string {
  if (!sekundy || sekundy <= 0) return '';
  return sekundy < 60 ? `${sekundy} s` : `${Math.round(sekundy / 60)} min`;
}

// ---------- bledy wedlug reguly ----------

const GRUPY: Array<[string, string[]]> = [
  ['sz, cz', ['sz', 'cz']],
  ['ł / l', ['ł', 'l']],
  ['w', ['w']],
  ['y / i / j', ['y', 'i', 'j']],
  ['ś / si', ['ś', 'si']],
  ['ć / ci', ['ć', 'ci']],
  ['ń / ni', ['ń', 'ni']],
  ['ź / zi', ['ź', 'zi']],
  ['ą / ę', ['ą', 'ę']],
  ['ia, ie, iu, io', ['ia', 'ie', 'iu', 'io', 'ią', 'ię']],
  ['c, dz, dż, dź', ['c', 'dz', 'dż', 'dź', 'dzi']],
  ['ó / u', ['ó', 'u']],
  ['rz / ż', ['rz', 'ż']],
  ['ch / h', ['ch', 'h']],
];

const GRUPA_LITER = new Map(GRUPY.flatMap(([nazwa, litery]) => litery.map((l) => [l, nazwa] as const)));

export const POMINIETE = 'pominięte słowo';
export const INNE = 'inne litery';

/** Kolejnosc grup jak w kursie (do sortowania przy rownej liczbie bledow). */
const KOLEJNOSC = [...GRUPY.map(([n]) => n), INNE, POMINIETE];

/** Do jakich regul nalezy blad (jedno slowo moze miec dwie, np. "ó / u" i "rz / ż"). */
export function grupyBledu(b: BladKursu): string[] {
  if (b.wpisane === null || !b.wzor) return [POMINIETE];
  const wynik = porownajSlowo(b.wpisane, b.wzor);
  if (wynik.ok) return [];
  const grupy = [...new Set(wynik.wskazowki.map((w) => GRUPA_LITER.get(w.litery) ?? INNE))];
  return grupy.length ? grupy : [INNE];
}

export interface GrupaBledow {
  grupa: string;
  /** Ile bledow (slow). */
  ile: number;
  /** Ilu uczniow (w podsumowaniu klasy). */
  uczniowie: number;
  przyklady: BladKursu[];
}

/**
 * Bledy zgrupowane wedlug reguly, od najczestszej. `uczenId` pozwala policzyc,
 * ilu uczniow ma dana trudnosc. Te same slowa z kilku prob licza sie raz na ucznia.
 */
export function bledyWgReguly(bledy: Array<BladKursu & { uczenId?: string }>, maxPrzykladow = 4): GrupaBledow[] {
  const mapa = new Map<string, { ile: number; uczniowie: Set<string>; przyklady: BladKursu[]; slowa: Set<string> }>();
  for (const b of bledy) {
    for (const grupa of grupyBledu(b)) {
      const g = mapa.get(grupa) ?? { ile: 0, uczniowie: new Set(), przyklady: [], slowa: new Set() };
      const klucz = `${b.uczenId ?? ''}|${b.wzor.toLowerCase()}|${(b.wpisane ?? '').toLowerCase()}`;
      if (g.slowa.has(klucz)) continue;
      g.slowa.add(klucz);
      g.ile++;
      if (b.uczenId) g.uczniowie.add(b.uczenId);
      if (g.przyklady.length < maxPrzykladow && !g.przyklady.some((p) => p.wzor === b.wzor)) g.przyklady.push({ wzor: b.wzor, wpisane: b.wpisane });
      mapa.set(grupa, g);
    }
  }
  return [...mapa.entries()]
    .map(([grupa, g]) => ({ grupa, ile: g.ile, uczniowie: g.uczniowie.size, przyklady: g.przyklady }))
    .sort((a, b) => b.ile - a.ile || KOLEJNOSC.indexOf(a.grupa) - KOLEJNOSC.indexOf(b.grupa));
}

// ---------- uwagi nauczyciela ----------

export interface SzablonUwagi {
  id: string;
  /** Krotko na przycisku w panelu. */
  etykieta: string;
  /** {litery} = regula, np. "ó / u". */
  pl: string;
  ua: string;
  es: string;
  /** Tylko gdy uczen ma bledy (szablon potrzebuje {litery}). */
  zBledem?: boolean;
}

export const SZABLONY_UWAG: SzablonUwagi[] = [
  {
    id: 'brawo',
    etykieta: 'Brawo',
    pl: 'Brawo! Bez błędów. Tak trzymaj!',
    ua: 'Браво! Без помилок. Так тримати!',
    es: '¡Bravo! Sin errores. ¡Sigue así!',
  },
  {
    id: 'postep',
    etykieta: 'Postęp',
    pl: 'Widać postęp! Coraz mniej błędów.',
    ua: 'Видно прогрес! Помилок усе менше.',
    es: '¡Se nota el progreso! Cada vez menos errores.',
  },
  {
    id: 'popraw',
    etykieta: 'Popraw i powtórz',
    pl: 'Popraw {litery} i zrób tę lekcję jeszcze raz.',
    ua: 'Попрацюй над {litery} і зроби цей урок ще раз.',
    es: 'Repasa {litery} y haz esta lección otra vez.',
    zBledem: true,
  },
  {
    id: 'poprawki',
    etykieta: 'Zobacz poprawki',
    pl: 'Dobra robota! Przeczytaj jeszcze raz poprawki na końcu lekcji.',
    ua: 'Гарна робота! Ще раз прочитай виправлення в кінці уроку.',
    es: '¡Buen trabajo! Lee otra vez las correcciones al final de la lección.',
  },
  {
    id: 'powoli',
    etykieta: 'Nie spiesz się',
    pl: 'Nie spiesz się. Posłuchaj nagrania dwa razy, zanim napiszesz.',
    ua: 'Не поспішай. Послухай запис двічі, перш ніж писати.',
    es: 'No tengas prisa. Escucha la grabación dos veces antes de escribir.',
  },
  {
    id: 'litery',
    etykieta: 'Polskie litery',
    pl: 'Pisz polskie litery: ą, ę, ł, ó, ś, ż. Są przyciski pod polem.',
    ua: 'Пиши польські літери: ą, ę, ł, ó, ś, ż. Під полем є кнопки.',
    es: 'Escribe las letras polacas: ą, ę, ł, ó, ś, ż. Hay botones debajo del campo.',
  },
  {
    id: 'zrob',
    etykieta: 'Zrób do niedzieli',
    pl: 'Zrób lekcję tego tygodnia do niedzieli.',
    ua: 'Зроби урок цього тижня до неділі.',
    es: 'Haz la lección de esta semana antes del domingo.',
  },
];

export function wypelnijSzablon(s: SzablonUwagi, litery = ''): { pl: string; ua: string; es: string } {
  const f = (t: string) => t.replace('{litery}', litery);
  return { pl: f(s.pl), ua: f(s.ua), es: f(s.es) };
}

/** Tlumaczenie uwagi, jesli to (niezmieniony) szablon - inaczej null (uwaga tylko po polsku). */
export function przekladUwagi(tresc: string, jezyk: Jezyk, litery = ''): string | null {
  const t = tresc.trim();
  for (const s of SZABLONY_UWAG) {
    const w = wypelnijSzablon(s, litery);
    if (w.pl === t) return w[jezyk];
  }
  return null;
}

/** Ktory szablon podsunac: bez bledow - brawo, z bledami - popraw, bez proby - zrob. */
export function podpowiedzSzablonu(p: PodsumowanieProb<ProbaKursu> | null): SzablonUwagi['id'] {
  if (!p) return 'zrob';
  if (procent(p.najlepsza) >= 1) return 'brawo';
  if (p.ile > 1 && procent(p.ostatnia) > procent(p.proby[0])) return 'postep';
  return 'popraw';
}

/** Uwaga nauczyciela tak, jak widzi ja uczen (dyktando_moje_uwagi, migracja 0047). */
export interface UwagaUcznia {
  id: string;
  lekcja: string;
  tresc: string;
  przeklad: string | null;
  created_at: string;
  przeczytana_at: string | null;
}

/** Id szablonu, z ktorego jest uwaga (bez wzgledu na wstawiona regule), albo null dla wlasnego tekstu. */
export function szablonUwagi(tresc: string): SzablonUwagi['id'] | null {
  const t = tresc.trim();
  for (const s of SZABLONY_UWAG) {
    const [przed, po = ''] = s.pl.split('{litery}');
    if (s.pl.includes('{litery}') ? t.startsWith(przed) && t.endsWith(po) : t === s.pl) return s.id;
  }
  return null;
}

/** Pochwaly - po nich lekcja jest zamknieta, po reszcie uwag uczen ma ja poprawic. */
const POCHWALY = new Set(['brawo', 'postep', 'poprawki']);

/**
 * Lekcja "do poprawy": nauczyciel napisal uwage (nie pochwale) po ostatniej probie,
 * a wynik nie jest pelny. Po nowej probie stan znika sam.
 */
export function doPoprawy(
  uwaga: Pick<UwagaUcznia, 'tresc' | 'created_at'> | undefined,
  proby: Array<Pick<ProbaKursu, 'punkty' | 'maks' | 'created_at'>>,
): boolean {
  if (!uwaga || proby.length === 0) return false;
  const id = szablonUwagi(uwaga.tresc);
  if (id && POCHWALY.has(id)) return false;
  const ostatnia = proby.reduce((a, b) => (b.created_at > a.created_at ? b : a));
  if (ostatnia.created_at > uwaga.created_at) return false;
  return !proby.some((p) => procent(p) >= 1);
}

/** Proby po uwadze nauczyciela (czy uczen zareagowal). */
export function probyPoUwadze<T extends Pick<ProbaKursu, 'created_at'>>(proby: T[], uwaga: Pick<UwagaUcznia, 'created_at'>): T[] {
  return proby.filter((p) => p.created_at > uwaga.created_at);
}
