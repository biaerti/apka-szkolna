// Logika przycisku "Gotowe materialy" (wstawianie lekcji zapoznawczej i gotowych
// powtorek oraz ich odswiezanie) wydzielona z Lessons.tsx, zeby strona zmiescila
// sie w limicie 250 linii na komponent. Czysta logika + wywolania akcji store'a,
// bez JSX - UI zyje w ReadyMaterialsMenu.tsx.
//
// Materialy sa opisane danymi (MATERIAL_DEFINITIONS), a nie osobnymi polami
// hooka - dolozenie kolejnego (np. powtorki klasy 5) to jeden wpis w tablicy.
// Lekcje naleza do rocznika (Lesson.grade), wiec hook pracuje na roczniku i
// liscie klas tego rocznika, a nie na pojedynczej klasie.

import { useMemo } from 'react';
import { useStore } from '../../data/store';
import type { Lesson } from '../../data/types';
import { buildRecap13 } from '../../data/recap13';
import { buildRecap4 } from '../../data/recap4';
import { buildIntroLesson } from '../../data/intro';
import {
  isMatchStale,
  lessonQuestionSetId,
  matchLessonsForRefresh,
  remapRecapSlides,
  type FreshMaterialsBundle,
  type RefreshMatch,
} from './refreshMaterials';

interface MaterialDefinition {
  key: 'intro' | 'recap13' | 'recap4';
  /** Nazwa do menu, np. "Lekcja zapoznawcza", "Powtórka klas 1-3". */
  label: string;
  /** Jedno zdanie do dialogu potwierdzenia: co dokladnie zostanie dodane. */
  description: string;
  build: (grade: string, classIds: string[]) => FreshMaterialsBundle;
}

/** buildIntroLesson zwraca jedna lekcje (nie paczke) - dopasowujemy ksztalt do FreshMaterialsBundle. */
function buildIntroBundle(grade: string, classIds: string[]): FreshMaterialsBundle {
  const bundle = buildIntroLesson(grade, classIds);
  return {
    lessons: [bundle.lesson],
    questionSets: [bundle.questionSet],
    questions: bundle.questions,
  };
}

const MATERIAL_DEFINITIONS: MaterialDefinition[] = [
  {
    key: 'intro',
    label: 'Lekcja zapoznawcza',
    description: 'Doda lekcję zapoznawczą wraz z zestawem 20 pytań "Poznajmy się".',
    build: buildIntroBundle,
  },
  {
    key: 'recap13',
    label: 'Powtórka klas 1-3',
    description:
      'Doda 3 lekcje-prezentacje (fonetyka i ortografia, gramatyka i interpunkcja, formy wypowiedzi) i 3 zestawy pytań do koła fortuny.',
    build: buildRecap13,
  },
  {
    key: 'recap4',
    label: 'Powtórka klasy 4',
    description:
      'Doda 3 lekcje-prezentacje (odmienne części mowy, zdanie i wyrazy nieodmienne, środki poetyckie i formy wypowiedzi) i 3 zestawy pytań do koła fortuny.',
    build: buildRecap4,
  },
];

/** Jeden gotowy material w stanie gotowym do wyswietlenia w panelu. */
export interface ReadyMaterial {
  key: 'intro' | 'recap13' | 'recap4';
  /** Nazwa do menu, np. "Lekcja zapoznawcza", "Powtórka klas 1-3", "Powtórka klasy 4" */
  label: string;
  /** Jedno zdanie do dialogu potwierdzenia: co dokładnie zostanie dodane */
  description: string;
  /** Ile lekcji wstawia (1 albo 3) */
  lessonCount: number;
  alreadyInserted: boolean;
  insert: () => void;
}

export function useReadyMaterials(grade: string, classIds: string[], gradeLessons: Lesson[]) {
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  const updateQuestionSet = useStore((s) => s.updateQuestionSet);
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);

  // Paczka danych z kodu per material. buildIntroLesson jest kontraktem
  // implementowanym rownolegle przez inny modul - dopoki nie jest gotowy,
  // funkcja rzuca wyjatek, wiec zabezpieczamy sie try/catch i po prostu
  // pomijamy material (zniknie z listy, dopoki intro.ts nie bedzie gotowe).
  const bundles = useMemo(() => {
    const map = new Map<string, FreshMaterialsBundle>();
    if (!grade) return map;
    for (const def of MATERIAL_DEFINITIONS) {
      try {
        map.set(def.key, def.build(grade, classIds));
      } catch {
        // material chwilowo niedostepny - pomijamy
      }
    }
    return map;
  }, [grade, classIds]);

  // Wszystkie dostepne materialy razem - do dopasowania przy odswiezaniu.
  const freshBundle: FreshMaterialsBundle = useMemo(() => {
    const combined: FreshMaterialsBundle = { lessons: [], questionSets: [], questions: [] };
    for (const def of MATERIAL_DEFINITIONS) {
      const bundle = bundles.get(def.key);
      if (!bundle) continue;
      combined.lessons.push(...bundle.lessons);
      combined.questionSets.push(...bundle.questionSets);
      combined.questions.push(...bundle.questions);
    }
    return combined;
  }, [bundles]);

  // Tylko lekcje, ktorych tresc naprawde rozni sie od kodu - dopasowanie po
  // tytule samo w sobie nie znaczy, ze jest co odswiezac.
  const refreshMatches: RefreshMatch[] = useMemo(
    () => matchLessonsForRefresh(gradeLessons, freshBundle).filter((m) => isMatchStale(m, questions)),
    [freshBundle, gradeLessons, questions],
  );

  // "Juz wstawione" = w lekcjach rocznika istnieje lekcja o tytule pierwszej
  // lekcji materialu.
  function isAlreadyInserted(bundle: FreshMaterialsBundle | undefined): boolean {
    const firstTitle = bundle?.lessons[0]?.title;
    return !!firstTitle && gradeLessons.some((l) => l.title === firstTitle);
  }

  function insert(bundle: FreshMaterialsBundle) {
    if (!grade) return;

    // Wstaw zestawy pytan i zapamietaj mapowanie starych (tymczasowych) id -> nowe id.
    const setIdMap = new Map<string, string>();
    for (const set of bundle.questionSets) {
      const created = addQuestionSet({ name: set.name, topic: set.topic, classIds });
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

  // Podmienia tresc juz wstawionych lekcji (dopasowanych po tytule) na aktualna
  // wersje z kodu, zachowujac postep (progress) i nie ruszajac recapEvents.
  // Zestaw pytan i pytania sa aktualizowane W MIEJSCU (te same id), zeby zapisane
  // wczesniej RecapEvent nadal wskazywaly na istniejace pytania/zestawy.
  function refresh() {
    if (!grade) return;
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
          classIds,
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
        // progress, order, grade, plannedDate - celowo pominiete w patchu.
      });
    }
  }

  const materials: ReadyMaterial[] = MATERIAL_DEFINITIONS.filter((def) => bundles.has(def.key)).map((def) => {
    const bundle = bundles.get(def.key);
    return {
      key: def.key,
      label: def.label,
      description: def.description,
      lessonCount: bundle?.lessons.length ?? 0,
      alreadyInserted: isAlreadyInserted(bundle),
      insert: () => {
        if (bundle) insert(bundle);
      },
    };
  });

  return {
    materials,
    refreshMatches,
    refresh,
  };
}
