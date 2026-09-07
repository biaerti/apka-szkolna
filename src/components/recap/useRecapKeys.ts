// Skroty klawiaturowe ekranu powtorki. Wydzielone z RecapSession.tsx, zeby
// komponent zmiescil sie w limicie 250 linii.
//
// Spacja = losuj/nastepny, Enter = gotowe-nastepny (tryb bez ocen). W trybie
// ocen klawisze 1-4 zaleza od trybu rundy (recapMode, patrz src/lib/recap.ts):
// - powtorzeniowe: 1/2/3/4 = dobrze/czesciowo/zle/pas (bez zmian),
// - po-lekcji (stary tryb, tylko dla starych danych - patrz src/lib/recap.ts):
//   1 = dobrze, 2 = dalej (jak Enter w trybie bez ocen) - to jedyne dwa
//   przyciski, ten tryb nigdy nie dawal plomby.
// N = nastepne pytanie, O = pokaz odpowiedz, F = pelny ekran, Esc = zakoncz.

import { useEffect, useRef } from 'react';
import type { RecapSessionState } from './useRecapSession';

export function useRecapKeys(session: RecapSessionState, embedded: boolean | undefined, onExit: () => void, onToggleFullscreen: () => void) {
  const sessionRef = useRef(session);
  sessionRef.current = session;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const s = sessionRef.current;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (s.canSpin) s.pickNext();
      } else if (e.key === 'Enter') {
        if (!s.grading && s.currentStudent) s.markDoneNoGrade();
        else if (s.grading && s.recapMode !== 'powtorzeniowe' && s.currentStudent && !s.graded) s.markDoneNoGrade();
      } else if (e.key === '1') {
        if (s.grading) s.grade('plus');
      } else if (e.key === '2') {
        if (!s.grading) return;
        if (s.recapMode === 'powtorzeniowe') s.grade('kropka');
        else if (s.currentStudent && !s.graded) s.markDoneNoGrade();
      } else if (e.key === '3') {
        if (s.grading && s.recapMode === 'powtorzeniowe') s.grade('plomba');
      } else if (e.key === '4') {
        if (s.grading && s.recapMode === 'powtorzeniowe' && s.currentCanPass) s.grade('pass');
      } else if (e.key === 'n' || e.key === 'N') {
        s.nextQuestion();
      } else if (e.key === 'o' || e.key === 'O') {
        s.setShowAnswer((v) => !v);
      } else if (e.key === 'f' || e.key === 'F') {
        onToggleFullscreen();
      } else if (e.key === 'Escape') {
        onExit();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded]);
}
