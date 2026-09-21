// Pilne wazne info: punkty jeszcze niewyslane, ktorych termin mija dzis albo
// jutro. Odznaka w menu (AppShell) i pasek na pulpicie - zeby nauczyciel nie
// dowiedzial sie o terminie po fakcie. Lekki odczyt z chmury przy wejsciu
// do apki i przy powrocie do okna (w trybie lokalnym z localStorage).

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWazneInfo } from '../../data/wazneInfo';
import { dniDoTerminu, formatTermin } from '../../lib/wazneInfoExtract';
import { toDateKey } from '../../lib/dates';

interface Pilne {
  id: string;
  tytul: string;
  termin: string;
}

export function usePilneWazneInfo(): Pilne[] {
  const [pilne, setPilne] = useState<Pilne[]>([]);
  useEffect(() => {
    let stopped = false;
    async function tick() {
      const dzisiaj = toDateKey(new Date());
      try {
        const { punkty } = await fetchWazneInfo();
        const pilne = punkty
          .filter((p): p is typeof p & { termin: string } => p.status === 'nowe' && p.termin !== null)
          .filter((p) => {
            const dni = dniDoTerminu(p.termin, dzisiaj);
            return dni >= 0 && dni <= 1;
          })
          .sort((a, b) => a.termin.localeCompare(b.termin))
          .map((p) => ({ id: p.id, tytul: p.tytul, termin: p.termin }));
        if (!stopped) setPilne(pilne);
      } catch {
        // brak sieci - odznaka po prostu sie nie pokaze
      }
    }
    void tick();
    window.addEventListener('focus', tick);
    return () => {
      stopped = true;
      window.removeEventListener('focus', tick);
    };
  }, []);
  return pilne;
}

/** Pasek na pulpicie: "Termin jutro: ..." z linkiem do zakladki. */
export function WazneInfoPasek() {
  const pilne = usePilneWazneInfo();
  if (pilne.length === 0) return null;
  const dzisiaj = toDateKey(new Date());
  return (
    <Link
      to="/info"
      className="mb-6 block rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 hover:bg-red-100"
    >
      <p className="font-semibold">Ważne info do wysłania rodzicom</p>
      <ul className="mt-1 space-y-0.5">
        {pilne.map((p) => (
          <li key={p.id}>
            {dniDoTerminu(p.termin, dzisiaj) <= 0 ? 'Dziś' : 'Jutro'} ({formatTermin(p.termin)}): {p.tytul}
          </li>
        ))}
      </ul>
    </Link>
  );
}
