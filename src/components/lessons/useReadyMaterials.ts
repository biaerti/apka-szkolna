// Logika przycisku "Gotowe materialy" (wstawianie lekcji zapoznawczej / powtorki
// klas 1-3 oraz ich odswiezanie) wydzielona z Lessons.tsx, zeby strona zmiescila
// sie w limicie 250 linii na komponent. Czysta logika + wywolania akcji store'a,
// bez JSX - UI zyje w ReadyMaterialsPanel.tsx.

import { useMemo } from 'react';
import { useStore } from '../../data/store';
import type { Lesson } from '../../data/types';
import { buildRecap13 } from '../../data/recap13';
import { buildIntroLesson, type IntroBundle } from '../../data/intro';
import {
  lessonQuestionSetId,
  matchLessonsForRefresh,
  remapRecapSlides,
  type FreshMaterialsBundle,
  type RefreshMatch,
} from './refreshMaterials';

export function useReadyMaterials(classId: string, classLessons: Lesson[]) {
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  const updateQuestionSet = useStore((s) => s.updateQuestionSet);
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);

  const recap13FirstTitle = useMemo(() => {
    if (!classId) return undefined;
    return buildRecap13(classId).lessons[0]?.title;
  }, [classId]);
  const recap13AlreadyInserted =
    !!recap13FirstTitle && classLessons.some((l) => l.title === recap13FirstTitle);

  // buildIntroLesson jest kontraktem implementowanym rownolegle przez inny modul -
  // dopoki nie jest gotowy, funkcja rzuca wyjatek, wiec zabezpieczamy sie try/catch.
  const introBundle: IntroBundle | null = useMemo(() => {
    if (!classId) return null;
    try {
      return buildIntroLesson(classId);
    } catch {
      return null;
    }
  }, [classId]);
  const introAlreadyInserted =
    !!introBundle && classLessons.some((l) => l.title === introBundle.lesson.title);

  const freshBundle: FreshMaterialsBundle | null = useMemo(() => {
    if (!classId) return null;
    const recap = buildRecap13(classId);
    const bundle: FreshMaterialsBundle = {
      lessons: [...recap.lessons],
      questionSets: [...recap.questionSets],
      questions: [...recap.questions],
    };
    if (introBundle) {
      bundle.lessons.push(introBundle.lesson);
      bundle.questionSets.push(introBundle.questionSet);
      bundle.questions.push(...introBundle.questions);
    }
    return bundle;
  }, [classId, introBundle]);

  const refreshMatches: RefreshMatch[] = useMemo(
    () => (freshBundle ? matchLessonsForRefresh(classLessons, freshBundle) : []),
    [freshBundle, classLessons],
  );

  function insertRecap13() {
    if (!classId) return;
    const bundle = buildRecap13(classId);

    // Wstaw zestawy pytan i zapamietaj mapowanie starych id -> nowe id.
    const setIdMap = new Map<string, string>();
    for (const set of bundle.questionSets) {
      const created = addQuestionSet({ name: set.name, topic: set.topic, classIds: [classId] });
      setIdMap.set(set.id, created.id);
    }

    for (const q of bundle.questions) {
      const newSetId = setIdMap.get(q.setId);
      if (!newSetId) continue;
      addQuestion({ setId: newSetId, text: q.text, answer: q.answer });
    }

    for (const lesson of bundle.lessons) {
      const mappedQuestionSetId = lesson.questionSetId ? setIdMap.get(lesson.questionSetId) : undefined;
      const mappedSlides = lesson.slides.map((slide) => {
        if (slide.kind === 'recap') {
          const newId = setIdMap.get(slide.questionSetId);
          if (newId) return { ...slide, questionSetId: newId };
        }
        return slide;
      });
      addLesson({ ...lesson, questionSetId: mappedQuestionSetId, slides: mappedSlides });
    }
  }

  function insertIntro() {
    if (!classId || !introBundle) return;

    const created = addQuestionSet({
      name: introBundle.questionSet.name,
      topic: introBundle.questionSet.topic,
      classIds: [classId],
    });
    for (const q of introBundle.questions) {
      addQuestion({ setId: created.id, text: q.text, answer: q.answer });
    }

    const mappedQuestionSetId =
      introBundle.lesson.questionSetId === introBundle.questionSet.id
        ? created.id
        : introBundle.lesson.questionSetId;
    const mappedSlides = introBundle.lesson.slides.map((slide) => {
      if (slide.kind === 'recap' && slide.questionSetId === introBundle.questionSet.id) {
        return { ...slide, questionSetId: created.id };
      }
      return slide;
    });

    addLesson({ ...introBundle.lesson, questionSetId: mappedQuestionSetId, slides: mappedSlides });
  }

  // Podmienia tresc juz wstawionych lekcji (dopasowanych po tytule) na aktualna
  // wersje z kodu, zachowujac status/doneDate lekcji i nie ruszajac recapEvents.
  // Zestaw pytan i pytania sa aktualizowane W MIEJSCU (te same id), zeby zapisane
  // wczesniej RecapEvent nadal wskazywaly na istniejace pytania/zestawy.
  function refresh() {
    if (!classId) return;
    for (const match of refreshMatches) {
      let effectiveSetId = lessonQuestionSetId(match.oldLesson);

      if (effectiveSetId && questionSets.some((qs) => qs.id === effectiveSetId)) {
        if (match.newQuestionSet) {
          updateQuestionSet(effectiveSetId, {
            name: match.newQuestionSet.name,
            topic: match.newQuestionSet.topic,
          });
        }
        const oldQuestions = questions
          .filter((q) => q.setId === effectiveSetId)
          .sort((a, b) => a.order - b.order);
        const max = Math.max(oldQuestions.length, match.newQuestions.length);
        for (let i = 0; i < max; i++) {
          const nq = match.newQuestions[i];
          const oq = oldQuestions[i];
          if (nq && oq) updateQuestion(oq.id, { text: nq.text, answer: nq.answer });
          else if (nq && !oq) addQuestion({ setId: effectiveSetId, text: nq.text, answer: nq.answer });
          else if (!nq && oq) removeQuestion(oq.id);
        }
      } else if (match.newQuestionSet) {
        // Brak starego zestawu (np. dane sprzed wprowadzenia questionSetId) - utworz nowy.
        const created = addQuestionSet({
          name: match.newQuestionSet.name,
          topic: match.newQuestionSet.topic,
          classIds: [classId],
        });
        for (const nq of match.newQuestions) {
          addQuestion({ setId: created.id, text: nq.text, answer: nq.answer });
        }
        effectiveSetId = created.id;
      }

      const mappedSlides =
        effectiveSetId && match.newLesson.questionSetId
          ? remapRecapSlides(match.newLesson.slides, match.newLesson.questionSetId, effectiveSetId)
          : match.newLesson.slides;

      updateLesson(match.oldLesson.id, {
        title: match.newLesson.title,
        topic: match.newLesson.topic,
        registerTopic: match.newLesson.registerTopic,
        curriculum: match.newLesson.curriculum,
        questionSetId: effectiveSetId,
        slides: mappedSlides,
        // status, doneDate, plannedDate, order, classId - celowo pominiete w patchu.
      });
    }
  }

  return {
    introAvailable: !!introBundle,
    introAlreadyInserted,
    recap13AlreadyInserted,
    refreshMatches,
    insertIntro,
    insertRecap13,
    refresh,
  };
}
