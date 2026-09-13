import { FormEvent, useMemo, useState } from 'react';
import clsx from 'clsx';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  LEKTURY_IV_2026_KATALOG,
  LEKTURY_IV_2026_POLECANE_IDS,
  LEKTURY_IV_2026_STALE_TEKSTY,
  LEKTURY_IV_2026_ZASADA,
  LEKTURY_IV_2026_ZRODLO,
  LEKTURY_KROTKIE,
  LEKTURY_OBOWIAZKOWE,
  LEKTURY_UZUPELNIAJACE,
  LEKTURY_UZUPELNIAJACE_ZASADA,
  LEKTURY_ZRODLO,
  type Lektura,
} from '../data/lektury';
import { newId } from '../data/id';
import { useStore } from '../data/store';
import type { ReadingPlanItem } from '../data/types';

type Rocznik = 'IV' | 'V';
type FiltrIV = 'polecane' | 'wszystkie';

interface Kandydat extends Lektura {
  rodzaj: 'przykładowa' | 'obowiązkowa w cyklu IV-VI' | 'uzupełniająca';
}

function pasujeDoSzukania(lektura: Pick<Lektura, 'autor' | 'tytul'>, query: string): boolean {
  const tekst = `${lektura.autor ?? ''} ${lektura.tytul}`.toLocaleLowerCase('pl');
  return tekst.includes(query.trim().toLocaleLowerCase('pl'));
}

function OpisLektury({ lektura }: { lektura: Pick<Lektura, 'autor' | 'tytul'> }) {
  return (
    <span className="min-w-0">
      <span className="block font-medium text-gray-900">{lektura.tytul}</span>
      {lektura.autor && <span className="mt-0.5 block text-sm text-gray-500">{lektura.autor}</span>}
    </span>
  );
}

function ListaTekstowStalych({ lektury }: { lektury: Lektura[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {lektury.map((lektura) => (
        <li key={lektura.id} className="text-sm leading-6 text-gray-700">
          {lektura.autor && <span className="text-gray-500">{lektura.autor}, </span>}
          <span className="font-medium">{lektura.tytul}</span>
        </li>
      ))}
    </ul>
  );
}

export function Lektury() {
  const [rocznik, setRocznik] = useState<Rocznik>('IV');
  const [query, setQuery] = useState('');
  const [filtrIV, setFiltrIV] = useState<FiltrIV>('polecane');
  const [pokazFormularz, setPokazFormularz] = useState(false);
  const [wlasnyTytul, setWlasnyTytul] = useState('');
  const [wlasnyAutor, setWlasnyAutor] = useState('');

  const readingPlans = useStore((s) => s.settings.readingPlans);
  const updateSettings = useStore((s) => s.updateSettings);
  const wybrane = readingPlans?.[rocznik] ?? [];
  const wybraneIds = useMemo(() => new Set(wybrane.map((lektura) => lektura.id)), [wybrane]);

  const kandydaci = useMemo<Kandydat[]>(() => {
    if (rocznik === 'IV') {
      const baza = filtrIV === 'polecane'
        ? LEKTURY_IV_2026_KATALOG.filter((lektura) => LEKTURY_IV_2026_POLECANE_IDS.has(lektura.id))
        : LEKTURY_IV_2026_KATALOG;
      return baza
        .filter((lektura) => pasujeDoSzukania(lektura, query))
        .map((lektura) => ({ ...lektura, rodzaj: 'przykładowa' }));
    }

    return [
      ...LEKTURY_OBOWIAZKOWE.map((lektura) => ({ ...lektura, rodzaj: 'obowiązkowa w cyklu IV-VI' as const })),
      ...LEKTURY_UZUPELNIAJACE.map((lektura) => ({ ...lektura, rodzaj: 'uzupełniająca' as const })),
    ].filter((lektura) => pasujeDoSzukania(lektura, query));
  }, [filtrIV, query, rocznik]);

  const uzupelniajaceIds = useMemo(() => new Set(LEKTURY_UZUPELNIAJACE.map((lektura) => lektura.id)), []);
  const liczbaUzupelniajacych = rocznik === 'V'
    ? wybrane.filter((lektura) => uzupelniajaceIds.has(lektura.id) || lektura.wlasna).length
    : 0;
  const liczbaPrzeczytanych = rocznik === 'V'
    ? wybrane.filter((lektura) => lektura.przeczytana).length
    : 0;

  function zapiszPlan(nowyPlan: ReadingPlanItem[]) {
    updateSettings({ readingPlans: { ...readingPlans, [rocznik]: nowyPlan } });
  }

  function przelacz(lektura: Lektura) {
    if (wybraneIds.has(lektura.id)) {
      zapiszPlan(wybrane.filter((pozycja) => pozycja.id !== lektura.id));
      return;
    }
    zapiszPlan([...wybrane, { id: lektura.id, autor: lektura.autor, tytul: lektura.tytul }]);
  }

  function ustawPrzeczytana(id: string, przeczytana: boolean) {
    zapiszPlan(wybrane.map((lektura) => (
      lektura.id === id ? { ...lektura, przeczytana: przeczytana || undefined } : lektura
    )));
  }

  function dodajWlasna(e: FormEvent) {
    e.preventDefault();
    const tytul = wlasnyTytul.trim();
    if (!tytul) return;
    zapiszPlan([
      ...wybrane,
      { id: `wlasna-${newId()}`, tytul, autor: wlasnyAutor.trim() || undefined, wlasna: true },
    ]);
    setWlasnyTytul('');
    setWlasnyAutor('');
    setPokazFormularz(false);
  }

  function zmienRocznik(nowy: Rocznik) {
    setRocznik(nowy);
    setQuery('');
    setPokazFormularz(false);
  }

  const planGotowy = rocznik === 'IV' ? wybrane.length >= 4 : liczbaUzupelniajacych >= 2;

  return (
    <div className="max-w-5xl pb-10">
      <PageHeader
        title="Lektury"
        description="Osobne spisy dla klas IV i V w roku szkolnym 2026/2027."
      />

      <div className="mb-6 inline-flex rounded-lg border border-gray-200 bg-white p-1" role="tablist" aria-label="Wybierz rocznik">
        {(['IV', 'V'] as const).map((wartosc) => (
          <button
            key={wartosc}
            type="button"
            role="tab"
            aria-selected={rocznik === wartosc}
            onClick={() => zmienRocznik(wartosc)}
            className={clsx(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600',
              rocznik === wartosc ? 'bg-accent-600 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            Klasa {wartosc}
          </button>
        ))}
      </div>

      <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Twój spis dla klasy {rocznik}</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {rocznik === 'IV'
                ? 'Nowa podstawa 2026. Wybierz z uczniami co najmniej 4 dłuższe lektury na ten rok.'
                : 'Dotychczasowa podstawa. Prowadź wspólną historię lektur z cyklu IV-VI i ustal co najmniej 2 lektury uzupełniające na ten rok.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <div
              className={clsx(
                'shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums',
                planGotowy ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900',
              )}
            >
              {rocznik === 'IV'
                ? `${wybrane.length}/4 wybrane`
                : `${liczbaUzupelniajacych}/2 uzupełniające`}
            </div>
            {rocznik === 'V' && (
              <div className="shrink-0 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold tabular-nums text-blue-800">
                Przeczytane: {liczbaPrzeczytanych}
              </div>
            )}
          </div>
        </div>

        {wybrane.length > 0 ? (
          <ol className="divide-y divide-gray-100 px-5">
            {wybrane.map((lektura, index) => (
              <li key={lektura.id} className="flex flex-wrap items-center gap-3 py-3.5">
                <span className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums text-gray-400">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <OpisLektury lektura={lektura} />
                  {lektura.wlasna && <span className="mt-1 inline-block text-xs font-medium text-accent-700">Tytuł własny</span>}
                </div>
                {rocznik === 'V' && (
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={lektura.przeczytana ?? false}
                      onChange={(e) => ustawPrzeczytana(lektura.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Już mieli
                  </label>
                )}
                <Button type="button" variant="ghost" size="sm" onClick={() => zapiszPlan(wybrane.filter((x) => x.id !== lektura.id))}>
                  Usuń
                </Button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="font-medium text-gray-700">Spis jest jeszcze pusty.</p>
            <p className="mt-1 text-sm text-gray-500">Zaznacz tytuły z katalogu poniżej albo dopisz własną lekturę.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="katalog-lektur">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="katalog-lektur" className="text-lg font-semibold text-gray-900">Wybierz lektury do spisu</h2>
            <p className="mt-1 text-sm text-gray-500">
              {rocznik === 'V'
                ? 'Dodaj tytuły z całego cyklu IV-VI, a wyżej oznacz te, które klasa już miała.'
                : 'Zaznaczenia zapisują się automatycznie.'}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setPokazFormularz((wartosc) => !wartosc)}
          >
            {pokazFormularz ? 'Anuluj dodawanie' : 'Dodaj własny tytuł'}
          </Button>
        </div>

        {pokazFormularz && (
          <form onSubmit={dodajWlasna} className="mb-4 rounded-xl border border-accent-200 bg-accent-50 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="block text-sm font-medium text-gray-700">
                Tytuł
                <Input className="mt-1 bg-white" value={wlasnyTytul} onChange={(e) => setWlasnyTytul(e.target.value)} autoFocus />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Autor <span className="font-normal text-gray-500">(opcjonalnie)</span>
                <Input className="mt-1 bg-white" value={wlasnyAutor} onChange={(e) => setWlasnyAutor(e.target.value)} />
              </label>
              <Button type="submit" disabled={!wlasnyTytul.trim()}>Dodaj do spisu</Button>
            </div>
          </form>
        )}

        <div className="mb-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po tytule lub autorze"
            aria-label="Szukaj lektury po tytule lub autorze"
          />
          {rocznik === 'IV' && (
            <div className="flex rounded-lg border border-gray-200 bg-white p-1" aria-label="Zakres katalogu">
              <button
                type="button"
                onClick={() => setFiltrIV('polecane')}
                className={clsx('rounded-md px-3 py-1.5 text-sm font-medium', filtrIV === 'polecane' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50')}
              >
                Polecane dla IV
              </button>
              <button
                type="button"
                onClick={() => setFiltrIV('wszystkie')}
                className={clsx('rounded-md px-3 py-1.5 text-sm font-medium', filtrIV === 'wszystkie' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50')}
              >
                Cała lista IV-VIII
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {kandydaci.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {kandydaci.map((lektura) => {
                const zaznaczona = wybraneIds.has(lektura.id);
                return (
                  <li key={lektura.id} className={clsx('transition-colors', zaznaczona ? 'bg-accent-50' : 'hover:bg-gray-50')}>
                    <label className="flex cursor-pointer items-start gap-3 px-4 py-3.5 sm:px-5">
                      <input
                        type="checkbox"
                        checked={zaznaczona}
                        onChange={() => przelacz(lektura)}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                      />
                      <span className="min-w-0 flex-1"><OpisLektury lektura={lektura} /></span>
                       <span className={clsx(
                        'hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block',
                        lektura.rodzaj === 'obowiązkowa w cyklu IV-VI'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600',
                      )}>
                         {lektura.rodzaj}
                       </span>
                       {rocznik === 'V' && wybrane.find((pozycja) => pozycja.id === lektura.id)?.przeczytana && (
                         <span className="hidden shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 sm:inline-block">
                           już mieli
                         </span>
                       )}
                     </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-500">Nie znaleziono takiego tytułu ani autora.</div>
          )}
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <details className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <summary className="cursor-pointer font-semibold text-gray-900">
            {rocznik === 'IV' ? 'Pozostałe teksty wskazane w nowej podstawie' : 'Krótkie utwory, fragmenty i poezja'}
          </summary>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {rocznik === 'IV'
              ? 'Te teksty również trzeba uwzględnić w pracy z klasą. Nie wliczają się do minimum 4 dłuższych lektur.'
              : 'To wspólna pula do realizacji w klasach IV-VI. Nie wlicza się do minimum 2 lektur uzupełniających w roku.'}
          </p>
          <ListaTekstowStalych lektury={rocznik === 'IV' ? LEKTURY_IV_2026_STALE_TEKSTY : LEKTURY_KROTKIE} />
        </details>

        <details className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <summary className="cursor-pointer font-semibold text-gray-900">Co dokładnie mówi podstawa i źródło</summary>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {rocznik === 'IV' ? LEKTURY_IV_2026_ZASADA : LEKTURY_UZUPELNIAJACE_ZASADA}
          </p>
          <p className="mt-3 text-xs leading-5 text-gray-500">
            Źródło: {rocznik === 'IV' ? LEKTURY_IV_2026_ZRODLO : LEKTURY_ZRODLO}
          </p>
        </details>
      </section>
    </div>
  );
}
