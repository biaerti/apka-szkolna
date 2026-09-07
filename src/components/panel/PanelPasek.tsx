// Pasek ratunkowy na czas, gdy panelu jeszcze nie ma na ekranie: logowanie,
// "Ladowanie...", blad. Okno desktopowe nie ma ramki, wiec bez tego paska nie
// da sie go ani przesunac, ani zamknac - a ekran logowania rysuje AuthGate,
// czyli warstwa NAD trasa /panel, ktora o oknie nic nie wie.
//
// Znika sam: Panel.tsx po zamontowaniu ustawia na <html> klase `panel-gotowy`,
// a CSS chowa wtedy pasek (wlasny naglowek panelu przejmuje te role).

import { isTauri, zamknijOkno } from '../../lib/desktop';
import { useUchwytPrzeciagania } from './useUchwytPrzeciagania';

export function PanelPasek() {
  const uchwyt = useUchwytPrzeciagania(() => {});
  return (
    <div className="panel-pasek fixed inset-x-0 top-0 z-50 flex h-6 items-center">
      <div {...uchwyt} className="h-full flex-1 cursor-move" title="Przeciągnij, żeby przesunąć okno" />
      {isTauri() && (
        <button
          type="button"
          onClick={() => void zamknijOkno()}
          aria-label="Zamknij panel"
          className="mr-1 rounded px-2 text-sm leading-6 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
        >
          ✕
        </button>
      )}
    </div>
  );
}
