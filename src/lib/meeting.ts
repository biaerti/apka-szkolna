// Pomocnicze funkcje zakladki "Zebrania".

import { parseDateKey } from './dates';
import { parseMarkdownLite } from './markdownLite';

/** "2026-09-09" -> "środa, 9 września 2026". Nierozpoznana data zostaje jak jest. */
export function formatMeetingDate(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
  const date = parseDateKey(dateKey);
  if (Number.isNaN(date.getTime())) return dateKey;
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Naglowki sekcji skryptu - to, co kafelek pokazuje jako spis punktow zebrania.
 * Gdy skrypt nie ma naglowkow, bierze pierwsze punkty listy, zeby kafelek nie
 * byl pusty przy notatce pisanej samymi myslnikami.
 */
export function meetingSummary(script: string, limit = 5): string[] {
  const blocks = parseMarkdownLite(script);
  const text = (inline: Array<{ text: string }>) => inline.map((n) => n.text).join('').trim();

  const headings = blocks.filter((b) => b.type === 'heading').map((b) => text(b.inline));
  if (headings.length > 0) return headings.slice(0, limit);

  const items: string[] = [];
  for (const block of blocks) {
    if (block.type === 'list') items.push(...block.items.map(text));
    if (items.length >= limit) break;
  }
  return items.slice(0, limit);
}
