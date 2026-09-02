// Pomocnicze funkcje do pracy z datami (kalendarz, pulpit).
// Wszystko liczone w czasie lokalnym - klucz daty "RRRR-MM-DD" nie uzywa UTC,
// zeby uniknac przesuniec o jeden dzien przy strefach czasowych.

/** Zamienia date na klucz "RRRR-MM-DD" w czasie lokalnym. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parsuje klucz "RRRR-MM-DD" na Date (poczatek dnia, czas lokalny). */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** Dodaje `days` dni do daty (moze byc ujemne). Nie mutuje wejscia. */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

/** Zwraca poczatek tygodnia (poniedzialek) dla podanej daty, czas lokalny. */
function mondayOf(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = niedziela, 1 = poniedzialek, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(d, diffToMonday);
}

/** Zwraca 7 dni tygodnia (poniedzialek..niedziela) zawierajacego `anchor`. */
export function weekDays(anchor: Date): Date[] {
  const monday = mondayOf(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Formatuje date po polsku, np. "śr. 2 wrz". */
export function formatPl(date: Date): string {
  const weekday = new Intl.DateTimeFormat('pl-PL', { weekday: 'short' }).format(date);
  const month = new Intl.DateTimeFormat('pl-PL', { month: 'short' }).format(date);
  return `${weekday} ${date.getDate()} ${month}`;
}

/** Czy podana data to dzisiaj (porownanie po dniu, czas lokalny). */
export function isToday(date: Date): boolean {
  const now = new Date();
  return toDateKey(date) === toDateKey(now);
}
