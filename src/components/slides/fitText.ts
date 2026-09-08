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
   * Podbija `min` i `max`, ale NIE wysokosc `height`: krotki slajd (a takich
   * jest wiekszosc) robi sie o tyle wiekszy, o ile nauczyciel poprosil, a dlugi
   * nadal dobiera rozmiar do miejsca i nie wylewa sie poza kartke. Podniesiony
   * `min` jest jedynym miejscem, gdzie naprawde dlugi tekst moze przekroczyc
   * ramke - to swiadome: lepiej duze litery i ciasny slajd niz nieczytelny.
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

/** Bloki tekstu (akapity i listy rozbite na pozycje) - kazdy zaczyna nowy wiersz. */
function blockLines(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\*\*/g, '').replace(/^[\t ]*(?:[-*]|\d+\.)\s+/, '').trim())
    .filter((line) => line.length > 0);
}

/** Ile pustych linii (czyli odstepow miedzy akapitami) jest w tekscie. */
function blankLineCount(text: string): number {
  return (text.replace(/\r\n/g, '\n').match(/\n[\t ]*\n/g) ?? []).length;
}

/**
 * Szacunkowa wysokosc tekstu zlozonego danym rozmiarem czcionki w kolumnie o
 * zadanej szerokosci. Kazda linia zrodlowa (akapit, pozycja listy) zaczyna sie
 * od nowa i zawija sie co `width / (fontSize * charRatio)` znakow.
 */
export function estimateTextHeight(text: string, fontSize: number, opts: FitOptions): number {
  const lineHeight = opts.lineHeight ?? 1.35;
  const charRatio = opts.charRatio ?? 0.52;
  const charsPerLine = Math.max(1, Math.floor(opts.width / (fontSize * charRatio)));
  let lines = 0;
  for (const line of blockLines(text)) {
    lines += Math.max(1, Math.ceil(line.length / charsPerLine));
  }
  const gaps = blankLineCount(text);
  return lines * fontSize * lineHeight + gaps * fontSize * 0.7;
}

/**
 * Najwiekszy rozmiar czcionki z przedzialu [min, max], przy ktorym tekst
 * miesci sie w przydzielonym prostokacie. Krok 2px - roznica ponizej i tak
 * nie jest widoczna z ostatniej lawki.
 */
export function fitFontSize(text: string, opts: FitOptions): number {
  const scale = opts.scale ?? 1;
  const max = Math.round(opts.max * scale);
  const min = Math.round(opts.min * scale);
  if (!text.trim()) return max;
  for (let size = max; size > min; size -= 2) {
    if (estimateTextHeight(text, size, opts) <= opts.height) return size;
  }
  return min;
}
