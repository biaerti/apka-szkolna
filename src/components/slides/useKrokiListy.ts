// Punkty listy odkrywane po kolei (slajd tekstowy z `krokowo: true`, np.
// pytania do klasy po czytance) albo czesci schematu z atrybutem data-krok.
// Strzalka w prawo / spacja pokazuje kolejny punkt, a dopiero po ostatnim idzie kolejny slajd; strzalka w lewo chowa
// ostatni pokazany. Klik mysza nie jest przechwytywany - prawa polowa ekranu
// od razu przechodzi na nastepny slajd (LessonPresent).
//
// Ukryte punkty sa przezroczyste, a nie usuniete: uklad i rozmiar czcionki
// (fitText liczy z calego tekstu) nie skacza przy odkrywaniu.

import { useEffect, useRef, useState, type RefObject } from 'react';

const DALEJ = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ']);
const WSTECZ = new Set(['ArrowLeft', 'ArrowUp', 'PageUp']);

/** Ile punktow widac na starcie: pierwszy od razu, zeby slajd nie byl pusty. */
const NA_START = 1;

export function useKrokiListy(kontener: RefObject<HTMLElement | null>, wlaczone: boolean, klucz: string) {
  const [widoczne, setWidoczne] = useState(NA_START);
  const stan = useRef({ widoczne: NA_START, ile: 0 });

  useEffect(() => {
    setWidoczne(NA_START);
    stan.current.widoczne = NA_START;
  }, [klucz]);

  // Widocznosc punktow - po kazdym kroku i po kazdym renderze tresci.
  useEffect(() => {
    // Punkty listy albo czesci ilustracji oznaczone data-krok (np. art "zdrada").
    const punkty = kontener.current ? [...kontener.current.querySelectorAll<HTMLElement | SVGElement>('li, [data-krok]')] : [];
    stan.current = { widoczne, ile: punkty.length };
    punkty.forEach((li, i) => {
      li.style.transition = 'opacity 350ms ease';
      li.style.opacity = !wlaczone || i < widoczne ? '1' : '0';
    });
  });

  useEffect(() => {
    if (!wlaczone) return;
    function onKeyDown(e: KeyboardEvent) {
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const { widoczne: w, ile } = stan.current;
      let nowe: number;
      if (DALEJ.has(e.key) && w < ile) nowe = w + 1;
      else if (WSTECZ.has(e.key) && w > NA_START) nowe = w - 1;
      else return;
      e.preventDefault();
      e.stopPropagation();
      stan.current.widoczne = nowe;
      setWidoczne(nowe);
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [wlaczone]);
}
