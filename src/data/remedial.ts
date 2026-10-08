import { newId } from './id';
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
