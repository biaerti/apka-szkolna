// Losowanie mikolajkowe klasy: zaznaczasz, kto bierze udzial, losujesz, drukujesz
// karteczki do pociecia (10 na A4). Wynik jest domyslnie schowany, zeby nie
// wyswietlic go przypadkiem na projektorze. Zapis w tej przegladarce - same id
// uczniow, bez nazwisk.

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../data/store';
import { losujMikolajki, type ParaMikolajkowa } from '../lib/mikolajki';

interface Zapis {
  pary: ParaMikolajkowa[];
  pominieci: string[];
  kwota: string;
  termin: string;
}

const PUSTY: Zapis = { pary: [], pominieci: [], kwota: '', termin: '' };
const NA_STRONIE = 10;

function wczytaj(klucz: string): Zapis {
  try {
    const surowe = localStorage.getItem(klucz);
    return surowe ? { ...PUSTY, ...(JSON.parse(surowe) as Partial<Zapis>) } : PUSTY;
  } catch {
    return PUSTY;
  }
}

export function Mikolajki() {
  const { id = '' } = useParams();
  const schoolClass = useStore((s) => s.classes.find((c) => c.id === id));
  const wszyscy = useStore((s) => s.students);
  const uczniowie = useMemo(
    () => wszyscy.filter((s) => s.classId === id && s.active).sort((a, b) => a.number - b.number),
    [wszyscy, id],
  );

  const klucz = `mikolajki:${id}`;
  const [zapis, setZapis] = useState<Zapis>(() => wczytaj(klucz));
  const [pokazWynik, setPokazWynik] = useState(false);

  useEffect(() => {
    localStorage.setItem(klucz, JSON.stringify(zapis));
  }, [klucz, zapis]);

  const imie = useMemo(() => new Map(uczniowie.map((u) => [u.id, `${u.firstName} ${u.lastName}`.trim()])), [uczniowie]);
  const pominieci = useMemo(() => new Set(zapis.pominieci), [zapis.pominieci]);
  const bioracy = uczniowie.filter((u) => !pominieci.has(u.id));
  const wylosowani = new Set(zapis.pary.map((p) => p.kto));
  const nieaktualne = zapis.pary.length > 0
    && (bioracy.length !== wylosowani.size || bioracy.some((u) => !wylosowani.has(u.id)));

  function przelacz(uczenId: string) {
    setZapis((z) => ({
      ...z,
      pominieci: z.pominieci.includes(uczenId) ? z.pominieci.filter((x) => x !== uczenId) : [...z.pominieci, uczenId],
    }));
  }

  function losuj() {
    if (zapis.pary.length > 0 && !window.confirm('Jest już losowanie. Wylosować od nowa? Stare karteczki przestaną być aktualne.')) return;
    setZapis((z) => ({ ...z, pary: losujMikolajki(bioracy.map((u) => u.id)) }));
    setPokazWynik(false);
  }

  if (!schoolClass) {
    return <p className="p-8 text-gray-600">Nie ma takiej klasy. <Link to="/klasy" className="text-accent-700 underline">Klasy</Link></p>;
  }

  // Karteczki w kolejnosci z dziennika - latwiej rozdac.
  const numer = new Map(uczniowie.map((u) => [u.id, u.number]));
  const karteczki = [...zapis.pary].sort((a, b) => (numer.get(a.kto) ?? 0) - (numer.get(b.kto) ?? 0));
  const strony: ParaMikolajkowa[][] = [];
  for (let i = 0; i < karteczki.length; i += NA_STRONIE) strony.push(karteczki.slice(i, i + NA_STRONIE));
  const stopka = [zapis.kwota && `Prezent do ${zapis.kwota}.`, zapis.termin && `Przynieś ${zapis.termin}.`].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:min-h-0 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 max-w-[210mm] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <Link to={`/klasy/${id}`} className="text-sm text-accent-700 hover:underline">{schoolClass.name}</Link>
        <h1 className="mt-1 text-xl font-semibold text-gray-900">Mikołajki - losowanie</h1>
        <p className="mt-1 text-sm text-gray-600">
          Odznacz osoby, które nie biorą udziału, wylosuj i wydrukuj karteczki. Każdy dostaje karteczkę ze swoim nazwiskiem, w środku jest osoba, dla której robi prezent.
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
          {uczniowie.map((u) => (
            <li key={u.id}>
              <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={!pominieci.has(u.id)}
                  onChange={() => przelacz(u.id)}
                  className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                />
                {u.number}. {imie.get(u.id)}
              </label>
            </li>
          ))}
        </ul>
        {uczniowie.length === 0 && <p className="mt-4 text-sm text-gray-500">Ta klasa nie ma jeszcze uczniów.</p>}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Kwota <span className="font-normal text-gray-500">(na karteczce, np. 30 zł)</span>
            <Input className="mt-1" value={zapis.kwota} onChange={(e) => setZapis((z) => ({ ...z, kwota: e.target.value }))} />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Kiedy przynieść <span className="font-normal text-gray-500">(np. w piątek 4 grudnia)</span>
            <Input className="mt-1" value={zapis.termin} onChange={(e) => setZapis((z) => ({ ...z, termin: e.target.value }))} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={losuj} disabled={bioracy.length < 2}>
            {zapis.pary.length > 0 ? 'Losuj od nowa' : `Losuj (${bioracy.length} osób)`}
          </Button>
          {zapis.pary.length > 0 && (
            <>
              <Button variant="secondary" onClick={() => window.print()}>Drukuj karteczki</Button>
              <Button variant="ghost" onClick={() => setPokazWynik((v) => !v)}>
                {pokazWynik ? 'Schowaj wynik' : 'Pokaż, kto kogo ma'}
              </Button>
            </>
          )}
        </div>
        {nieaktualne && (
          <p className="mt-3 text-sm font-medium text-amber-800">
            Lista osób zmieniła się od losowania. Wylosuj od nowa, inaczej ktoś zostanie bez prezentu.
          </p>
        )}

        {pokazWynik && (
          <ol className="mt-4 grid gap-x-6 gap-y-1 border-t border-gray-200 pt-4 text-sm text-gray-800 sm:grid-cols-2">
            {karteczki.map((p) => (
              <li key={p.kto}>{imie.get(p.kto) ?? '?'} → <span className="font-semibold">{imie.get(p.komu) ?? '?'}</span></li>
            ))}
          </ol>
        )}
      </div>

      {/* Na ekranie tylko zaslepka - karteczki z nazwiskami widac dopiero na wydruku. */}
      {zapis.pary.length > 0 && (
        <p className="no-print mx-auto max-w-[210mm] text-center text-sm text-gray-500">
          Gotowe: {karteczki.length} karteczek, {strony.length} {strony.length === 1 ? 'kartka' : 'kartki'} A4. Karteczki pokażą się na wydruku.
        </p>
      )}

      <div className="hidden print:block">
        {strony.map((strona, nr) => (
          <div key={nr} className="grid grid-cols-2" style={{ breakAfter: nr < strony.length - 1 ? 'page' : 'auto' }}>
            {strona.map((p) => (
              <div key={p.kto} className="flex h-[54mm] flex-col border border-dashed border-gray-500 px-[6mm] py-[4mm]" style={{ breakInside: 'avoid' }}>
                <p className="text-[10px]">Mikołajki {schoolClass.name} · karteczka dla:</p>
                <p className="text-[15px] font-semibold leading-tight">{imie.get(p.kto) ?? '?'}</p>
                <div className="my-auto">
                  <p className="text-[11px]">Przygotowujesz prezent dla:</p>
                  <p className="text-[22px] font-bold leading-tight">{imie.get(p.komu) ?? '?'}</p>
                </div>
                <p className="text-[10px] leading-snug">{stopka} To tajemnica - nie mów nikomu, kogo masz.</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
