// Skroty klawiaturowe ekranu powtorki. Wydzielone z RecapSession.tsx, zeby
// komponent zmiescil sie w limicie 250 linii.
//
// Spacja = losuj/nastepny, 1/2/3/4 = dobrze/czesciowo/zle/pas (tylko w trybie
// ocen), Enter = gotowe-nastepny (tryb bez ocen), N = nastepne pytanie,
// O = pokaz odpowiedz, F = pelny ekran, Esc = zakoncz.

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
      } else if (e.key === '1') {
        if (s.grading) s.grade('plus');
      } else if (e.key === '2') {
        if (s.grading) s.grade('kropka');
      } else if (e.key === '3') {
        if (s.grading) s.grade('plomba');
      } else if (e.key === '4') {
        if (s.grading && s.currentCanPass) s.grade('pass');
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
