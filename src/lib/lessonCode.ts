// Kody lekcji do zeszytu: "4.1", "4.2", "5.1"... - cyfra rocznika, kropka,
// kolejny numer lekcji w tym roczniku.
//
// Po co: dziecko zapisuje w zeszycie "Temat 4.3: ..." i po pol roku potrafi
// odnalezc, o ktora lekcje chodzi (a nauczyciel widzi ten sam kod na liscie
// lekcji). Kod nadajemy RAZ, przy tworzeniu lekcji, i nigdy nie przeliczamy z
// kolejnosci - inaczej przestawienie lekcji w planie podwazyloby wszystkie
// zapisy w zeszytach. Dlatego numer to "najwyzszy dotad uzyty + 1", a nie
// pozycja na liscie.

import type { Lesson } from '../data/types';

const ROMAN: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
};

/** "IV" -> "4", "8" -> "8", "IV A" -> "4". Nierozpoznany rocznik zostaje jak jest. */
export function gradeNumber(grade: string): string {
  const first = grade.trim().split(/\s+/)[0] ?? '';
  const roman = ROMAN[first.toUpperCase()];
  if (roman) return String(roman);
  const digits = first.match(/\d+/);
  return digits ? digits[0] : first;
}

/** Numer po kropce, np. "4.12" -> 12. Zwraca 0, gdy kod nie pasuje do rocznika. */
function codeNumber(code: string | undefined, prefix: string): number {
  if (!code) return 0;
  const match = new RegExp(`^${prefix}\\.(\\d+)$`).exec(code.trim());
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Kolejny wolny kod dla rocznika: bierze najwyzszy numer juz uzyty (takze przez
 * lekcje usuniete z planu, ale wciaz obecne na liscie) i dodaje jeden.
 */
export function nextLessonCode(lessons: Lesson[], grade: string): string {
  const prefix = gradeNumber(grade);
  let max = 0;
  for (const lesson of lessons) {
    if (lesson.grade !== grade) continue;
    max = Math.max(max, codeNumber(lesson.code, prefix));
  }
  return `${prefix}.${max + 1}`;
}

/**
 * Uzupelnia kody lekcjom, ktore ich jeszcze nie maja (dane sprzed wprowadzenia
 * kodow). Numeruje wg kolejnosci w roczniku, zaczynajac od pierwszego wolnego
 * numeru, i zwraca tylko lekcje, ktore faktycznie dostaly kod.
 */
export function backfillLessonCodes(lessons: Lesson[]): Array<{ id: string; code: string }> {
  const out: Array<{ id: string; code: string }> = [];
  const grades = Array.from(new Set(lessons.map((l) => l.grade)));
  for (const grade of grades) {
    const inGrade = lessons.filter((l) => l.grade === grade).sort((a, b) => a.order - b.order);
    const prefix = gradeNumber(grade);
    let next = inGrade.reduce((max, l) => Math.max(max, codeNumber(l.code, prefix)), 0) + 1;
    for (const lesson of inGrade) {
      if (lesson.code) continue;
      out.push({ id: lesson.id, code: `${prefix}.${next}` });
      next += 1;
    }
  }
  return out;
}
