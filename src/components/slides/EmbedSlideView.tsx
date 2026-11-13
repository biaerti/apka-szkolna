// Slajd ze strona z public/ w ramce (np. model 3D Placu Broni:
// /prezentacje/plac-broni-3d.html). Strona ma wlasne kroki - strzalki
// najpierw przechodza po jej krokach, a dopiero po ostatnim idzie kolejny
// slajd (jak w PrzypomnienieSlideView).
//
// Umowa z ramka (postMessage, ten sam origin):
// - strona -> apka: { typ: 'slajd-stan', krok, ile } po kazdej zmianie kroku,
//                   { typ: 'slajd-klawisz', key } gdy strzalka w ramce wychodzi
//                   poza pierwszy/ostatni krok (focus byl w ramce po kliknieciu),
// - apka -> strona: { typ: 'slajd-krok', kierunek: 1 | -1 }.
// Strona bez tej umowy tez dziala - wtedy strzalki od razu zmieniaja slajd.

import { useEffect, useRef } from 'react';
import type { Slide } from '../../data/types';

type EmbedSlide = Extract<Slide, { kind: 'embed' }>;

const DALEJ = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ']);
const WSTECZ = new Set(['ArrowLeft', 'ArrowUp', 'PageUp']);

export function EmbedSlideView({ slide }: { slide: EmbedSlide }) {
  const ramka = useRef<HTMLIFrameElement>(null);
  const stan = useRef({ krok: 0, ile: 0 });

  useEffect(() => {
    stan.current = { krok: 0, ile: 0 };
    function onMessage(e: MessageEvent) {
      if (e.source !== ramka.current?.contentWindow) return;
      const d = e.data as { typ?: string; krok?: number; ile?: number; key?: string };
      if (d?.typ === 'slajd-stan' && typeof d.krok === 'number' && typeof d.ile === 'number') {
        stan.current = { krok: d.krok, ile: d.ile };
      } else if (d?.typ === 'slajd-klawisz' && typeof d.key === 'string') {
        // Focus zostal w ramce: oddajemy go apce i przekazujemy klawisz dalej.
        ramka.current?.blur();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: d.key, bubbles: true }));
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      const { krok, ile } = stan.current;
      let kierunek: 1 | -1;
      if (DALEJ.has(e.key) && krok < ile - 1) kierunek = 1;
      else if (WSTECZ.has(e.key) && krok > 0) kierunek = -1;
      else return;
      e.preventDefault();
      e.stopPropagation();
      ramka.current?.contentWindow?.postMessage({ typ: 'slajd-krok', kierunek }, window.location.origin);
    }
    window.addEventListener('message', onMessage);
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [slide.url]);

  if (!slide.url) {
    return <div className="flex h-full items-center justify-center text-3xl text-white/70">(brak adresu strony)</div>;
  }
  return (
    <iframe
      ref={ramka}
      src={slide.url}
      title={slide.title ?? 'Strona'}
      className="absolute inset-0 h-full w-full border-0"
      allow="fullscreen"
    />
  );
}
