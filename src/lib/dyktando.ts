// Sprawdzanie dyktanda: porownanie wpisanego tekstu ze wzorem litera po literze
// i podpowiedzi, ktora polska litera odpowiada ktoremu ukrainskiemu dzwiekowi.
// Interpunkcji nie liczymy (pokazujemy ja we wzorze), wielka litera jest
// zaznaczana osobno i nie odbiera punktu.

export type StatusZnaku = 'ok' | 'zly' | 'brak';

export interface ZnakWzoru {
  znak: string;
  status: StatusZnaku;
}

export interface Wskazowka {
  /** Litery we wzorze, np. "sz" albo "ł". */
  litery: string;
  /** Ukrainski dzwiek, np. "ш". */
  dzwiek: string;
  pl: string;
  ua: string;
}

export interface WynikSlowa {
  /** Slowo ze wzoru (z interpunkcja, jak w zdaniu). Pusty, gdy uczen dopisal slowo nadmiarowe. */
  wzor: string;
  /** Co wpisal uczen (null = pominal slowo). */
  wpisane: string | null;
  /** Litery sie zgadzaja (bez patrzenia na wielka litere). */
  ok: boolean;
  /** Zla wielka/mala litera na poczatku. */
  wielkaLitera: boolean;
  znaki: ZnakWzoru[];
  wskazowki: Wskazowka[];
}

const BAZA: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

const SAMOGLOSKI = 'aąeęioóuy';

/** Slowo bez interpunkcji na brzegach. */
export function oczysc(slowo: string): string {
  return slowo.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

export function maCyrylice(tekst: string): boolean {
  return /[Ѐ-ӿ]/.test(tekst);
}

function kosztZamiany(a: string, b: string): number {
  if (a === b) return 0;
  if ((BAZA[a] ?? a) === (BAZA[b] ?? b)) return 0.5;
  return 1;
}

type Krok = { op: 'ok' | 'zamiana' | 'brak' | 'nadmiar'; iWzor: number };

/** Wyrownanie liter (Levenshtein z cofaniem). Oba slowa juz malymi literami. */
function wyrownaj(wpisane: string, wzor: string): Krok[] {
  const a = [...wpisane];
  const b = [...wzor];
  const n = a.length;
  const m = b.length;
  const d: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      d[i][j] = Math.min(d[i - 1][j - 1] + kosztZamiany(a[i - 1], b[j - 1]), d[i - 1][j] + 1, d[i][j - 1] + 1);
    }
  }
  const kroki: Krok[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + kosztZamiany(a[i - 1], b[j - 1])) {
      kroki.push({ op: a[i - 1] === b[j - 1] ? 'ok' : 'zamiana', iWzor: j - 1 });
      i--;
      j--;
    } else if (j > 0 && d[i][j] === d[i][j - 1] + 1) {
      kroki.push({ op: 'brak', iWzor: j - 1 });
      j--;
    } else {
      // Litera dopisana przez ucznia - liczymy ja przy literze wzoru, przed ktora stoi.
      kroki.push({ op: 'nadmiar', iWzor: j });
      i--;
    }
  }
  return kroki.reverse();
}

interface Cegielka {
  litery: string;
  start: number;
  koniec: number;
}

const DWULITEROWE = ['dż', 'dź', 'dz', 'ch', 'cz', 'rz', 'sz'];

/** Dzieli slowo na polskie "litery dzwiekowe": sz, cz, ch, si+samogloska, ia... */
export function cegielki(slowo: string): Cegielka[] {
  const z = [...slowo.toLowerCase()];
  const wynik: Cegielka[] = [];
  let i = 0;
  while (i < z.length) {
    const reszta = z.slice(i).join('');
    const nastepna = (k: number) => z[i + k] ?? '';
    const samogloska = (k: number) => nastepna(k) !== '' && SAMOGLOSKI.includes(nastepna(k));
    let dl = 1;
    if (reszta.startsWith('dzi') && samogloska(3) && nastepna(3) !== 'i') dl = 3;
    else if (/^[sczn]i/.test(reszta) && samogloska(2) && nastepna(2) !== 'i') dl = 2;
    else if (DWULITEROWE.some((d) => reszta.startsWith(d))) dl = 2;
    else if (z[i] === 'i' && i > 0 && samogloska(1) && 'aeuoąę'.includes(nastepna(1)) && !SAMOGLOSKI.includes(z[i - 1])) dl = 2;
    wynik.push({ litery: z.slice(i, i + dl).join(''), start: i, koniec: i + dl });
    i += dl;
  }
  return wynik;
}

const WSKAZOWKI: Record<string, Omit<Wskazowka, 'litery'>> = {
  sz: { dzwiek: 'ш', pl: 'piszemy dwiema literami: s + z', ua: 'дві літери: s + z' },
  cz: { dzwiek: 'ч', pl: 'piszemy c + z (nie ch!)', ua: 'c + z (не ch!)' },
  ch: { dzwiek: 'х', pl: 'piszemy c + h (to nie jest [ч]!)', ua: 'c + h (це не [ч]!)' },
  h: { dzwiek: 'г / х', pl: 'jedna litera h', ua: 'одна літера h' },
  rz: { dzwiek: 'ж', pl: 'rz brzmi tak samo jak ż', ua: 'rz звучить як ż' },
  ż: { dzwiek: 'ж', pl: 'z z kropką', ua: 'z з крапкою' },
  ź: { dzwiek: 'зь', pl: 'z z kreską', ua: 'z з рисочкою' },
  ś: { dzwiek: 'сь', pl: 's z kreską', ua: 's з рисочкою' },
  ć: { dzwiek: 'ть / м’яке ч', pl: 'c z kreską', ua: 'c з рисочкою' },
  ń: { dzwiek: 'нь', pl: 'n z kreską', ua: 'n з рисочкою' },
  dz: { dzwiek: 'дз', pl: 'd + z', ua: 'd + z' },
  dż: { dzwiek: 'дж', pl: 'd + ż', ua: 'd + ż' },
  dź: { dzwiek: 'дзь', pl: 'd + ź', ua: 'd + ź' },
  dzi: { dzwiek: 'дзі / дзь', pl: 'przed samogłoską piszemy dzi', ua: 'перед голосною: dzi' },
  si: { dzwiek: 'сі / сь', pl: 'przed samogłoską piszemy si (nie ś)', ua: 'перед голосною: si' },
  ci: { dzwiek: 'ті / ть', pl: 'przed samogłoską piszemy ci (nie ć)', ua: 'перед голосною: ci' },
  zi: { dzwiek: 'зі / зь', pl: 'przed samogłoską piszemy zi (nie ź)', ua: 'перед голосною: zi' },
  ni: { dzwiek: 'ні / нь', pl: 'przed samogłoską piszemy ni (nie ń)', ua: 'перед голосною: ni' },
  ia: { dzwiek: 'я', pl: 'po spółgłosce [я] piszemy ia', ua: 'я = ia' },
  ie: { dzwiek: 'є', pl: 'po spółgłosce [є] piszemy ie', ua: 'є = ie' },
  iu: { dzwiek: 'ю', pl: 'po spółgłosce [ю] piszemy iu', ua: 'ю = iu' },
  io: { dzwiek: 'ьо', pl: 'po spółgłosce piszemy io', ua: 'ьо = io' },
  ią: { dzwiek: 'ьон', pl: 'piszemy ią', ua: 'ьон = ią' },
  ię: { dzwiek: 'єн', pl: 'piszemy ię', ua: 'єн = ię' },
  ł: { dzwiek: 'ў', pl: 'ł z kreską, brzmi jak angielskie w', ua: 'як англійське w' },
  l: { dzwiek: 'л', pl: 'zwykłe l, bez kreski', ua: 'звичайне l' },
  w: { dzwiek: 'в', pl: 'piszemy w (nie v)', ua: 'в = w (не v)' },
  y: { dzwiek: 'и', pl: 'piszemy y', ua: 'и = y' },
  i: { dzwiek: 'і', pl: 'piszemy i', ua: 'і = i' },
  j: { dzwiek: 'й', pl: 'piszemy j', ua: 'й = j' },
  ą: { dzwiek: 'он / ом', pl: 'a z ogonkiem', ua: 'a з хвостиком' },
  ę: { dzwiek: 'ен / ем', pl: 'e z ogonkiem', ua: 'e з хвостиком' },
  ó: { dzwiek: 'у', pl: 'o z kreską (brzmi jak u)', ua: 'o з рисочкою, звучить як у' },
  u: { dzwiek: 'у', pl: 'zwykłe u', ua: 'звичайне u' },
  c: { dzwiek: 'ц', pl: 'piszemy c', ua: 'ц = c' },
  e: { dzwiek: 'е', pl: 'piszemy e', ua: 'е = e' },
  a: { dzwiek: 'а', pl: 'piszemy a', ua: 'а = a' },
  o: { dzwiek: 'о', pl: 'piszemy o', ua: 'о = o' },
  z: { dzwiek: 'з', pl: 'piszemy z', ua: 'з = z' },
  s: { dzwiek: 'с', pl: 'piszemy s', ua: 'с = s' },
  k: { dzwiek: 'к', pl: 'piszemy k', ua: 'к = k' },
  g: { dzwiek: 'ґ', pl: 'piszemy g', ua: 'ґ = g' },
};

/** Porownuje jedno slowo (z interpunkcja albo bez) z tym, co wpisal uczen. */
export function porownajSlowo(wpisane: string | null, wzor: string): WynikSlowa {
  const czystyWzor = oczysc(wzor);
  if (wpisane === null) {
    return {
      wzor,
      wpisane: null,
      ok: false,
      wielkaLitera: false,
      znaki: [...czystyWzor].map((znak) => ({ znak, status: 'brak' })),
      wskazowki: [],
    };
  }
  const czysteWpisane = oczysc(wpisane);
  const a = czysteWpisane.toLowerCase();
  const b = czystyWzor.toLowerCase();
  const literyWzoru = [...czystyWzor];
  const znaki: ZnakWzoru[] = literyWzoru.map((znak) => ({ znak, status: 'ok' }));
  const zlePozycje = new Set<number>();
  for (const krok of wyrownaj(a, b)) {
    if (krok.op === 'zamiana') {
      znaki[krok.iWzor].status = 'zly';
      zlePozycje.add(krok.iWzor);
    } else if (krok.op === 'brak') {
      znaki[krok.iWzor].status = 'brak';
      zlePozycje.add(krok.iWzor);
    } else if (krok.op === 'nadmiar') {
      // Dopisana litera psuje sasiednie litery wzoru (np. "sh" zamiast "sz").
      zlePozycje.add(Math.min(krok.iWzor, literyWzoru.length - 1));
      if (krok.iWzor > 0) zlePozycje.add(krok.iWzor - 1);
    }
  }
  const ok = a === b;
  const wielkaLitera = ok && czysteWpisane.length > 0 && czysteWpisane[0] !== czystyWzor[0];

  const wskazowki: Wskazowka[] = [];
  if (!ok) {
    for (const c of cegielki(czystyWzor)) {
      let zla = false;
      for (let p = c.start; p < c.koniec; p++) if (zlePozycje.has(p)) zla = true;
      if (!zla) continue;
      const opis = WSKAZOWKI[c.litery];
      if (opis && !wskazowki.some((w) => w.litery === c.litery)) {
        wskazowki.push({ litery: c.litery, ...opis });
      }
    }
  }
  return { wzor, wpisane, ok, wielkaLitera, znaki, wskazowki };
}

function odleglosc(a: string, b: string): number {
  const kroki = wyrownaj(a.toLowerCase(), b.toLowerCase());
  return kroki.filter((k) => k.op !== 'ok').length / Math.max(a.length, b.length, 1);
}

/** Porownuje cale zdanie: dopasowuje slowa (uczen mogl pominac albo dopisac slowo). */
export function porownajZdanie(wpisane: string, wzor: string): WynikSlowa[] {
  const sw = wzor.split(/\s+/).filter(Boolean);
  const sa = wpisane.split(/\s+/).map(oczysc).filter(Boolean);
  const n = sa.length;
  const m = sw.length;
  const d: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  const koszt = (i: number, j: number) => {
    const o = odleglosc(sa[i], oczysc(sw[j]));
    // Bardzo rozne slowa lepiej uznac za pominiete + dopisane niz za jedno.
    return o > 0.7 ? 2.1 : o;
  };
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      d[i][j] = Math.min(d[i - 1][j - 1] + koszt(i - 1, j - 1), d[i - 1][j] + 1, d[i][j - 1] + 1);
    }
  }
  const wynik: WynikSlowa[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && Math.abs(d[i][j] - (d[i - 1][j - 1] + koszt(i - 1, j - 1))) < 1e-9) {
      wynik.push(porownajSlowo(sa[i - 1], sw[j - 1]));
      i--;
      j--;
    } else if (j > 0 && Math.abs(d[i][j] - (d[i][j - 1] + 1)) < 1e-9) {
      wynik.push(porownajSlowo(null, sw[j - 1]));
      j--;
    } else {
      wynik.push({ wzor: '', wpisane: sa[i - 1], ok: false, wielkaLitera: false, znaki: [], wskazowki: [] });
      i--;
    }
  }
  return wynik.reverse();
}

/** Punkty za zdanie: poprawne slowa ze wzoru (nadmiarowe slowa nie odejmuja). */
export function punktyZdania(wyniki: WynikSlowa[]): number {
  return wyniki.filter((w) => w.wzor && w.ok).length;
}
