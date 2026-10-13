// Slajd "Ćwiczymy razem": wiele przykladow naraz, ktore nauczyciel (albo
// dziecko przy komputerze) uzupelnia na projektorze, a potem klika
// "Sprawdź". Tresc z rejestru src/data/cwiczenia.ts, logika sprawdzania w
// src/lib/cwiczenia.ts.
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
import { cwiczenieById, type Cwiczenie, type CwiczenieTabela } from '../../data/cwiczenia';
import {
  liczbaStron,
  parsujLinie,
  sprawdzLuke,
  sprawdzWybor,
  stronaPrzykladow,
  type Kawalek,
  type Wynik,
} from '../../lib/cwiczenia';

type CwiczenieSlide = Extract<Slide, { kind: 'cwiczenie' }>;
type Stan = Wynik | 'pokazane';

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

  const stron = cw.typ === 'luki' ? liczbaStron(cw.przyklady.length, cw.naRaz ?? 6) : cw.wyrazy.length;

  // Linie biezacego ekranu: przyklady albo komorki tabeli (wiersz po wierszu).
  const linie: Kawalek[][] = useMemo(() => {
    if (cw.typ === 'luki') return stronaPrzykladow(cw.przyklady, strona, cw.naRaz ?? 6).map(parsujLinie);
    if (wlasny) return cw.wiersze.flatMap(() => cw.kolumny.map((): Kawalek[] => [{ t: 'luka', odp: [], otwarta: true }]));
    return cw.wyrazy[strona].komorki.flat().map(parsujLinie);
  }, [cw, strona, wlasny]);

  const wielkosc = cw.typ === 'luki' && Boolean(cw.wielkoscLiter);
  // W dwoch kolumnach jest ciasno - podpowiedz do luki otwartej to jeden przyklad, nie trzy.
  const kompakt = cw.typ === 'luki' && cw.kolumny === 2;
  const pola = linie.flatMap((linia, i) =>
    linia.filter((k) => k.t !== 'tekst').map((k, j) => ({ klucz: `${i}-${j}`, k: k as Exclude<Kawalek, { t: 'tekst' }> })),
  );

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

  function ocen(klucz: string, k: (typeof pola)[number]['k']): Wynik {
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

  function renderPole(klucz: string, k: (typeof pola)[number]['k'], wTabeli: boolean): ReactNode {
    const stan = wyniki?.[klucz];
    if (k.t === 'wybor') {
      // Sama litera (w/W): jedno pole w srodku wyrazu, klik przelacza
      // litery - wyraz czyta sie w calosci, a nie "w W akacje".
      if (k.opcje.every((o) => [...o].length === 1)) {
        const wybrana = wybory[klucz];
        const pokaz = wybrana === undefined ? k.opcje.join('/') : k.opcje[wybrana];
        return (
          <>
            <button
              type="button"
              onClick={() => {
                setWybory((prev) => ({ ...prev, [klucz]: prev[klucz] === undefined ? 0 : (prev[klucz] + 1) % k.opcje.length }));
                zmienione(klucz);
              }}
              className={clsx(
                'mx-px rounded-md border-2 px-1 leading-tight transition-colors',
                wybrana === undefined && 'text-[0.7em] align-middle',
                klasaOpcji(stan, wybrana !== undefined, false),
              )}
            >
              {pokaz}
            </button>
            {stan === 'zle' && <sup className="font-bold text-green-300">{k.opcje[k.dobra]}</sup>}
          </>
        );
      }
      return (
        <span className="inline-flex flex-wrap gap-2 align-middle">
          {k.opcje.map((opcja, n) => {
            const wybrana = wybory[klucz] === n;
            const dobra = n === k.dobra;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setWybory((prev) => ({ ...prev, [klucz]: n }));
                  zmienione(klucz);
                }}
                className={clsx('rounded-xl border-2 px-3 py-0.5 leading-snug transition-colors', klasaOpcji(stan, wybrana, dobra))}
              >
                {opcja}
              </button>
            );
          })}
        </span>
      );
    }
    const wpis = wpisy[klucz] ?? '';
    const najdluzsza = Math.max(4, ...k.odp.map((o) => o.length));
    const podpowiedz = stan === 'zle' ? k.odp[0] : stan === 'otwarta' ? `np. ${k.odp.slice(0, kompakt ? 1 : 3).join(', ')}` : '';
    return (
      <span className={clsx('relative inline-flex align-middle', wTabeli ? 'w-full flex-col' : 'items-baseline gap-2')}>
        <input
          data-pole
          value={wpis}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => {
            setWpisy((prev) => ({ ...prev, [klucz]: e.target.value }));
            zmienione(klucz);
          }}
          onKeyDown={onKeyDownPole}
          style={wTabeli ? undefined : { width: `${Math.min(najdluzsza + 2, 22)}ch` }}
          className={clsx(
            'rounded-lg border-2 bg-gray-900 px-2 text-white outline-none focus:border-accent-300',
            wTabeli ? 'py-0' : 'py-0.5',
            wTabeli && 'w-full',
            !stan && 'border-gray-500',
            stan === 'puste' && 'border-gray-500',
            stan === 'dobrze' && 'border-green-400 bg-green-500/20',
            stan === 'zle' && 'border-red-400 bg-red-500/20 text-red-200 line-through',
            stan === 'otwarta' && 'border-amber-400 bg-amber-500/20',
            stan === 'pokazane' && 'border-sky-400 bg-sky-500/20 text-sky-100',
          )}
        />
        {podpowiedz && (
          <span
            className={clsx(
              'whitespace-nowrap font-semibold',
              stan === 'zle' ? 'text-green-300' : 'text-amber-200',
              wTabeli ? 'pointer-events-none absolute -top-3 right-2 rounded bg-gray-950 px-1.5 text-[0.65em] leading-tight' : 'text-[0.8em]',
            )}
          >
            {podpowiedz}
          </span>
        )}
      </span>
    );
  }

  function renderLinia(linia: Kawalek[], i: number, wTabeli = false): ReactNode {
    let j = 0;
    return linia.map((k, n) => {
      if (k.t === 'tekst') return <Tekst key={n} v={k.v} />;
      const klucz = `${i}-${j++}`;
      return <span key={n}>{renderPole(klucz, k, wTabeli)}</span>;
    });
  }

  const sprawdzone = wyniki !== null && !wlasny;
  const dobrych = sprawdzone ? pola.filter(({ klucz }) => wyniki?.[klucz] === 'dobrze').length : 0;
  const doDecyzji = sprawdzone ? pola.filter(({ klucz }) => wyniki?.[klucz] === 'otwarta').length : 0;

  return (
    <div
      ref={rootRef}
      className="relative flex h-full flex-col px-12 pb-6 pt-7"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="rounded-lg bg-accent-500/25 px-3 py-1 text-lg font-bold uppercase tracking-wider text-accent-200">
              Ćwiczymy razem
            </span>
            <h2 className="truncate text-[40px] font-bold leading-tight text-white">{cw.tytul}</h2>
          </div>
          <p className="mt-2 text-2xl leading-snug text-gray-300">{cw.polecenie}</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-center py-3">
        {cw.typ === 'luki' ? (
          <ListaPrzykladow cw={cw} linie={linie} renderLinia={renderLinia} />
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
            renderLinia={renderLinia}
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

type RenderLinia = (linia: Kawalek[], i: number, wTabeli?: boolean) => ReactNode;

function ListaPrzykladow({ cw, linie, renderLinia }: { cw: Extract<Cwiczenie, { typ: 'luki' }>; linie: Kawalek[][]; renderLinia: RenderLinia }) {
  const dwie = cw.kolumny === 2;
  const naRaz = cw.naRaz ?? 6;
  const fontSize = dwie ? 32 : naRaz <= 4 ? 30 : naRaz === 5 ? 38 : naRaz >= 7 ? 30 : 34;
  return (
    <ol
      className={clsx('w-full', dwie ? 'grid grid-flow-col grid-cols-2 gap-x-12 gap-y-4' : 'flex flex-col gap-4')}
      style={{ fontSize, gridTemplateRows: dwie ? `repeat(${Math.ceil(naRaz / 2)}, auto)` : undefined }}
    >
      {linie.map((linia, i) => (
        <li key={i} className="flex items-baseline gap-4 leading-snug text-gray-100">
          <span className="w-8 shrink-0 text-right text-[0.75em] font-semibold tabular-nums text-gray-500">{i + 1}.</span>
          <span className="min-w-0">{renderLinia(linia, i)}</span>
        </li>
      ))}
    </ol>
  );
}

function Tabela({ cw, haslo, linie, renderLinia }: { cw: CwiczenieTabela; haslo: ReactNode; linie: Kawalek[][]; renderLinia: RenderLinia }) {
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
            <th key={k} className="px-2 pb-2 text-left align-bottom text-[0.75em] font-semibold uppercase tracking-wide text-gray-400">
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
              const podana = linia.every((x) => x.t === 'tekst');
              return (
                <td key={k} className={clsx('px-2', duzo ? 'py-1' : 'py-4', podana && 'font-bold text-accent-200')}>
                  {renderLinia(linia, i, true)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
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
