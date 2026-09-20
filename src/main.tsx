import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthGate } from './components/layout/AuthGate';
import { PanelPasek } from './components/panel/PanelPasek';
import './index.css';

// Plywajacy panel desktopowy (trasa /panel, folder desktop/): okno Tauri jest
// przezroczyste i bez ramki, wiec tlo strony musi zniknac JUZ przy starcie -
// zanim zamontuje sie Panel. Przed zalogowaniem widac tu ekran AuthGate, ktory
// o oknie nic nie wie; stad tez pasek z przeciaganiem i krzyzykiem.
const jestPanel = window.location.pathname.startsWith('/panel');
const jestDziennik = window.location.pathname.startsWith('/dziennik');
if (jestPanel) {
  document.documentElement.classList.add('panel-tryb');
}

if (jestDziennik) {
  document.body.insertBefore(
    document.createComment(`
THESIS: Jedna godzina planu staje się kompletnym wpisem do dziennika; ekran odrzuca rozrzucone formularze i podwójne przepisywanie.
OWN-WORLD: Jasne neutralne pole istniejącej apki, cienkie linie, indygo dla działania, semantyczna zieleń, czerwień i bursztyn wyłącznie dla frekwencji.
STORY: Nauczyciel potwierdza godzinę i materiał, zaznacza wyjątki, sprawdza podsumowanie i przekazuje paczkę do zalogowanej karty VULCANA.
FIRST VIEWPORT: Desktop pokazuje wybór lekcji nad listą frekwencji; telefon układa te same decyzje pionowo, a stała akcja pozostaje przy dolnej krawędzi.
FORM: Operacyjny arkusz jednej lekcji, pozycja 6; seed key 61bd9dc5. Incumbent product world is a user-pinned constraint.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
    `),
    document.body.firstChild,
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Brak elementu #root w index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      {jestPanel && <PanelPasek />}
      <AuthGate>
        <App />
      </AuthGate>
    </BrowserRouter>
  </React.StrictMode>,
);
