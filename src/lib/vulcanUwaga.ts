// Uwaga z apki -> formularz uwagi w VULCANIE (zakladka "Uwagi" w lekcji,
// przycisk "Dodaj"). Tu sa same obliczenia: co wpisac w "Kategoria" i "Tresc".
// Sam przeplyw w karcie VULCANA robi dodatek Chrome (vulcan-extension/
// vulcan-bot.js: fillUwaga), a most miedzy karta apki a dodatkiem - src/lib/
// vulcanBridge.ts.
//
// Gotowce uwag (src/lib/uwagi.ts: UWAGA_PRESETS) sa krotkie, bo klika sie je
// w trakcie lekcji. Do dziennika idzie pelne zdanie w stylu innych wpisow w
// VULCANIE ("Uczeń przeszkadza na lekcji, ...") i kategoria z listy szkoly.
// Wlasna tresc idzie jak jest, z duza litera i kropka. Bartek i tak widzi
// formularz przed zapisem, wiec moze poprawic.

import type { LessonPeriod, RecapEvent, SchoolClass, Student } from '../data/types';
import { toDateKey } from './dates';
import { uwagaLabel, uwagaLekcja } from './uwagi';
import { vulcanClassName } from './vulcan';

/** Kategorie z listy w VULCANIE (SP97, wrzesien 2026) - kolejnosc jak na liscie. */
export const VULCAN_UWAGA_CATEGORIES = [
  'Dbałość o bezpieczeństwo i zdrowie',
  'Informacja',
  'Kultura języka',
  'Kultura osobista',
  'Pochwała',
  'Reprezentowanie szkoły',
  'Szacunek dla innych osób',
  'Uwaga',
  'Wypełnianie obowiązków ucznia',
  'Zaangażowanie społeczne',
  'Zachowanie na lekcji',
  'Zachowanie norm etycznych',
] as const;

export type VulcanUwagaCategory = (typeof VULCAN_UWAGA_CATEGORIES)[number];

/** Gotowiec -> kategoria i szablon zdania. `{U}` = "Uczeń" / "Uczennica". */
const PRESET_TEMPLATES: Record<string, { category: VulcanUwagaCategory; sentence: string }> = {
  'Przeszkadza na lekcji': {
    category: 'Zachowanie na lekcji',
    sentence: '{U} przeszkadza w prowadzeniu lekcji mimo upomnień nauczyciela.',
  },
  'Rozmawia i przekrzykuje': {
    category: 'Zachowanie na lekcji',
    sentence: '{U} rozmawia i przekrzykuje nauczyciela w trakcie lekcji, nie reaguje na upomnienia.',
  },
  'Nie wykonuje poleceń': {
    category: 'Wypełnianie obowiązków ucznia',
    sentence: '{U} nie wykonuje poleceń nauczyciela w trakcie lekcji.',
  },
  'Telefon na lekcji': {
    category: 'Zachowanie na lekcji',
    sentence: '{U} korzysta z telefonu w trakcie lekcji mimo upomnienia nauczyciela.',
  },
  'Wyśmiewa kolegów': {
    category: 'Szacunek dla innych osób',
    sentence: '{U} wyśmiewa kolegów i koleżanki w trakcie lekcji mimo upomnienia nauczyciela.',
  },
};

export interface VulcanUwagaTransfer {
  version: 1;
  kind: 'uwaga';
  /** Id RecapEvent - po zapisie w VULCANIE wraca w VULCAN_UWAGA_SAVED i odhacza "wpisane". */
  eventId: string;
  /** "RRRR-MM-DD" - dzien uwagi; dodatek otwiera ten dzien w drzewie po lewej. */
  date: string;
  /** Numer lekcji wg dzwonkow (do drzewa "6. 4B Język polski"); brak = poza planem. */
  period?: number;
  className: string;
  vulcanClassName: string;
  student: { firstName: string; lastName: string; number: number };
  category: VulcanUwagaCategory;
  content: string;
  /**
   * Auto-wpis w tle (AutoVulcanUwaga): dodatek NIE wyciaga karty VULCANA na
   * wierzch i sam odpala wypelnianie formularza - ale jak zawsze zatrzymuje
   * sie przed "Zapisz". Bez flagi (przycisk "Wpisz do VULCANA") karta
   * VULCANA jest aktywowana i bot czeka na klik w panelu pomocnika.
   */
  background?: boolean;
}

/**
 * "Uczeń" czy "Uczennica" - po imieniu. Polskie imiona zenskie koncza sie na
 * -a (wyjatki jak Kuba, Barnaba sa rzadkie w SP i Bartek widzi tekst przed
 * zapisem). Imiona obce (Danylo, Makar, Nika) trafiaja w te sama regule.
 */
export function uczenForm(firstName: string): 'Uczeń' | 'Uczennica' {
  const name = firstName.trim().toLocaleLowerCase('pl');
  const MALE_A = ['kuba', 'barnaba', 'bonawentura', 'sasza', 'nikita', 'ilya', 'ilja', 'mustafa', 'kosma'];
  if (MALE_A.includes(name)) return 'Uczeń';
  return name.endsWith('a') ? 'Uczennica' : 'Uczeń';
}

/** Kategoria VULCANA dla tresci uwagi: gotowiec ma swoja, reszta idzie jako "Uwaga". */
export function uwagaCategory(note: string | undefined): VulcanUwagaCategory {
  return PRESET_TEMPLATES[(note ?? '').trim()]?.category ?? 'Uwaga';
}

/** Pelne zdanie do pola "Tresc". */
export function uwagaSentence(note: string | undefined, firstName: string): string {
  const key = (note ?? '').trim();
  const template = PRESET_TEMPLATES[key];
  if (template) return template.sentence.replace('{U}', uczenForm(firstName));
  const text = key || uwagaLabel({ note } as RecapEvent);
  const capitalized = text.charAt(0).toLocaleUpperCase('pl') + text.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

export function buildVulcanUwagaTransfer(args: {
  event: RecapEvent;
  student: Student;
  schoolClass: SchoolClass;
  periods: LessonPeriod[];
}): VulcanUwagaTransfer {
  const { event, student, schoolClass, periods } = args;
  return {
    version: 1,
    kind: 'uwaga',
    eventId: event.id,
    date: toDateKey(new Date(event.at)),
    period: uwagaLekcja(event, periods),
    className: schoolClass.name,
    vulcanClassName: vulcanClassName(schoolClass.name),
    student: { firstName: student.firstName, lastName: student.lastName, number: student.number },
    category: uwagaCategory(event.note),
    content: uwagaSentence(event.note, student.firstName),
  };
}
