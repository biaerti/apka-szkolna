// Wyzwanie tygodnia w portalu ucznia (/uczen), jak w grach mobilnych: pasek
// laduje sie z kazdym zadaniem zrobionym w tym tygodniu (pon-nd). Pelny pasek
// (CEL zadan) = tydzien zaliczony; w poniedzialek pasek startuje od zera, a za
// miniony tydzien nie da sie juz nic dorobic. Zaliczone tygodnie podnosza poziom.
// Liczy sie kazde zadanie raz w tygodniu (powtorka tej samej lekcji nie dobija paska).

export const CEL_TYGODNIA = 5;

export interface WpisAktywnosci {
  lekcja: string;
  created_at: string;
}

const dwa = (n: number) => String(n).padStart(2, '0');

/** Poniedzialek tygodnia (YYYY-MM-DD, czas lokalny). */
export function poczatekTygodnia(d: Date): string {
  const p = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  p.setDate(p.getDate() - ((p.getDay() + 6) % 7));
  return `${p.getFullYear()}-${dwa(p.getMonth() + 1)}-${dwa(p.getDate())}`;
}

/** Ile roznych zadan zrobiono w kazdym tygodniu: klucz = poniedzialek. */
export function zadaniaWTygodniach(wpisy: WpisAktywnosci[]): Map<string, number> {
  const zbiory = new Map<string, Set<string>>();
  for (const w of wpisy) {
    const t = poczatekTygodnia(new Date(w.created_at));
    if (!zbiory.has(t)) zbiory.set(t, new Set());
    zbiory.get(t)!.add(w.lekcja);
  }
  return new Map([...zbiory].map(([t, s]) => [t, s.size]));
}

export interface StanWyzwania {
  /** Zadania w tym tygodniu (do CEL_TYGODNIA). */
  teraz: number;
  cel: number;
  /** Zaliczone tygodnie (pelny pasek) - to jest poziom. */
  zaliczone: number;
  /** Dni do konca tygodnia wlacznie z dzisiaj (nd = 1). */
  dniDoKonca: number;
  /** Ostatnie 6 tygodni przed obecnym, od najstarszego: czy zaliczony. */
  historia: boolean[];
}

export function stanWyzwania(wpisy: WpisAktywnosci[], dzis: Date = new Date()): StanWyzwania {
  const tygodnie = zadaniaWTygodniach(wpisy);
  const ten = poczatekTygodnia(dzis);
  const historia: boolean[] = [];
  for (let i = 6; i >= 1; i--) {
    const d = new Date(dzis);
    d.setDate(d.getDate() - 7 * i);
    historia.push((tygodnie.get(poczatekTygodnia(d)) ?? 0) >= CEL_TYGODNIA);
  }
  return {
    teraz: Math.min(tygodnie.get(ten) ?? 0, CEL_TYGODNIA),
    cel: CEL_TYGODNIA,
    zaliczone: [...tygodnie.values()].filter((n) => n >= CEL_TYGODNIA).length,
    dniDoKonca: 7 - ((dzis.getDay() + 6) % 7),
    historia,
  };
}
