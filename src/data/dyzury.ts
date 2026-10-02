// Dyzury nauczyciela na przerwach - z arkusza "DYZURY ... grafik tygodniowy"
// (Bartek = BU). Wiersz arkusza to przerwa PO danej lekcji. Stale dane, bo
// grafik zmienia sie rzadko; nowa wersja arkusza = nowy wpis w GRAFIKI z data,
// od ktorej obowiazuje.

export interface Duty {
  /** Dzien 1-5 (pon-pt). */
  weekday: number;
  /** Numer lekcji, po ktorej jest przerwa z dyzurem. */
  afterPeriod: number;
  /** Gdzie stac. */
  place: string;
}

interface Grafik {
  /** Od kiedy obowiazuje (YYYY-MM-DD). */
  from: string;
  duties: Duty[];
}

const P1_PIETRO = 'Pawilon 1, piętro';
const P3_PARTER = 'Pawilon 3, parter';
const P3_PIETRO = 'Pawilon 3, piętro';

export const GRAFIKI: Grafik[] = [
  {
    // wersja 1.1
    from: '2026-09-01',
    duties: [
      { weekday: 4, afterPeriod: 1, place: P3_PARTER },
      { weekday: 4, afterPeriod: 2, place: P3_PARTER },
    ],
  },
  {
    // wersja 1.2
    from: '2026-10-05',
    duties: [
      { weekday: 1, afterPeriod: 4, place: P3_PARTER },
      { weekday: 1, afterPeriod: 6, place: P3_PARTER },
      { weekday: 2, afterPeriod: 6, place: P3_PARTER },
      { weekday: 3, afterPeriod: 2, place: P1_PIETRO },
      { weekday: 3, afterPeriod: 4, place: P3_PARTER },
      { weekday: 3, afterPeriod: 5, place: P3_PARTER },
      { weekday: 4, afterPeriod: 2, place: P3_PIETRO },
      { weekday: 4, afterPeriod: 3, place: P3_PARTER },
    ],
  },
];

/** Dyzury z grafiku obowiazujacego w danym dniu. */
export function dyzuryNa(date: Date): Duty[] {
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  let current: Grafik | undefined;
  for (const g of GRAFIKI) if (g.from <= day) current = g;
  return current?.duties ?? [];
}
