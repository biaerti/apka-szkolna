// Logika przycisku "Gotowe materialy" (wstawianie lekcji zapoznawczej i gotowych
// powtorek oraz ich odswiezanie) wydzielona z Lessons.tsx, zeby strona zmiescila
// sie w limicie 250 linii na komponent. Czysta logika + wywolania akcji store'a,
// bez JSX - UI zyje w ReadyMaterialsPanel.tsx.
//
// Powtorki sa opisane danymi (RECAP_DEFINITIONS), a nie osobnymi polami hooka -
// dolozenie kolejnej (np. powtorki klasy 5) to jeden wpis w tablicy.

import { useMemo } from 'react';
import { useStore } from '../../data/store';
import type { Lesson } from '../../data/types';
import { buildRecap13 } from '../../data/recap13';
import { buildRecap4 } from '../../data/recap4';
import { buildIntroLesson, type IntroBundle } from '../../data/intro';
import {
  lessonQuestionSetId,
  matchLessonsForRefresh,
  remapRecapSlides,
  type FreshMaterialsBundle,
  type RefreshMatch,
} from './refreshMaterials';

interface RecapDefinition {
  key: string;
  /** Konczy zdanie "Wstaw ..." na przycisku. */
  insertLabel: string;
  /** Nazwa materialu w stanie "... - juz wstawione". */
  name: string;
  /** Co dokladnie zostanie dodane - trafia do dialogu potwierdzenia. */
  contents: string;
  build: (classId: string) => FreshMaterialsBundle;
}

const RECAP_DEFINITIONS: RecapDefinition[] = [
  {
    key: 'recap13',
    insertLabel: 'powtórkę klas 1-3',
    name: 'Powtórka klas 1-3',
    contents: 'fonetyka/ortografia, gramatyka/interpunkcja, formy wypowiedzi',
    build: buildRecap13,
  },
  {
    key: 'recap4',
    insertLabel: 'powtórkę klasy 4',
    name: 'Powtórka klasy 4',
    contents: 'odmienne części mowy, zdanie i wyrazy nieodmienne, środki poetyckie i formy wypowiedzi',
    build: buildRecap4,
  },
];

/** Jedna gotowa powtorka w stanie gotowym do wyswietlenia w panelu. */
export interface ReadyRecap {
  key: string;
  insertLabel: string;
  name: string;
  contents: string;
  alreadyInserted: boolean;
  insert: () => void;
}

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

  // Powtorke uznajemy za wstawiona, gdy klasa ma juz lekcje o tytule jej pierwszej lekcji.
  const insertedRecapKeys = useMemo(() => {
    if (!classId) return new Set<string>();
    const inserted = new Set<string>();
    for (const def of RECAP_DEFINITIONS) {
      const firstTitle = def.build(classId).lessons[0]?.title;
      if (firstTitle && classLessons.some((l) => l.title === firstTitle)) inserted.add(def.key);
    }
    return inserted;
  }, [classId, classLessons]);

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
    const bundle: FreshMaterialsBundle = { lessons: [], questionSets: [], questions: [] };
    for (const def of RECAP_DEFINITIONS) {
      const recap = def.build(classId);
      bundle.lessons.push(...recap.lessons);
      bundle.questionSets.push(...recap.questionSets);
      bundle.questions.push(...recap.questions);
    }
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

  function insertRecap(build: (classId: string) => FreshMaterialsBundle) {
    if (!classId) return;
    const bundle = build(classId);

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

  const recaps: ReadyRecap[] = RECAP_DEFINITIONS.map((def) => ({
    key: def.key,
    insertLabel: def.insertLabel,
    name: def.name,
    contents: def.contents,
    alreadyInserted: insertedRecapKeys.has(def.key),
    insert: () => insertRecap(def.build),
  }));

  return {
    introAvailable: !!introBundle,
    introAlreadyInserted,
    recaps,
    refreshMatches,
    insertIntro,
    refresh,
  };
}
