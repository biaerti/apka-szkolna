// Obsluga klawiatury ekranu prezentacji (LessonPresent) - wyniesiona z
// komponentu dla limitu dlugosci pliku. Kolejnosc ma znaczenie:
// 1. Esc najpierw zamyka otwarte panele (szuflada kola, panel "Klasa"), a
//    dopiero kolejny Esc wychodzi z prezentacji,
// 2. na slajdzie recap Spacja/Esc naleza do sesji kola powtorzeniowego,
// 3. na slajdzie `task` klawisz K przelacza szuflade kola na lekcji; przy
//    otwartej szufladzie Spacja KRECI (nie zmienia slajdu), 1 = plus,
//    2 = kropka, Backspace albo Ctrl+Z = cofnij ostatnia ocene,
// 4. strzalki / PageUp / PageDown / Home / End nawiguja zawsze, F = pelny ekran,
// 5. R wlacza/wylacza rysowanie po slajdzie, T dopisek tekstowy, Ctrl+Z cofa
//    ostatnia kreske (przy wylaczonym rysowaniu - ostatnia ocene z kola);
//    przy wlaczonym rysowaniu Esc najpierw chowa pasek (klikanie w slajd
//    wraca do przewijania),
// 6. M pauzuje ladowanie kartkowki decybelomierza (gdy mowi nauczyciel).

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
  /** Rysowanie po slajdzie (AnnotationToolbar) jest wlaczone. */
  drawing: boolean;
  onToggleDraw: () => void;
  onTextTool: () => void;
  onDrawOff: () => void;
  onDrawUndo: () => void;
  /** M = mute: pauza ladowania kartkowki na czas, gdy mowi nauczyciel. */
  onToggleNoisePause: () => void;
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
      if (e.key === 'Escape' && args.drawing) {
        e.preventDefault();
        args.onDrawOff();
        return;
      }
      // Ctrl+Z = cofnij. Przy wlaczonym rysowaniu cofa ostatni ksztalt, poza
      // rysowaniem - ostatnia ocene z kola na lekcji (tak samo jak Backspace).
      if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (args.drawing) args.onDrawUndo();
        else if (wheelActive) args.onUndo();
        return;
      }
      // Slajd kola ma wlasny uklad (bez kartki 1280x720), wiec nie ma po czym rysowac.
      if (!args.onRecap && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        args.onToggleDraw();
        return;
      }
      if (!args.onRecap && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        args.onTextTool();
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        args.onToggleNoisePause();
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
