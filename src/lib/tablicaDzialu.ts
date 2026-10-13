// Szkic "Tablicy dzialu" z mapy wiedzy rocznika: kolumny kategorii (czesci mowy,
// ortografia...), w kazdej karty z nazwa i przykladem. Kolor mowi, gdzie jestesmy:
// zielone - juz umiemy, zolte - ten dzial, szara karta "Potem" - co przyjdzie pozniej.
// Funkcja zwraca szkielety elementow Excalidraw (convertToExcalidrawElements robi
// z nich prawdziwe elementy w komponencie), dzieki temu da sie ja testowac bez canvasu.

import { KATEGORIE_WIEDZY, type PunktWiedzy } from '../data/mapaWiedzy';

export type TrybTablicy = 'przed' | 'po' | 'pusta';

export const TRYBY_TABLICY: { id: TrybTablicy; nazwa: string }[] = [
  { id: 'przed', nazwa: 'Co nas czeka' },
  { id: 'po', nazwa: 'Czego się nauczyliśmy' },
  { id: 'pusta', nazwa: 'Pusta tablica' },
];

/** Minimalny podzbior ExcalidrawElementSkeleton, ktorego uzywamy. */
export type SzkieletElementu =
  | {
      type: 'rectangle';
      x: number;
      y: number;
      width: number;
      height: number;
      backgroundColor: string;
      strokeColor: string;
      strokeWidth: number;
      strokeStyle: 'solid' | 'dashed';
      roundness: { type: 3 };
      label: { text: string; fontSize: number; strokeColor: string; fontFamily: number; textAlign: 'left'; verticalAlign: 'middle' };
    }
  | { type: 'text'; x: number; y: number; text: string; fontSize: number; strokeColor: string; fontFamily: number };

export type StanPunktu = 'umiemy' | 'teraz' | 'potem';

export function stanPunktu(punkt: PunktWiedzy, dzial: number): StanPunktu {
  if (punkt.dzial < dzial) return 'umiemy';
  return punkt.dzial === dzial ? 'teraz' : 'potem';
}

// Paleta Excalidraw (open-color), zeby karty wygladaly jak narysowane na tablicy.
const KOLORY = {
  umiemy: { tlo: '#d3f9d8', linia: '#2f9e44' },
  nowe: { tlo: '#b2f2bb', linia: '#2b8a3e' },
  czeka: { tlo: '#ffec99', linia: '#f08c00' },
  potem: { tlo: 'transparent', linia: '#adb5bd' },
  tekst: '#1e1e1e',
  szary: '#868e96',
};

const FONT_ODRECZNY = 5; // Excalifont
const FONT_ZWYKLY = 6; // Nunito - czytelniejszy w przykladach

const KOLUMNA = 320;
const ODSTEP_KOLUMN = 40;
const ODSTEP_KART = 18;
const ROZMIAR = 20;
const GORA_KOLUMN = 170;

// Excalifont 20 px ma srednio ok. 11 px na znak - liczymy z zapasem, bo przy
// generowaniu Excalidraw nie zawija etykiet sam i dlugi tekst wylazilby z karty.
const ZNAKOW_W_LINII = Math.floor((KOLUMNA - 24) / (ROZMIAR * 0.6));

/** Zawija tekst po slowach do ZNAKOW_W_LINII; istniejace nowe linie zostaja. */
export function zawin(tekst: string, znakow = ZNAKOW_W_LINII): string {
  return tekst
    .split('\n')
    .map((akapit) => {
      const linie: string[] = [];
      let linia = '';
      for (const slowo of akapit.split(' ')) {
        if (linia && (linia + ' ' + slowo).length > znakow) {
          linie.push(linia);
          linia = slowo;
        } else {
          linia = linia ? `${linia} ${slowo}` : slowo;
        }
      }
      linie.push(linia);
      return linie.join('\n');
    })
    .join('\n');
}

function wysokoscKarty(zawiniety: string): number {
  return Math.max(76, zawiniety.split('\n').length * ROZMIAR * 1.25 + 28);
}

function karta(x: number, y: number, surowy: string, styl: { tlo: string; linia: string }, opcje: { gruba?: boolean; przerywana?: boolean; kolorTekstu?: string; font?: number } = {}): SzkieletElementu & { type: 'rectangle' } {
  const tekst = zawin(surowy);
  return {
    type: 'rectangle',
    x,
    y,
    width: KOLUMNA,
    height: wysokoscKarty(tekst),
    backgroundColor: styl.tlo,
    strokeColor: styl.linia,
    strokeWidth: opcje.gruba ? 4 : 2,
    strokeStyle: opcje.przerywana ? 'dashed' : 'solid',
    roundness: { type: 3 },
    label: { text: tekst, fontSize: ROZMIAR, strokeColor: opcje.kolorTekstu ?? KOLORY.tekst, fontFamily: opcje.font ?? FONT_ODRECZNY, textAlign: 'left', verticalAlign: 'middle' },
  };
}

export interface OpisTablicy {
  /** Np. "Klasa IV" */
  klasa: string;
  /** Lesson.dzial */
  dzial: string;
  numer: number;
  tryb: TrybTablicy;
  punkty: PunktWiedzy[];
}

export function szkicTablicy({ klasa, dzial, numer, tryb, punkty }: OpisTablicy): SzkieletElementu[] {
  if (tryb === 'pusta') return [];
  const elementy: SzkieletElementu[] = [];
  const podtytul = tryb === 'przed' ? 'Co nas czeka?' : 'Czego się nauczyliśmy?';
  elementy.push({ type: 'text', x: 0, y: 0, text: dzial, fontSize: 40, strokeColor: KOLORY.tekst, fontFamily: FONT_ODRECZNY });
  elementy.push({ type: 'text', x: 0, y: 56, text: `${klasa} · ${podtytul}`, fontSize: 28, strokeColor: tryb === 'przed' ? KOLORY.czeka.linia : KOLORY.nowe.linia, fontFamily: FONT_ODRECZNY });
  const legenda = tryb === 'przed' ? 'zielone - już umiemy   ·   żółte - nowe w tym dziale' : 'zielone - już umiemy   ·   pogrubione - nowe z tego działu';
  elementy.push({ type: 'text', x: 0, y: 104, text: legenda, fontSize: 18, strokeColor: KOLORY.szary, fontFamily: FONT_ZWYKLY });

  let kolumna = 0;
  for (const kategoria of KATEGORIE_WIEDZY) {
    const wKategorii = punkty.filter((punkt) => punkt.kat === kategoria.id);
    const widoczne = wKategorii.filter((punkt) => stanPunktu(punkt, numer) !== 'potem');
    const pozniej = wKategorii.filter((punkt) => stanPunktu(punkt, numer) === 'potem');
    if (widoczne.length === 0 && pozniej.length === 0) continue;

    const x = kolumna * (KOLUMNA + ODSTEP_KOLUMN);
    kolumna += 1;
    elementy.push({ type: 'text', x, y: GORA_KOLUMN, text: kategoria.nazwa, fontSize: 26, strokeColor: KOLORY.tekst, fontFamily: FONT_ODRECZNY });
    let y = GORA_KOLUMN + 50;

    for (const punkt of widoczne) {
      const teraz = stanPunktu(punkt, numer) === 'teraz';
      const tekst = `${teraz && tryb === 'po' ? '✓ ' : ''}${punkt.nazwa}\n${punkt.przyklad}`;
      const styl = !teraz ? KOLORY.umiemy : tryb === 'przed' ? KOLORY.czeka : KOLORY.nowe;
      const element = karta(x, y, tekst, styl, { gruba: teraz });
      elementy.push(element);
      y += element.height + ODSTEP_KART;
    }

    if (pozniej.length > 0) {
      const tekst = `Potem: ${pozniej.map((punkt) => punkt.nazwa.toLowerCase()).join(', ')}`;
      elementy.push(karta(x, y, tekst, KOLORY.potem, { przerywana: true, kolorTekstu: KOLORY.szary, font: FONT_ZWYKLY }));
    }
  }
  return elementy;
}

/** Klucz zapisu tablicy: rocznik + dzial + tryb. */
export function idTablicy(grade: string, dzial: string, tryb: TrybTablicy): string {
  return `${grade.toUpperCase()}|${dzial}|${tryb}`;
}
