// Slajd "Ćwiczymy razem": wiele przykladow naraz, ktore nauczyciel (albo
// dziecko przy komputerze) uzupelnia na projektorze, a potem klika
// "Sprawdź". Tresc z rejestru src/data/cwiczenia.ts, logika sprawdzania w
// src/lib/cwiczenia.ts.
//
// Uklad zawsze jest tabela (Bartek 2026-10-13: "ma byc rowno, nie
// rozwalone"): przyklady podzielone " | " ida w kolumny pod naglowkami, pola
// w jednej kolumnie maja te sama szerokosc na wszystkich stronach, a
// poprawka po "Sprawdź" siada na gornej krawedzi pola - nic sie nie
// przesuwa ani nie zawija.
//
// - luki: lista przykladow ze stronami ("Kolejne przykłady"),
// - tabela: odmiana jednego wyrazu ("Następny wyraz"), a "Własny wyraz" daje
//   pusta tabele do wpisania czegokolwiek - bez sprawdzania.
//
// Klik w slajd nie przewija prezentacji (stopPropagation), Enter przechodzi do
// nastepnego pola, a w ostatnim sprawdza. Esc zdejmuje kursor z pola - wtedy
// strzalki znow zmieniaja slajdy. Wpisy zyja tylko w tym pokazie.

import clsx from 'clsx';
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { Slide } from '../../data/types';
import { cwiczenieById, type Cwiczenie, type CwiczenieLuki, type CwiczenieTabela } from '../../data/cwiczenia';
import {
  jestPole,
  liczbaStron,
  parsujLinie,
  podzielNaKomorki,
  sprawdzLuke,
  sprawdzWybor,
  stronaPrzykladow,
  szerokosciKolumn,
  type Kawalek,
  type Pole,
  type Wynik,
} from '../../lib/cwiczenia';

type CwiczenieSlide = Extract<Slide, { kind: 'cwiczenie' }>;
type Stan = Wynik | 'pokazane';
/** Rysuje komorke: kawalki linii `i`, pola numerowane od `j0` (klucz `${i}-${j}`). */
type RenderKomorka = (kawalki: Kawalek[], i: number, j0: number, szerokoscCh?: number) => ReactNode;

export function CwiczenieSlideView({ slide }: { slide: CwiczenieSlide }) {
  const cw = cwiczenieById(slide.cwiczenieId);
  if (!cw) {
    return (
      <div className="flex h-full items-center justify-center text-3xl text-gray-400">
        {slide.cwiczenieId ? `Brak ćwiczenia „${slide.cwiczenieId}”` : 'Wybierz ćwiczenie w edytorze slajdu'}
      </div>
    );
  }
  return <Kanwa key={cw.id} cw={cw} />;
}

function Kanwa({ cw }: { cw: Cwiczenie }) {
  const [strona, setStrona] = useState(0);
  const [wlasny, setWlasny] = useState(false);
  const [wlasneHaslo, setWlasneHaslo] = useState('');
  const [wpisy, setWpisy] = useState<Record<string, string>>({});
  const [wybory, setWybory] = useState<Record<string, number>>({});
  const [wyniki, setWyniki] = useState<Record<string, Stan> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const naRaz = cw.typ === 'luki' ? (cw.naRaz ?? 6) : 0;
  const stron = cw.typ === 'luki' ? liczbaStron(cw.przyklady.length, naRaz) : cw.wyrazy.length;

  // Linie biezacego ekranu: przyklady albo komorki tabeli (wiersz po wierszu).
  const linie: Kawalek[][] = useMemo(() => {
    if (cw.typ === 'luki') return stronaPrzykladow(cw.przyklady, strona, naRaz).map(parsujLinie);
    if (wlasny) return cw.wiersze.flatMap(() => cw.kolumny.map((): Kawalek[] => [{ t: 'luka', odp: [], otwarta: true }]));
    return cw.wyrazy[strona].komorki.flat().map(parsujLinie);
  }, [cw, strona, wlasny, naRaz]);

  const wielkosc = cw.typ === 'luki' && Boolean(cw.wielkoscLiter);
  const pola = linie.flatMap((linia, i) => linia.filter(jestPole).map((k, j) => ({ klucz: `${i}-${j}`, k })));

  function wyczysc() {
    setWpisy({});
    setWybory({});
    setWyniki(null);
  }

  function idzDo(nowa: number, nowyWlasny = false) {
    setStrona(nowa);
    setWlasny(nowyWlasny);
    wyczysc();
  }

  function ocen(klucz: string, k: Pole): Wynik {
    return k.t === 'luka' ? sprawdzLuke(wpisy[klucz] ?? '', k, wielkosc) : sprawdzWybor(wybory[klucz], k.dobra);
  }

  function sprawdz() {
    setWyniki(Object.fromEntries(pola.map(({ klucz, k }) => [klucz, ocen(klucz, k)])));
  }

  function pokazOdpowiedzi() {
    const noweWpisy = { ...wpisy };
    const noweWybory = { ...wybory };
    const nowe: Record<string, Stan> = {};
    for (const { klucz, k } of pola) {
      const w = ocen(klucz, k);
      if (w === 'dobrze') {
        nowe[klucz] = 'dobrze';
        continue;
      }
      if (k.t === 'luka' && w !== 'otwarta') noweWpisy[klucz] = k.odp[0] ?? '';
      if (k.t === 'wybor') noweWybory[klucz] = k.dobra;
      nowe[klucz] = w === 'otwarta' ? 'otwarta' : 'pokazane';
    }
    setWpisy(noweWpisy);
    setWybory(noweWybory);
    setWyniki(nowe);
  }

  /** Poprawka po sprawdzeniu zdejmuje kolor tylko z tego jednego pola. */
  function zmienione(klucz: string) {
    setWyniki((prev) => {
      if (!prev || !(klucz in prev)) return prev;
      const next = { ...prev };
      delete next[klucz];
      return next;
    });
  }

  function onKeyDownPole(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      return;
    }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const inputy = Array.from(rootRef.current?.querySelectorAll<HTMLInputElement>('input[data-pole]') ?? []);
    const i = inputy.indexOf(e.currentTarget);
    if (i >= 0 && i < inputy.length - 1) inputy[i + 1].focus();
    else if (!wlasny) {
      e.currentTarget.blur();
      sprawdz();
    }
  }

  function renderWybor(klucz: string, k: Extract<Pole, { t: 'wybor' }>): ReactNode {
    const stan = wyniki?.[klucz];
    // Sama litera (w/W): jedno pole w srodku wyrazu, klik przelacza
    // litery - wyraz czyta sie w calosci, a nie "w W akacje".
    if (k.opcje.every((o) => [...o].length === 1)) {
      const wybrana = wybory[klucz];
      return (
        <span className="relative inline-block">
          <button
            type="button"
            onClick={() => {
              setWybory((prev) => ({ ...prev, [klucz]: prev[klucz] === undefined ? 0 : (prev[klucz] + 1) % k.opcje.length }));
              zmienione(klucz);
            }}
            className={clsx(
              'mx-px rounded-md border-2 px-1 leading-tight',
              wybrana === undefined && 'align-middle text-[0.7em]',
              klasaOpcji(stan, wybrana !== undefined, false),
            )}
          >
            {wybrana === undefined ? k.opcje.join('/') : k.opcje[wybrana]}
          </button>
          {stan === 'zle' && <Poprawka>{k.opcje[k.dobra]}</Poprawka>}
        </span>
      );
    }
    return (
      <span className="wybor inline-flex flex-wrap gap-2 align-middle">
        {k.opcje.map((opcja, n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              setWybory((prev) => ({ ...prev, [klucz]: n }));
              zmienione(klucz);
            }}
            className={clsx('rounded-xl border-2 px-3 py-0.5 leading-snug', klasaOpcji(stan, wybory[klucz] === n, n === k.dobra))}
          >
            {opcja}
          </button>
        ))}
      </span>
    );
  }

  function renderLuka(klucz: string, k: Extract<Pole, { t: 'luka' }>, szerokoscCh: number | 'pelna'): ReactNode {
    const stan = wyniki?.[klucz];
    const podpowiedz = stan === 'zle' ? k.odp[0] : stan === 'otwarta' ? `np. ${k.odp.slice(0, 2).join(', ')}` : '';
    return (
      <span className={clsx('relative align-middle', szerokoscCh === 'pelna' ? 'block w-full' : 'inline-block')}>
        <input
          data-pole
          value={wpisy[klucz] ?? ''}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => {
            setWpisy((prev) => ({ ...prev, [klucz]: e.target.value }));
            zmienione(klucz);
          }}
          onKeyDown={onKeyDownPole}
          style={szerokoscCh === 'pelna' ? undefined : { width: `${szerokoscCh}ch` }}
          className={clsx(
            'rounded-lg border-2 bg-gray-900 px-2 py-0 text-white outline-none focus:border-accent-300',
            szerokoscCh === 'pelna' && 'w-full',
            (!stan || stan === 'puste') && 'border-gray-500',
            stan === 'dobrze' && 'border-green-400 bg-green-500/20',
            stan === 'zle' && 'border-red-400 bg-red-500/20 text-red-200 line-through',
            stan === 'otwarta' && 'border-amber-400 bg-amber-500/20',
            stan === 'pokazane' && 'border-sky-400 bg-sky-500/20 text-sky-100',
          )}
        />
        {podpowiedz && <Poprawka otwarta={stan === 'otwarta'}>{podpowiedz}</Poprawka>}
      </span>
    );
  }

  const renderKomorka: RenderKomorka = (kawalki, i, j0, szerokoscCh) => {
    let j = j0;
    return kawalki.map((k, n) => {
      if (k.t === 'tekst') return <Tekst key={n} v={k.v} />;
      if (k.t === 'sep') return null;
      const klucz = `${i}-${j++}`;
      const szer = szerokoscCh ?? Math.min(Math.max(...(k.t === 'luka' ? k.odp : ['']).map((o) => [...o].length), 4) + 2, 24);
      return <span key={n}>{k.t === 'luka' ? renderLuka(klucz, k, szer) : renderWybor(klucz, k)}</span>;
    });
  };

  // Komorka tabeli odmiany: jedna luka na cala szerokosc kolumny.
  const renderKomorkaOdmiany: RenderKomorka = (kawalki, i) =>
    kawalki.map((k, n) => {
      if (k.t === 'tekst') return <Tekst key={n} v={k.v} />;
      if (k.t === 'luka') return <span key={n}>{renderLuka(`${i}-0`, k, 'pelna')}</span>;
      if (k.t === 'wybor') return <span key={n}>{renderWybor(`${i}-0`, k)}</span>;
      return null;
    });

  const sprawdzone = wyniki !== null && !wlasny;
  const dobrych = sprawdzone ? pola.filter(({ klucz }) => wyniki?.[klucz] === 'dobrze').length : 0;
  const doDecyzji = sprawdzone ? pola.filter(({ klucz }) => wyniki?.[klucz] === 'otwarta').length : 0;

  return (
    <div ref={rootRef} className="relative flex h-full flex-col px-12 pb-6 pt-7" onClick={(e) => e.stopPropagation()}>
      <header className="min-w-0">
        <div className="flex items-center gap-4">
          <span className="rounded-lg bg-accent-500/25 px-3 py-1 text-lg font-bold uppercase tracking-wider text-accent-200">
            Ćwiczymy razem
          </span>
          <h2 className="truncate text-[40px] font-bold leading-tight text-white">{cw.tytul}</h2>
        </div>
        <p className="mt-2 text-2xl leading-snug text-gray-300">{cw.polecenie}</p>
      </header>

      <div className="flex min-h-0 flex-1 items-center py-3">
        {cw.typ === 'luki' ? (
          <ListaPrzykladow cw={cw} linie={linie} start={strona * naRaz} renderKomorka={renderKomorka} />
        ) : (
          <Tabela
            cw={cw}
            haslo={
              wlasny ? (
                <input
                  data-pole
                  value={wlasneHaslo}
                  placeholder="wpisz wyraz"
                  onChange={(e) => setWlasneHaslo(e.target.value)}
                  onKeyDown={onKeyDownPole}
                  className="w-72 rounded-lg border-2 border-accent-300 bg-gray-900 px-2 text-white outline-none placeholder:text-gray-600"
                />
              ) : (
                cw.wyrazy[strona].haslo
              )
            }
            linie={linie}
            renderKomorka={renderKomorkaOdmiany}
          />
        )}
      </div>

      <footer className="flex items-center gap-2 whitespace-nowrap pr-28 text-xl">
        {!wlasny && (
          <>
            <Przycisk glowny onClick={sprawdz}>
              Sprawdź
            </Przycisk>
            <Przycisk onClick={pokazOdpowiedzi}>Pokaż odpowiedzi</Przycisk>
          </>
        )}
        <Przycisk onClick={wyczysc}>Wyczyść</Przycisk>
        {sprawdzone && (
          <span className="ml-2 font-semibold tabular-nums text-gray-200">
            <span className="text-green-300">✓ {dobrych}</span>/{pola.length}
            {doDecyzji > 0 && <span className="text-amber-200"> · {doDecyzji} do decyzji</span>}
          </span>
        )}
        <span className="flex-1" />
        {cw.typ === 'tabela' && !wlasny && <Przycisk onClick={() => idzDo(strona, true)}>Własny wyraz</Przycisk>}
        {stron > 1 && strona > 0 && !wlasny && <Przycisk onClick={() => idzDo(strona - 1)}>←</Przycisk>}
        {stron > 1 && !wlasny && <span className="px-1 tabular-nums text-gray-400">{strona + 1}/{stron}</span>}
        {wlasny ? (
          <Przycisk onClick={() => idzDo(strona)}>Wróć do przykładów</Przycisk>
        ) : (
          stron > 1 && (
            <Przycisk onClick={() => idzDo((strona + 1) % stron)}>
              {cw.typ === 'tabela' ? 'Następny wyraz →' : 'Kolejne przykłady →'}
            </Przycisk>
          )
        )}
      </footer>
    </div>
  );
}

/**
 * Przyklady jako tabela: numer, potem komorki z " | ". Bez " | " (zdania z
 * wyborem w srodku) to tabela z jedna kolumna - ten sam rytm wierszy i linie.
 * `kolumny: 2` dzieli strone na dwie tabele obok siebie.
 */
function ListaPrzykladow({ cw, linie, start, renderKomorka }: { cw: CwiczenieLuki; linie: Kawalek[][]; start: number; renderKomorka: RenderKomorka }) {
  const szerokosci = useMemo(() => szerokosciKolumn(cw.przyklady), [cw.przyklady]);
  const dwie = cw.kolumny === 2;
  const naRaz = cw.naRaz ?? 6;
  const wierszy = dwie ? Math.ceil(naRaz / 2) : naRaz;
  // Dlugie zdania w pierwszej kolumnie: tabela na cala szerokosc, tekst sie
  // zawija, a pola stoja rowno przy prawej. Krotkie hasla: tabela tak szeroka
  // jak tresc, zeby pole nie odjechalo od wyrazu.
  const dlugie = cw.przyklady.some((p) => (podzielNaKomorki(parsujLinie(p))[0] ?? []).reduce((n, k) => n + (k.t === 'tekst' ? k.v.length : 8), 0) > 34);
  // Waska tabela krotkich hasel: wieksze litery i srodek kartki, zeby nie
  // wisiala w lewym rogu.
  const waska = !dlugie && !dwie;
  const fontSize = waska ? (wierszy <= 6 ? 34 : 30) : wierszy <= 5 ? 32 : wierszy <= 6 ? 30 : 28;
  const polowy = dwie ? [linie.slice(0, wierszy), linie.slice(wierszy)] : [linie];

  return (
    <div className={clsx('w-full', dwie && 'grid grid-cols-2 items-start gap-14', waska && 'flex justify-center')} style={{ fontSize }}>
      {polowy.map((czesc, p) => (
        <table key={p} className={clsx('border-collapse', dlugie || dwie ? 'w-full' : 'w-auto')}>
          {cw.naglowki && (
            <thead>
              <tr>
                <th className="w-12" />
                {cw.naglowki.map((n, c) => (
                  <th key={n} className={clsx('pb-2 text-left text-[0.6em] font-semibold uppercase tracking-wide text-gray-400', c > 0 && 'pl-6')}>
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {czesc.map((linia, r) => {
              const i = p * wierszy + r;
              const komorki = podzielNaKomorki(linia);
              let j0 = 0;
              return (
                <tr key={i} className="border-t border-gray-800 first:border-t-0">
                  <td className="w-12 py-2.5 pr-3 text-right align-middle text-[0.7em] font-semibold tabular-nums text-gray-500">
                    {start + i + 1}.
                  </td>
                  {komorki.map((komorka, c) => {
                    const node = renderKomorka(komorka, i, j0, szerokosci[c] || undefined);
                    j0 += komorka.filter(jestPole).length;
                    return (
                      <td
                        key={c}
                        className={clsx(
                          'py-2.5 align-middle leading-snug',
                          c > 0 && 'pl-6',
                          // Kolumna z samymi polami (albo "jak [[...]]") nie lamie sie - opcje stoja w
                          // jednym rzedzie; dluzszy tekst z lukami moze sie zawinac.
                          c > 0 && komorka.every((k) => k.t !== 'tekst' || k.v.trim().length <= 4) && 'whitespace-nowrap [&_.wybor]:flex-nowrap',
                          c === 0 && komorki.length > 1 && 'font-medium text-white',
                          c === 0 && dwie && 'whitespace-nowrap',
                          c === 0 && komorki.length === 1 && 'text-gray-100',
                        )}
                      >
                        {node}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
    </div>
  );
}

function Tabela({ cw, haslo, linie, renderKomorka }: { cw: CwiczenieTabela; haslo: ReactNode; linie: Kawalek[][]; renderKomorka: RenderKomorka }) {
  const kol = cw.kolumny.length;
  const duzo = cw.wiersze.length > 4;
  return (
    <table className="table-fixed border-collapse" style={{ fontSize: duzo ? 27 : 30, width: kol === 1 ? 900 : '100%' }}>
      <colgroup>
        <col style={{ width: kol > 2 ? 230 : 470 }} />
        {cw.kolumny.map((k) => (
          <col key={k} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th className="pb-2 text-left align-bottom text-[1.15em] font-bold text-accent-200">{haslo}</th>
          {cw.kolumny.map((k) => (
            <th key={k} className="px-2 pb-2 text-left align-bottom text-[0.6em] font-semibold uppercase tracking-wide text-gray-400">
              {k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cw.wiersze.map(([nazwa, pytanie], w) => (
          <tr key={nazwa} className="border-t border-gray-800">
            <td className={clsx('pr-3', duzo ? 'py-1' : 'py-4')}>
              {/* Przy 7 przypadkach pytanie stoi obok nazwy - dwie linie nie mieszcza sie na kartce. */}
              <div className={clsx('leading-tight', duzo && 'flex items-baseline gap-3')}>
                <div className="font-semibold text-white">{nazwa}</div>
                <div className="text-[0.62em] text-gray-400">{pytanie}</div>
              </div>
            </td>
            {cw.kolumny.map((k, c) => {
              const i = w * kol + c;
              const linia = linie[i] ?? [];
              const podana = !linia.some(jestPole);
              return (
                <td key={k} className={clsx('px-2', duzo ? 'py-1' : 'py-4', podana && 'font-bold text-accent-200')}>
                  {renderKomorka(linia, i, 0)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Poprawna odpowiedz albo przyklad - na gornej krawedzi pola, bez przesuwania ukladu. */
function Poprawka({ children, otwarta = false }: { children: ReactNode; otwarta?: boolean }) {
  return (
    <span
      className={clsx(
        'pointer-events-none absolute -top-3.5 right-1 whitespace-nowrap rounded bg-gray-950 px-1.5 text-[0.6em] font-semibold leading-tight',
        otwarta ? 'text-amber-200' : 'text-green-300',
      )}
    >
      {children}
    </span>
  );
}

/** Kolor opcji wyboru. Po bledzie dobra opcja dostaje zielona ramke; nieruszone pole niczego nie zdradza. */
function klasaOpcji(stan: Stan | undefined, wybrana: boolean, dobra: boolean): string {
  if (wybrana && stan === 'dobrze') return 'border-green-400 bg-green-500/30 text-white';
  if (wybrana && stan === 'zle') return 'border-red-400 bg-red-500/30 text-white line-through';
  if (wybrana && stan === 'pokazane') return 'border-sky-400 bg-sky-500/30 text-white';
  if (wybrana) return 'border-accent-300 bg-accent-500/30 text-white';
  if (stan === 'zle' && dobra) return 'border-green-400 bg-gray-900 text-green-300';
  if (stan === 'dobrze' || stan === 'zle' || stan === 'pokazane') return 'border-gray-700 bg-gray-900 text-gray-500';
  return 'border-gray-600 bg-gray-900 text-gray-200 hover:border-gray-400';
}

/** Tekst przykladu: **pogrubienie** wskazuje wyraz, o ktory pytamy. */
function Tekst({ v }: { v: string }) {
  const czesci = v.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {czesci.map((c, n) =>
        n % 2 ? (
          <strong key={n} className="text-accent-200 underline decoration-accent-400 decoration-2 underline-offset-4">
            {c}
          </strong>
        ) : (
          <span key={n} className="whitespace-pre-wrap">
            {c}
          </span>
        ),
      )}
    </>
  );
}

function Przycisk({ children, onClick, glowny = false }: { children: ReactNode; onClick: () => void; glowny?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-xl px-4 py-2 font-semibold transition-colors',
        glowny ? 'bg-accent-500 text-white hover:bg-accent-400' : 'bg-white/10 text-gray-200 hover:bg-white/20',
      )}
    >
      {children}
    </button>
  );
}
