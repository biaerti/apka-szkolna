// Wydruk zasad lekcji - poza AppShell (jak ekrany projektora), bez paska bocznego.
// Dwie strony do wydruku:
//   1. zasady w dwoch identycznych polowkach A4 (do przeciecia nozyczkami,
//      kazda polowka to komplet do wreczenia jednemu uczniowi),
//   2. osobna strona z rysunkiem kola fortuny (WheelDiagram).
// Widoczne na ekranie przelaczniki pozwalaja wydrukowac tylko jedna z tych stron.

import { useState } from 'react';
import { RULE_SECTIONS } from '../data/zasady';
import { Button } from '../components/ui/Button';
import { WheelDiagram } from '../components/print/WheelDiagram';

/** Komplet zasad na jedna polowke kartki - uzywany dwukrotnie (do przeciecia). */
function RuleSheet() {
  return (
    <div className="flex h-full flex-col">
      <header className="mb-1.5 flex items-baseline justify-between border-b border-gray-900 pb-1">
        <div>
          <h1 className="text-[15px] font-bold leading-tight">Zasady naszych lekcji</h1>
          <p className="text-[9px] text-gray-600">Język polski</p>
        </div>
        <p className="text-[9px] text-gray-500">Imię i nazwisko: ________________________</p>
      </header>

      <div className="columns-3 gap-x-3">
        {RULE_SECTIONS.map((section) => (
          <section key={section.title} className="mb-1.5 break-inside-avoid">
            <h2 className="mb-0.5 text-[9.5px] font-bold uppercase tracking-wide text-accent-700">
              {section.title}
            </h2>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item} className="flex gap-1 text-[11px] leading-snug text-gray-800">
                  <span aria-hidden="true">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function RulesPrint() {
  const [showRules, setShowRules] = useState(true);
  const [showWheel, setShowWheel] = useState(true);
  const nothingSelected = !showRules && !showWheel;

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Co się wydrukuje</p>
          <Button onClick={() => window.print()} disabled={nothingSelected}>
            Drukuj
          </Button>
        </div>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={showRules}
            onChange={(e) => setShowRules(e.target.checked)}
          />
          <span>
            <span className="font-medium">Strona 1 - zasady do rozdania</span>
            <span className="block text-xs text-gray-500">
              Dwie identyczne kopie na jednej kartce A4 - przetnij nożyczkami na pół i rozdaj uczniom.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={showWheel}
            onChange={(e) => setShowWheel(e.target.checked)}
          />
          <span>
            <span className="font-medium">Strona 2 - jak wygląda koło fortuny</span>
            <span className="block text-xs text-gray-500">
              Osobna kartka A4 z rysunkiem koła - do powieszenia w klasie albo pokazania na start.
            </span>
          </span>
        </label>
        {nothingSelected && (
          <p className="text-xs text-red-600">Zaznacz przynajmniej jedną stronę, żeby móc drukować.</p>
        )}
      </div>

      {showRules && (
        <div className="mx-auto box-border h-[297mm] w-[210mm] bg-white p-[12mm] text-gray-900 shadow-lg print:h-auto print:w-auto print:p-0 print:shadow-none">
          <div className="h-[131mm] overflow-hidden">
            <RuleSheet />
          </div>

          <div className="print-color flex items-center gap-2" style={{ height: '11mm' }}>
            <span className="h-0 flex-1 border-t-2 border-dashed border-gray-400" aria-hidden="true" />
            {/* Bez znaku nozyczek: SPEC zabrania emoji w UI, a na Windows 7 dingbat
                potrafi wyjsc jako kolorowa emoji albo pusty prostokat na wydruku. */}
            <span className="shrink-0 text-[9px] uppercase tracking-widest text-gray-500">tu przetnij</span>
            <span className="h-0 flex-1 border-t-2 border-dashed border-gray-400" aria-hidden="true" />
          </div>

          <div className="h-[131mm] overflow-hidden">
            <RuleSheet />
          </div>
        </div>
      )}

      {showWheel && (
        <div
          className={
            'mx-auto box-border w-[210mm] bg-white p-[12mm] text-gray-900 shadow-lg print:w-auto print:p-0 print:shadow-none' +
            (showRules ? ' mt-8 break-before-page print:mt-0' : '')
          }
        >
          <header className="mb-3 border-b-2 border-gray-900 pb-2 text-center">
            <h1 className="text-xl font-bold">Jak wygląda nasze koło fortuny</h1>
            <p className="text-sm text-gray-600">Język polski</p>
          </header>
          <WheelDiagram />
        </div>
      )}
    </div>
  );
}
