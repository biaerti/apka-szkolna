// Zakladka "Zadania domowe": portal ucznia szkola.klippi.pl/uczen. Konta klasy
// (login + haslo, kartki i wiadomosci do rodzicow), zadania robia sie same z
// lekcji klasy, a modul "Polski krok po kroku" to kurs pisowni dla uczniow
// z innym jezykiem ojczystym. Filtr klas na gorze dotyczy wszystkich sekcji.

import { Link } from 'react-router-dom';
import { useState } from 'react';
import clsx from 'clsx';
import { PageHeader } from '../components/ui/PageHeader';
import { DyktandaPanel } from '../components/dyktanda/DyktandaPanel';
import { KontaPanel } from '../components/portal/KontaPanel';
import { useStore } from '../data/store';

export function ZadaniaDomowe() {
  const classes = useStore((s) => s.classes);
  const [klasaId, setKlasaId] = useState<string | null>(null);
  const posortowane = [...classes].sort((a, b) => a.order - b.order);

  const chip = (aktywny: boolean) =>
    clsx(
      'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
      aktywny ? 'border-accent-500 bg-accent-50 text-accent-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    );

  return (
    <div>
      <PageHeader
        title="Zadania domowe"
        description="Uczniowie robią je w domu na szkola.klippi.pl/uczen. Zadania robią się same z lekcji klasy, wyniki wracają tutaj."
      />
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Klasa">
        <button type="button" className={chip(klasaId === null)} onClick={() => setKlasaId(null)} aria-pressed={klasaId === null}>
          Wszystkie klasy
        </button>
        {posortowane.map((c) => (
          <button key={c.id} type="button" className={chip(klasaId === c.id)} onClick={() => setKlasaId(c.id)} aria-pressed={klasaId === c.id}>
            {c.name}
          </button>
        ))}
      </div>


      <section aria-labelledby="modul-obcokrajowcy" className="max-w-4xl">
        <h2 id="modul-obcokrajowcy" className="text-lg font-semibold text-gray-900">
          Polski krok po kroku
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
          Kurs pisowni dla uczniów, dla których polski nie jest pierwszym językiem: 10 lekcji, co poniedziałek nowa. Uczeń wchodzi na szkola.klippi.pl/uczen loginem
          i hasłem z kartki (przycisk „Kartki dla kursu”). Na lekcji pracują z zeszytem{' '}
          <Link to="/lekcje?widok=polski-od-zera" className="font-medium text-accent-700 underline">
            „Mój polski od zera”
          </Link>
          .
        </p>
        <div className="mt-5">
          <DyktandaPanel klasaId={klasaId} />
        </div>
      </section>

      <details className="mt-12 max-w-4xl rounded-xl border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer text-base font-semibold text-gray-900">
          Zadania domowe dla całych klas <span className="font-normal text-gray-500">- od nowego semestru</span>
        </summary>
        <p className="mt-2 text-sm text-gray-600">
          Uczniowie tego jeszcze nie widzą (włącza się w src/pages/portal/Portal.tsx, ZADANIA_Z_LEKCJI). Konta można założyć wcześniej.
        </p>
        <div className="mt-4">
          <KontaPanel klasaId={klasaId} />
        </div>
      </details>
    </div>
  );
}
