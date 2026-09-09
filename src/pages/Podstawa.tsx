import { useMemo, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { PodstawaChat } from '../components/podstawa/PodstawaChat';
import { PODSTAWA_SEKCJE, PODSTAWA_ZRODLO, PodstawaSekcja } from '../data/podstawaTekst';

// Filtruje sekcje/dzialy/punkty po frazie (kod lub tekst, bez rozroznienia wielkosci liter).
function filterSekcje(sekcje: PodstawaSekcja[], query: string): PodstawaSekcja[] {
  const q = query.trim().toLowerCase();
  if (!q) return sekcje;
  return sekcje
    .map((sekcja) => ({
      ...sekcja,
      dzialy: sekcja.dzialy
        .map((dzial) => ({
          ...dzial,
          punkty: dzial.tytul.toLowerCase().includes(q)
            ? dzial.punkty
            : dzial.punkty.filter(
                (p) => p.kod.toLowerCase().includes(q) || p.tekst.toLowerCase().includes(q),
              ),
        }))
        .filter((dzial) => dzial.punkty.length > 0),
    }))
    .filter((sekcja) => sekcja.dzialy.length > 0);
}

export function Podstawa() {
  const [query, setQuery] = useState('');
  const sekcje = useMemo(() => filterSekcje(PODSTAWA_SEKCJE, query), [query]);

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Podstawa programowa"
        description="Język polski, klasy IV-VI - pełny tekst po zmianach z 2024 r."
      />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtruj: fraza lub kod, np. przecinek, I.1.4..."
            className="mb-4 max-w-md"
          />
          {sekcje.length === 0 && (
            <p className="text-sm text-gray-500">Brak punktów pasujących do filtra.</p>
          )}
          <div className="space-y-6">
            {sekcje.map((sekcja) => (
              <section key={sekcja.id} className="rounded-lg border border-gray-200 bg-white p-5">
                <h2 className="mb-2 text-base font-semibold text-gray-900">{sekcja.tytul}</h2>
                {sekcja.opis && <p className="mb-3 text-sm text-gray-600">{sekcja.opis}</p>}
                <div className="space-y-4">
                  {sekcja.dzialy.map((dzial) => (
                    <div key={dzial.id}>
                      <h3 className="mb-1 text-sm font-semibold text-gray-800">{dzial.tytul}</h3>
                      {dzial.wstep && <p className="mb-1 text-sm text-gray-500">{dzial.wstep}</p>}
                      <ul className="space-y-1">
                        {dzial.punkty.map((p) => (
                          <li key={p.kod} className="flex gap-2 text-sm text-gray-700">
                            <span className="shrink-0 font-mono text-xs leading-5 text-gray-400">
                              {p.kod}
                            </span>
                            <span>{p.tekst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">Źródło: {PODSTAWA_ZRODLO}</p>
        </div>
        <div className="w-full shrink-0 lg:w-96">
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)]">
            <PodstawaChat />
          </div>
        </div>
      </div>
    </div>
  );
}
