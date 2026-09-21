// Karteczka z lekturami dla ucznia: A4 w poziomie, dwie takie same polowki
// A5 (lewa i prawa), do przeciecia. Jedna klasa (rocznik) na wydruk, wybor
// przelacznikiem nad karta. Kolejnosc ze spisu (readingPlans), terminy z
// TERMINY. Ok. 18 kartek wystarcza na 35 uczniow.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from '../components/ui/Button';
import { TERMINY } from '../data/lekturyOpisy';
import { useStore } from '../data/store';
import type { ReadingPlanItem } from '../data/types';

const ROK = '2026/2027';
type Rocznik = 'IV' | 'V';

function Karteczka({ rocznik, plan }: { rocznik: Rocznik; plan: ReadingPlanItem[] }) {
  const terminy = TERMINY[rocznik];
  return (
    <div className="flex h-full flex-col p-[12mm] text-gray-900">
      <header className="mb-3 border-b border-gray-900 pb-1.5">
        <h1 className="text-[20px] font-bold leading-tight">Lektury - klasa {rocznik}, rok {ROK}</h1>
        <p className="mt-0.5 text-[10px] text-gray-600">
          Wybrane w głosowaniu klasy. Książkę trzeba mieć przeczytaną na podany termin - wtedy zaczynamy ją omawiać.
        </p>
      </header>
      {plan.length === 0 ? (
        <p className="text-[11px] text-gray-500">Spis jest pusty - najpierw zapisz kolejność z głosowania.</p>
      ) : (
        <ol className="space-y-5">
          {plan.map((lektura, i) => {
            const termin = terminy[i];
            return (
              <li key={lektura.id} className="flex gap-2.5">
                <span className="w-5 shrink-0 text-[17px] font-bold tabular-nums">{i + 1}.</span>
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold leading-tight">{lektura.tytul}</p>
                  {lektura.autor && <p className="text-[13px] text-gray-700">{lektura.autor}</p>}
                  {termin && (
                    <p className="mt-0.5 text-[13px]">
                      po dziale {termin.dzial} - <span className="font-semibold">{termin.kiedy}</span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-auto border-t border-gray-300 pt-1.5 text-[9px] text-gray-600">
        Książki są w bibliotece szkolnej i miejskiej. Jeśli nie da się zdobyć na czas - powiedz wcześniej, coś wymyślimy.
      </p>
    </div>
  );
}

export function LekturyPrint() {
  const readingPlans = useStore((s) => s.settings.readingPlans);
  const [rocznik, setRocznik] = useState<Rocznik>('IV');
  const plan = readingPlans?.[rocznik] ?? [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[297mm] items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <Link to="/lektury" className="text-sm text-accent-700 hover:underline">Lektury</Link>
          <p className="text-xs text-gray-500">A4 w poziomie, dwie karteczki A5 do przecięcia. Na 35 uczniów wystarczy 18 kartek.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-gray-200 p-1" role="tablist" aria-label="Klasa">
            {(['IV', 'V'] as const).map((wartosc) => (
              <button
                key={wartosc}
                type="button"
                role="tab"
                aria-selected={rocznik === wartosc}
                onClick={() => setRocznik(wartosc)}
                className={clsx('rounded-md px-3 py-1.5 text-sm font-medium', rocznik === wartosc ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50')}
              >
                Klasa {wartosc}
              </button>
            ))}
          </div>
          <Button onClick={() => window.print()}>Drukuj</Button>
        </div>
      </div>

      <div className="lektury-a4 mx-auto grid h-[210mm] w-[297mm] grid-cols-2 bg-white shadow-lg print:shadow-none">
        <div className="border-r border-dashed border-gray-400">
          <Karteczka rocznik={rocznik} plan={plan} />
        </div>
        <Karteczka rocznik={rocznik} plan={plan} />
      </div>
    </div>
  );
}
