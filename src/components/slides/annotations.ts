// Rysowanie i notatki na slajdzie w trakcie prezentacji ("tablica" na slajdzie).
//
// Wspolrzedne trzymamy w pikselach kartki 1280x720 (patrz fitText.ts), a nie w
// pikselach ekranu - dzieki temu rysunek trzyma sie tresci slajdu niezaleznie
// od rozdzielczosci rzutnika i od tego, czy okno jest w pelnym ekranie.
//
// Adnotacje ZYJA TYLKO W TYM POKAZIE - nie zapisuja sie do lekcji ani do bazy.
// To celowe: to sa zamazania i dopiski robione przy klasie, tak jak na tablicy;
// lekcja ma zostac czysta na nastepna klase.

import type { ID } from '../../data/types';

export type AnnotationTool = 'off' | 'pen' | 'marker' | 'line' | 'text' | 'eraser';

export interface AnnotationPoint {
  x: number;
  y: number;
}

/** Linia narysowana odrecznie - piorem albo zakreslaczem (grubsza, przezroczysta). */
export interface StrokeShape {
  id: ID;
  kind: 'stroke';
  color: string;
  width: number;
  /** Zakreslacz: grube, polprzezroczyste pociagniecie pod tekstem. */
  marker: boolean;
  points: AnnotationPoint[];
}

/** Prosta linia od punktu rozpoczecia do punktu puszczenia myszy lub piora. */
export interface LineShape {
  id: ID;
  kind: 'line';
  color: string;
  width: number;
  start: AnnotationPoint;
  end: AnnotationPoint;
}

/**
 * Dopisek wstawiony klikiem w slajd. `width` to szerokosc ramki w pikselach
 * kartki - nauczyciel ustawia ja uchwytem w rogu pola, a litery skaluja sie
 * RAZEM z ramka (patrz scaleTextBox): wieksze pole to wieksze litery, mniejsze
 * pole to mniejsze. Jedno pociagniecie zamiast osobnego suwaka wielkosci.
 * Brak `width` (dopiski sprzed tej zmiany) = szerokosc domyslna.
 */
export interface TextShape {
  id: ID;
  kind: 'text';
  color: string;
  size: number;
  width?: number;
  x: number;
  y: number;
  text: string;
}

/** Szerokosc swiezo otwartego pola tekstowego, w pikselach kartki 1280x720. */
export const TEXT_BOX_WIDTH = 520;

/** Granice skalowania pola - ponizej tekst jest nieczytelny z ostatniej lawki, powyzej nie miesci sie na kartce. */
export const TEXT_SIZE_MIN = 14;
export const TEXT_SIZE_MAX = 160;

export interface TextBoxSize {
  width: number;
  size: number;
}

/**
 * Nowa szerokosc ramki i wynikajaca z niej wielkosc liter po przeciagnieciu
 * uchwytu o `dx` pikseli kartki. Litery ida w tej samej proporcji co ramka,
 * wiec liczba wierszy w polu zostaje mniej wiecej ta sama - zmienia sie skala
 * calego dopisku, a nie zawijanie tekstu.
 */
export function scaleTextBox(start: TextBoxSize, dx: number, maxWidth: number): TextBoxSize {
  const minWidth = Math.max(60, (start.width * TEXT_SIZE_MIN) / start.size);
  const limit = Math.max(minWidth, Math.min(maxWidth, (start.width * TEXT_SIZE_MAX) / start.size));
  const width = Math.round(Math.min(limit, Math.max(minWidth, start.width + dx)));
  const size = Math.round((start.size * width) / start.width);
  return { width, size };
}

/**
 * Uchwyt na prawej krawedzi: tylko szerokosc ramki, litery zostaja. Do
 * wydluzenia pola, zeby wiecej liter weszlo w jedna linijke (albo zwezenia,
 * zeby tekst sie zawinal).
 */
export function widenTextBox(start: TextBoxSize, dx: number, maxWidth: number): TextBoxSize {
  const minWidth = Math.min(60, maxWidth);
  const width = Math.round(Math.min(maxWidth, Math.max(minWidth, start.width + dx)));
  return { width, size: start.size };
}

/**
 * Uchwyt na dolnej krawedzi: tylko wielkosc liter, szerokosc ramki zostaje.
 * Pole tekstowe samo dopasowuje wysokosc do tresci, wiec "wyzsze pole" znaczy
 * "wieksze litery" - `startHeight` to wysokosc tresci w chwili zlapania uchwytu,
 * a litery rosna w tej samej proporcji, w jakiej rosnie wysokosc.
 */
export function heightenTextBox(start: TextBoxSize, dy: number, startHeight: number): TextBoxSize {
  const base = Math.max(1, startHeight);
  const ratio = Math.max(0.05, (base + dy) / base);
  const size = Math.round(Math.max(TEXT_SIZE_MIN, Math.min(TEXT_SIZE_MAX, start.size * ratio)));
  return { width: start.width, size };
}

export type AnnotationShape = StrokeShape | LineShape | TextShape;

/** Kolory pisaka. Pierwsze trzy czytelne na ciemnym slajdzie, czarny - na notatce i temacie. */
export const ANNOTATION_COLORS = [
  { value: '#fbbf24', label: 'żółty' },
  { value: '#ef4444', label: 'czerwony' },
  { value: '#4ade80', label: 'zielony' },
  { value: '#ffffff', label: 'biały' },
  { value: '#111827', label: 'czarny' },
];

/**
 * Grubosc pisaka i wielkosc dopisku - jedno ustawienie, trzy pozycje. Dla
 * dopisku to tylko wielkosc STARTOWA: dalej skaluje sie ja uchwytem w rogu pola
 * (scaleTextBox).
 */
export const ANNOTATION_SIZES = [
  { label: 'bardzo cienki', stroke: 2, text: 26 },
  { label: 'cienki', stroke: 4, text: 34 },
  { label: 'średni', stroke: 8, text: 46 },
  { label: 'gruby', stroke: 14, text: 62 },
  { label: 'bardzo gruby', stroke: 22, text: 82 },
];

/** Zakreslacz jest zawsze duzo grubszy od piora tej samej pozycji. */
export function strokeWidthFor(tool: AnnotationTool, size: number): number {
  return tool === 'marker' ? size * 3 : size;
}

/**
 * Punkty jako sciezka SVG. Bez wygladzania krzywymi: przy grubosci od 4 px
 * kartki (czyli 6 px na rzutniku 1920) lamana i tak wyglada jak kreska, a
 * prosty kod nie potrafi sie rozjechac.
 */
export function strokePath(points: AnnotationPoint[]): string {
  if (points.length === 0) return '';
  // Jedno klikniecie bez ruchu: kropka (sciezka o zerowej dlugosci z zaokraglona koncowka).
  if (points.length === 1) {
    const p = points[0];
    return `M ${round(p.x)} ${round(p.y)} L ${round(p.x)} ${round(p.y)}`;
  }
  if (points.length === 2) {
    return `M ${round(points[0].x)} ${round(points[0].y)} L ${round(points[1].x)} ${round(points[1].y)}`;
  }

  // Krzywa przechodzi przez srodki kolejnych odcinkow. Daje naturalna,
  // gladka kreske takze przy szybkim pisaniu pisakiem po tablicy, bez
  // kosztownego przeliczania calego pociagniecia przy kazdym ruchu wskaznika.
  const parts = [`M ${round(points[0].x)} ${round(points[0].y)}`];
  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    parts.push(`Q ${round(current.x)} ${round(current.y)} ${round(midX)} ${round(midY)}`);
  }
  const beforeLast = points[points.length - 2];
  const last = points[points.length - 1];
  parts.push(`Q ${round(beforeLast.x)} ${round(beforeLast.y)} ${round(last.x)} ${round(last.y)}`);
  return parts.join(' ');
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Pomija punkty lezace blisko poprzedniego - mysz zglasza dziesiatki zdarzen na
 * sekunde, a slajd nie potrzebuje takiej dokladnosci.
 */
export function appendPoint(points: AnnotationPoint[], next: AnnotationPoint, minDist = 3): AnnotationPoint[] {
  const last = points[points.length - 1];
  if (last) {
    const dx = next.x - last.x;
    const dy = next.y - last.y;
    if (dx * dx + dy * dy < minDist * minDist) return points;
  }
  return [...points, next];
}
