// Logika slajdu "Ćwiczymy razem" (src/components/slides/CwiczenieSlideView.tsx).
//
// Przyklady zapisujemy tym samym jezykiem znacznikow co karty pracy
// (materialy/karta.mjs), zeby Bartek nie musial pamietac dwoch:
// - [[odp]] albo [[odp1|odp2]] - luka do wpisania, kilka dobrych odpowiedzi,
// - [[?odp1|odp2]] - luka OTWARTA: dobrych odpowiedzi jest wiecej niz lista
//   (synonimy, porownania). Spoza listy nie jest "zle", tylko "sprawdz sam" -
//   klasa i nauczyciel decyduja, a lista pokazuje sie jako przyklad.
// - {{a|*b|c}} - wybor, gwiazdka oznacza dobra odpowiedz.
// - " | " poza znacznikami dzieli przyklad na kolumny tabeli
//   (np. "szybki | [[prędki]] | [[wolny]]" pod naglowkami wyraz/synonim/antonim).

export type Kawalek =
  | { t: 'tekst'; v: string }
  | { t: 'sep' }
  | { t: 'luka'; odp: string[]; otwarta: boolean }
  | { t: 'wybor'; opcje: string[]; dobra: number };

export type Pole = Extract<Kawalek, { t: 'luka' } | { t: 'wybor' }>;

export type Wynik = 'dobrze' | 'zle' | 'otwarta' | 'puste';

const ZNACZNIK = /\[\[(.+?)\]\]|\{\{(.+?)\}\}/g;
const SEP = /\s\|\s/;

export function jestPole(k: Kawalek): k is Pole {
  return k.t === 'luka' || k.t === 'wybor';
}

function dodajTekst(out: Kawalek[], v: string) {
  v.split(SEP).forEach((czesc, n) => {
    if (n > 0) out.push({ t: 'sep' });
    if (czesc) out.push({ t: 'tekst', v: czesc });
  });
}

export function parsujLinie(linia: string): Kawalek[] {
  const out: Kawalek[] = [];
  let ostatni = 0;
  for (const m of linia.matchAll(ZNACZNIK)) {
    const start = m.index ?? 0;
    if (start > ostatni) dodajTekst(out, linia.slice(ostatni, start));
    if (m[1] !== undefined) {
      const otwarta = m[1].startsWith('?');
      const odp = (otwarta ? m[1].slice(1) : m[1]).split('|').map((s) => s.trim()).filter(Boolean);
      out.push({ t: 'luka', odp, otwarta });
    } else {
      const surowe = m[2].split('|');
      const dobra = Math.max(0, surowe.findIndex((o) => o.startsWith('*')));
      out.push({ t: 'wybor', opcje: surowe.map((o) => o.replace(/^\*/, '')), dobra });
    }
    ostatni = start + m[0].length;
  }
  if (ostatni < linia.length) dodajTekst(out, linia.slice(ostatni));
  return out;
}

/** Ile pol (luk i wyborow) ma linia - klucze pol to `${linia}-${pole}`. */
export function liczbaPol(kawalki: Kawalek[]): number {
  return kawalki.filter(jestPole).length;
}

/** Linia pocieta na komorki tabeli w miejscach " | ". */
export function podzielNaKomorki(kawalki: Kawalek[]): Kawalek[][] {
  const komorki: Kawalek[][] = [[]];
  for (const k of kawalki) {
    if (k.t === 'sep') komorki.push([]);
    else komorki[komorki.length - 1].push(k);
  }
  return komorki;
}

/**
 * Szerokosc luk w kazdej kolumnie (w znakach), liczona z WSZYSTKICH
 * przykladow cwiczenia - pola w kolumnie sa rowne i nie skacza miedzy
 * stronami. Otwarte luki licza tylko pierwszy przyklad - reszta to podpowiedzi.
 */
export function szerokosciKolumn(przyklady: string[]): number[] {
  const szer: number[] = [];
  for (const linia of przyklady) {
    podzielNaKomorki(parsujLinie(linia)).forEach((komorka, c) => {
      for (const k of komorka) {
        if (k.t !== 'luka') continue;
        const dl = Math.max(...(k.otwarta ? k.odp.slice(0, 1) : k.odp).map((o) => [...o].length), 4);
        szer[c] = Math.max(szer[c] ?? 0, dl);
      }
    });
  }
  return szer.map((s) => Math.min(Math.max(s + 2, 6), 24));
}

/**
 * Porownanie odpowiedzi: bez spacji na brzegach, kropek, wykrzyknikow i
 * cudzyslowow; przecinek w srodku liczy sie jak spacja ("chata, kasa" =
 * "chata kasa"). Wielkosc liter liczy sie tylko w cwiczeniach o wielkiej
 * literze. Polskie znaki zostaja - "ó" i "u" to wlasnie to, co cwiczymy.
 */
export function normalizuj(s: string, wielkoscLiter = false): string {
  const czyste = s
    .replace(/[„”"'«»]/g, '')
    .replace(/\s*,\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.,!?;:]+|[.,!?;:]+$/g, '')
    .trim();
  return wielkoscLiter ? czyste : czyste.toLocaleLowerCase('pl');
}

/**
 * Wpis jest dobry, gdy rowna sie ktorejs odpowiedzi albo konczy sie nia po
 * spacji - dzieci czesto dopisuja przyimek lub pytanie z tabeli ("o kocie",
 * "z mamą", "nie ma domu"), a sama forma jest poprawna.
 */
export function sprawdzLuke(wpis: string, luka: { odp: string[]; otwarta: boolean }, wielkoscLiter = false): Wynik {
  const w = normalizuj(wpis, wielkoscLiter);
  if (!w) return 'puste';
  const pasuje = (a: string, b: string) => a === b || a.endsWith(` ${b}`);
  if (luka.odp.some((o) => pasuje(w, normalizuj(o, wielkoscLiter)))) return 'dobrze';
  // Przy wielkiej literze dobry wyraz z zla litera to blad, nie "sprawdz sam".
  if (wielkoscLiter && luka.odp.some((o) => pasuje(normalizuj(w), normalizuj(o)))) return 'zle';
  if (wielkoscLiter && luka.otwarta && /^\p{Ll}/u.test(w) && luka.odp.every((o) => /^\p{Lu}/u.test(o))) return 'zle';
  return luka.otwarta ? 'otwarta' : 'zle';
}

export function sprawdzWybor(wybrana: number | undefined, dobra: number): Wynik {
  if (wybrana === undefined) return 'puste';
  return wybrana === dobra ? 'dobrze' : 'zle';
}

/** Kolejna strona przykladow: `naRaz` linii od `strona * naRaz`. */
export function stronaPrzykladow<T>(przyklady: T[], strona: number, naRaz: number): T[] {
  return przyklady.slice(strona * naRaz, strona * naRaz + naRaz);
}

export function liczbaStron(ile: number, naRaz: number): number {
  return Math.max(1, Math.ceil(ile / naRaz));
}
