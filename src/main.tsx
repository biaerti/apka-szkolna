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
if (jestPanel) {
  document.documentElement.classList.add('panel-tryb');
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
