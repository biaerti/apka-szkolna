// Zadanie domowe z jednej lekcji: "Przypomnij sobie" (notatka z lekcji), potem
// jeden przyklad z kart "Ćwiczymy razem" na ekran, "Sprawdź" i arkusz od dolu
// z "Dlaczego?" (regula z karty). Na koncu wynik, zapis do bazy i "jeszcze raz"
// z nowymi przykladami. Pytania: src/lib/zadaniaDomowe.ts.

import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RichText } from '../../components/slides/RichText';
import { getSupabase } from '../../data/supabase';
import {
  jestPole,
  parsujLinie,
  podzielNaKomorki,
  sprawdzLuke,
  sprawdzWybor,
  type Kawalek,
  type Wynik,
} from '../../lib/cwiczenia';
import {
  kluczZadania,
  notatkaLekcji,
  pytaniaZadania,
  type LekcjaZadania,
  type PytanieZadania,
} from '../../lib/zadaniaDomowe';
import { Arkusz, DolnyPrzycisk, GornyPasek, Karta, btnDrugi, btnGlowny } from './ui';
import type { KontoUcznia } from './konto';

type Odpowiedzi = Record<string, string>;
type Wybory = Record<string, number>;

interface WynikPytania {
  punkty: number;
  maks: number;
  bledy: Array<{ wzor: string; wpisane: string | null }>;
}

const POLSKIE = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

/** Pola jednego ekranu: luki i wybory z kluczami `${komorka}-${pole}`. */
function polaEkranu(p: PytanieZadania): Array<{ klucz: string; pole: Extract<Kawalek, { t: 'luka' } | { t: 'wybor' }> }> {
  const linie = p.typ === 'luki' ? [p.linia] : p.cw.wyrazy[p.wyraz].komorki.flat();
  return linie.flatMap((linia, i) =>
    parsujLinie(linia)
      .filter(jestPole)
      .map((pole, j) => ({ klucz: `${i}-${j}`, pole })),
  );
}

function ocenEkran(p: PytanieZadania, wpisy: Odpowiedzi, wybory: Wybory): { stany: Record<string, Wynik>; wynik: WynikPytania } {
  const stany: Record<string, Wynik> = {};
  const wynik: WynikPytania = { punkty: 0, maks: 0, bledy: [] };
  const wielkosc = p.cw.typ === 'luki' && !!p.cw.wielkoscLiter;
  for (const { klucz, pole } of polaEkranu(p)) {
    if (pole.t === 'luka') {
      const s = sprawdzLuke(wpisy[klucz] ?? '', pole, wielkosc);
      stany[klucz] = s;
      if (pole.otwarta) continue;
      wynik.maks++;
      if (s === 'dobrze') wynik.punkty++;
      else wynik.bledy.push({ wzor: pole.odp[0], wpisane: wpisy[klucz]?.trim() || null });
    } else {
      const s = sprawdzWybor(wybory[klucz], pole.dobra);
      stany[klucz] = s;
      wynik.maks++;
      if (s === 'dobrze') wynik.punkty++;
      else wynik.bledy.push({ wzor: pole.opcje[pole.dobra], wpisane: wybory[klucz] === undefined ? null : pole.opcje[wybory[klucz]] });
    }
  }
  return { stany, wynik };
}

/** Komorka: tekst, luki (pole do wpisania) i wybory (kafelki do klikniecia). */
function Komorka({
  kawalki,
  prefiks,
  start = 0,
  wpisy,
  wybory,
  stany,
  onWpis,
  onWybor,
  onFocus,
}: {
  kawalki: Kawalek[];
  prefiks: number;
  /** Numer pierwszego pola komorki w linii (kolumny jednej linii licza pola razem). */
  start?: number;
  wpisy: Odpowiedzi;
  wybory: Wybory;
  stany: Record<string, Wynik> | null;
  onWpis: (klucz: string, v: string) => void;
  onWybor: (klucz: string, i: number) => void;
  onFocus: (klucz: string, el: HTMLInputElement) => void;
}) {
  let nr = start;
  return (
    <span className="leading-[3.2rem]">
      {kawalki.map((k, i) => {
        if (k.t === 'tekst') return <span key={i}>{k.v}</span>;
        if (k.t === 'sep') return null;
        const klucz = `${prefiks}-${nr++}`;
        const stan = stany?.[klucz];
        if (k.t === 'luka') {
          const dl = Math.max(...(k.otwarta ? k.odp.slice(0, 1) : k.odp).map((o) => [...o].length), 3);
          return (
            <span key={i} className="mx-1 inline-flex flex-col align-middle">
              <input
                type="text"
                value={wpisy[klucz] ?? ''}
                disabled={!!stany}
                onChange={(e) => onWpis(klucz, e.target.value)}
                onFocus={(e) => onFocus(klucz, e.currentTarget)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Wpisz odpowiedź"
                style={{ width: `${Math.min(dl + 3, 22)}ch` }}
                className={clsx(
                  'h-12 rounded-xl border-2 bg-white px-2 text-center text-xl font-semibold outline-none transition-colors',
                  !stany && 'border-[#d6d5cf] focus:border-[#22a95b]',
                  stan === 'dobrze' && 'border-[#22a95b] bg-[#e7f7ec] text-[#17803f]',
                  stan === 'otwarta' && 'border-[#7cc8ff] bg-[#eef8ff]',
                  (stan === 'zle' || stan === 'puste') && 'border-[#e5534b] bg-[#fdeceb] text-[#c0362c] line-through decoration-2',
                )}
              />
              {stany && (stan === 'zle' || stan === 'puste') && (
                <span className="text-center text-base font-bold leading-6 text-[#17803f]">{k.odp[0]}</span>
              )}
              {stany && stan === 'otwarta' && k.odp[0] && (
                <span className="text-center text-xs leading-5 text-[#5b5b57]">np. {k.odp[0]}</span>
              )}
            </span>
          );
        }
        return (
          <span key={i} className="mx-1 my-1 inline-flex flex-wrap gap-2 align-middle">
            {k.opcje.map((o, oi) => {
              const wybrana = wybory[klucz] === oi;
              const dobra = oi === k.dobra;
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={!!stany}
                  onClick={() => onWybor(klucz, oi)}
                  aria-pressed={wybrana}
                  className={clsx(
                    'min-h-12 rounded-xl border-2 px-4 text-lg font-semibold leading-tight transition-colors',
                    !stany && (wybrana ? 'border-[#22a95b] bg-[#e7f7ec] text-[#17803f] shadow-[0_3px_0_#22a95b]' : 'border-[#d6d5cf] bg-white shadow-[0_3px_0_#d6d5cf] hover:bg-[#fafaf7]'),
                    stany && dobra && 'border-[#22a95b] bg-[#e7f7ec] text-[#17803f]',
                    stany && wybrana && !dobra && 'border-[#e5534b] bg-[#fdeceb] text-[#c0362c] line-through',
                    stany && !wybrana && !dobra && 'border-[#ecebe5] bg-white text-[#b5b4ad]',
                  )}
                >
                  {o}
                </button>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

function EkranPytania({
  p,
  nr,
  ile,
  onWynik,
  onZamknij,
  zrobione,
  wszystkie,
}: {
  p: PytanieZadania;
  nr: number;
  ile: number;
  onWynik: (w: WynikPytania) => void;
  onZamknij: () => void;
  zrobione: number;
  wszystkie: number;
}) {
  const [wpisy, setWpisy] = useState<Odpowiedzi>({});
  const [wybory, setWybory] = useState<Wybory>({});
  const [ocena, setOcena] = useState<ReturnType<typeof ocenEkran> | null>(null);
  const [dlaczego, setDlaczego] = useState(false);
  const aktywne = useRef<{ klucz: string; el: HTMLInputElement } | null>(null);
  const pola = useMemo(() => polaEkranu(p), [p]);
  const wypelnione = pola.every(({ klucz, pole }) => (pole.t === 'luka' ? (wpisy[klucz] ?? '').trim() : wybory[klucz] !== undefined));
  const maLuki = pola.some(({ pole }) => pole.t === 'luka');

  function sprawdz() {
    if (!wypelnione) return;
    setOcena(ocenEkran(p, wpisy, wybory));
  }

  function wstaw(znak: string) {
    const a = aktywne.current;
    if (!a) return;
    const el = a.el;
    const v = wpisy[a.klucz] ?? '';
    const start = el.selectionStart ?? v.length;
    const end = el.selectionEnd ?? v.length;
    setWpisy({ ...wpisy, [a.klucz]: v.slice(0, start) + znak + v.slice(end) });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    });
  }

  const wszystkoDobrze = ocena && ocena.wynik.punkty === ocena.wynik.maks;

  return (
    <div onKeyDown={(e) => e.key === 'Enter' && !ocena && sprawdz()}>
      <GornyPasek zrobione={zrobione} wszystkie={wszystkie} onZamknij={onZamknij} etykietaZamknij="Wróć do listy" />
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">
        {p.cw.tytul} · {nr}/{ile}
      </p>
      <h2 className="mt-1.5 text-[1.35rem] font-extrabold leading-snug">{p.cw.polecenie}</h2>
      <Karta className="mt-5">
        {p.typ === 'luki' ? (
          (() => {
            const komorki = podzielNaKomorki(parsujLinie(p.linia));
            const naglowki = 'naglowki' in p.cw ? p.cw.naglowki : undefined;
            if (komorki.length === 1) {
              return (
                <div className="text-[1.35rem] font-medium">
                  <Komorka kawalki={komorki[0]} prefiks={0} wpisy={wpisy} wybory={wybory} stany={ocena?.stany ?? null}
                    onWpis={(k, v) => setWpisy({ ...wpisy, [k]: v })} onWybor={(k, i) => setWybory({ ...wybory, [k]: i })}
                    onFocus={(klucz, el) => (aktywne.current = { klucz, el })} />
                </div>
              );
            }
            // Kolumny z karty (" | ") ida jedna pod druga z naglowkiem - na telefonie tabela sie nie miesci.
            // Pola numerujemy w calej linii (klucze `0-n`, jak w polaEkranu).
            let prefiksPol = 0;
            return (
              <dl className="space-y-4">
                {komorki.map((kom, ci) => {
                  const start = prefiksPol;
                  prefiksPol += kom.filter(jestPole).length;
                  return (
                    <div key={ci}>
                      {naglowki?.[ci] && <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">{naglowki[ci]}</dt>}
                      <dd className={clsx('text-[1.3rem]', kom.some(jestPole) ? 'font-medium' : 'font-bold')}>
                        <Komorka kawalki={kom} prefiks={0} start={start} wpisy={wpisy} wybory={wybory} stany={ocena?.stany ?? null}
                          onWpis={(k, v) => setWpisy({ ...wpisy, [k]: v })}
                          onWybor={(k, i) => setWybory({ ...wybory, [k]: i })}
                          onFocus={(klucz, el) => (aktywne.current = { klucz, el })} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            );
          })()
        ) : (
          <TabelaOdmiany p={p} wpisy={wpisy} stany={ocena?.stany ?? null}
            onWpis={(k, v) => setWpisy({ ...wpisy, [k]: v })}
            onFocus={(klucz, el) => (aktywne.current = { klucz, el })} />
        )}
      </Karta>
      {maLuki && !ocena && (
        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Polskie litery">
          {POLSKIE.map((z) => (
            <button key={z} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wstaw(z)}
              className="h-10 w-10 rounded-lg border border-[#d6d5cf] bg-white text-lg font-semibold hover:bg-[#fafaf7]">
              {z}
            </button>
          ))}
        </div>
      )}

      {!ocena ? (
        <DolnyPrzycisk>
          <button type="button" className={clsx(btnGlowny, 'flex-1')} disabled={!wypelnione} onClick={sprawdz}>
            Sprawdź
          </button>
        </DolnyPrzycisk>
      ) : (
        <Arkusz
          stan={wszystkoDobrze ? 'dobrze' : 'zle'}
          tytul={wszystkoDobrze ? <>🎉 Dobrze!</> : <>Prawie! {ocena.wynik.punkty}/{ocena.wynik.maks}</>}
          przyciski={
            <>
              {p.cw.info && (
                <button type="button" className={btnDrugi} onClick={() => setDlaczego((d) => !d)} aria-expanded={dlaczego}>
                  Dlaczego?
                </button>
              )}
              <button type="button" className={clsx(btnGlowny, 'flex-1')} onClick={() => onWynik(ocena.wynik)} autoFocus>
                Dalej
              </button>
            </>
          }
        >
          {dlaczego && p.cw.info ? <RichText text={p.cw.info} className="space-y-1" /> : !wszystkoDobrze ? 'Dobre odpowiedzi są na zielono.' : null}
        </Arkusz>
      )}
    </div>
  );
}

function TabelaOdmiany({
  p,
  wpisy,
  stany,
  onWpis,
  onFocus,
}: {
  p: Extract<PytanieZadania, { typ: 'tabela' }>;
  wpisy: Odpowiedzi;
  stany: Record<string, Wynik> | null;
  onWpis: (klucz: string, v: string) => void;
  onFocus: (klucz: string, el: HTMLInputElement) => void;
}) {
  const wyraz = p.cw.wyrazy[p.wyraz];
  const kolumny = p.cw.kolumny.length;
  return (
    <div>
      <p className="mb-3 text-2xl font-extrabold">{wyraz.haslo}</p>
      <table className="w-full border-separate border-spacing-y-1.5">
        {kolumny > 1 && (
          <thead>
            <tr>
              <th />
              {p.cw.kolumny.map((k) => (
                <th key={k} className="text-left text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">{k}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {p.cw.wiersze.map(([nazwa, podp], w) => (
            <tr key={nazwa}>
              <th className="pr-2 text-left align-middle">
                <span className="block text-sm font-bold">{nazwa}</span>
                <span className="block text-xs font-normal text-[#8a8a85]">{podp}</span>
              </th>
              {wyraz.komorki[w].map((kom, k) => {
                const i = w * kolumny + k;
                return (
                  <td key={k} className="text-lg">
                    <Komorka kawalki={parsujLinie(kom)} prefiks={i} wpisy={wpisy} wybory={{}} stany={stany}
                      onWpis={onWpis} onWybor={() => {}} onFocus={onFocus} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Wynik({
  lekcja,
  konto,
  wyniki,
  sekundy,
  onJeszcze,
  onGotowe,
}: {
  lekcja: LekcjaZadania;
  konto: KontoUcznia;
  wyniki: WynikPytania[];
  sekundy: number;
  onJeszcze: () => void;
  onGotowe: () => void;
}) {
  const punkty = wyniki.reduce((s, w) => s + w.punkty, 0);
  const maks = wyniki.reduce((s, w) => s + w.maks, 0);
  const procent = maks ? punkty / maks : 0;
  const [zapis, setZapis] = useState<'trwa' | 'ok' | 'blad'>('trwa');
  const wyslane = useRef(false);

  async function zapisz() {
    setZapis('trwa');
    const { error } = await getSupabase().rpc('dyktando_zapisz', {
      p_id: konto.id,
      p_haslo: konto.haslo,
      p_lekcja: kluczZadania(lekcja.lekcja_id),
      p_punkty: punkty,
      p_maks: Math.max(1, maks),
      p_bledy: wyniki.flatMap((w) => w.bledy),
      p_sekundy: sekundy,
    });
    setZapis(error ? 'blad' : 'ok');
  }

  useEffect(() => {
    if (wyslane.current) return;
    wyslane.current = true;
    void zapisz();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const obwod = 2 * Math.PI * 52;
  return (
    <div className="pt-6 text-center">
      <p className="text-5xl" aria-hidden="true">{procent >= 0.9 ? '🏆' : procent >= 0.6 ? '💪' : '🌱'}</p>
      <h2 className="mt-3 text-3xl font-extrabold">{procent >= 0.9 ? 'Świetnie!' : procent >= 0.6 ? 'Dobra robota!' : 'Ćwiczenie czyni mistrza'}</h2>
      <p className="mt-1 text-[#5b5b57]">{lekcja.tytul}</p>
      <div className="relative mx-auto mt-6 h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e6e5df" strokeWidth="12" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="#22a95b" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={obwod} strokeDashoffset={obwod * (1 - procent)} className="transition-[stroke-dashoffset] duration-700" />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold">{punkty}/{maks}</span>
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">punkty</span>
        </span>
      </div>
      <p className="mt-4 text-sm text-[#5b5b57]">
        {zapis === 'trwa' && 'Zapisuję…'}
        {zapis === 'ok' && '✓ Wynik zapisany - pan Bartek go zobaczy.'}
        {zapis === 'blad' && (
          <span className="text-[#c0362c]">
            Nie udało się zapisać.{' '}
            <button type="button" onClick={zapisz} className="font-bold underline">Spróbuj jeszcze raz</button>
          </span>
        )}
      </p>
      <DolnyPrzycisk>
        <button type="button" className={clsx(btnDrugi, 'flex-1')} onClick={onJeszcze}>Jeszcze raz</button>
        <button type="button" className={clsx(btnGlowny, 'flex-1')} onClick={onGotowe}>Gotowe</button>
      </DolnyPrzycisk>
    </div>
  );
}

export function ZadanieDomowe({ lekcja, konto, onKoniec }: { lekcja: LekcjaZadania; konto: KontoUcznia; onKoniec: () => void }) {
  const [proba, setProba] = useState(0);
  const pytania = useMemo(() => pytaniaZadania(lekcja), [lekcja, proba]); // eslint-disable-line react-hooks/exhaustive-deps
  const notatka = notatkaLekcji(lekcja);
  const [krok, setKrok] = useState<number>(notatka ? -1 : 0);
  const [wyniki, setWyniki] = useState<WynikPytania[]>([]);
  const [start, setStart] = useState(() => Date.now());

  useEffect(() => window.scrollTo({ top: 0 }), [krok]);

  if (krok === -1 && notatka) {
    return (
      <div>
        <GornyPasek zrobione={0} wszystkie={pytania.length + 1} onZamknij={onKoniec} etykietaZamknij="Wróć do listy" />
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">Przypomnij sobie</p>
        <h2 className="mt-1.5 text-[1.6rem] font-extrabold leading-tight">{lekcja.tytul}</h2>
        <Karta className="mt-5 border-l-[6px] border-[#ffd43b]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#b08900]">Notatka z lekcji</p>
          <RichText text={notatka} className="space-y-3 text-lg leading-relaxed [&_strong]:font-extrabold" />
        </Karta>
        <p className="mt-4 text-[#5b5b57]">Teraz {pytania.length} krótkich zadań. Po każdym od razu zobaczysz, czy dobrze.</p>
        <DolnyPrzycisk>
          <button type="button" className={clsx(btnGlowny, 'flex-1')} onClick={() => setKrok(0)}>Zaczynamy</button>
        </DolnyPrzycisk>
      </div>
    );
  }

  if (krok >= pytania.length) {
    return (
      <Wynik
        key={proba}
        lekcja={lekcja}
        konto={konto}
        wyniki={wyniki}
        sekundy={Math.round((Date.now() - start) / 1000)}
        onJeszcze={() => {
          setProba((p) => p + 1);
          setWyniki([]);
          setStart(Date.now());
          setKrok(0);
        }}
        onGotowe={onKoniec}
      />
    );
  }

  return (
    <EkranPytania
      key={`${proba}-${krok}`}
      p={pytania[krok]}
      nr={krok + 1}
      ile={pytania.length}
      zrobione={krok + (notatka ? 1 : 0)}
      wszystkie={pytania.length + (notatka ? 1 : 0)}
      onZamknij={onKoniec}
      onWynik={(w) => {
        setWyniki((ws) => [...ws, w]);
        setKrok((k) => k + 1);
      }}
    />
  );
}
