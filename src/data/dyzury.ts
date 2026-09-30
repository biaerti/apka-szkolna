// Dyzury nauczyciela na przerwach - z arkusza "DYZURY 1.1 grafik tygodniowy"
// (Bartek = BU). Wiersz arkusza to przerwa PO danej lekcji. Stale dane, bo
// grafik zmienia sie rzadko; nowa wersja arkusza = poprawka tutaj.

export interface Duty {
  /** Dzien 1-5 (pon-pt). */
  weekday: number;
  /** Numer lekcji, po ktorej jest przerwa z dyzurem. */
  afterPeriod: number;
  /** Gdzie stac. */
  place: string;
}

export const DYZURY: Duty[] = [
  { weekday: 4, afterPeriod: 1, place: 'Pawilon 3, parter' },
  { weekday: 4, afterPeriod: 2, place: 'Pawilon 3, parter' },
];
