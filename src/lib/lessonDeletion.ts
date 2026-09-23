import type { Lesson } from '../data/types';
import { lessonMaterialType } from './lessonMaterial';

/**
 * Usuwa lekcje i naprawia lancuch powtorek w jej serii.
 *
 * Slajd `recap` na poczatku lekcji wskazuje zestaw POPRZEDNIEGO tematu.
 * Gdy srodkowy temat znika, nastepna lekcja ma wiec wrocic o jeszcze jeden
 * krok. Nie ruszamy recznie ustawionej powtorki, jezeli wskazuje inny zestaw.
 */
export function removeLessonWithRecapFallback(lessons: Lesson[], lessonId: string): Lesson[] {
  const removed = lessons.find((lesson) => lesson.id === lessonId);
  if (!removed) return lessons;

  const series = lessons
    .filter(
      (lesson) =>
        lesson.grade === removed.grade
        && lessonMaterialType(lesson) === lessonMaterialType(removed),
    )
    .sort((a, b) => a.order - b.order);
  const removedIndex = series.findIndex((lesson) => lesson.id === lessonId);
  const previous = removedIndex > 0 ? series[removedIndex - 1] : undefined;
  const next = removedIndex >= 0 ? series[removedIndex + 1] : undefined;
  const removedSetIds = new Set(
    [removed.questionSetId, removed.reviewQuestionSetId].filter(Boolean) as string[],
  );
  const fallbackSetId = previous?.reviewQuestionSetId ?? previous?.questionSetId;

  return lessons
    .filter((lesson) => lesson.id !== lessonId)
    .map((lesson) => {
      if (lesson.id !== next?.id || removedSetIds.size === 0) return lesson;

      const hasAffectedRecap = lesson.slides.some(
        (slide) => slide.kind === 'recap' && removedSetIds.has(slide.questionSetId),
      );
      if (!hasAffectedRecap) return lesson;

      const slides = lesson.slides.flatMap((slide) => {
        if (slide.kind !== 'recap' || !removedSetIds.has(slide.questionSetId)) return [slide];
        return fallbackSetId ? [{ ...slide, questionSetId: fallbackSetId }] : [];
      });
      return { ...lesson, slides };
    });
}

/**
 * Naprawia stare dane, w ktorych temat usunieto przed wprowadzeniem powyzszej
 * logiki. Osierocony jest tylko zestaw, ktorego nie posiada juz zadna lekcja
 * tej serii. Lekcje oznaczone jako recznie edytowane pozostaja bez zmian.
 */
export function repairOrphanedLessonRecaps(
  lessons: Lesson[],
  manuallyEditedLessonIds: Record<string, true> = {},
): Lesson[] {
  const groups = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const key = `${lesson.grade}\u0000${lessonMaterialType(lesson)}`;
    groups.set(key, [...(groups.get(key) ?? []), lesson]);
  }

  const repairedById = new Map<string, Lesson>();
  for (const group of groups.values()) {
    const sorted = [...group].sort((a, b) => a.order - b.order);
    const ownedSetIds = new Set(
      sorted.flatMap((lesson) =>
        [lesson.questionSetId, lesson.reviewQuestionSetId].filter(Boolean) as string[],
      ),
    );

    sorted.forEach((lesson, index) => {
      if (manuallyEditedLessonIds[lesson.id]) return;
      const previous = index > 0 ? sorted[index - 1] : undefined;
      const fallbackSetId = previous?.reviewQuestionSetId ?? previous?.questionSetId;
      const hasOrphanedRecap = lesson.slides.some(
        (slide) => slide.kind === 'recap' && !ownedSetIds.has(slide.questionSetId),
      );
      if (!hasOrphanedRecap) return;

      const slides = lesson.slides.flatMap((slide) => {
        if (slide.kind !== 'recap' || ownedSetIds.has(slide.questionSetId)) return [slide];
        return fallbackSetId ? [{ ...slide, questionSetId: fallbackSetId }] : [];
      });
      repairedById.set(lesson.id, { ...lesson, slides });
    });
  }

  return lessons.map((lesson) => repairedById.get(lesson.id) ?? lesson);
}
