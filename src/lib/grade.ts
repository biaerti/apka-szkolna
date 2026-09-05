// Rocznik (grade) i postep lekcji per klasa - czyste funkcje.
//
// Rocznik to pierwszy wyraz nazwy klasy: "IV A" -> "IV", "V A" -> "V". Lekcje
// naleza do rocznika (Lesson.grade), a kazda klasa rocznika ma w lekcji wlasny
// wpis postepu (Lesson.progress[classId]). Dzieki temu nowa klasa "IV D" od razu
// widzi wszystkie lekcje czwartych, bez kopiowania.

import type { Lesson, LessonProgress, SchoolClass } from '../data/types';

/** "IV A" -> "IV". Nazwa bez spacji jest sama swoim rocznikiem. */
export function classGrade(className: string): string {
  const first = className.trim().split(/\s+/)[0];
  return first || className.trim();
}

export function gradeOfClass(classes: SchoolClass[], classId: string): string | undefined {
  const cls = classes.find((c) => c.id === classId);
  return cls ? classGrade(cls.name) : undefined;
}

/** Klasy danego rocznika posortowane wg `order`. */
export function classesOfGrade(classes: SchoolClass[], grade: string): SchoolClass[] {
  return classes.filter((c) => classGrade(c.name) === grade).sort((a, b) => a.order - b.order);
}

/** Unikalne roczniki w kolejnosci pierwszego wystapienia wg `order` klas. */
export function allGrades(classes: SchoolClass[]): string[] {
  const out: string[] = [];
  for (const c of [...classes].sort((a, b) => a.order - b.order)) {
    const g = classGrade(c.name);
    if (!out.includes(g)) out.push(g);
  }
  return out;
}

/** Etykieta rocznika do zdan: "klasy IV" (kilka klas) albo "klasa IV" (jedna). */
export function gradeLabel(classes: SchoolClass[], grade: string): string {
  return classesOfGrade(classes, grade).length > 1 ? `klasy ${grade}` : `klasa ${grade}`;
}

const PLANNED: LessonProgress = { status: 'planned' };

/** Postep klasy w lekcji; brak wpisu oznacza lekcje jeszcze nieprowadzona. */
export function lessonProgress(lesson: Lesson, classId: string): LessonProgress {
  return lesson.progress[classId] ?? PLANNED;
}

/** Lekcje rocznika posortowane wg kolejnosci. */
export function lessonsOfGrade(lessons: Lesson[], grade: string): Lesson[] {
  return lessons.filter((l) => l.grade === grade).sort((a, b) => a.order - b.order);
}

/** Lekcje widoczne dla klasy = lekcje jej rocznika. */
export function lessonsForClass(lessons: Lesson[], classes: SchoolClass[], classId: string): Lesson[] {
  const grade = gradeOfClass(classes, classId);
  return grade === undefined ? [] : lessonsOfGrade(lessons, grade);
}

/** Dzisiejsza data jako YYYY-MM-DD (lokalnie). */
export function todayKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
