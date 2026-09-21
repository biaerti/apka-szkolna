import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { KANDYDACI, OPISY_KANDYDATOW, okladkaUrl, type Kandydat } from '../../data/lekturyOpisy';
import { useStore } from '../../data/store';
import type { ReadingPlanItem, ReadingVote } from '../../data/types';

type Rocznik = 'IV' | 'V';
type Widok = 'po-kolei' | 'wszystkie';

interface KandydatZOpisem extends Kandydat {
  autor: string;
  tytul: string;
  opis: string;
  strony: number;
  uwaga?: string;
  glosy: number;
}

const PUSTE: ReadingVote = { glosy: {} };

function Licznik({
  wartosc,
  onZmiana,
  duzy = false,
}: {
  wartosc: number;
  onZmiana: (delta: number) => void;
  duzy?: boolean;
}) {
  const przycisk = clsx(
    'flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    duzy ? 'h-14 w-14 text-3xl' : 'h-9 w-9 text-lg',
  );
  return (
    <div className="flex items-center gap-2" aria-label="Liczba głosów">
      <button type="button" className={przycisk} onClick={() => onZmiana(-1)} aria-label="Odejmij głos">-</button>
      <span className={clsx('min-w-[2.5ch] text-center font-bold tabular-nums text-gray-900', duzy ? 'text-5xl' : 'text-2xl')}>
        {wartosc}
      </span>
      <button type="button" className={przycisk} onClick={() => onZmiana(1)} aria-label="Dodaj głos">+</button>
    </div>
  );
}

function Okladka({ klucz, tytul, className }: { klucz: string; tytul: string; className?: string }) {
  return (
    <img
      src={okladkaUrl(klucz)}
      alt={`Okładka: ${tytul}`}
      className={clsx('aspect-[352/500] w-full rounded-md bg-gray-100 object-cover shadow-sm', className)}
      loading="lazy"
    />
  );
}

export function Glosowanie({ rocznik }: { rocznik: Rocznik }) {
  const readingVotes = useStore((s) => s.settings.readingVotes);
  const readingPlans = useStore((s) => s.settings.readingPlans);
  const updateSettings = useStore((s) => s.updateSettings);
  const glosowanie = readingVotes?.[rocznik] ?? PUSTE;
  const wykluczone = useMemo(() => new Set(glosowanie.wykluczone ?? []), [glosowanie.wykluczone]);

  const [pelnyEkran, setPelnyEkran] = useState(false);
  const [widok, setWidok] = useState<Widok>('po-kolei');
  const [biezacy, setBiezacy] = useState(0);
  const [pytajWyzeruj, setPytajWyzeruj] = useState(false);
  const [pytajZapisz, setPytajZapisz] = useState(false);

  const wszyscy = useMemo<KandydatZOpisem[]>(
    () => KANDYDACI[rocznik].map((kandydat) => ({
      ...kandydat,
      ...OPISY_KANDYDATOW[kandydat.klucz],
      glosy: glosowanie.glosy[kandydat.id] ?? 0,
    })),
    [glosowanie.glosy, rocznik],
  );
  const aktywni = useMemo(() => wszyscy.filter((k) => !wykluczone.has(k.id)), [wszyscy, wykluczone]);
  const schowani = useMemo(() => wszyscy.filter((k) => wykluczone.has(k.id)), [wszyscy, wykluczone]);
  const ranking = useMemo(
    () => [...aktywni].filter((k) => k.glosy > 0).sort((a, b) => b.glosy - a.glosy),
    [aktywni],
  );
  const sumaGlosow = aktywni.reduce((suma, k) => suma + k.glosy, 0);

  function zapiszGlosowanie(nowe: ReadingVote) {
    updateSettings({ readingVotes: { ...readingVotes, [rocznik]: nowe } });
  }

  function zmienGlosy(id: string, delta: number) {
    const obecne = glosowanie.glosy[id] ?? 0;
    zapiszGlosowanie({ ...glosowanie, glosy: { ...glosowanie.glosy, [id]: Math.max(0, obecne + delta) } });
  }

  function schowaj(id: string) {
    zapiszGlosowanie({ ...glosowanie, wykluczone: [...wykluczone, id] });
    setBiezacy((i) => Math.min(i, Math.max(0, aktywni.length - 2)));
  }

  function przywroc(id: string) {
    zapiszGlosowanie({ ...glosowanie, wykluczone: [...wykluczone].filter((x) => x !== id) });
  }

  function wyzeruj() {
    zapiszGlosowanie({ ...glosowanie, glosy: {} });
    setPytajWyzeruj(false);
  }

  // Wynik glosowania staje sie kolejnoscia w spisie. Tytuly bez glosow nie
  // wchodza, a to, co juz bylo w spisie (np. wlasne tytuly), zostaje za nimi.
  function zapiszKolejnosc() {
    const stary = readingPlans?.[rocznik] ?? [];
    const zRankingu: ReadingPlanItem[] = ranking.map((k) => {
      const byl = stary.find((pozycja) => pozycja.id === k.id);
      return { id: k.id, autor: k.autor, tytul: k.tytul, przeczytana: byl?.przeczytana };
    });
    const ids = new Set(zRankingu.map((pozycja) => pozycja.id));
    updateSettings({
      readingPlans: { ...readingPlans, [rocznik]: [...zRankingu, ...stary.filter((pozycja) => !ids.has(pozycja.id))] },
    });
    setPytajZapisz(false);
    setPelnyEkran(false);
  }

  useEffect(() => {
    if (!pelnyEkran) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setPelnyEkran(false);
      if (widok !== 'po-kolei') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') setBiezacy((i) => Math.min(i + 1, aktywni.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setBiezacy((i) => Math.max(i - 1, 0));
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [aktywni.length, pelnyEkran, widok]);

  useEffect(() => {
    setBiezacy(0);
  }, [rocznik]);

  const dialogi = (
    <>
      <ConfirmDialog
        open={pytajWyzeruj}
        title="Wyzerować głosy?"
        message={`Wszystkie głosy klasy ${rocznik} znikną. Schowane tytuły zostaną schowane.`}
        confirmLabel="Wyzeruj"
        onConfirm={wyzeruj}
        onCancel={() => setPytajWyzeruj(false)}
      />
      <ConfirmDialog
        open={pytajZapisz}
        title={`Zapisać kolejność do spisu klasy ${rocznik}?`}
        message={ranking.map((k, i) => `${i + 1}. ${k.tytul} (${k.glosy})`).join('\n')}
        confirmLabel="Zapisz kolejność"
        danger={false}
        onConfirm={zapiszKolejnosc}
        onCancel={() => setPytajZapisz(false)}
      />
    </>
  );

  if (pelnyEkran) {
    const k = aktywni[Math.min(biezacy, aktywni.length - 1)];
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Wybieramy lektury - klasa {rocznik}</h2>
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              {(['po-kolei', 'wszystkie'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWidok(w)}
                  className={clsx('rounded-md px-3 py-1.5 text-sm font-medium', widok === w ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50')}
                >
                  {w === 'po-kolei' ? 'Po kolei' : 'Wszystkie'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Głosów: {sumaGlosow}</span>
            <Button variant="primary" disabled={ranking.length === 0} onClick={() => setPytajZapisz(true)}>Zapisz kolejność</Button>
            <Button variant="secondary" onClick={() => setPelnyEkran(false)}>Zamknij (Esc)</Button>
          </div>
        </div>

        {widok === 'po-kolei' && k ? (
          <div className="flex min-h-0 flex-1 items-center gap-10 px-10 py-6">
            <button
              type="button"
              className="shrink-0 rounded-full p-3 text-3xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:invisible"
              onClick={() => setBiezacy((i) => Math.max(i - 1, 0))}
              disabled={biezacy === 0}
              aria-label="Poprzednia"
            >
              ‹
            </button>
            <div className="h-full max-h-[75vh] shrink-0">
              <img src={okladkaUrl(k.klucz)} alt={`Okładka: ${k.tytul}`} className="h-full rounded-lg object-contain shadow-md" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">{biezacy + 1} z {aktywni.length}</p>
              <h3 className="mt-2 text-5xl font-bold leading-tight text-gray-900">{k.tytul}</h3>
              <p className="mt-2 text-2xl text-gray-600">{k.autor} · ok. {k.strony} stron</p>
              <p className="mt-6 max-w-3xl text-2xl leading-relaxed text-gray-800">{k.opis}</p>
              <div className="mt-8">
                <Licznik duzy wartosc={k.glosy} onZmiana={(d) => zmienGlosy(k.id, d)} />
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full p-3 text-3xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:invisible"
              onClick={() => setBiezacy((i) => Math.min(i + 1, aktywni.length - 1))}
              disabled={biezacy >= aktywni.length - 1}
              aria-label="Następna"
            >
              ›
            </button>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
            <div className="grid grid-cols-3 gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {aktywni.map((kandydat) => (
                <div key={kandydat.id} className="flex flex-col rounded-xl border border-gray-200 p-3">
                  <Okladka klucz={kandydat.klucz} tytul={kandydat.tytul} className="max-h-64 object-contain" />
                  <p className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-gray-900">{kandydat.tytul}</p>
                  <p className="text-sm text-gray-500">{kandydat.autor}</p>
                  <div className="mt-auto pt-3">
                    <Licznik wartosc={kandydat.glosy} onZmiana={(d) => zmienGlosy(kandydat.id, d)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {dialogi}
      </div>
    );
  }

  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Głosowanie klasy {rocznik}</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Pokaż klasie tytuły z projektora, policz ręce i wpisz głosy. Kolejność w głosowaniu to kolejność omawiania w roku.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setPytajWyzeruj(true)} disabled={sumaGlosow === 0}>Wyzeruj głosy</Button>
          <Button onClick={() => { setWidok('po-kolei'); setBiezacy(0); setPelnyEkran(true); }}>Pokaż klasie</Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {aktywni.map((kandydat) => (
          <div key={kandydat.id} className="flex gap-3 rounded-lg border border-gray-200 p-3">
            <div className="w-24 shrink-0">
              <Okladka klucz={kandydat.klucz} tytul={kandydat.tytul} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-semibold leading-snug text-gray-900">{kandydat.tytul}</p>
              <p className="text-sm text-gray-500">{kandydat.autor} · ok. {kandydat.strony} s.</p>
              {kandydat.obowiazkowa && (
                <span className="mt-1 inline-block w-fit rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">obowiązkowa</span>
              )}
              {kandydat.uwaga && <p className="mt-1 text-xs leading-5 text-gray-500">{kandydat.uwaga}</p>}
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <Licznik wartosc={kandydat.glosy} onZmiana={(d) => zmienGlosy(kandydat.id, d)} />
                <button type="button" className="text-xs text-gray-400 hover:text-gray-700" onClick={() => schowaj(kandydat.id)}>
                  Schowaj
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {schowani.length > 0 && (
        <p className="border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
          Schowane:{' '}
          {schowani.map((k, i) => (
            <span key={k.id}>
              {i > 0 && ', '}
              {k.tytul}{' '}
              <button type="button" className="font-medium text-accent-700 hover:underline" onClick={() => przywroc(k.id)}>przywróć</button>
            </span>
          ))}
        </p>
      )}

      {ranking.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
          <ol className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {ranking.map((k, i) => (
              <li key={k.id}>
                <span className="font-semibold tabular-nums">{i + 1}.</span> {k.tytul} <span className="text-gray-400">({k.glosy})</span>
              </li>
            ))}
          </ol>
          <Button onClick={() => setPytajZapisz(true)}>Zapisz kolejność do spisu</Button>
        </div>
      )}
      {dialogi}
    </section>
  );
}
