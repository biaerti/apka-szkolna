// Zakladka "Zadania domowe": prace, ktore uczniowie robia w domu pod linkiem,
// a wyniki wracaja do apki. Na razie jeden modul - polski dla uczniow z innym
// jezykiem ojczystym (dyktanda online + zeszyt "Moj polski od zera"). Kolejne
// moduly (np. zadania domowe calej klasy) dochodza jako nowe sekcje ponizej;
// filtr klas na gorze dotyczy wszystkich.

import { Link } from 'react-router-dom';
import { useState } from 'react';
import clsx from 'clsx';
import { PageHeader } from '../components/ui/PageHeader';
import { DyktandaPanel } from '../components/dyktanda/DyktandaPanel';
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
        description="Uczniowie robią je w domu pod linkiem, wyniki i błędy wracają tutaj."
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
          Polski dla obcokrajowców
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
          Dla uczniów, dla których polski nie jest pierwszym językiem. W domu robią dyktanda online, a na lekcji pracują z
          zeszytem{' '}
          <Link to="/lekcje?widok=polski-od-zera" className="font-medium text-accent-700 underline">
            „Mój polski od zera”
          </Link>
          .
        </p>
        <div className="mt-5">
          <DyktandaPanel klasaId={klasaId} />
        </div>
      </section>
    </div>
  );
}
