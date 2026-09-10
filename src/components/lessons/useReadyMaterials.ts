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
import type { Lesson, Question, QuestionSet } from '../../data/types';
import { buildRecap13 } from '../../data/recap13';
import { buildRecap4 } from '../../data/recap4';
import { buildIntroLesson } from '../../data/intro';
import {
  classifyMatch,
  isMatchStale,
  lessonQuestionSetId,
  matchLessonsForRefresh,
  orphanedQuestionSetIds,
  remapRecapSlides,
  resolveForeignReviewSetId,
  titleMatchKey,
  type ClassifiedRefreshMatch,
  type FreshMaterialsBundle,
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
      'Doda 6 lekcji-prezentacji (głoski i ortografia, części mowy i zdania, formy wypowiedzi, zmiękczenia oraz ą i ę, alfabet i słownik, zapis rozmowy: dialog i czat) i 6 zestawów pytań do koła fortuny.',
    build: buildRecap13,
  },
  {
    key: 'recap4',
    label: 'Powtórka klasy 4',
    description:
      'Doda 7 lekcji-prezentacji (odmienne części mowy, zdanie i wyrazy nieodmienne, środki poetyckie i formy wypowiedzi, słownictwo i frazeologia, ortografia i skróty, świat przedstawiony i teksty kultury, dialog, wiadomość i e-mail) i 7 zestawów pytań do koła fortuny.',
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
  /** Ile lekcji ma material w komplecie */
  lessonCount: number;
  /** Ile lekcji materialu jeszcze nie ma w roczniku - tyle wstawi klikniecie */
  missingCount: number;
  alreadyInserted: boolean;
  insert: () => void;
}

export function useReadyMaterials(grade: string, classIds: string[], gradeLessons: Lesson[]) {
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const manuallyEditedLessonIds = useStore((s) => s.manuallyEditedLessonIds);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const clearManualEdit = useStore((s) => s.clearManualEdit);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  const updateQuestionSet = useStore((s) => s.updateQuestionSet);
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);
  const removeQuestionSet = useStore((s) => s.removeQuestionSet);

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
  // tytule samo w sobie nie znaczy, ze jest co odswiezac. Kazde dopasowanie
  // jest tez oklasyfikowane: "code-newer" (kod ma nowsza wersje - biezaca
  // tresc lekcji odpowiada temu, co zostalo wstawione/odswiezone ostatnim
  // razem) albo "manually-edited" (nauczyciel zmienil tresc recznie w
  // edytorze - ciche odswiezenie zgubiloby jego zmiany).
  const refreshMatches: ClassifiedRefreshMatch[] = useMemo(
    () =>
      matchLessonsForRefresh(gradeLessons, freshBundle)
        .filter((m) => isMatchStale(m, questions))
        .map((m) => ({
          ...m,
          classification: classifyMatch(manuallyEditedLessonIds[m.oldLesson.id] === true),
        })),
    [freshBundle, gradeLessons, questions, manuallyEditedLessonIds],
  );

  // Lekcje materialu, ktorych rocznik jeszcze nie ma. Material rozrasta sie w czasie
  // (do powtorki 1-3 doszly lekcje 4-6), a nauczyciel mogl wstawic starsza wersje -
  // dlatego wstawianie dokłada brakujace lekcje zamiast byc blokowane po pierwszej.
  function missingLessons(bundle: FreshMaterialsBundle | undefined): FreshMaterialsBundle['lessons'] {
    if (!bundle) return [];
    const maja = new Set(gradeLessons.map((l) => titleMatchKey(l.title)));
    return bundle.lessons.filter((l) => !maja.has(titleMatchKey(l.title)));
  }

  /**
   * Rozwiazuje tymczasowe id zestawu pytan (z buildXxx) na id juz zapisane w
   * bazie. Uzywane dla obu pol lekcji (questionSetId, reviewQuestionSetId) ORAZ
   * dla slajdow recap - slajd otwierajacy lekcje N wskazuje na zestaw
   * powtorkowy lekcji N-1, ktora przy wstawianiu CZESCIOWYM (doszly tylko nowe
   * lekcje materialu) moze juz istniec w bazie pod innym (realnym) id. Dwa
   * zrodla id: `setIdMap` (zestawy wstawiane w tym samym wywolaniu) i - gdy tam
   * brak - dopasowanie po tytule lekcji-wlasciciela wsrod juz istniejacych
   * `gradeLessons`.
   */
  function resolveSetId(
    tempId: string | undefined,
    bundle: FreshMaterialsBundle,
    setIdMap: Map<string, string>,
  ): string | undefined {
    if (!tempId) return undefined;
    const mapped = setIdMap.get(tempId);
    if (mapped) return mapped;
    const owner = bundle.lessons.find((l) => l.questionSetId === tempId || l.reviewQuestionSetId === tempId);
    if (!owner) return undefined;
    const existing = gradeLessons.find((l) => titleMatchKey(l.title) === titleMatchKey(owner.title));
    if (!existing) return undefined;
    return owner.questionSetId === tempId ? existing.questionSetId : existing.reviewQuestionSetId;
  }

  function insert(bundle: FreshMaterialsBundle) {
    if (!grade) return;

    const doWstawienia = missingLessons(bundle);
    if (doWstawienia.length === 0) return;

    // Zestawy pytan tworzymy tylko te, ktorych uzywaja wstawiane lekcje - inaczej
    // uzupelnienie materialu zostawiloby w bazie duplikaty zestawow juz istniejacych.
    // Kazda lekcja moze uzywac dwoch zestawow: wstepnego (questionSetId) i
    // powtorkowego (reviewQuestionSetId).
    const potrzebneSety = new Set(
      doWstawienia.flatMap((l) => [l.questionSetId, l.reviewQuestionSetId]).filter(Boolean) as string[],
    );

    // Wstaw zestawy pytan i zapamietaj mapowanie starych (tymczasowych) id -> nowe id.
    const setIdMap = new Map<string, string>();
    for (const set of bundle.questionSets) {
      if (!potrzebneSety.has(set.id)) continue;
      const created = addQuestionSet({ name: set.name, topic: set.topic, classIds });
      setIdMap.set(set.id, created.id);
    }

    for (const q of bundle.questions) {
      const newSetId = setIdMap.get(q.setId);
      if (!newSetId) continue;
      addQuestion({ setId: newSetId, text: q.text, answer: q.answer });
    }

    for (const lesson of doWstawienia) {
      const mappedQuestionSetId = resolveSetId(lesson.questionSetId, bundle, setIdMap);
      const mappedSlides = remapRecapSlides(lesson.slides, (tempId) => resolveSetId(tempId, bundle, setIdMap));
      addLesson({
        ...lesson,
        questionSetId: mappedQuestionSetId,
        // Wymuszone rowne questionSetId (a nie osobno resolveSetId(lesson.reviewQuestionSetId, ...)) -
        // nowe lekcje NIGDY nie dostaja osobnego, zdublowanego zestawu powtorkowego,
        // nawet gdyby buildXxx kiedys pomylkowo uzyl dwoch roznych tymczasowych id.
        reviewQuestionSetId: mappedQuestionSetId,
        slides: mappedSlides,
      });
    }
  }

  // Aktualizuje jeden zestaw pytan "w miejscu" (te same id zestawu i pytan, o
  // ile juz istnieja), zeby zapisane wczesniej RecapEvent nadal wskazywaly na
  // istniejace pytania/zestawy. Brak starego zestawu (np. dane sprzed
  // wprowadzenia questionSetId/reviewQuestionSetId) tworzy nowy. Wspolna dla
  // zestawu wstepnego i powtorkowego lekcji - obie polowy odswiezaja sie tak samo.
  function syncQuestionSetInPlace(
    effectiveSetId: string | undefined,
    newSet: QuestionSet | undefined,
    newQuestions: Question[],
  ): string | undefined {
    if (effectiveSetId && questionSets.some((qs) => qs.id === effectiveSetId)) {
      if (newSet) {
        updateQuestionSet(effectiveSetId, { name: newSet.name, topic: newSet.topic });
      }
      const oldQuestions = questions.filter((q) => q.setId === effectiveSetId).sort((a, b) => a.order - b.order);
      const max = Math.max(oldQuestions.length, newQuestions.length);
      for (let i = 0; i < max; i++) {
        const nq = newQuestions[i];
        const oq = oldQuestions[i];
        if (nq && oq) updateQuestion(oq.id, { text: nq.text, answer: nq.answer });
        else if (nq && !oq) addQuestion({ setId: effectiveSetId, text: nq.text, answer: nq.answer });
        else if (!nq && oq) removeQuestion(oq.id);
      }
      return effectiveSetId;
    }
    if (newSet) {
      const created = addQuestionSet({ name: newSet.name, topic: newSet.topic, classIds });
      for (const nq of newQuestions) addQuestion({ setId: created.id, text: nq.text, answer: nq.answer });
      return created.id;
    }
    return undefined;
  }

  // Podmienia tresc juz wstawionych lekcji (dopasowanych po tytule) na aktualna
  // wersje z kodu, zachowujac postep (progress) i nie ruszajac recapEvents.
  // Zestaw pytan i pytania sa aktualizowane W MIEJSCU (te same id) - patrz
  // syncQuestionSetInPlace. reviewQuestionSetId lekcji jest WYMUSZONE rowne
  // jej wlasnemu questionSetId (patrz Lesson.reviewQuestionSetId) - starsze
  // lekcje z prawdziwie osobnym (lustrzanym) zestawem powtorkowym dostaja go
  // tu skasowany na rzecz jednego, wspolnego zestawu; ich stary, osobny zestaw
  // zostaje po petli osierocony i sprzatniety przez cleanupOrphanQuestionSets.
  //
  // `confirmedManualIds` to id lekcji sklasyfikowanych jako "manually-edited"
  // (recznie zmienione przez nauczyciela), ktore mimo to nauczyciel zaznaczyl
  // w dialogu do nadpisania. Lekcje "code-newer" odswiezaja sie zawsze;
  // "manually-edited" bez zaznaczenia checkboxa sa pomijane, zeby ciche
  // odswiezenie nie zgubilo recznych zmian.
  function refresh(confirmedManualIds?: ReadonlySet<string>) {
    if (!grade) return;
    const toRefresh = refreshMatches.filter(
      (m) => m.classification === 'code-newer' || confirmedManualIds?.has(m.oldLesson.id),
    );
    // lekcja.id (stare) -> nowy id zestawu powtorkowego (= jej wlasny
    // questionSetId) - zeby slajd otwierajacy NASTEPNEJ odswiezanej lekcji w
    // tej samej petli widzial swiezy id, a nie ten sprzed odswiezenia.
    const updatedReviewSetIds = new Map<string, string>();
    const beforeQuestionSetIds = questionSets.map((qs) => qs.id);

    for (const match of toRefresh) {
      const effectiveSetId = syncQuestionSetInPlace(
        lessonQuestionSetId(match.oldLesson),
        match.newQuestionSet,
        match.newQuestions,
      );
      // Wymuszone rowne effectiveSetId (bez osobnego syncQuestionSetInPlace na
      // match.oldLesson.reviewQuestionSetId) - stary, prawdziwie osobny zestaw
      // powtorkowy (jesli taki byl) juz nie jest przez nic wskazywany po tej
      // petli i sprzata go cleanupOrphanQuestionSets ponizej.
      const effectiveReviewSetId = effectiveSetId;
      if (effectiveReviewSetId) updatedReviewSetIds.set(match.oldLesson.id, effectiveReviewSetId);

      const mappedSlides = remapRecapSlides(match.newLesson.slides, (tempId) => {
        if (effectiveSetId && tempId === match.newLesson.questionSetId) return effectiveSetId;
        if (effectiveReviewSetId && tempId === match.newLesson.reviewQuestionSetId) return effectiveReviewSetId;
        return resolveForeignReviewSetId(gradeLessons, tempId, freshBundle, updatedReviewSetIds);
      });

      updateLesson(match.oldLesson.id, {
        title: match.newLesson.title,
        topic: match.newLesson.topic,
        registerTopic: match.newLesson.registerTopic,
        curriculum: match.newLesson.curriculum,
        dzial: match.newLesson.dzial,
        questionSetId: effectiveSetId,
        reviewQuestionSetId: effectiveReviewSetId,
        slides: mappedSlides,
        // progress, order, grade, plannedDate - celowo pominiete w patchu.
      });

      // Odswiezenie zastepuje ewentualne reczne zmiany trescia z kodu - flaga
      // "edytowana recznie" juz nie opisuje tego, co teraz jest zapisane.
      clearManualEdit(match.oldLesson.id);
    }

    if (toRefresh.length > 0) cleanupOrphanQuestionSets(beforeQuestionSetIds);
  }

  /**
   * Usuwa (wraz z pytaniami) zestawy pytan, na ktore po normalizacji
   * reviewQuestionSetId (patrz refresh) nie wskazuje juz zadna lekcja ani
   * zaden slajd recap - typowo zdublowany, lustrzany zestaw powtorkowy sprzed
   * wycofania osobnych zestawow. Sprawdza PELNA liste lekcji w store (nie
   * tylko rocznika), zeby nie skasowac zestawu uzywanego gdzie indziej.
   * `candidateIds` to zestawy sprzed refresh() - sprzatamy tylko wsrod nich,
   * zeby nie przegladac (i przypadkiem nie ruszyc) calej bazy pytan.
   */
  function cleanupOrphanQuestionSets(candidateIds: string[]) {
    // Swiezy stan lekcji PROSTO ZE STORE'A (nie `allLessons` z selektora
    // hooka) - w tym momencie updateLesson z petli refresh() juz zapisal
    // swoje zmiany w store, ale ten komponent jeszcze sie nie przerenderowal,
    // wiec `allLessons` bylby wciaz sprzed odswiezenia.
    const currentLessons = useStore.getState().lessons;
    for (const id of orphanedQuestionSetIds(currentLessons, candidateIds)) {
      removeQuestionSet(id);
    }
  }

  const materials: ReadyMaterial[] = MATERIAL_DEFINITIONS.filter((def) => bundles.has(def.key)).map((def) => {
    const bundle = bundles.get(def.key);
    const brakujace = missingLessons(bundle);
    const lessonCount = bundle?.lessons.length ?? 0;
    // Czesc materialu juz jest (starsza wersja) - w dialogu mowimy wprost, ile lekcji dojdzie.
    const description =
      brakujace.length > 0 && brakujace.length < lessonCount
        ? `Uzupełni materiał o ${brakujace.length} ${brakujace.length === 1 ? 'nową lekcję' : 'nowe lekcje'}: ` +
          `${brakujace.map((l) => l.title).join(', ')}.`
        : def.description;
    return {
      key: def.key,
      label: def.label,
      description,
      lessonCount,
      missingCount: brakujace.length,
      alreadyInserted: brakujace.length === 0,
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
