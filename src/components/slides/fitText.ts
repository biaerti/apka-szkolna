// Dobieranie rozmiaru czcionki slajdu do dlugosci tekstu.
//
// Slajdy rysujemy w stalej "kartce" 1280x720 (SLIDE_W/SLIDE_H), ktora
// SlideView skaluje transformem do rozmiaru ekranu - dzieki temu podglad w
// edytorze i projektor wygladaja identycznie, a na rzutniku 1920 wszystko jest
// automatycznie 1,5x wieksze niz w kodzie.
//
// Wczesniej rozmiary byly sztywne (32px tresc, 48px tytul) i krotki slajd
// swiecil pustym ekranem, a dlugi ledwo sie miescil. Tutaj liczymy rozmiar z
// dlugosci tekstu: bierzemy najwiekszy, przy ktorym oszacowana wysokosc bloku
// wciaz miesci sie w przydzielonym miejscu. Oszacowanie jest przyblizone (nie
// mierzymy DOM-u), wiec zostawiamy zapas przez ostrozne wspolczynniki.

export const SLIDE_W = 1280;
export const SLIDE_H = 720;

export interface FitOptions {
  /** Szerokosc kolumny tekstu w pikselach kartki 1280x720. */
  width: number;
  /** Wysokosc do dyspozycji w pikselach kartki. */
  height: number;
  min: number;
  max: number;
  /** Wysokosc wiersza jako mnoznik rozmiaru czcionki. */
  lineHeight?: number;
  /** Srednia szerokosc znaku jako czesc rozmiaru czcionki. */
  charRatio?: number;
  /**
   * Mnoznik wielkosci liter z Ustawien (Settings.slideFontPercent / 100).
   * Podbija `max` w calosci, `min` o polowe, a wysokosci `height` wcale: krotki
   * slajd (a takich jest wiekszosc) robi sie o tyle wiekszy, o ile nauczyciel
   * poprosil, a slajd gesty od tekstu nadal dobiera rozmiar do miejsca i nie
   * wylewa sie poza kartke.
   */
  scale?: number;
}

/** Tekst bez skladni markdown-lite - do liczenia znakow, ktore naprawde widac. */
export function plainLength(text: string): number {
  return text
    .replace(/\*\*/g, '')
    .replace(/^[\t ]*(?:[-*]|\d+\.)\s+/gm, '')
    .trim().length;
}

/** Odstep miedzy akapitami (RichText: `space-y-[0.6em]`), w em. */
const BLOCK_GAP_EM = 0.6;
/** Odstep miedzy pozycjami tej samej listy (RichText: `[&_ul]:space-y-[0.3em]`), w em. */
const ITEM_GAP_EM = 0.3;

interface SourceLine {
  text: string;
  /** Pozycja listy ("- ", "1. ") - sasiednie pozycje maja mniejszy odstep niz akapity. */
  list: boolean;
}

/** Linie zrodlowe tekstu: akapity i pozycje list, bez skladni markdown-lite. */
function sourceLines(text: string): SourceLine[] {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      const clean = line.replace(/\*\*/g, '').trim();
      const list = /^(?:[-*]|\d+\.)\s+/.test(clean);
      return { text: clean.replace(/^(?:[-*]|\d+\.)\s+/, ''), list };
    })
    .filter((line) => line.text.length > 0);
}

/**
 * Szacunkowa wysokosc tekstu zlozonego danym rozmiarem czcionki w kolumnie o
 * zadanej szerokosci. Kazda linia zrodlowa (akapit, pozycja listy) zaczyna sie
 * od nowa i zawija sie co `width / (fontSize * charRatio)` znakow. Do wysokosci
 * wierszy doliczamy odstepy, ktore RichText naprawde rysuje miedzy blokami -
 * bez nich dluga lista wychodzila w oszacowaniu o jakies 20% nizsza, niz jest
 * naprawde, i tresc wypychala ze slajdu to, co pod nia (np. stoper zadania).
 */
export function estimateTextHeight(text: string, fontSize: number, opts: FitOptions): number {
  const lineHeight = opts.lineHeight ?? 1.35;
  const charRatio = opts.charRatio ?? 0.52;
  const charsPerLine = Math.max(1, Math.floor(opts.width / (fontSize * charRatio)));
  const lines = sourceLines(text);
  let wrapped = 0;
  let gapEm = 0;
  lines.forEach((line, i) => {
    wrapped += Math.max(1, Math.ceil(line.text.length / charsPerLine));
    const prev = lines[i - 1];
    if (prev) gapEm += line.list && prev.list ? ITEM_GAP_EM : BLOCK_GAP_EM;
  });
  return wrapped * fontSize * lineHeight + gapEm * fontSize;
}

/**
 * Najwiekszy rozmiar czcionki z przedzialu [min, max], przy ktorym tekst
 * miesci sie w przydzielonym prostokacie. Krok 2px - roznica ponizej i tak
 * nie jest widoczna z ostatniej lawki.
 */
export function fitFontSize(text: string, opts: FitOptions): number {
  const scale = opts.scale ?? 1;
  const max = Math.round(opts.max * scale);
  // Podloge podnosimy o POLOWE tego, co sufit: przy 130% krotki slajd ma byc o
  // 30% wiekszy, ale slajd gesty od tekstu (dlugie polecenie + lista) nie moze
  // przez to zjechac poza kartke - nieczytelny jest tak samo jak za maly.
  const min = Math.round(opts.min * (1 + (scale - 1) / 2));
  if (!text.trim()) return max;
  for (let size = max; size > min; size -= 2) {
    if (estimateTextHeight(text, size, opts) <= opts.height) return size;
  }
  return min;
}
