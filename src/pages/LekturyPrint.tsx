// Lista lektur na rok dla uczniow - jedna strona A4, klasa IV i V obok siebie.
// Kolejnosc bierze sie ze spisu (readingPlans), terminy z TERMINY.

import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TERMINY } from '../data/lekturyOpisy';
import { useStore } from '../data/store';

const ROK = '2026/2027';

export function LekturyPrint() {
  const readingPlans = useStore((s) => s.settings.readingPlans);

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <Link to="/lektury" className="text-sm text-accent-700 hover:underline">Lektury</Link>
          <p className="text-xs text-gray-500">Kolejność ze spisu, terminy z głowy - zmienia się je w kodzie (TERMINY w lekturyOpisy.ts).</p>
        </div>
        <Button onClick={() => window.print()}>Drukuj</Button>
      </div>

      <article className="mx-auto box-border w-[210mm] bg-white p-[12mm] text-gray-900 shadow-lg print:w-auto print:p-0 print:shadow-none">
        <header className="mb-4 border-b border-gray-900 pb-2">
          <h1 className="text-[20px] font-bold leading-tight">Lektury na rok szkolny {ROK}</h1>
          <p className="mt-0.5 text-[11px] text-gray-600">
            Tytuły wybrane w głosowaniu klas 4a i 5a. Książkę trzeba mieć przeczytaną na podany termin - wtedy zaczynamy ją omawiać.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6">
          {(['IV', 'V'] as const).map((rocznik) => {
            const plan = readingPlans?.[rocznik] ?? [];
            const terminy = TERMINY[rocznik];
            return (
              <section key={rocznik}>
                <h2 className="mb-2 text-[14px] font-bold">Klasy {rocznik === 'IV' ? 'czwarte' : 'piąte'}</h2>
                {plan.length === 0 ? (
                  <p className="text-[11px] text-gray-500">Spis jest pusty - najpierw zapisz kolejność z głosowania.</p>
                ) : (
                  <ol className="space-y-2.5">
                    {plan.map((lektura, i) => {
                      const termin = terminy[i];
                      return (
                        <li key={lektura.id} className="flex gap-2 break-inside-avoid">
                          <span className="w-5 shrink-0 text-[13px] font-bold tabular-nums">{i + 1}.</span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold leading-tight">{lektura.tytul}</p>
                            {lektura.autor && <p className="text-[11px] text-gray-700">{lektura.autor}</p>}
                            {termin && (
                              <p className="mt-0.5 text-[11px] text-gray-900">
                                po dziale {termin.dzial} - <span className="font-semibold">{termin.kiedy}</span>
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            );
          })}
        </div>

        <p className="mt-6 border-t border-gray-300 pt-2 text-[10px] text-gray-600">
          Książki są w bibliotece szkolnej i miejskiej. Jeśli nie da się zdobyć na czas - powiedz wcześniej, coś wymyślimy.
        </p>
      </article>
    </div>
  );
}
