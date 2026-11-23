// Strona /dyktando - zadanie domowe z pisowni dla uczniow z Ukrainy.
// Dziala bez logowania nauczyciela (main.tsx omija AuthGate): uczen wybiera imie,
// wpisuje haslo z kartki, slucha slow i zdan (ElevenLabs) i pisze. Sprawdzanie
// litera po literze z podpowiedzia, jaki to dzwiek po ukrainsku (src/lib/dyktando.ts).
// Wynik idzie przez funkcje dyktando_* w Supabase (migracja 0042).

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '../data/supabase';
import {
  audioUrl,
  dostepneLekcje,
  maksPunktow,
  slugAudio,
  type DyktandoLekcja,
} from '../data/dyktanda';
import {
  maCyrylice,
  porownajSlowo,
  porownajZdanie,
  punktyZdania,
  type Wskazowka,
  type WynikSlowa,
} from '../lib/dyktando';
import { toDateKey } from '../lib/dates';

interface Uczen {
  id: string;
  imie: string;
  haslo: string;
}

interface WynikLekcji {
  lekcja: string;
  punkty: number;
  maks: number;
  created_at: string;
}

const KLUCZ_UCZNIA = 'dyktando-uczen';

function wczytajUcznia(): Uczen | null {
  try {
    const raw = localStorage.getItem(KLUCZ_UCZNIA);
    return raw ? (JSON.parse(raw) as Uczen) : null;
  } catch {
    return null;
  }
}

// ---------- audio ----------

let biezace: HTMLAudioElement | null = null;

/** Odtwarza pliki po kolei (np. cale zdanie, potem wolno). */
function graj(urls: string[], przerwaMs = 900): void {
  biezace?.pause();
  const [pierwszy, ...reszta] = urls;
  if (!pierwszy) return;
  const audio = new Audio(pierwszy);
  biezace = audio;
  audio.onended = () => {
    if (reszta.length && biezace === audio) {
      window.setTimeout(() => {
        if (biezace === audio) graj(reszta, przerwaMs);
      }, przerwaMs);
    }
  };
  void audio.play().catch(() => {});
}

function zatrzymaj(): void {
  biezace?.pause();
  biezace = null;
}

const wolnoUrl = (zdanie: string) => `/audio/dyktanda/${slugAudio(zdanie)}-wolno.mp3`;

// ---------- male klocki ----------

function Dwujezycznie({ pl, ua, className = '' }: { pl: ReactNode; ua: ReactNode; className?: string }) {
  return (
    <span className={className}>
      <span className="block">{pl}</span>
      <span className="block text-[0.85em] font-normal text-gray-500">{ua}</span>
    </span>
  );
}

const btnGlowny =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-600 px-6 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500';
const btnDrugi =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-base font-medium text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500';
const pole =
  'w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-2xl tracking-wide text-gray-900 outline-none focus:border-accent-500';

function IkonaGlosnik() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
    </svg>
  );
}

function Posluchaj({ url, label = 'Posłuchaj', ua = 'Послухай' }: { url: string | string[]; label?: string; ua?: string }) {
  return (
    <button type="button" className={btnDrugi} onClick={() => graj(Array.isArray(url) ? url : [url])}>
      <IkonaGlosnik />
      <Dwujezycznie pl={label} ua={ua} className="text-left leading-tight" />
    </button>
  );
}

const POLSKIE = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

/** Przyciski z polskimi literami - wiele domowych komputerow i telefonow ich nie ma. */
function PolskieLitery({ onWstaw }: { onWstaw: (znak: string) => void }) {
  const [duze, setDuze] = useState(false);
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs text-gray-500">Polskie litery · Польські літери</p>
      <div className="flex flex-wrap gap-1.5">
        {POLSKIE.map((z) => {
          const znak = duze ? z.toUpperCase() : z;
          return (
            <button
              key={z}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onWstaw(znak);
                setDuze(false);
              }}
              className="h-11 w-11 rounded-lg border border-gray-300 bg-white text-xl font-semibold text-gray-800 hover:bg-accent-50"
            >
              {znak}
            </button>
          );
        })}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setDuze((d) => !d)}
          aria-pressed={duze}
          className={`h-11 rounded-lg border px-3 text-sm font-semibold ${duze ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-gray-300 bg-white text-gray-600'}`}
        >
          ⇧ Aa
        </button>
      </div>
    </div>
  );
}

/** Pole tekstowe bez autokorekty + wstawianie polskich liter w miejscu kursora. */
function PoleDyktanda({
  value,
  onChange,
  onEnter,
  disabled,
  autoFocus = true,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus && !disabled) ref.current?.focus();
  }, [autoFocus, disabled]);

  function wstaw(znak: string) {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + znak + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + znak.length, start + znak.length);
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  }

  return (
    <div>
      <input
        ref={ref}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`${pole} disabled:bg-gray-50 disabled:text-gray-600`}
      />
      {maCyrylice(value) && (
        <p className="mt-2 text-sm font-medium text-amber-700">
          Pisz polskimi literami (łacinką). · Пиши польськими літерами (латиницею).
        </p>
      )}
      {!disabled && <PolskieLitery onWstaw={wstaw} />}
    </div>
  );
}

function ListaWskazowek({ wskazowki }: { wskazowki: Wskazowka[] }) {
  if (wskazowki.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {wskazowki.map((w) => (
        <li key={w.litery} className="flex items-start gap-3 rounded-lg bg-amber-50 px-3 py-2">
          <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-lg font-bold text-gray-900 shadow-sm">
            {w.litery} = {w.dzwiek}
          </span>
          <Dwujezycznie pl={w.pl} ua={w.ua} className="text-sm leading-snug text-gray-800" />
        </li>
      ))}
    </ul>
  );
}

/** Trzy rzedy o stalej wysokosci (wpisane / wzor / podpis), zeby slowa w zdaniu staly w jednej linii. */
function Kolumna({ gora, srodek, dol }: { gora?: ReactNode; srodek: ReactNode; dol?: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center">
      <span className="h-6 text-base leading-6 text-red-600 line-through decoration-2">{gora}</span>
      <span className="text-2xl font-semibold leading-9">{srodek}</span>
      <span className="h-4 text-xs leading-4">{dol}</span>
    </span>
  );
}

/** Slowo ze wzoru z zaznaczonymi zlymi i brakujacymi literami. */
function SlowoZBledami({ w }: { w: WynikSlowa }) {
  if (!w.wzor) {
    return <Kolumna gora={w.wpisane} srodek={<span className="text-gray-300">-</span>} dol={<span className="text-gray-500">za dużo · зайве</span>} />;
  }
  if (w.wpisane === null) {
    return (
      <Kolumna
        srodek={<span className="rounded bg-amber-100 px-1 text-amber-900">{w.wzor}</span>}
        dol={<span className="text-gray-500">pominięte · пропущене</span>}
      />
    );
  }
  if (w.ok) {
    return (
      <Kolumna
        srodek={
          <span className="text-green-700">
            {w.wielkaLitera ? (
              <>
                <span className="rounded bg-amber-100 px-0.5 text-amber-900">{w.wzor[0]}</span>
                {w.wzor.slice(1)}
              </>
            ) : (
              w.wzor
            )}
          </span>
        }
        dol={w.wielkaLitera ? <span className="text-amber-700">wielka litera · велика літера</span> : null}
      />
    );
  }
  // Interpunkcja ze wzoru na koncu (kropka) - pokazujemy po slowie.
  const ogon = w.wzor.slice(w.wzor.search(/[^\p{L}\p{N}]*$/u));
  return (
    <Kolumna
      gora={w.wpisane}
      srodek={
        <span className="text-gray-900">
          {w.znaki.map((z, i) => (
            <span
              key={i}
              className={
                z.status === 'ok'
                  ? ''
                  : z.status === 'zly'
                    ? 'rounded bg-red-100 px-px text-red-700 underline decoration-red-500 decoration-2 underline-offset-4'
                    : 'rounded bg-amber-200 px-px text-amber-900'
              }
            >
              {z.znak}
            </span>
          ))}
          {ogon}
        </span>
      }
    />
  );
}

function Pasek({ zrobione, wszystkie }: { zrobione: number; wszystkie: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
      <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${(zrobione / wszystkie) * 100}%` }} />
    </div>
  );
}

function Karta({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">{children}</div>;
}

// ---------- logowanie ----------

function Logowanie({ onZalogowany }: { onZalogowany: (u: Uczen) => void }) {
  const [lista, setLista] = useState<Array<{ id: string; imie: string }> | null>(null);
  const [blad, setBlad] = useState<string | null>(null);
  const [wybrany, setWybrany] = useState<{ id: string; imie: string } | null>(null);
  const [haslo, setHaslo] = useState('');
  const [czekam, setCzekam] = useState(false);

  useEffect(() => {
    getSupabase()
      .rpc('dyktando_lista')
      .then(({ data, error }) => {
        if (error) setBlad('Nie udało się wczytać listy. Odśwież stronę. · Не вдалося завантажити список.');
        else setLista((data ?? []) as Array<{ id: string; imie: string }>);
      });
  }, []);

  async function wejdz() {
    if (!wybrany || !haslo.trim()) return;
    setCzekam(true);
    setBlad(null);
    const { data, error } = await getSupabase().rpc('dyktando_sprawdz', { p_id: wybrany.id, p_haslo: haslo });
    setCzekam(false);
    if (error) {
      setBlad('Coś nie działa. Spróbuj za chwilę. · Щось не працює. Спробуй пізніше.');
    } else if (data === true) {
      onZalogowany({ id: wybrany.id, imie: wybrany.imie, haslo: haslo.trim().toLowerCase() });
    } else {
      setBlad('Złe hasło. Spróbuj jeszcze raz. · Неправильний пароль. Спробуй ще раз.');
    }
  }

  return (
    <Karta>
      {!wybrany ? (
        <>
          <h2 className="text-xl font-semibold text-gray-900">
            <Dwujezycznie pl="Wybierz swoje imię" ua="Обери своє ім’я" />
          </h2>
          {lista === null && !blad && <p className="mt-4 text-gray-500">Chwileczkę… · Зачекай…</p>}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {lista?.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setWybrany(u)}
                className="min-h-14 rounded-xl border-2 border-gray-200 bg-white px-4 text-lg font-semibold text-gray-900 transition-colors hover:border-accent-500 hover:bg-accent-50"
              >
                {u.imie}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button type="button" onClick={() => { setWybrany(null); setHaslo(''); setBlad(null); }} className="text-sm text-accent-700 hover:underline">
            ← To nie ja · Це не я
          </button>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900">{wybrany.imie}</h2>
          <label className="mt-4 block">
            <Dwujezycznie pl="Wpisz hasło z kartki" ua="Введи пароль з картки" className="mb-2 font-medium text-gray-800" />
            <input
              type="text"
              value={haslo}
              onChange={(e) => setHaslo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && wejdz()}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={pole}
            />
          </label>
          <button type="button" className={`${btnGlowny} mt-4 w-full`} disabled={czekam || !haslo.trim()} onClick={wejdz}>
            Wejdź · Увійти
          </button>
        </>
      )}
      {blad && <p className="mt-4 font-medium text-red-700">{blad}</p>}
    </Karta>
  );
}

// ---------- lista lekcji ----------

const krotkaData = (key: string) => {
  const [, m, d] = key.split('-');
  return `${Number(d)}.${m}`;
};

function ListaLekcji({
  uczen,
  onStart,
  onWyloguj,
}: {
  uczen: Uczen;
  onStart: (l: DyktandoLekcja) => void;
  onWyloguj: () => void;
}) {
  const [wyniki, setWyniki] = useState<WynikLekcji[] | null>(null);
  const { dostepne, nastepna } = dostepneLekcje(toDateKey(new Date()));

  useEffect(() => {
    getSupabase()
      .rpc('dyktando_moje_wyniki', { p_id: uczen.id, p_haslo: uczen.haslo })
      .then(({ data, error }) => {
        if (error) {
          // Haslo zmienione przez nauczyciela - trzeba wpisac nowe.
          if (error.code === '28P01') onWyloguj();
          setWyniki([]);
        } else setWyniki((data ?? []) as WynikLekcji[]);
      });
  }, [uczen, onWyloguj]);

  const najlepszy = (id: string) =>
    (wyniki ?? []).filter((w) => w.lekcja === id).sort((a, b) => b.punkty / b.maks - a.punkty / a.maks)[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          <Dwujezycznie pl={`Cześć, ${uczen.imie}!`} ua="Твої диктанти" />
        </h2>
        <button type="button" onClick={onWyloguj} className="text-sm text-gray-500 hover:text-gray-800 hover:underline">
          To nie ja · Це не я
        </button>
      </div>
      <ol className="space-y-3">
        {[...dostepne].reverse().map((l) => {
          const w = najlepszy(l.id);
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onStart(l)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition-colors hover:border-accent-500 ${w ? 'border-gray-200' : 'border-accent-300'}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-50 text-xl font-bold text-accent-700">
                  {l.nr}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold text-gray-900">{l.temat}</span>
                  <span className="block text-sm text-gray-500">{l.tematUa} · od {krotkaData(l.od)}</span>
                </span>
                {wyniki === null ? null : w ? (
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-bold text-green-700">{w.punkty}/{w.maks}</span>
                    <span className="block text-xs text-gray-500">zrobione · зроблено</span>
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-accent-600 px-3 py-1 text-sm font-semibold text-white">
                    Zrób · Зроби
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {nastepna && (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          Następna lekcja od poniedziałku {krotkaData(nastepna.od)}. · Наступний урок з понеділка {krotkaData(nastepna.od)}.
        </p>
      )}
    </div>
  );
}

// ---------- lekcja ----------

type Etap = 'wstep' | 'slowa' | 'zdania' | 'wynik';

function Wstep({ lekcja, onDalej }: { lekcja: DyktandoLekcja; onDalej: () => void }) {
  return (
    <Karta>
      <h2 className="text-xl font-semibold text-gray-900">
        <Dwujezycznie pl="Najpierw posłuchaj i przeczytaj" ua="Спочатку послухай і прочитай" />
      </h2>
      <div className="mt-5 space-y-5">
        {lekcja.wstep.map((r) => (
          <section key={r.litery} className="rounded-xl bg-gray-50 p-4">
            <p className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-accent-700">{r.litery}</span>
              <span className="text-2xl text-gray-500">=</span>
              <span className="text-4xl font-bold text-gray-900">{r.dzwiek}</span>
            </p>
            <Dwujezycznie pl={r.pl} ua={r.ua} className="mt-2 text-base leading-snug text-gray-800" />
            <div className="mt-3 flex flex-wrap gap-2">
              {r.przyklady.map((p) => (
                <button
                  key={p.pl}
                  type="button"
                  onClick={() => graj([audioUrl(p.pl)])}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-accent-50"
                >
                  <IkonaGlosnik />
                  <span className="text-xl font-semibold text-gray-900">
                    {p.pl.split(new RegExp(`(${r.litery})`, 'i')).map((cz, i) =>
                      cz.toLowerCase() === r.litery ? (
                        <span key={i} className="text-accent-700 underline decoration-2 underline-offset-4">{cz}</span>
                      ) : (
                        <span key={i}>{cz}</span>
                      ),
                    )}
                  </span>
                  <span className="text-sm text-gray-500">{p.ua}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <button type="button" className={`${btnGlowny} mt-6 w-full`} onClick={onDalej}>
        Zaczynamy · Почнімо
      </button>
    </Karta>
  );
}

function KrokSlowo({
  lekcja,
  idx,
  onWynik,
}: {
  lekcja: DyktandoLekcja;
  idx: number;
  onWynik: (w: WynikSlowa) => void;
}) {
  const slowo = lekcja.slowa[idx];
  const [tekst, setTekst] = useState('');
  const [wynik, setWynik] = useState<WynikSlowa | null>(null);
  const [poprawka, setPoprawka] = useState('');

  // Stan zeruje sie przez key={idx} w Lekcji (nowe slowo = nowy komponent).
  useEffect(() => {
    const t = window.setTimeout(() => graj([audioUrl(slowo.pl)]), 300);
    return () => window.clearTimeout(t);
  }, [slowo.pl]);

  const poprawione = poprawka.trim().toLowerCase() === slowo.pl.toLowerCase();
  const moznaDalej = wynik !== null && (wynik.ok || poprawione);

  function sprawdz() {
    if (!tekst.trim()) return;
    setWynik(porownajSlowo(tekst.trim(), slowo.pl));
  }

  function dalej() {
    if (wynik && moznaDalej) onWynik(wynik);
  }

  return (
    <Karta>
      <p className="text-sm font-medium text-gray-500">
        Słowo {idx + 1} z {lekcja.slowa.length} · Слово {idx + 1} з {lekcja.slowa.length}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">
        <Dwujezycznie pl="Posłuchaj i napisz słowo." ua="Послухай і напиши слово." />
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Posluchaj url={audioUrl(slowo.pl)} />
        <span className="text-lg text-gray-500">({slowo.ua})</span>
      </div>
      <div className="mt-5">
        <PoleDyktanda value={tekst} onChange={setTekst} onEnter={wynik ? dalej : sprawdz} disabled={wynik !== null} />
      </div>
      {!wynik && (
        <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!tekst.trim()} onClick={sprawdz}>
          Sprawdź · Перевірити
        </button>
      )}
      {wynik && (
        <div className="mt-5">
          {wynik.ok ? (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-lg font-semibold text-green-800">
              Dobrze! · Добре! <span className="ml-2 text-2xl">{slowo.pl}</span>
            </p>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
              <p className="font-semibold text-gray-900">
                <Dwujezycznie pl="Prawie! Zobacz, gdzie jest błąd." ua="Майже! Подивись, де помилка." />
              </p>
              <div className="mt-3">
                <SlowoZBledami w={wynik} />
              </div>
              <ListaWskazowek wskazowki={wynik.wskazowki} />
              <label className="mt-4 block">
                <Dwujezycznie
                  pl="Napisz to słowo jeszcze raz, poprawnie:"
                  ua="Напиши це слово ще раз правильно:"
                  className="mb-2 text-sm font-medium text-gray-800"
                />
                <PoleDyktanda value={poprawka} onChange={setPoprawka} onEnter={dalej} />
              </label>
              {poprawione && <p className="mt-2 font-semibold text-green-700">Teraz dobrze! · Тепер добре!</p>}
            </div>
          )}
          <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!moznaDalej} onClick={dalej} autoFocus={wynik.ok}>
            Dalej · Далі
          </button>
        </div>
      )}
    </Karta>
  );
}

function KrokZdanie({
  lekcja,
  idx,
  onWynik,
}: {
  lekcja: DyktandoLekcja;
  idx: number;
  onWynik: (w: WynikSlowa[]) => void;
}) {
  const zdanie = lekcja.zdania[idx];
  const [tekst, setTekst] = useState('');
  const [wynik, setWynik] = useState<WynikSlowa[] | null>(null);

  useEffect(() => {
    // Jak na dyktandzie: cale zdanie, potem powoli po kawalku.
    const t = window.setTimeout(() => graj([audioUrl(zdanie.pl), wolnoUrl(zdanie.pl)], 1200), 300);
    return () => window.clearTimeout(t);
  }, [zdanie.pl]);

  function sprawdz() {
    if (!tekst.trim()) return;
    zatrzymaj();
    setWynik(porownajZdanie(tekst.trim(), zdanie.pl));
  }

  const wskazowki = wynik ? wynik.flatMap((w) => w.wskazowki).filter((w, i, all) => all.findIndex((x) => x.litery === w.litery) === i) : [];
  const zlaWielka = wynik?.some((w) => w.wielkaLitera);
  const wszystkoDobrze = wynik !== null && wynik.every((w) => w.wzor && w.ok && !w.wielkaLitera);

  return (
    <Karta>
      <p className="text-sm font-medium text-gray-500">
        Zdanie {idx + 1} z {lekcja.zdania.length} · Речення {idx + 1} з {lekcja.zdania.length}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">
        <Dwujezycznie pl="Posłuchaj zdania i napisz je." ua="Послухай речення і напиши його." />
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Posluchaj url={audioUrl(zdanie.pl)} label="Całe zdanie" ua="Все речення" />
        <Posluchaj url={wolnoUrl(zdanie.pl)} label="Powoli" ua="Повільно" />
      </div>
      <p className="mt-3 text-gray-500">{zdanie.ua}</p>
      <div className="mt-4">
        <PoleDyktanda value={tekst} onChange={setTekst} onEnter={wynik ? () => onWynik(wynik) : sprawdz} disabled={wynik !== null} />
      </div>
      {!wynik ? (
        <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!tekst.trim()} onClick={sprawdz}>
          Sprawdź · Перевірити
        </button>
      ) : (
        <div className="mt-5">
          <div className={`rounded-xl p-4 ${wszystkoDobrze ? 'bg-green-50' : 'border border-gray-200 bg-gray-50'}`}>
            <p className="font-semibold text-gray-900">
              {wszystkoDobrze ? (
                <Dwujezycznie pl="Brawo, bez błędów!" ua="Браво, без помилок!" />
              ) : (
                <Dwujezycznie pl="Zobacz poprawki:" ua="Подивись виправлення:" />
              )}
            </p>
            <div className="mt-3 flex flex-wrap items-start gap-x-4 gap-y-3">
              {wynik.map((w, i) => (
                <SlowoZBledami key={i} w={w} />
              ))}
            </div>
            {zlaWielka && (
              <p className="mt-3 text-sm text-amber-800">
                Zdanie zaczynamy wielką literą, imiona też. · Речення та імена пишемо з великої літери.
              </p>
            )}
            <ListaWskazowek wskazowki={wskazowki} />
            {!wszystkoDobrze && (
              <p className="mt-4 text-lg">
                <span className="text-sm text-gray-500">Poprawnie · Правильно: </span>
                <span className="font-semibold text-gray-900">{zdanie.pl}</span>
              </p>
            )}
          </div>
          <button type="button" className={`${btnGlowny} mt-5 w-full`} onClick={() => onWynik(wynik)} autoFocus>
            Dalej · Далі
          </button>
        </div>
      )}
    </Karta>
  );
}

function Podsumowanie({
  lekcja,
  uczen,
  slowa,
  zdania,
  sekundy,
  onPowtorz,
  onWroc,
}: {
  lekcja: DyktandoLekcja;
  uczen: Uczen;
  slowa: WynikSlowa[];
  zdania: WynikSlowa[][];
  sekundy: number;
  onPowtorz: () => void;
  onWroc: () => void;
}) {
  const punkty = slowa.filter((w) => w.ok).length + zdania.reduce((s, z) => s + punktyZdania(z), 0);
  const maks = maksPunktow(lekcja);
  const bledne = [...slowa, ...zdania.flat()].filter((w) => w.wzor && !w.ok);
  const doPowtorki = [...new Set(bledne.map((w) => w.wzor.replace(/[^\p{L}\p{N}]+$/u, '')))];
  const [zapis, setZapis] = useState<'trwa' | 'ok' | 'blad'>('trwa');
  const wyslane = useRef(false);

  async function zapisz() {
    setZapis('trwa');
    const { error } = await getSupabase().rpc('dyktando_zapisz', {
      p_id: uczen.id,
      p_haslo: uczen.haslo,
      p_lekcja: lekcja.id,
      p_punkty: punkty,
      p_maks: maks,
      p_bledy: bledne.map((w) => ({ wzor: w.wzor, wpisane: w.wpisane })),
      p_sekundy: sekundy,
    });
    setZapis(error ? 'blad' : 'ok');
  }

  useEffect(() => {
    if (wyslane.current) return;
    wyslane.current = true;
    void zapisz();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const procent = punkty / maks;
  return (
    <Karta>
      <h2 className="text-xl font-semibold text-gray-900">
        <Dwujezycznie pl="Koniec! Twój wynik:" ua="Кінець! Твій результат:" />
      </h2>
      <p className={`mt-3 text-5xl font-bold ${procent >= 0.8 ? 'text-green-700' : procent >= 0.5 ? 'text-accent-700' : 'text-amber-700'}`}>
        {punkty} / {maks}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        {zapis === 'trwa' && 'Zapisuję… · Зберігаю…'}
        {zapis === 'ok' && '✓ Wynik zapisany. · Результат збережено.'}
        {zapis === 'blad' && (
          <span className="text-red-700">
            Nie udało się zapisać. · Не вдалося зберегти.{' '}
            <button type="button" onClick={zapisz} className="font-semibold underline">
              Spróbuj jeszcze raz · Ще раз
            </button>
          </span>
        )}
      </p>
      {doPowtorki.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">
            <Dwujezycznie pl="Powtórz te słowa:" ua="Повтори ці слова:" />
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {doPowtorki.map((s) => (
              <span key={s} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xl font-semibold text-gray-900">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button type="button" className={`${btnDrugi} flex-1`} onClick={onPowtorz}>
          Zrób jeszcze raz · Ще раз
        </button>
        <button type="button" className={`${btnGlowny} flex-1`} onClick={onWroc}>
          Gotowe · Готово
        </button>
      </div>
    </Karta>
  );
}

function Lekcja({ lekcja, uczen, onKoniec }: { lekcja: DyktandoLekcja; uczen: Uczen; onKoniec: () => void }) {
  const [etap, setEtap] = useState<Etap>('wstep');
  const [idx, setIdx] = useState(0);
  const [slowa, setSlowa] = useState<WynikSlowa[]>([]);
  const [zdania, setZdania] = useState<WynikSlowa[][]>([]);
  const [start, setStart] = useState(() => Date.now());
  const [proba, setProba] = useState(0);

  useEffect(() => () => zatrzymaj(), []);

  function odNowa() {
    setEtap('wstep');
    setIdx(0);
    setSlowa([]);
    setZdania([]);
    setStart(Date.now());
    setProba((p) => p + 1);
  }

  const wszystkie = lekcja.slowa.length + lekcja.zdania.length;
  const zrobione = etap === 'slowa' ? idx : etap === 'zdania' ? lekcja.slowa.length + idx : etap === 'wynik' ? wszystkie : 0;

  return (
    <div className="space-y-4" key={proba}>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onKoniec} className="shrink-0 text-sm text-accent-700 hover:underline">
          ← Lista · Список
        </button>
        <Pasek zrobione={zrobione} wszystkie={wszystkie} />
      </div>
      <div>
        <p className="text-sm text-gray-500">Lekcja {lekcja.nr} · Урок {lekcja.nr}</p>
        <h1 className="text-2xl font-bold text-gray-900">
          {lekcja.temat}
          {etap === 'slowa' && <span className="ml-2 text-base font-medium text-gray-500">część 1: słowa · частина 1: слова</span>}
          {etap === 'zdania' && <span className="ml-2 text-base font-medium text-gray-500">część 2: dyktando · частина 2: диктант</span>}
        </h1>
      </div>
      {etap === 'wstep' && <Wstep lekcja={lekcja} onDalej={() => { setEtap('slowa'); setIdx(0); setStart(Date.now()); }} />}
      {etap === 'slowa' && (
        <KrokSlowo
          key={idx}
          lekcja={lekcja}
          idx={idx}
          onWynik={(w) => {
            setSlowa((s) => [...s, w]);
            if (idx + 1 < lekcja.slowa.length) setIdx(idx + 1);
            else {
              setEtap('zdania');
              setIdx(0);
            }
          }}
        />
      )}
      {etap === 'zdania' && (
        <KrokZdanie
          key={idx}
          lekcja={lekcja}
          idx={idx}
          onWynik={(w) => {
            setZdania((z) => [...z, w]);
            if (idx + 1 < lekcja.zdania.length) setIdx(idx + 1);
            else setEtap('wynik');
          }}
        />
      )}
      {etap === 'wynik' && (
        <Podsumowanie
          lekcja={lekcja}
          uczen={uczen}
          slowa={slowa}
          zdania={zdania}
          sekundy={Math.round((Date.now() - start) / 1000)}
          onPowtorz={odNowa}
          onWroc={onKoniec}
        />
      )}
    </div>
  );
}

// ---------- calosc ----------

export function Dyktando() {
  const [uczen, setUczen] = useState<Uczen | null>(wczytajUcznia);
  const [lekcja, setLekcja] = useState<DyktandoLekcja | null>(null);

  useEffect(() => {
    document.title = 'Dyktanda · Диктанти';
  }, []);

  function zaloguj(u: Uczen) {
    localStorage.setItem(KLUCZ_UCZNIA, JSON.stringify(u));
    setUczen(u);
  }

  const wyloguj = useRef(() => {
    localStorage.removeItem(KLUCZ_UCZNIA);
    setUczen(null);
    setLekcja(null);
  }).current;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        {!lekcja && (
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dyktanda</h1>
            <p className="text-gray-500">Piszę po polsku · Пишу польською</p>
          </header>
        )}
        {!isSupabaseConfigured() ? (
          <Karta>Strona nie jest skonfigurowana.</Karta>
        ) : !uczen ? (
          <Logowanie onZalogowany={zaloguj} />
        ) : lekcja ? (
          <Lekcja lekcja={lekcja} uczen={uczen} onKoniec={() => setLekcja(null)} />
        ) : (
          <ListaLekcji uczen={uczen} onStart={setLekcja} onWyloguj={wyloguj} />
        )}
      </main>
    </div>
  );
}
