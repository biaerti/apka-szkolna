// Kurs "Polski krok po kroku" w portalu ucznia (/uczen, src/pages/portal/Portal.tsx):
// pisownia dla uczniow z innym jezykiem ojczystym (podpowiedzi po ukrainsku albo
// hiszpansku - ustawia Bartek w zakladce Zadania domowe). Co tydzien nowa lekcja:
// powtorka z poprzednich, wstep jak prezentacja (lektorka), cwiczenie z luka, slowa,
// dyktando zdan, "Zapamietaj" i test bez podpowiedzi.
// Sprawdzanie litera po literze z podpowiedzia (src/lib/dyktando.ts).
// Wynik idzie przez funkcje dyktando_* w Supabase (migracje 0042-0044).

import clsx from 'clsx';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { getSupabase } from '../data/supabase';
import {
  DYKTANDA,
  audioUrl,
  dostepneLekcje,
  lektorUrl,
  maksPunktow,
  polski,
  powtorkaDla,
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
import { doPoprawy, dzienMiesiac, lekcjaTygodnia, type UwagaUcznia } from '../lib/dyktandoPostepy';
import { Arkusz, DolnyPrzycisk, GornyPasek, Karta as KartaPortalu, btnDrugi, btnGlowny, IkonaGlosnik } from './portal/ui';
import type { KontoUcznia, WynikUcznia } from './portal/konto';

type Uczen = Pick<KontoUcznia, 'id' | 'haslo' | 'jezyk'>;

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
  powtorka: { pl: 'Powtórka', ua: 'Повторення', es: 'Repaso' },
  powtorkaOpis: {
    pl: 'Zanim zaczniemy: 5 słów z poprzednich lekcji.',
    ua: 'Перед початком: 5 слів з попередніх уроків.',
    es: 'Antes de empezar: 5 palabras de las lecciones anteriores.',
  },
  dlaczego: { pl: 'Dlaczego?', ua: 'Чому?', es: '¿Por qué?' },
  kurs: { pl: 'Polski krok po kroku', ua: 'Польська крок за кроком', es: 'Polaco paso a paso' },
  zablokowana: { pl: 'od', ua: 'з', es: 'desde' },
  wroc: { pl: 'Wróć', ua: 'Назад', es: 'Volver' },
  tenTydzien: { pl: 'Lekcja tego tygodnia', ua: 'Урок цього тижня', es: 'Lección de esta semana' },
  gotoweTydzien: { pl: 'Zrobione!', ua: 'Зроблено!', es: '¡Hecho!' },
  nadrobienia: { pl: 'do nadrobienia', ua: 'надолужити', es: 'pendiente' },
  doPoprawy: { pl: 'Do poprawy', ua: 'Треба виправити', es: 'Para corregir' },
  zrobJeszczeRaz: { pl: 'Zrób jeszcze raz', ua: 'Зроби ще раз', es: 'Hazla otra vez' },
  odNauczyciela: { pl: 'Od nauczyciela', ua: 'Від учителя', es: 'Del profesor' },
  przeczytane: { pl: 'Przeczytane', ua: 'Прочитано', es: 'Leído' },
  otworzLekcje: { pl: 'Otwórz lekcję', ua: 'Відкрити урок', es: 'Abrir la lección' },
  powtorzKiedyChcesz: {
    pl: 'Starsze lekcje możesz powtarzać, kiedy chcesz.',
    ua: 'Старі уроки можна повторювати будь-коли.',
    es: 'Puedes repetir las lecciones anteriores cuando quieras.',
  },
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

const pole =
  'w-full rounded-2xl border-2 border-[#d6d5cf] bg-white px-4 py-3 text-2xl tracking-wide text-[#1d1d1f] outline-none focus:border-[#22a95b]';

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

function Karta({ children }: { children: ReactNode }) {
  return <KartaPortalu>{children}</KartaPortalu>;
}

/** Dlaczego tak piszemy (wymiana albo regula) - w lekcjach z regulami. */
function Dlaczego({ t }: { t?: Tekst }) {
  const napis = useNapis();
  if (!t) return null;
  return (
    <div className="mt-3 flex items-start gap-3 rounded-xl bg-[#fff6d6] px-3 py-2.5">
      <span className="shrink-0 text-sm font-bold text-[#8a6d00]">{napis(N.dlaczego)}</span>
      <Dwujezycznie t={t} className="text-[0.95rem] leading-snug text-[#1d1d1f]" />
    </div>
  );
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

// ---------- lista lekcji kursu ----------

const krotkaData = (key: string) => dzienMiesiac(key);

/** "do niedzieli 29.11" w trzech jezykach. */
export function doNiedzieli(termin: string): Tekst {
  const d = dzienMiesiac(termin);
  return { pl: `Zrób do niedzieli ${d}`, ua: `Зроби до неділі ${d}`, es: `Hazla antes del domingo ${d}` };
}

/** "Zostały 3 dni" / "Dziś ostatni dzień". */
export function zostaloDni(n: number): Tekst {
  if (n <= 1) return { pl: 'Dziś ostatni dzień', ua: 'Сьогодні останній день', es: 'Hoy es el último día' };
  const pl = n < 5 ? `Zostały ${n} dni` : `Zostało ${n} dni`;
  return { pl, ua: `Залишилось днів: ${n}`, es: `Quedan ${n} días` };
}

/** "Nowa lekcja w poniedziałek 30.11". */
export function nowaWPoniedzialek(od: string): Tekst {
  const d = dzienMiesiac(od);
  return { pl: `Nowa lekcja w poniedziałek ${d}`, ua: `Новий урок у понеділок ${d}`, es: `Nueva lección el lunes ${d}` };
}

/** Dymek z uwaga nauczyciela (po polsku + tlumaczenie, gdy to gotowy szablon). */
function DymekUwagi({ uwaga, maly = false }: { uwaga: UwagaUcznia; maly?: boolean }) {
  const napis = useNapis();
  return (
    <div className={clsx('rounded-2xl bg-[#fff6d6] text-[#1d1d1f]', maly ? 'px-3.5 py-2.5' : 'px-4 py-3')}>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a6d00]">
        <span aria-hidden="true">💬 </span>
        {napis(N.odNauczyciela)}
      </p>
      <p className={clsx('mt-1 font-semibold leading-snug', maly ? 'text-[0.95rem]' : 'text-lg')}>{uwaga.tresc}</p>
      {uwaga.przeklad && <p className={clsx('mt-0.5 leading-snug text-[#5b5b57]', maly ? 'text-sm' : 'text-[0.95rem]')}>{uwaga.przeklad}</p>}
    </div>
  );
}

/** Nieprzeczytane uwagi nauczyciela na stronie startowej portalu. */
export function KartaUwag({
  uwagi,
  jezyk,
  onOtworz,
  onPrzeczytane,
}: {
  uwagi: UwagaUcznia[];
  jezyk: Jezyk;
  onOtworz: (lekcjaId: string) => void;
  onPrzeczytane: (uwaga: UwagaUcznia) => void;
}) {
  return (
    <JezykCtx.Provider value={jezyk}>
      <KartaUwagWnetrze uwagi={uwagi} onOtworz={onOtworz} onPrzeczytane={onPrzeczytane} />
    </JezykCtx.Provider>
  );
}

function KartaUwagWnetrze({
  uwagi,
  onOtworz,
  onPrzeczytane,
}: {
  uwagi: UwagaUcznia[];
  onOtworz: (lekcjaId: string) => void;
  onPrzeczytane: (uwaga: UwagaUcznia) => void;
}) {
  const napis = useNapis();
  const dzis = toDateKey(new Date());
  return (
    <div className="space-y-3">
      {uwagi.map((u) => {
        const lekcja = DYKTANDA.find((l) => l.id === u.lekcja && l.od <= dzis);
        return (
          <KartaPortalu key={u.id} className="!p-4 sm:!p-5">
            {lekcja && (
              <p className="mb-2 text-sm font-bold text-[#5b5b57]">
                {napis({ pl: `${N.lekcja.pl} ${lekcja.nr}`, ua: `${N.lekcja.ua} ${lekcja.nr}`, es: `${N.lekcja.es} ${lekcja.nr}` })} · {lekcja.temat}
              </p>
            )}
            <DymekUwagi uwaga={u} />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {lekcja && (
                <button type="button" className={clsx(btnGlowny, 'flex-1')} onClick={() => onOtworz(u.lekcja)}>
                  {napis(N.otworzLekcje)}
                </button>
              )}
              <button type="button" className={clsx(btnDrugi, 'flex-1')} onClick={() => onPrzeczytane(u)}>
                ✓ {napis(N.przeczytane)}
              </button>
            </div>
          </KartaPortalu>
        );
      })}
    </div>
  );
}

/** Lekcja, ktora uczen powinien zrobic teraz: tygodnia, a gdy zrobiona - najstarsza zalegla. */
export function lekcjaDoZrobienia(dzis: string, zrobiona: (id: string) => boolean): DyktandoLekcja | undefined {
  const tydzien = lekcjaTygodnia(dzis);
  if (tydzien && !zrobiona(tydzien.lekcja.id)) return tydzien.lekcja;
  return dostepneLekcje(dzis).dostepne.find((l) => !zrobiona(l.id));
}

function ListaKursu({
  wyniki,
  uwagi,
  onStart,
  onWroc,
}: {
  wyniki: WynikUcznia[] | null;
  uwagi: UwagaUcznia[];
  onStart: (l: DyktandoLekcja) => void;
  onWroc: () => void;
}) {
  const j = useJezyk();
  const napis = useNapis();
  const dzis = toDateKey(new Date());
  const { nastepna } = dostepneLekcje(dzis);
  const tydzien = lekcjaTygodnia(dzis);
  const najlepszy = (id: string) =>
    (wyniki ?? []).filter((w) => w.lekcja === id).sort((a, b) => b.punkty / b.maks - a.punkty / a.maks)[0];
  const zrobione = DYKTANDA.filter((l) => najlepszy(l.id)).length;
  const uwagaDo = (id: string) => uwagi.find((u) => u.lekcja === id);
  // Nauczyciel prosi o poprawe (uwaga po ostatniej probie) - lekcja wraca do zrobienia.
  const poprawa = (id: string) => doPoprawy(uwagaDo(id), (wyniki ?? []).filter((w) => w.lekcja === id));
  const teraz = lekcjaDoZrobienia(dzis, (id) => !!najlepszy(id) && !poprawa(id));
  const tygodniowa = tydzien && !poprawa(tydzien.lekcja.id) ? najlepszy(tydzien.lekcja.id) : undefined;
  const tygodniowaDoPoprawy = tydzien ? poprawa(tydzien.lekcja.id) : false;

  return (
    <div>
      <GornyPasek zrobione={zrobione} wszystkie={DYKTANDA.length} onZamknij={onWroc} etykietaZamknij={napis(N.wroc)}
        prawy={<span className="text-sm font-extrabold text-[#5b5b57]">{zrobione}/{DYKTANDA.length}</span>} />
      <h1 className="text-[1.75rem] font-extrabold leading-tight">
        <Dwujezycznie t={N.kurs} />
      </h1>

      {tydzien && (
        <section
          aria-label={napis(N.tenTydzien)}
          className={clsx(
            'mt-5 rounded-3xl p-5',
            tygodniowa ? 'bg-[#e7f7ec] shadow-[0_4px_0_#b8e6c8]' : 'bg-[#8b5cf6] text-white shadow-[0_6px_0_#6a3fd1]',
          )}
        >
          <p className={clsx('text-xs font-bold uppercase tracking-[0.08em]', tygodniowa ? 'text-[#17803f]' : 'text-white/80')}>
            {napis(N.tenTydzien)}
          </p>
          <p className="mt-1 text-2xl font-extrabold leading-tight">
            {tydzien.lekcja.nr}. {tydzien.lekcja.temat}
          </p>
          {tygodniowa ? (
            <>
              <p className="mt-1 font-bold text-[#17803f]">
                ★ {napis(N.gotoweTydzien)} {tygodniowa.punkty}/{tygodniowa.maks}
              </p>
              {nastepna && <p className="text-sm font-medium text-[#3a6b4c]">{napis(nowaWPoniedzialek(nastepna.od))}</p>}
            </>
          ) : tygodniowaDoPoprawy ? (
            <>
              <p className="mt-2 text-lg font-bold leading-snug">
                <Dwujezycznie t={N.doPoprawy} className="[&>span:last-child]:text-white/85" />
              </p>
              <div className="mt-3">
                <DymekUwagi uwaga={uwagaDo(tydzien.lekcja.id)!} maly />
              </div>
              <button
                type="button"
                onClick={() => onStart(tydzien.lekcja)}
                className="mt-4 flex min-h-[3.25rem] w-full items-center justify-center rounded-2xl bg-white px-4 py-2 text-base leading-tight font-bold text-[#4b2aa8] shadow-[0_4px_0_#d9ccff] transition-transform active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {napis(N.zrobJeszczeRaz)} →
              </button>
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-bold leading-snug">{polski(doNiedzieli(tydzien.termin), j)}</p>
              <p className="text-[0.95rem] font-medium text-white/85">{przeklad(doNiedzieli(tydzien.termin), j)}</p>
              <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{napis(zostaloDni(tydzien.dniDoTerminu))}</p>
              <button
                type="button"
                onClick={() => onStart(tydzien.lekcja)}
                className="mt-4 flex min-h-[3.25rem] w-full items-center justify-center rounded-2xl bg-white px-6 text-lg font-bold text-[#4b2aa8] shadow-[0_4px_0_#d9ccff] transition-transform active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {napis(N.zaczynamy)} →
              </button>
            </>
          )}
        </section>
      )}

      <ol className="relative mt-6 space-y-3 before:absolute before:bottom-6 before:left-[1.85rem] before:top-6 before:w-1 before:rounded-full before:bg-[#e6e5df]">
        {DYKTANDA.map((l) => {
          const w = najlepszy(l.id);
          const otwarta = l.od <= dzis;
          const aktualna = teraz?.id === l.id;
          const zalegla = otwarta && !w && tydzien?.lekcja.id !== l.id;
          const uwaga = uwagaDo(l.id);
          const popraw = poprawa(l.id);
          // Dymek pod lekcja tygodnia "do poprawy" jest juz w karcie u gory.
          const pokazDymek = uwaga && !(popraw && tydzien?.lekcja.id === l.id);
          return (
            <li key={l.id} className="relative">
              <button
                type="button"
                disabled={!otwarta}
                onClick={() => onStart(l)}
                className={clsx(
                  'flex w-full items-center gap-4 rounded-3xl p-3 pr-4 text-left transition-transform',
                  otwarta && 'active:translate-y-[2px]',
                  aktualna ? 'bg-white shadow-[0_4px_0_#8b5cf6] ring-2 ring-[#8b5cf6]' : otwarta ? 'bg-white shadow-[0_3px_0_#e3e2dc]' : 'bg-transparent',
                )}
              >
                <span
                  className={clsx(
                    'relative z-10 flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center rounded-full text-xl font-extrabold',
                    popraw ? 'bg-[#fff1dc] text-[#b45309] shadow-[0_3px_0_#f3c98b]' : w ? 'bg-[#ffd43b] text-[#1d1d1f] shadow-[0_3px_0_#e0ac00]' : aktualna ? 'bg-[#8b5cf6] text-white shadow-[0_3px_0_#6a3fd1]' : otwarta ? 'bg-[#ecebe5] text-[#5b5b57]' : 'bg-[#ecebe5] text-[#b5b4ad]',
                  )}
                >
                  {popraw ? '↻' : w ? '★' : otwarta ? l.nr : '🔒'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={clsx('block text-lg font-extrabold', !otwarta && 'text-[#9a9993]')}>{l.temat}</span>
                  <span className="block truncate text-sm text-[#8a8a85]">
                    {popraw ? (
                      <span className="font-bold text-[#b45309]">{napis(N.doPoprawy)}</span>
                    ) : zalegla ? (
                      <span className="font-bold text-[#b45309]">{napis(N.nadrobienia)}</span>
                    ) : (
                      tematLekcji(l, j)
                    )}
                    {!otwarta && ` · ${krotkaData(l.od)}`}
                  </span>
                </span>
                {w ? (
                  <span className={clsx('shrink-0 text-right text-base font-extrabold', popraw ? 'text-[#b45309]' : 'text-[#17803f]')}>
                    {w.punkty}/{w.maks}
                  </span>
                ) : aktualna && tydzien?.lekcja.id !== l.id ? (
                  <span className="shrink-0 rounded-full bg-[#8b5cf6] px-3.5 py-1.5 text-sm font-bold text-white">{napis(N.zrob)}</span>
                ) : null}
              </button>
              {pokazDymek && (
                <div className="relative z-10 ml-[4.6rem] mt-2">
                  <DymekUwagi uwaga={uwaga} maly />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {zrobione > 0 && <p className="mt-6 text-center text-sm text-[#8a8a85]">{napis(N.powtorzKiedyChcesz)}</p>}
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
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {lekcja.wstep.map((r) => (
          <div key={r.litery} className="w-24 rounded-2xl bg-[#f1ebff] py-4 shadow-[0_3px_0_#d9ccff]">
            <p className="text-5xl font-extrabold text-[#6a3fd1]">{r.litery}</p>
            <p className="mt-1 text-xl text-[#5b5b57]">[{dzwiekDla(r, j)}]</p>
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
            <span key={i} className={`h-2.5 rounded-full transition-all ${i === nr ? 'w-6 bg-[#8b5cf6]' : 'w-2.5 bg-[#e3e2dc]'}`} />
          ))}
        </div>
        <button type="button" onClick={() => graj([nagranie])} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
          <IkonaGlosnik className="h-4 w-4" /> {napis(N.posluchajJeszcze)}
        </button>
      </div>
      <div className="min-h-[22rem]" key={nr}>
        {nr === 0 ? <SlajdIntro lekcja={lekcja} /> : <SlajdReguly regula={lekcja.wstep[nr - 1]} />}
      </div>
      <DolnyPrzycisk>
        {nr > 0 && (
          <button type="button" className={btnDrugi} onClick={() => setNr(nr - 1)} aria-label={napis(N.wstecz)}>
            ←
          </button>
        )}
        <button type="button" className={`${btnGlowny} flex-1`} onClick={() => (ostatni ? onDalej() : setNr(nr + 1))}>
          {ostatni ? napis(N.cwiczymy) : napis(N.dalej)}
        </button>
      </DolnyPrzycisk>
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
      <div className={clsx('mt-6 grid gap-3', opcje.length === 2 || opcje.length === 4 ? 'grid-cols-2' : 'grid-cols-3')}>
        {opcje.map((o) => {
          const zly = zle.includes(o);
          const trafiony = dobrze && o === zadanie.luka;
          return (
            <button
              key={o}
              type="button"
              onClick={() => wybierz(o)}
              disabled={zly || dobrze}
              className={`min-h-16 rounded-2xl border-2 text-3xl font-extrabold transition-colors ${
                trafiony
                  ? 'border-[#22a95b] bg-[#e7f7ec] text-[#17803f]'
                  : zly
                    ? 'border-[#f5c2c0] bg-[#fdeceb] text-[#e8a09b] line-through'
                    : 'border-[#d6d5cf] bg-white text-[#1d1d1f] shadow-[0_4px_0_#d6d5cf] hover:bg-[#fafaf7] active:translate-y-[3px] active:shadow-none'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {zle.length > 0 && !dobrze && <p className="mt-4 font-semibold text-[#c0362c]">{napis(N.jeszczeRazWybierz)}</p>}
      {dobrze && (
        <Arkusz
          stan="dobrze"
          tytul={<>🎉 {napis(N.dobrze)}</>}
          przyciski={
            <button type="button" className={`${btnGlowny} flex-1`} onClick={() => onDalej(zle.length === 0)} autoFocus>
              {napis(N.dalej)}
            </button>
          }
        >
          {zle.length > 0 && wskazowka && <ListaWskazowek wskazowki={[wskazowka]} />}
          <Dlaczego t={zadanie.dlaczego} />
        </Arkusz>
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
            <p className="rounded-2xl bg-[#e7f7ec] px-4 py-3 text-lg font-bold text-[#17803f]">
              🎉 {napis(N.dobrze)} <span className="ml-2 text-2xl">{slowo.pl}</span>
            </p>
          ) : (
            <div className="rounded-2xl border-2 border-[#f5c2c0] bg-[#fdeceb]/60 p-4">
              <p className="font-semibold text-gray-900">
                <Dwujezycznie t={N.prawie} />
              </p>
              <div className="mt-3">
                <SlowoZBledami w={wynik} />
              </div>
              <ListaWskazowek wskazowki={wynik.wskazowki} />
              <Dlaczego t={slowo.dlaczego} />
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
          {pozycje.map((p, i) => (!p.zdanie && !wyniki[i][0].ok ? <Dlaczego key={i} t={p.przyklad.dlaczego} /> : null))}
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
  powtorka,
  slowa,
  zdania,
  test,
  sekundy,
  onPowtorz,
  onWroc,
}: {
  lekcja: DyktandoLekcja;
  uczen: Uczen;
  powtorka: WynikSlowa[];
  slowa: WynikSlowa[];
  zdania: WynikSlowa[][];
  test: WynikSlowa[][];
  sekundy: number;
  onPowtorz: () => void;
  onWroc: () => void;
}) {
  const napis = useNapis();
  const maksy = punktyLekcji(lekcja);
  const zaPowtorke = powtorka.filter((w) => w.ok).length;
  const zaCwiczenia = slowa.filter((w) => w.ok).length + zdania.reduce((s, z) => s + punktyZdania(z), 0);
  const zaTest = test.reduce((s, z) => s + punktyZdania(z), 0);
  const punkty = zaPowtorke + zaCwiczenia + zaTest;
  const maks = maksPunktow(lekcja);
  const bledne = [...powtorka, ...slowa, ...zdania.flat(), ...test.flat()].filter((w) => w.wzor && !w.ok);
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
        {maksy.powtorka > 0 && (
          <>
            {napis(N.powtorka)}: <b>{zaPowtorke}/{maksy.powtorka}</b> ·{' '}
          </>
        )}
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

type Etap = 'powtorka' | 'wstep' | 'cwiczenie' | 'slowa' | 'zdania' | 'zapamietaj' | 'test' | 'poprawki' | 'wynik';

function Lekcja({ lekcja, uczen, onKoniec }: { lekcja: DyktandoLekcja; uczen: Uczen; onKoniec: () => void }) {
  const napis = useNapis();
  const [proba, setProba] = useState(0);
  const slowaPowtorki = useMemo(() => powtorkaDla(lekcja), [lekcja, proba]); // eslint-disable-line react-hooks/exhaustive-deps
  const pierwszy: Etap = slowaPowtorki.length ? 'powtorka' : 'wstep';
  const [etap, setEtap] = useState<Etap>(pierwszy);
  const [idx, setIdx] = useState(0);
  const [powtorka, setPowtorka] = useState<WynikSlowa[]>([]);
  const [slowa, setSlowa] = useState<WynikSlowa[]>([]);
  const [zdania, setZdania] = useState<WynikSlowa[][]>([]);
  const [test, setTest] = useState<WynikSlowa[][]>([]);
  const [start, setStart] = useState(() => Date.now());

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
    setPowtorka([]);
    setSlowa([]);
    setZdania([]);
    setTest([]);
    setStart(Date.now());
    setProba((p) => p + 1);
    przejdz(pierwszy);
  }

  const kolejnosc: Array<[Etap, number]> = [
    ['powtorka', slowaPowtorki.length],
    ['wstep', 1],
    ['cwiczenie', lekcja.cwiczenie.length],
    ['slowa', lekcja.slowa.length],
    ['zdania', lekcja.zdania.length],
    ['zapamietaj', 1],
    ['test', pozycjeTestu.length],
    ['poprawki', 1],
  ];
  const wszystkie = kolejnosc.reduce((s, [, n]) => s + n, 0);
  let zrobione = wszystkie;
  let licz = 0;
  for (const [e, n] of kolejnosc) {
    if (e === etap) {
      zrobione = licz + idx;
      break;
    }
    licz += n;
  }

  const podtytul: Partial<Record<Etap, Tekst>> = {
    powtorka: N.powtorka,
    cwiczenie: N.czescCwiczenie,
    slowa: N.czescSlowa,
    zdania: N.czescDyktando,
    test: N.test,
    poprawki: N.test,
  };

  return (
    <div key={proba}>
      <GornyPasek zrobione={zrobione} wszystkie={wszystkie} onZamknij={onKoniec} etykietaZamknij={napis(N.lista)} />
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">
          {napis({ pl: `${N.lekcja.pl} ${lekcja.nr}`, ua: `${N.lekcja.ua} ${lekcja.nr}`, es: `${N.lekcja.es} ${lekcja.nr}` })}
          {podtytul[etap] && ` · ${napis(podtytul[etap]!)}`}
        </p>
        <h1 className="mt-1 text-[1.6rem] font-extrabold leading-tight">{lekcja.temat}</h1>
      </div>
      {etap === 'powtorka' && (
        <>
          {idx === 0 && (
            <p className="mb-3 rounded-2xl bg-[#f1ebff] px-4 py-3 font-semibold text-[#4b2aa8]">
              <Dwujezycznie t={N.powtorkaOpis} />
            </p>
          )}
          <KrokSlowo
            key={`p${idx}`}
            slowo={slowaPowtorki[idx]}
            nr={idx + 1}
            ile={slowaPowtorki.length}
            onWynik={(w) => {
              setPowtorka((s) => [...s, w]);
              nastepny(slowaPowtorki.length, 'wstep');
            }}
          />
        </>
      )}
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
          powtorka={powtorka}
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

// ---------- calosc kursu ----------

/** Kurs w portalu ucznia: lista 10 lekcji albo otwarta lekcja. */
export function KursPolski({
  konto,
  wyniki,
  uwagi = [],
  startLekcja,
  onPrzeczytane,
  onWroc,
  onZapisano,
}: {
  konto: KontoUcznia;
  wyniki: WynikUcznia[] | null;
  /** Uwagi nauczyciela (migracja 0047) - dymek pod lekcja. */
  uwagi?: UwagaUcznia[];
  /** Od razu otworz te lekcje (np. z uwagi na stronie startowej). */
  startLekcja?: string;
  /** Uczen otworzyl lekcje z uwaga - uwaga przeczytana. */
  onPrzeczytane?: (u: UwagaUcznia[]) => void;
  onWroc: () => void;
  /** Po skonczonej lekcji - portal odswieza wyniki. */
  onZapisano: () => void;
}) {
  const [lekcja, setLekcja] = useState<DyktandoLekcja | null>(
    () => DYKTANDA.find((l) => l.id === startLekcja && l.od <= toDateKey(new Date())) ?? null,
  );
  return (
    <JezykCtx.Provider value={konto.jezyk}>
      {lekcja ? (
        <Lekcja
          lekcja={lekcja}
          uczen={konto}
          onKoniec={() => {
            setLekcja(null);
            onZapisano();
          }}
        />
      ) : (
        <ListaKursu
          wyniki={wyniki}
          uwagi={uwagi}
          onStart={(l) => {
            onPrzeczytane?.(uwagi.filter((u) => u.lekcja === l.id));
            setLekcja(l);
          }}
          onWroc={onWroc}
        />
      )}
    </JezykCtx.Provider>
  );
}
