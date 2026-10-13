// Logika slajdu "Ćwiczymy razem" (src/components/slides/CwiczenieSlideView.tsx).
//
// Przyklady zapisujemy tym samym jezykiem znacznikow co karty pracy
// (materialy/karta.mjs), zeby Bartek nie musial pamietac dwoch:
// - [[odp]] albo [[odp1|odp2]] - luka do wpisania, kilka dobrych odpowiedzi,
// - [[?odp1|odp2]] - luka OTWARTA: dobrych odpowiedzi jest wiecej niz lista
//   (synonimy, porownania). Spoza listy nie jest "zle", tylko "sprawdz sam" -
//   klasa i nauczyciel decyduja, a lista pokazuje sie jako przyklad.
// - {{a|*b|c}} - wybor, gwiazdka oznacza dobra odpowiedz.

export type Kawalek =
  | { t: 'tekst'; v: string }
  | { t: 'luka'; odp: string[]; otwarta: boolean }
  | { t: 'wybor'; opcje: string[]; dobra: number };

export type Wynik = 'dobrze' | 'zle' | 'otwarta' | 'puste';

const ZNACZNIK = /\[\[(.+?)\]\]|\{\{(.+?)\}\}/g;

export function parsujLinie(linia: string): Kawalek[] {
  const out: Kawalek[] = [];
  let ostatni = 0;
  for (const m of linia.matchAll(ZNACZNIK)) {
    const start = m.index ?? 0;
    if (start > ostatni) out.push({ t: 'tekst', v: linia.slice(ostatni, start) });
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
  if (ostatni < linia.length) out.push({ t: 'tekst', v: linia.slice(ostatni) });
  return out;
}

/** Ile pol (luk i wyborow) ma linia - klucze pol to `${linia}-${pole}`. */
export function liczbaPol(kawalki: Kawalek[]): number {
  return kawalki.filter((k) => k.t !== 'tekst').length;
}

/**
 * Porownanie odpowiedzi: bez spacji na brzegach, kropek, wykrzyknikow i
 * cudzyslowow. Wielkosc liter liczy sie tylko w cwiczeniach o wielkiej
 * literze. Polskie znaki zostaja - "ó" i "u" to wlasnie to, co cwiczymy.
 */
export function normalizuj(s: string, wielkoscLiter = false): string {
  const czyste = s
    .replace(/[„”"'«»]/g, '')
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
  const trafiona = luka.odp.some((o) => {
    const n = normalizuj(o, wielkoscLiter);
    return w === n || w.endsWith(` ${n}`);
  });
  if (trafiona) return 'dobrze';
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
