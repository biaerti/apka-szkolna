import { newId } from './id';
import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Lesson } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';

export const REMEDIAL_SECTION = 'Wyrównawcze';

export const REMEDIAL_WORKSHEETS = [
  {
    title: 'Kiermasz dobrych pomysłów',
    description: 'Kolejność wydarzeń, rzeczownik, zdanie i krótka wiadomość.',
    href: '/materialy/wyrownawcze/arkusz-1-kiermasz-dobrych-pomyslow.docx',
  },
  {
    title: 'Klucz z numerem siedem',
    description: 'Wnioskowanie, części mowy, ortografia i opis przedmiotu.',
    href: '/materialy/wyrownawcze/arkusz-2-klucz-z-numerem-siedem.docx',
  },
  {
    title: 'Sen pomaga się uczyć',
    description: 'Tekst informacyjny, przyczyna i skutek, fakt i opinia oraz notatka.',
    href: '/materialy/wyrownawcze/arkusz-3-sen-pomaga-sie-uczyc.docx',
  },
  {
    title: 'Droga do starego dębu',
    description: 'Instrukcja, plan działania, kierunki, przymiotnik i opis trasy.',
    href: '/materialy/wyrownawcze/arkusz-4-droga-do-starego-debu.docx',
  },
] as const;

export const REMEDIAL_KEY_HREF = '/materialy/wyrownawcze/klucz-odpowiedzi-arkusze-wyrownawcze.docx';

/**
 * Zeszyt "Moj polski od zera" dla uczniow, ktorzy dopiero ucza sie polskiego
 * (polecenia po rosyjsku). Zrodlo: karty-pracy/polski-od-zera/, PDF-y leza w
 * prywatnym buckecie "materialy" (wrzuca je karty-pracy/polski-od-zera/wyslij.py).
 */
export const POLSKI_OD_ZERA = [
  { czesc: 1, tematy: 'Litery, powitania, klasa, liczby i kolory, rodzina' },
  { czesc: 2, tematy: 'Dni tygodnia, jedzenie, ciało, dom, mój dzień' },
  { czesc: 3, tematy: 'Pogoda, ubrania, zwierzęta, miasto, czas wolny, Kto? Co? Jaki?' },
] as const;

export type PolskiOdZeraWersja = 'broszura-A4' | 'do-ciecia-A4' | 'A5';

/** Podpisany adres jednej czesci zeszytu z prywatnego bucketu. */
export async function polskiOdZeraUrl(czesc: number, wersja: PolskiOdZeraWersja): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Plik jest w chmurze - zaloguj się.');
  const { data, error } = await getSupabase()
    .storage.from('materialy')
    .createSignedUrl(`polski-od-zera-czesc-${czesc}-${wersja}.pdf`, 60 * 60);
  if (error || !data) throw new Error('Brak pliku w chmurze albo nie jesteś zalogowany.');
  return data.signedUrl;
}

/**
 * Ten sam zestaw jest wstawiany do kazdego rocznika. Model lekcji jest
 * rocznikowy, wiec IV i V dostaja osobne rekordy, ale identyczna zakladke i
 * tresc. Dzieki temu kazda klasa moze przypisac arkusz do swojego slotu.
 */
export function buildRemedialMaterials(grade: string, _classIds: string[]): FreshMaterialsBundle {
  const lessons: Array<Omit<Lesson, 'id' | 'order'>> = REMEDIAL_WORKSHEETS.map((worksheet, index) => ({
    grade,
    title: `${index + 1}. ${worksheet.title}`,
    topic: `Zajęcia wyrównawcze: ${worksheet.title}`,
    registerTopic: `Zajęcia wyrównawcze: ${worksheet.title}`,
    materialType: 'textbook',
    dzial: REMEDIAL_SECTION,
    teacherPlan: `${worksheet.description}\n\nArkusz: ${worksheet.href}`,
    progress: {},
    slides: [
      {
        id: newId(),
        kind: 'title',
        title: worksheet.title,
        subtitle: 'Zajęcia wyrównawcze',
      },
    ],
  }));
  return { lessons, questionSets: [], questions: [] };
}
