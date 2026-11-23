// Strona /dyktando - zadanie domowe z pisowni dla uczniow z innym jezykiem ojczystym
// (ukrainski albo hiszpanski - ustawia Bartek w zakladce Zadania domowe).
// Dziala bez logowania nauczyciela (main.tsx omija AuthGate): uczen wybiera imie,
// wpisuje haslo z kartki i robi lekcje: wstep jak prezentacja (lektorka),
// cwiczenie z luka, slowa, dyktando zdan, "Zapamietaj" i test bez podpowiedzi.
// Sprawdzanie litera po literze z podpowiedzia (src/lib/dyktando.ts).
// Wynik idzie przez funkcje dyktando_* w Supabase (migracje 0042, 0043).

import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '../data/supabase';
import {
  audioUrl,
  dostepneLekcje,
  lektorUrl,
  maksPunktow,
  polski,
  przeklad,
  punktyLekcji,
  tematLekcji,
  wolnoUrl,
  type DyktandoLekcja,
  type DyktandoPrzyklad,
  type DyktandoRegula,
  type Jezyk,
  type Tekst,
} from '../data/dyktanda';
import {
  maCyrylice,
  porownajSlowo,
  porownajZdanie,
  punktyZdania,
  wskazowkaDla,
  type Wskazowka,
  type WynikSlowa,
} from '../lib/dyktando';
import { toDateKey } from '../lib/dates';

interface Uczen {
  id: string;
  imie: string;
  haslo: string;
  jezyk?: Jezyk;
}

interface WynikLekcji {
  lekcja: string;
  punkty: number;
  maks: number;
  created_at: string;
}

interface PozycjaListy {
  id: string;
  imie: string;
  jezyk?: Jezyk | null;
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

// ---------- napisy (po polsku + jezyk ucznia) ----------

const N = {
  naglowek: { pl: 'Piszę po polsku', ua: 'Пишу польською', es: 'Escribo en polaco' },
  chwila: { pl: 'Chwileczkę…', ua: 'Зачекай…', es: 'Un momento…' },
  wybierzImie: { pl: 'Wybierz swoje imię', ua: 'Обери своє ім’я', es: 'Elige tu nombre' },
  toNieJa: { pl: 'To nie ja', ua: 'Це не я', es: 'No soy yo' },
  wpiszHaslo: { pl: 'Wpisz hasło z kartki', ua: 'Введи пароль з картки', es: 'Escribe la contraseña de tu tarjeta' },
  wejdz: { pl: 'Wejdź', ua: 'Увійти', es: 'Entrar' },
  zleHaslo: { pl: 'Złe hasło. Spróbuj jeszcze raz.', ua: 'Неправильний пароль. Спробуй ще раз.', es: 'Contraseña incorrecta. Inténtalo otra vez.' },
  bladSieci: { pl: 'Coś nie działa. Spróbuj za chwilę.', ua: 'Щось не працює. Спробуй пізніше.', es: 'Algo no funciona. Inténtalo más tarde.' },
  bladListy: { pl: 'Nie udało się wczytać listy. Odśwież stronę.', ua: 'Не вдалося завантажити список.', es: 'No se pudo cargar la lista.' },
  posluchaj: { pl: 'Posłuchaj', ua: 'Послухай', es: 'Escucha' },
  posluchajJeszcze: { pl: 'Posłuchaj jeszcze raz', ua: 'Послухай ще раз', es: 'Escucha otra vez' },
  polskieLitery: { pl: 'Polskie litery', ua: 'Польські літери', es: 'Letras polacas' },
  lacinka: { pl: 'Pisz polskimi literami (łacinką).', ua: 'Пиши польськими літерами (латиницею).', es: 'Escribe con letras polacas.' },
  zaDuzo: { pl: 'za dużo', ua: 'зайве', es: 'sobra' },
  pominiete: { pl: 'pominięte', ua: 'пропущене', es: 'falta' },
  wielkaLitera: { pl: 'wielka litera', ua: 'велика літера', es: 'mayúscula' },
  twojeLekcje: { pl: 'Twoje lekcje', ua: 'Твої уроки', es: 'Tus lecciones' },
  zrobione: { pl: 'zrobione', ua: 'зроблено', es: 'hecho' },
  zrob: { pl: 'Zrób', ua: 'Зроби', es: 'Hazlo' },
  lista: { pl: 'Lista', ua: 'Список', es: 'Lista' },
  dalej: { pl: 'Dalej', ua: 'Далі', es: 'Siguiente' },
  wstecz: { pl: 'Wstecz', ua: 'Назад', es: 'Atrás' },
  cwiczymy: { pl: 'Teraz poćwiczymy', ua: 'Тепер потренуємося', es: 'Ahora practicamos' },
  wybierzLitery: { pl: 'Posłuchaj i wybierz brakujące litery.', ua: 'Послухай і обери пропущені літери.', es: 'Escucha y elige las letras que faltan.' },
  dobrze: { pl: 'Dobrze!', ua: 'Добре!', es: '¡Bien!' },
  jeszczeRazWybierz: { pl: 'Nie. Posłuchaj i wybierz jeszcze raz.', ua: 'Ні. Послухай і обери ще раз.', es: 'No. Escucha y elige otra vez.' },
  napiszSlowo: { pl: 'Posłuchaj i napisz słowo.', ua: 'Послухай і напиши слово.', es: 'Escucha y escribe la palabra.' },
  sprawdz: { pl: 'Sprawdź', ua: 'Перевірити', es: 'Comprobar' },
  prawie: { pl: 'Prawie! Zobacz, gdzie jest błąd.', ua: 'Майже! Подивись, де помилка.', es: '¡Casi! Mira dónde está el error.' },
  napiszPoprawnie: { pl: 'Napisz to słowo jeszcze raz, poprawnie:', ua: 'Напиши це слово ще раз правильно:', es: 'Escribe la palabra otra vez, bien:' },
  terazDobrze: { pl: 'Teraz dobrze!', ua: 'Тепер добре!', es: '¡Ahora sí!' },
  napiszZdanie: { pl: 'Posłuchaj zdania i napisz je.', ua: 'Послухай речення і напиши його.', es: 'Escucha la frase y escríbela.' },
  caleZdanie: { pl: 'Całe zdanie', ua: 'Все речення', es: 'Toda la frase' },
  powoli: { pl: 'Powoli', ua: 'Повільно', es: 'Despacio' },
  bezBledow: { pl: 'Brawo, bez błędów!', ua: 'Браво, без помилок!', es: '¡Bravo, sin errores!' },
  poprawki: { pl: 'Zobacz poprawki:', ua: 'Подивись виправлення:', es: 'Mira las correcciones:' },
  wielkaZdanie: { pl: 'Zdanie zaczynamy wielką literą, imiona też.', ua: 'Речення та імена пишемо з великої літери.', es: 'La frase y los nombres empiezan con mayúscula.' },
  poprawnie: { pl: 'Poprawnie', ua: 'Правильно', es: 'Correcto' },
  zapamietaj: { pl: 'Zapamiętaj!', ua: 'Запам’ятай!', es: '¡Recuerda!' },
  doTestu: { pl: 'Teraz test', ua: 'Тепер тест', es: 'Ahora el examen' },
  test: { pl: 'Test', ua: 'Тест', es: 'Examen' },
  testOpis: { pl: 'Bez podpowiedzi. Pisz uważnie - poprawki zobaczysz na końcu.', ua: 'Без підказок. Пиши уважно - виправлення побачиш у кінці.', es: 'Sin ayudas. Escribe con cuidado: verás las correcciones al final.' },
  testPoprawki: { pl: 'Twój test - poprawki', ua: 'Твій тест - виправлення', es: 'Tu examen: correcciones' },
  koniec: { pl: 'Koniec! Twój wynik:', ua: 'Кінець! Твій результат:', es: '¡Fin! Tu resultado:' },
  cwiczenia: { pl: 'Ćwiczenia', ua: 'Вправи', es: 'Ejercicios' },
  razem: { pl: 'Razem', ua: 'Разом', es: 'Total' },
  zapisuje: { pl: 'Zapisuję…', ua: 'Зберігаю…', es: 'Guardando…' },
  zapisany: { pl: '✓ Wynik zapisany.', ua: 'Результат збережено.', es: 'Resultado guardado.' },
  niezapisany: { pl: 'Nie udało się zapisać.', ua: 'Не вдалося зберегти.', es: 'No se pudo guardar.' },
  ponow: { pl: 'Spróbuj jeszcze raz', ua: 'Ще раз', es: 'Otra vez' },
  powtorzSlowa: { pl: 'Powtórz te słowa:', ua: 'Повтори ці слова:', es: 'Repasa estas palabras:' },
  zrobJeszcze: { pl: 'Zrób jeszcze raz', ua: 'Ще раз', es: 'Otra vez' },
  gotowe: { pl: 'Gotowe', ua: 'Готово', es: 'Listo' },
  czescSlowa: { pl: 'słowa', ua: 'слова', es: 'palabras' },
  czescDyktando: { pl: 'dyktando', ua: 'диктант', es: 'dictado' },
  czescCwiczenie: { pl: 'ćwiczenie', ua: 'вправа', es: 'ejercicio' },
  zaczynamy: { pl: 'Zaczynamy', ua: 'Почнімо', es: 'Empezamos' },
  lekcja: { pl: 'Lekcja', ua: 'Урок', es: 'Lección' },
} satisfies Record<string, Tekst>;

const licznik = (pl: string, ua: string, es: string, i: number, n: number): Tekst => ({
  pl: `${pl} ${i} z ${n}`,
  ua: `${ua} ${i} з ${n}`,
  es: `${es} ${i} de ${n}`,
});

const JezykCtx = createContext<Jezyk>('ua');
const useJezyk = () => useContext(JezykCtx);

/** "Po polsku · w jezyku ucznia" w jednej linii (bez powtorki, gdy brzmi tak samo: "Lista"). */
function useNapis() {
  const j = useJezyk();
  return (t: Tekst) => {
    const pl = polski(t, j);
    const obcy = przeklad(t, j);
    return pl === obcy ? pl : `${pl} · ${obcy}`;
  };
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

/** Gra nagranie po wejsciu na ekran (z mala zwloka) i zatrzymuje przy wyjsciu. */
function useGrajNaStart(urls: string[], przerwaMs?: number) {
  const klucz = urls.join('|');
  useEffect(() => {
    const t = window.setTimeout(() => graj(klucz.split('|'), przerwaMs), 350);
    return () => window.clearTimeout(t);
  }, [klucz, przerwaMs]);
}

// ---------- male klocki ----------

function Dwujezycznie({ t, className = '' }: { t: Tekst; className?: string }) {
  const j = useJezyk();
  return (
    <span className={className}>
      <span className="block">{polski(t, j)}</span>
      <span className="block text-[0.85em] font-normal text-gray-500">{przeklad(t, j)}</span>
    </span>
  );
}

const btnGlowny =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-600 px-6 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500';
const btnDrugi =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-base font-medium text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500';
const pole =
  'w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-2xl tracking-wide text-gray-900 outline-none focus:border-accent-500';

function IkonaGlosnik({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
    </svg>
  );
}

function Posluchaj({ url, t = N.posluchaj }: { url: string | string[]; t?: Tekst }) {
  return (
    <button type="button" className={btnDrugi} onClick={() => graj(Array.isArray(url) ? url : [url])}>
      <IkonaGlosnik />
      <Dwujezycznie t={t} className="text-left leading-tight" />
    </button>
  );
}

const POLSKIE = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

/** Przyciski z polskimi literami - wiele domowych komputerow i telefonow ich nie ma. */
function PolskieLitery({ onWstaw }: { onWstaw: (znak: string) => void }) {
  const napis = useNapis();
  const [duze, setDuze] = useState(false);
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs text-gray-500">{napis(N.polskieLitery)}</p>
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
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const napis = useNapis();
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
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`${pole} disabled:bg-gray-50 disabled:text-gray-600`}
      />
      {maCyrylice(value) && <p className="mt-2 text-sm font-medium text-amber-700">{napis(N.lacinka)}</p>}
      {!disabled && <PolskieLitery onWstaw={wstaw} />}
    </div>
  );
}

function dzwiekDla(w: { dzwiek: string; dzwiekEs: string }, j: Jezyk) {
  return j === 'es' ? w.dzwiekEs : w.dzwiek;
}

function ListaWskazowek({ wskazowki }: { wskazowki: Wskazowka[] }) {
  const j = useJezyk();
  if (wskazowki.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {wskazowki.map((w) => (
        <li key={w.litery} className="flex items-start gap-3 rounded-lg bg-amber-50 px-3 py-2">
          <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-lg font-bold text-gray-900 shadow-sm">
            {w.litery} = {dzwiekDla(w, j)}
          </span>
          <Dwujezycznie t={w} className="text-sm leading-snug text-gray-800" />
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
  const napis = useNapis();
  if (!w.wzor) {
    return <Kolumna gora={w.wpisane} srodek={<span className="text-gray-300">-</span>} dol={<span className="text-gray-500">{napis(N.zaDuzo)}</span>} />;
  }
  if (w.wpisane === null) {
    return (
      <Kolumna
        srodek={<span className="rounded bg-amber-100 px-1 text-amber-900">{w.wzor}</span>}
        dol={<span className="text-gray-500">{napis(N.pominiete)}</span>}
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
        dol={w.wielkaLitera ? <span className="text-amber-700">{napis(N.wielkaLitera)}</span> : null}
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

/** Slowo z podkreslonymi literami lekcji (np. "sz" w "szkoła"). */
function Podkresl({ slowo, litery }: { slowo: string; litery: string }) {
  const czesci = slowo.split(new RegExp(`(${litery})`, 'i'));
  return (
    <>
      {czesci.map((cz, i) =>
        cz.toLowerCase() === litery ? (
          <span key={i} className="text-accent-700 underline decoration-2 underline-offset-4">{cz}</span>
        ) : (
          <span key={i}>{cz}</span>
        ),
      )}
    </>
  );
}

// ---------- logowanie ----------

function Logowanie({ onZalogowany }: { onZalogowany: (u: Uczen) => void }) {
  const [lista, setLista] = useState<PozycjaListy[] | null>(null);
  const [blad, setBlad] = useState<Tekst | null>(null);
  const [wybrany, setWybrany] = useState<PozycjaListy | null>(null);
  const [haslo, setHaslo] = useState('');
  const [czekam, setCzekam] = useState(false);
  const jezyk: Jezyk = wybrany?.jezyk === 'es' ? 'es' : 'ua';

  useEffect(() => {
    getSupabase()
      .rpc('dyktando_lista')
      .then(({ data, error }) => {
        if (error) setBlad(N.bladListy);
        else setLista((data ?? []) as PozycjaListy[]);
      });
  }, []);

  async function wejdz() {
    if (!wybrany || !haslo.trim()) return;
    setCzekam(true);
    setBlad(null);
    const { data, error } = await getSupabase().rpc('dyktando_sprawdz', { p_id: wybrany.id, p_haslo: haslo });
    setCzekam(false);
    if (error) setBlad(N.bladSieci);
    else if (data === true) onZalogowany({ id: wybrany.id, imie: wybrany.imie, haslo: haslo.trim().toLowerCase(), jezyk });
    else setBlad(N.zleHaslo);
  }

  return (
    <JezykCtx.Provider value={jezyk}>
      <Karta>
        {!wybrany ? (
          <>
            {/* Przed wyborem imienia nie wiemy, jaki jezyk - napis we wszystkich trzech. */}
            <h2 className="text-xl font-semibold text-gray-900">
              {N.wybierzImie.pl}
              <span className="block text-[0.85em] font-normal text-gray-500">
                {N.wybierzImie.ua} · {N.wybierzImie.es}
              </span>
            </h2>
            {lista === null && !blad && <p className="mt-4 text-gray-500">{N.chwila.pl}</p>}
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
              ← {N.toNieJa.pl} · {przeklad(N.toNieJa, jezyk)}
            </button>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900">{wybrany.imie}</h2>
            <label className="mt-4 block">
              <Dwujezycznie t={N.wpiszHaslo} className="mb-2 font-medium text-gray-800" />
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
              {N.wejdz.pl} · {przeklad(N.wejdz, jezyk)}
            </button>
          </>
        )}
        {blad && (
          <p className="mt-4 font-medium text-red-700">
            {blad.pl} · {wybrany ? przeklad(blad, jezyk) : `${blad.ua} · ${blad.es}`}
          </p>
        )}
      </Karta>
    </JezykCtx.Provider>
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
  const j = useJezyk();
  const napis = useNapis();
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

  const nastepnaTekst: Tekst | null = nastepna
    ? {
        pl: `Następna lekcja od poniedziałku ${krotkaData(nastepna.od)}.`,
        ua: `Наступний урок з понеділка ${krotkaData(nastepna.od)}.`,
        es: `La próxima lección: desde el lunes ${krotkaData(nastepna.od)}.`,
      }
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          <Dwujezycznie t={{ pl: `Cześć, ${uczen.imie}!`, ua: N.twojeLekcje.ua, es: N.twojeLekcje.es }} />
        </h2>
        <button type="button" onClick={onWyloguj} className="text-sm text-gray-500 hover:text-gray-800 hover:underline">
          {napis(N.toNieJa)}
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
                  <span className="block text-sm text-gray-500">{tematLekcji(l, j)} · {krotkaData(l.od)}</span>
                </span>
                {wyniki === null ? null : w ? (
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-bold text-green-700">{w.punkty}/{w.maks}</span>
                    <span className="block text-xs text-gray-500">{napis(N.zrobione)}</span>
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-accent-600 px-3 py-1 text-sm font-semibold text-white">
                    {napis(N.zrob)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {nastepnaTekst && (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">{napis(nastepnaTekst)}</p>
      )}
    </div>
  );
}

// ---------- 1. wstep jak prezentacja ----------

/** Litery skladaja sie w jedna: "s + z" -> "sz". */
function Skladanie({ litery }: { litery: string }) {
  const [razem, setRazem] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setRazem(true), 900);
    return () => window.clearTimeout(t);
  }, []);
  const [a, b] = [...litery];
  return (
    <span className="inline-flex items-baseline font-bold text-accent-700" aria-label={litery}>
      <span>{a}</span>
      <span
        className="overflow-hidden text-gray-400 transition-all duration-500"
        style={{ maxWidth: razem ? 0 : '3ch', opacity: razem ? 0 : 1, padding: razem ? 0 : '0 0.3ch' }}
        aria-hidden="true"
      >
        +
      </span>
      <span>{b}</span>
    </span>
  );
}

function SlajdIntro({ lekcja }: { lekcja: DyktandoLekcja }) {
  const j = useJezyk();
  return (
    <div className="text-center">
      <p className="text-5xl" aria-hidden="true">👋</p>
      <Dwujezycznie t={lekcja.intro} className="mx-auto mt-4 block max-w-md text-xl font-medium leading-snug text-gray-900" />
      <div className="mt-8 flex justify-center gap-3 sm:gap-5">
        {lekcja.wstep.map((r) => (
          <div key={r.litery} className="w-24 rounded-2xl border-2 border-accent-200 bg-accent-50 py-4 sm:w-28">
            <p className="text-5xl font-bold text-accent-700">{r.litery}</p>
            <p className="mt-1 text-xl text-gray-600">[{dzwiekDla(r, j)}]</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlajdReguly({ regula }: { regula: DyktandoRegula }) {
  const j = useJezyk();
  return (
    <div>
      <p className="flex items-baseline justify-center gap-4 text-6xl sm:text-7xl">
        <Skladanie key={regula.litery} litery={regula.litery} />
        <span className="text-4xl text-gray-400">=</span>
        <span className="font-bold text-gray-900">[{dzwiekDla(regula, j)}]</span>
      </p>
      <Dwujezycznie t={regula} className="mx-auto mt-5 block max-w-lg text-center text-lg leading-snug text-gray-800" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {regula.przyklady.map((p) => (
          <button
            key={p.pl}
            type="button"
            onClick={() => graj([audioUrl(p.pl)])}
            className="flex flex-col items-center rounded-2xl border-2 border-gray-200 bg-white px-3 py-4 transition-colors hover:border-accent-400 hover:bg-accent-50"
          >
            {p.obraz && <span className="text-5xl" aria-hidden="true">{p.obraz}</span>}
            <span className="mt-2 text-3xl font-semibold text-gray-900">
              <Podkresl slowo={p.pl} litery={regula.litery} />
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <IkonaGlosnik className="h-4 w-4" /> {przeklad(p, j)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Prezentacja({ lekcja, onDalej }: { lekcja: DyktandoLekcja; onDalej: () => void }) {
  const napis = useNapis();
  const [nr, setNr] = useState(0);
  const ile = lekcja.wstep.length + 1;
  const nagranie = nr === 0 ? lektorUrl(lekcja, 'intro') : lektorUrl(lekcja, nr - 1);
  useGrajNaStart([nagranie]);
  const ostatni = nr === ile - 1;

  return (
    <Karta>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: ile }, (_, i) => (
            <span key={i} className={`h-2.5 rounded-full transition-all ${i === nr ? 'w-6 bg-accent-500' : 'w-2.5 bg-gray-300'}`} />
          ))}
        </div>
        <button type="button" onClick={() => graj([nagranie])} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
          <IkonaGlosnik className="h-4 w-4" /> {napis(N.posluchajJeszcze)}
        </button>
      </div>
      <div className="min-h-[22rem]" key={nr}>
        {nr === 0 ? <SlajdIntro lekcja={lekcja} /> : <SlajdReguly regula={lekcja.wstep[nr - 1]} />}
      </div>
      <div className="mt-6 flex gap-3">
        {nr > 0 && (
          <button type="button" className={btnDrugi} onClick={() => setNr(nr - 1)}>
            ← {napis(N.wstecz)}
          </button>
        )}
        <button type="button" className={`${btnGlowny} flex-1`} onClick={() => (ostatni ? onDalej() : setNr(nr + 1))}>
          {ostatni ? napis(N.cwiczymy) : napis(N.dalej)} →
        </button>
      </div>
    </Karta>
  );
}

// ---------- 2. cwiczenie: wybierz litery do luki ----------

function KrokLuka({ lekcja, idx, onDalej }: { lekcja: DyktandoLekcja; idx: number; onDalej: (dobrzeOdRazu: boolean) => void }) {
  const j = useJezyk();
  const napis = useNapis();
  const zadanie = lekcja.cwiczenie[idx];
  const opcje = lekcja.wstep.map((r) => r.litery);
  const [zle, setZle] = useState<string[]>([]);
  const [dobrze, setDobrze] = useState(false);
  useGrajNaStart([audioUrl(zadanie.pl)]);

  const poz = zadanie.pl.toLowerCase().indexOf(zadanie.luka);
  const przed = zadanie.pl.slice(0, poz);
  const po = zadanie.pl.slice(poz + zadanie.luka.length);
  const wskazowka = wskazowkaDla(zadanie.luka);

  function wybierz(o: string) {
    if (dobrze) return;
    if (o === zadanie.luka) setDobrze(true);
    else if (!zle.includes(o)) {
      setZle([...zle, o]);
      graj([audioUrl(zadanie.pl)]);
    }
  }

  return (
    <Karta>
      <p className="text-sm font-medium text-gray-500">{napis(licznik('Zadanie', 'Завдання', 'Ejercicio', idx + 1, lekcja.cwiczenie.length))}</p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">
        <Dwujezycznie t={N.wybierzLitery} />
      </h2>
      <div className="mt-6 flex flex-col items-center">
        <p className="text-5xl font-semibold tracking-wide text-gray-900">
          {przed}
          {dobrze ? (
            <span className="text-green-700 underline decoration-2 underline-offset-8">{zadanie.pl.slice(poz, poz + zadanie.luka.length)}</span>
          ) : (
            <span className="mx-1 inline-block min-w-[2.2ch] rounded-lg border-2 border-dashed border-accent-400 bg-accent-50 text-center text-accent-400">?</span>
          )}
          {po}
        </p>
        <p className="mt-3 flex items-center gap-3 text-gray-500">
          <span>{przeklad(zadanie, j)}</span>
          <button type="button" onClick={() => graj([audioUrl(zadanie.pl)])} className="inline-flex items-center gap-1 text-accent-700 hover:underline">
            <IkonaGlosnik className="h-4 w-4" /> {napis(N.posluchaj)}
          </button>
        </p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {opcje.map((o) => {
          const zly = zle.includes(o);
          const trafiony = dobrze && o === zadanie.luka;
          return (
            <button
              key={o}
              type="button"
              onClick={() => wybierz(o)}
              disabled={zly || dobrze}
              className={`min-h-16 rounded-xl border-2 text-3xl font-bold transition-colors ${
                trafiony
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : zly
                    ? 'border-red-200 bg-red-50 text-red-300 line-through'
                    : 'border-gray-300 bg-white text-gray-900 hover:border-accent-500 hover:bg-accent-50'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {zle.length > 0 && !dobrze && <p className="mt-4 font-medium text-red-700">{napis(N.jeszczeRazWybierz)}</p>}
      {dobrze && (
        <div className="mt-5">
          <p className="text-lg font-semibold text-green-700">{napis(N.dobrze)}</p>
          {zle.length > 0 && wskazowka && <ListaWskazowek wskazowki={[wskazowka]} />}
          <button type="button" className={`${btnGlowny} mt-4 w-full`} onClick={() => onDalej(zle.length === 0)} autoFocus>
            {napis(N.dalej)}
          </button>
        </div>
      )}
    </Karta>
  );
}

// ---------- 3. slowa i 4. zdania ----------

function KrokSlowo({ slowo, nr, ile, onWynik }: { slowo: DyktandoPrzyklad; nr: number; ile: number; onWynik: (w: WynikSlowa) => void }) {
  const j = useJezyk();
  const napis = useNapis();
  const [tekst, setTekst] = useState('');
  const [wynik, setWynik] = useState<WynikSlowa | null>(null);
  const [poprawka, setPoprawka] = useState('');
  // Stan zeruje sie przez key w Lekcji (nowe slowo = nowy komponent).
  useGrajNaStart([audioUrl(slowo.pl)]);

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
      <p className="text-sm font-medium text-gray-500">{napis(licznik('Słowo', 'Слово', 'Palabra', nr, ile))}</p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">
        <Dwujezycznie t={N.napiszSlowo} />
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Posluchaj url={audioUrl(slowo.pl)} />
        <span className="text-lg text-gray-500">({przeklad(slowo, j)})</span>
      </div>
      <div className="mt-5">
        <PoleDyktanda value={tekst} onChange={setTekst} onEnter={wynik ? dalej : sprawdz} disabled={wynik !== null} />
      </div>
      {!wynik && (
        <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!tekst.trim()} onClick={sprawdz}>
          {napis(N.sprawdz)}
        </button>
      )}
      {wynik && (
        <div className="mt-5">
          {wynik.ok ? (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-lg font-semibold text-green-800">
              {napis(N.dobrze)} <span className="ml-2 text-2xl">{slowo.pl}</span>
            </p>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
              <p className="font-semibold text-gray-900">
                <Dwujezycznie t={N.prawie} />
              </p>
              <div className="mt-3">
                <SlowoZBledami w={wynik} />
              </div>
              <ListaWskazowek wskazowki={wynik.wskazowki} />
              <label className="mt-4 block">
                <Dwujezycznie t={N.napiszPoprawnie} className="mb-2 text-sm font-medium text-gray-800" />
                <PoleDyktanda value={poprawka} onChange={setPoprawka} onEnter={dalej} />
              </label>
              {poprawione && <p className="mt-2 font-semibold text-green-700">{napis(N.terazDobrze)}</p>}
            </div>
          )}
          <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!moznaDalej} onClick={dalej} autoFocus={wynik.ok}>
            {napis(N.dalej)}
          </button>
        </div>
      )}
    </Karta>
  );
}

function PoprawkiZdania({ wynik, wzor }: { wynik: WynikSlowa[]; wzor: string }) {
  const napis = useNapis();
  const wskazowki = wynik.flatMap((w) => w.wskazowki).filter((w, i, all) => all.findIndex((x) => x.litery === w.litery) === i);
  const zlaWielka = wynik.some((w) => w.wielkaLitera);
  const wszystkoDobrze = wynik.every((w) => w.wzor && w.ok && !w.wielkaLitera);
  return (
    <div className={`rounded-xl p-4 ${wszystkoDobrze ? 'bg-green-50' : 'border border-gray-200 bg-gray-50'}`}>
      <p className="font-semibold text-gray-900">
        <Dwujezycznie t={wszystkoDobrze ? N.bezBledow : N.poprawki} />
      </p>
      <div className="mt-3 flex flex-wrap items-start gap-x-4 gap-y-3">
        {wynik.map((w, i) => (
          <SlowoZBledami key={i} w={w} />
        ))}
      </div>
      {zlaWielka && <p className="mt-3 text-sm text-amber-800">{napis(N.wielkaZdanie)}</p>}
      <ListaWskazowek wskazowki={wskazowki} />
      {!wszystkoDobrze && (
        <p className="mt-4 text-lg">
          <span className="text-sm text-gray-500">{napis(N.poprawnie)}: </span>
          <span className="font-semibold text-gray-900">{wzor}</span>
        </p>
      )}
    </div>
  );
}

function KrokZdanie({ zdanie, nr, ile, onWynik }: { zdanie: DyktandoPrzyklad; nr: number; ile: number; onWynik: (w: WynikSlowa[]) => void }) {
  const j = useJezyk();
  const napis = useNapis();
  const [tekst, setTekst] = useState('');
  const [wynik, setWynik] = useState<WynikSlowa[] | null>(null);
  // Jak na dyktandzie: cale zdanie, potem powoli po kawalku.
  useGrajNaStart([audioUrl(zdanie.pl), wolnoUrl(zdanie.pl)], 1200);

  function sprawdz() {
    if (!tekst.trim()) return;
    zatrzymaj();
    setWynik(porownajZdanie(tekst.trim(), zdanie.pl));
  }

  return (
    <Karta>
      <p className="text-sm font-medium text-gray-500">{napis(licznik('Zdanie', 'Речення', 'Frase', nr, ile))}</p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">
        <Dwujezycznie t={N.napiszZdanie} />
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Posluchaj url={audioUrl(zdanie.pl)} t={N.caleZdanie} />
        <Posluchaj url={wolnoUrl(zdanie.pl)} t={N.powoli} />
      </div>
      <p className="mt-3 text-gray-500">{przeklad(zdanie, j)}</p>
      <div className="mt-4">
        <PoleDyktanda value={tekst} onChange={setTekst} onEnter={wynik ? () => onWynik(wynik) : sprawdz} disabled={wynik !== null} />
      </div>
      {!wynik ? (
        <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!tekst.trim()} onClick={sprawdz}>
          {napis(N.sprawdz)}
        </button>
      ) : (
        <div className="mt-5">
          <PoprawkiZdania wynik={wynik} wzor={zdanie.pl} />
          <button type="button" className={`${btnGlowny} mt-5 w-full`} onClick={() => onWynik(wynik)} autoFocus>
            {napis(N.dalej)}
          </button>
        </div>
      )}
    </Karta>
  );
}

// ---------- 5. zapamietaj ----------

function Zapamietaj({ lekcja, onDalej }: { lekcja: DyktandoLekcja; onDalej: () => void }) {
  const j = useJezyk();
  const napis = useNapis();
  useGrajNaStart([lektorUrl(lekcja, 'zapamietaj')]);
  return (
    <Karta>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">
          <Dwujezycznie t={N.zapamietaj} />
        </h2>
        <button type="button" onClick={() => graj([lektorUrl(lekcja, 'zapamietaj')])} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
          <IkonaGlosnik className="h-4 w-4" /> {napis(N.posluchajJeszcze)}
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {lekcja.wstep.map((r) => {
          const p = r.przyklady[0];
          return (
            <div key={r.litery} className="rounded-2xl border-2 border-accent-200 bg-accent-50 p-4 text-center">
              <p className="text-4xl font-bold text-accent-700">
                {r.litery} <span className="text-2xl font-semibold text-gray-500">= [{dzwiekDla(r, j)}]</span>
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {p.obraz && <span className="mr-1" aria-hidden="true">{p.obraz}</span>}
                <Podkresl slowo={p.pl} litery={r.litery} />
              </p>
            </div>
          );
        })}
      </div>
      <ul className="mt-5 space-y-2">
        {lekcja.zapamietaj.punkty.map((p) => (
          <li key={p.pl} className="flex gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <span className="mt-0.5 text-accent-600" aria-hidden="true">✔</span>
            <Dwujezycznie t={p} className="leading-snug text-gray-900" />
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 px-4 py-3">
        <p className="font-semibold text-gray-900">{napis(N.doTestu)}</p>
        <p className="text-sm text-gray-600">{napis(N.testOpis)}</p>
      </div>
      <button type="button" className={`${btnGlowny} mt-5 w-full`} onClick={onDalej}>
        {napis(N.test)} →
      </button>
    </Karta>
  );
}

// ---------- 6. test (bez podpowiedzi) ----------

interface PozycjaTestu {
  przyklad: DyktandoPrzyklad;
  zdanie: boolean;
}

function KrokTestu({ poz, nr, ile, onDalej }: { poz: PozycjaTestu; nr: number; ile: number; onDalej: (tekst: string) => void }) {
  const napis = useNapis();
  const [tekst, setTekst] = useState('');
  const url = audioUrl(poz.przyklad.pl);
  useGrajNaStart(poz.zdanie ? [url, wolnoUrl(poz.przyklad.pl)] : [url], 1200);
  const dalej = () => tekst.trim() && onDalej(tekst.trim());
  return (
    <Karta>
      <p className="text-sm font-medium text-gray-500">
        {napis(N.test)} · {nr}/{ile}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-gray-900">
        <Dwujezycznie t={poz.zdanie ? N.napiszZdanie : N.napiszSlowo} />
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {poz.zdanie ? (
          <>
            <Posluchaj url={url} t={N.caleZdanie} />
            <Posluchaj url={wolnoUrl(poz.przyklad.pl)} t={N.powoli} />
          </>
        ) : (
          <Posluchaj url={url} />
        )}
      </div>
      <div className="mt-5">
        <PoleDyktanda value={tekst} onChange={setTekst} onEnter={dalej} />
      </div>
      <button type="button" className={`${btnGlowny} mt-5 w-full`} disabled={!tekst.trim()} onClick={dalej}>
        {napis(N.dalej)}
      </button>
    </Karta>
  );
}

function PoprawkiTestu({ pozycje, wyniki, onDalej }: { pozycje: PozycjaTestu[]; wyniki: WynikSlowa[][]; onDalej: () => void }) {
  const napis = useNapis();
  const slowa = pozycje.flatMap((p, i) => (p.zdanie ? [] : [wyniki[i][0]]));
  const wskazowki = slowa
    .flatMap((w) => w.wskazowki)
    .filter((w, i, all) => all.findIndex((x) => x.litery === w.litery) === i);
  return (
    <Karta>
      <h2 className="text-xl font-semibold text-gray-900">
        <Dwujezycznie t={N.testPoprawki} />
      </h2>
      {slowa.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            {slowa.map((w, i) => (
              <SlowoZBledami key={i} w={w} />
            ))}
          </div>
          <ListaWskazowek wskazowki={wskazowki} />
        </div>
      )}
      <div className="mt-3 space-y-3">
        {pozycje.map((p, i) => {
          if (!p.zdanie) return null;
          const dobrze = wyniki[i].every((w) => w.wzor && w.ok && !w.wielkaLitera);
          return dobrze ? (
            <p key={i} className="rounded-xl bg-green-50 px-4 py-3 text-xl font-semibold text-green-700">
              ✓ {p.przyklad.pl}
            </p>
          ) : (
            <PoprawkiZdania key={i} wynik={wyniki[i]} wzor={p.przyklad.pl} />
          );
        })}
      </div>
      <button type="button" className={`${btnGlowny} mt-5 w-full`} onClick={onDalej} autoFocus>
        {napis(N.dalej)}
      </button>
    </Karta>
  );
}

// ---------- 7. wynik ----------

function Podsumowanie({
  lekcja,
  uczen,
  slowa,
  zdania,
  test,
  sekundy,
  onPowtorz,
  onWroc,
}: {
  lekcja: DyktandoLekcja;
  uczen: Uczen;
  slowa: WynikSlowa[];
  zdania: WynikSlowa[][];
  test: WynikSlowa[][];
  sekundy: number;
  onPowtorz: () => void;
  onWroc: () => void;
}) {
  const napis = useNapis();
  const maksy = punktyLekcji(lekcja);
  const zaCwiczenia = slowa.filter((w) => w.ok).length + zdania.reduce((s, z) => s + punktyZdania(z), 0);
  const zaTest = test.reduce((s, z) => s + punktyZdania(z), 0);
  const punkty = zaCwiczenia + zaTest;
  const maks = maksPunktow(lekcja);
  const bledne = [...slowa, ...zdania.flat(), ...test.flat()].filter((w) => w.wzor && !w.ok);
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
        <Dwujezycznie t={N.koniec} />
      </h2>
      <p className={`mt-3 text-5xl font-bold ${procent >= 0.8 ? 'text-green-700' : procent >= 0.5 ? 'text-accent-700' : 'text-amber-700'}`}>
        {punkty} / {maks}
      </p>
      <p className="mt-2 text-gray-600">
        {napis(N.cwiczenia)}: <b>{zaCwiczenia}/{maksy.cwiczenia}</b> · {napis(N.test)}: <b>{zaTest}/{maksy.test}</b>
      </p>
      <p className="mt-2 text-sm text-gray-500">
        {zapis === 'trwa' && napis(N.zapisuje)}
        {zapis === 'ok' && napis(N.zapisany)}
        {zapis === 'blad' && (
          <span className="text-red-700">
            {napis(N.niezapisany)}{' '}
            <button type="button" onClick={zapisz} className="font-semibold underline">
              {napis(N.ponow)}
            </button>
          </span>
        )}
      </p>
      {doPowtorki.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">
            <Dwujezycznie t={N.powtorzSlowa} />
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
          {napis(N.zrobJeszcze)}
        </button>
        <button type="button" className={`${btnGlowny} flex-1`} onClick={onWroc}>
          {napis(N.gotowe)}
        </button>
      </div>
    </Karta>
  );
}

// ---------- przebieg lekcji ----------

type Etap = 'wstep' | 'cwiczenie' | 'slowa' | 'zdania' | 'zapamietaj' | 'test' | 'poprawki' | 'wynik';

function Lekcja({ lekcja, uczen, onKoniec }: { lekcja: DyktandoLekcja; uczen: Uczen; onKoniec: () => void }) {
  const napis = useNapis();
  const [etap, setEtap] = useState<Etap>('wstep');
  const [idx, setIdx] = useState(0);
  const [slowa, setSlowa] = useState<WynikSlowa[]>([]);
  const [zdania, setZdania] = useState<WynikSlowa[][]>([]);
  const [test, setTest] = useState<WynikSlowa[][]>([]);
  const [start, setStart] = useState(() => Date.now());
  const [proba, setProba] = useState(0);

  useEffect(() => () => zatrzymaj(), []);

  const pozycjeTestu: PozycjaTestu[] = [
    ...lekcja.test.slowa.map((p) => ({ przyklad: p, zdanie: false })),
    ...lekcja.test.zdania.map((p) => ({ przyklad: p, zdanie: true })),
  ];

  function przejdz(nowy: Etap) {
    zatrzymaj();
    setEtap(nowy);
    setIdx(0);
    window.scrollTo({ top: 0 });
  }

  function nastepny(ile: number, potem: Etap) {
    if (idx + 1 < ile) setIdx(idx + 1);
    else przejdz(potem);
  }

  function odNowa() {
    przejdz('wstep');
    setSlowa([]);
    setZdania([]);
    setTest([]);
    setStart(Date.now());
    setProba((p) => p + 1);
  }

  const kolejnosc: Array<[Etap, number]> = [
    ['wstep', 1],
    ['cwiczenie', lekcja.cwiczenie.length],
    ['slowa', lekcja.slowa.length],
    ['zdania', lekcja.zdania.length],
    ['zapamietaj', 1],
    ['test', pozycjeTestu.length],
    ['poprawki', 1],
  ];
  const wszystkie = kolejnosc.reduce((s, [, n]) => s + n, 0);
  let zrobione = 0;
  for (const [e, n] of kolejnosc) {
    if (e === etap) {
      zrobione += idx;
      break;
    }
    zrobione += n;
  }

  const podtytul: Partial<Record<Etap, Tekst>> = {
    cwiczenie: N.czescCwiczenie,
    slowa: N.czescSlowa,
    zdania: N.czescDyktando,
    test: N.test,
    poprawki: N.test,
  };

  return (
    <div className="space-y-4" key={proba}>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onKoniec} className="shrink-0 text-sm text-accent-700 hover:underline">
          ← {napis(N.lista)}
        </button>
        <Pasek zrobione={zrobione} wszystkie={wszystkie} />
      </div>
      <div>
        <p className="text-sm text-gray-500">
          {napis({ pl: `${N.lekcja.pl} ${lekcja.nr}`, ua: `${N.lekcja.ua} ${lekcja.nr}`, es: `${N.lekcja.es} ${lekcja.nr}` })}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {lekcja.temat}
          {podtytul[etap] && <span className="ml-2 text-base font-medium text-gray-500">{napis(podtytul[etap]!)}</span>}
        </h1>
      </div>
      {etap === 'wstep' && <Prezentacja lekcja={lekcja} onDalej={() => przejdz('cwiczenie')} />}
      {etap === 'cwiczenie' && (
        <KrokLuka key={idx} lekcja={lekcja} idx={idx} onDalej={() => nastepny(lekcja.cwiczenie.length, 'slowa')} />
      )}
      {etap === 'slowa' && (
        <KrokSlowo
          key={idx}
          slowo={lekcja.slowa[idx]}
          nr={idx + 1}
          ile={lekcja.slowa.length}
          onWynik={(w) => {
            setSlowa((s) => [...s, w]);
            nastepny(lekcja.slowa.length, 'zdania');
          }}
        />
      )}
      {etap === 'zdania' && (
        <KrokZdanie
          key={idx}
          zdanie={lekcja.zdania[idx]}
          nr={idx + 1}
          ile={lekcja.zdania.length}
          onWynik={(w) => {
            setZdania((z) => [...z, w]);
            nastepny(lekcja.zdania.length, 'zapamietaj');
          }}
        />
      )}
      {etap === 'zapamietaj' && <Zapamietaj lekcja={lekcja} onDalej={() => przejdz('test')} />}
      {etap === 'test' && (
        <KrokTestu
          key={idx}
          poz={pozycjeTestu[idx]}
          nr={idx + 1}
          ile={pozycjeTestu.length}
          onDalej={(tekst) => {
            const p = pozycjeTestu[idx];
            setTest((t) => [...t, p.zdanie ? porownajZdanie(tekst, p.przyklad.pl) : [porownajSlowo(tekst, p.przyklad.pl)]]);
            nastepny(pozycjeTestu.length, 'poprawki');
          }}
        />
      )}
      {etap === 'poprawki' && <PoprawkiTestu pozycje={pozycjeTestu} wyniki={test} onDalej={() => przejdz('wynik')} />}
      {etap === 'wynik' && (
        <Podsumowanie
          lekcja={lekcja}
          uczen={uczen}
          slowa={slowa}
          zdania={zdania}
          test={test}
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
  const jezyk: Jezyk = uczen?.jezyk === 'es' ? 'es' : 'ua';

  useEffect(() => {
    document.title = 'Dyktanda';
  }, []);

  function zaloguj(u: Uczen) {
    localStorage.setItem(KLUCZ_UCZNIA, JSON.stringify(u));
    setUczen(u);
  }

  // Jezyk mogl sie zmienic (Bartek ustawia go w apce) - odswiezamy z listy.
  const idUcznia = uczen?.id;
  useEffect(() => {
    if (!idUcznia || !isSupabaseConfigured()) return;
    getSupabase()
      .rpc('dyktando_lista')
      .then(({ data }) => {
        const ja = ((data ?? []) as PozycjaListy[]).find((p) => p.id === idUcznia);
        const nowy: Jezyk = ja?.jezyk === 'es' ? 'es' : 'ua';
        setUczen((u) => {
          if (!u || u.jezyk === nowy) return u;
          const zmieniony = { ...u, jezyk: nowy };
          localStorage.setItem(KLUCZ_UCZNIA, JSON.stringify(zmieniony));
          return zmieniony;
        });
      });
  }, [idUcznia]);

  const wyloguj = useRef(() => {
    localStorage.removeItem(KLUCZ_UCZNIA);
    setUczen(null);
    setLekcja(null);
  }).current;

  return (
    <JezykCtx.Provider value={jezyk}>
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
          {!lekcja && (
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dyktanda</h1>
              <p className="text-gray-500">
                {N.naglowek.pl} · {uczen ? przeklad(N.naglowek, jezyk) : `${N.naglowek.ua} · ${N.naglowek.es}`}
              </p>
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
    </JezykCtx.Provider>
  );
}
