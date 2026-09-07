// Obsluga klawiatury ekranu prezentacji (LessonPresent) - wyniesiona z
// komponentu dla limitu dlugosci pliku. Kolejnosc ma znaczenie:
// 1. Esc najpierw zamyka otwarte panele (szuflada kola, panel "Klasa"), a
//    dopiero kolejny Esc wychodzi z prezentacji,
// 2. na slajdzie recap Spacja/Esc naleza do sesji kola powtorzeniowego,
// 3. na slajdzie `task` klawisz K przelacza szuflade kola na lekcji; przy
//    otwartej szufladzie Spacja KRECI (nie zmienia slajdu), 1 = plus,
//    2 = kropka, Backspace = cofnij ostatnia ocene,
// 4. strzalki / PageUp / PageDown / Home / End nawiguja zawsze, F = pelny ekran.

import { useEffect } from 'react';

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export interface PresentKeysArgs {
  index: number;
  total: number;
  onRecap: boolean;
  onTask: boolean;
  classPanelOpen: boolean;
  setClassPanelOpen: (open: boolean) => void;
  wheelOpen: boolean;
  setWheelOpen: (open: boolean) => void;
  onSpin: () => void;
  onGrade: (result: 'plus' | 'kropka') => void;
  onUndo: () => void;
  goTo: (index: number) => void;
  toggleFullscreen: () => void;
  exit: () => void;
}

export function usePresentKeys(args: PresentKeysArgs) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      const wheelActive = args.onTask && args.wheelOpen;

      if (e.key === 'Escape' && wheelActive) {
        e.preventDefault();
        args.setWheelOpen(false);
        return;
      }
      if (e.key === 'Escape' && args.classPanelOpen) {
        e.preventDefault();
        args.setClassPanelOpen(false);
        return;
      }
      if (args.onRecap && (e.key === ' ' || e.key === 'Escape')) return;

      if (args.onTask && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        args.setWheelOpen(!args.wheelOpen);
        return;
      }
      if (wheelActive) {
        if (e.key === ' ') {
          e.preventDefault();
          args.onSpin();
          return;
        }
        if (e.key === '1') {
          e.preventDefault();
          args.onGrade('plus');
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          args.onGrade('kropka');
          return;
        }
        if (e.key === 'Backspace') {
          e.preventDefault();
          args.onUndo();
          return;
        }
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        args.goTo(args.index + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        args.goTo(args.index - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        args.goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        args.goTo(args.total - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        args.toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) args.exit();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });
}
