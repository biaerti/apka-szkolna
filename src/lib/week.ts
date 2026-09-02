// Pomocnicze funkcje do liczenia tygodni (poniedzialek-niedziela, czas lokalny)
// i kluczy miesiecy. Uzywane przez limit pasow oraz statystyki.

/** Zwraca poczatek tygodnia (poniedzialek 00:00:00.000 czasu lokalnego) dla podanej daty. */
export function weekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 = niedziela, 1 = poniedzialek, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Czy dwie daty naleza do tego samego tygodnia (poniedzialek-niedziela). */
export function isSameWeek(a: Date, b: Date): boolean {
  return weekStart(a).getTime() === weekStart(b).getTime();
}

/** Klucz miesiaca w formacie "RRRR-MM", np. "2026-09". */
export function monthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
