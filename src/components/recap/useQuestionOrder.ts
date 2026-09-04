// Kolejnosc pytan w biezacym zestawie: po kolei albo losowo (tasowanie
// odswiezane po wyczerpaniu calej listy), oraz mozliwosc skoku wprost do
// wybranego pytania (panel "wybierz pytanie" w RecapSession). Pamieta tez,
// ktore pytania juz padly na ekranie w tej sesji. Wydzielone z
// useRecapSession.ts, zeby glowny hook nie przekraczal limitu dlugosci pliku.

import { useEffect, useMemo, useState } from 'react';
import type { Question } from '../../data/types';
import { nextRandomIndex, shuffle } from '../../lib/recap';

export function useQuestionOrder(setQuestions: Question[], initialRandomOrder: boolean) {
  const [randomOrder, setRandomOrder] = useState(initialRandomOrder);
  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  // Pytania, ktore juz pojawily sie na ekranie w tej sesji - do panelu wyboru
  // konkretnego pytania (zeby bylo widac, co juz padlo).
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (randomOrder) {
      const ids = setQuestions.map((q) => q.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      setShuffledIds(ids);
    }
    setQuestionIndex(0);
    setShowAnswer(false);
  }, [randomOrder, setQuestions]);

  const orderedQuestions: Question[] = useMemo(() => {
    if (!randomOrder) return setQuestions;
    const byId = new Map(setQuestions.map((q) => [q.id, q]));
    return shuffledIds.map((id) => byId.get(id)).filter((q): q is Question => !!q);
  }, [randomOrder, setQuestions, shuffledIds]);

  const currentQuestion = orderedQuestions[questionIndex] ?? null;

  useEffect(() => {
    if (!currentQuestion) return;
    setAskedQuestionIds((cur) => (cur.has(currentQuestion.id) ? cur : new Set(cur).add(currentQuestion.id)));
  }, [currentQuestion]);

  function nextQuestion() {
    setShowAnswer(false);
    setQuestionIndex((i) => Math.min(orderedQuestions.length - 1, i + 1));
  }
  function prevQuestion() {
    setShowAnswer(false);
    setQuestionIndex((i) => Math.max(0, i - 1));
  }

  /**
   * Przechodzi do kolejnego pytania z potasowanej listy (tryb losowy). Wywolywana
   * automatycznie przy kazdym nowym uczniu - gdy lista zostanie wyczerpana, tasuje
   * ja ponownie od nowa (zeby pytania sie nie powtarzaly az do konca zestawu).
   */
  function advanceRandomQuestion() {
    setShowAnswer(false);
    const { index, reshuffle } = nextRandomIndex(questionIndex, shuffledIds.length);
    if (reshuffle) {
      setShuffledIds(shuffle(setQuestions.map((q) => q.id)));
    }
    setQuestionIndex(index);
  }

  /** Skok wprost do wskazanego pytania (klikniete w panelu "wybierz pytanie"). */
  function jumpToQuestion(questionId: string) {
    const idx = orderedQuestions.findIndex((q) => q.id === questionId);
    if (idx === -1) return;
    setShowAnswer(false);
    setQuestionIndex(idx);
  }

  return {
    orderedQuestions,
    questionIndex,
    currentQuestion,
    nextQuestion,
    prevQuestion,
    advanceRandomQuestion,
    jumpToQuestion,
    askedQuestionIds,
    randomOrder,
    setRandomOrder,
    showAnswer,
    setShowAnswer,
  };
}
