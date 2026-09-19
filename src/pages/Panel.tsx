// PLYWAJACY PANEL - trasa /panel, ladowana przez shell desktopowy (folder desktop/).
//
// Po co: gdy lekcja idzie nie w prezentacji apki, tylko w multipodreczniku GWO
// (albo w czymkolwiek innym na projektorze), narzedzia lekcji musza byc NAD
// tamtym oknem. Panel ma dwa tryby:
//
// - KOLO - ta sama mechanika, co szuflada TaskWheelDrawer w prezentacji:
//   Krec -> plus (dobrze) albo kropka (slabo albo wcale). Zdarzenia leca do tego
//   samego store (i tej samej chmury), z adnotacja "podrecznik", wiec w bilansie
//   miesiaca widac, skad plus przyszedl.
// - STOPER - odliczanie z wlasnym poleceniem ("Czytamy tekst ze s. 12"), bo przy
//   podreczniku nie ma slajdu zadania, na ktorym stoper stalby normalnie.
// - AUDIO - czytanki z lektorem (ElevenLabs) z kolejnych lekcji podrecznika.
//
// Stan trybow (kolo, odliczanie, odtwarzacz czytanek) siedzi TU, a nie w komponentach trybow:
// przelaczenie trybu ani zwiniecie panelu do pigulki nie moze gubic losowania
// ani przerywac stopera.
//
// OBECNOSC (przycisk w naglowku) - lista klasy: klik = nieobecny, 💬 = uwaga do
// dziennika. Nieobecni dzis nie trafiaja na zadne kolo.
//
// LEKCJA idzie SAMA z planu (zakladka "Plan"): trwajaca, a na przerwie i przed
// lekcjami - najblizsza. W naglowku wybiera sie lekcje z dzisiejszego planu
// ("2. IV B"), a klase bez lekcji tylko na zastepstwa; reczny wybor wygrywa do
// nastepnej lekcji z planu. Pigulka pokazuje zegar i czas do dzwonka.
//
// Rozmiar okna idzie za tym, co jest na ekranie (patrz ROZMIARY): pigulka po
// zwinieciu, wysokie okno pod kolo, niskie pod stoper, a srodkowy przycisk w
// naglowku scisga stoper do samego polecenia i czasu. W przegladarce (dev)
// zmienia sie tylko UI - okna nie ma czym ruszac.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { isTauri, nasluchujZwiniecia, ustawRozmiarOkna, zamknijOkno } from '../lib/desktop';
import { formatMmSs } from '../lib/timer';
import { toDateKey } from '../lib/dates';
import { currentOrNextEntry, entriesForDay, formatRemaining, periodStatus, weekdayOf } from '../lib/timetable';
import { useNow } from '../components/timetable/useNow';
import { useCountdown } from '../components/slides/useCountdown';
import { useTaskWheel } from '../components/lessons/useTaskWheel';
import { PanelNaglowek, type PanelTryb } from '../components/panel/PanelNaglowek';
import { PanelStoper } from '../components/panel/PanelStoper';
import { PanelObecnosc } from '../components/panel/PanelObecnosc';
import { PanelWheel } from '../components/panel/PanelWheel';
import { useUchwytPrzeciagania } from '../components/panel/useUchwytPrzeciagania';
import { PanelCzytanki } from '../components/panel/PanelCzytanki';
import { IncomingUwagaToast } from '../components/uwagi/IncomingUwagaToast';
import { formatCzasu, useCzytankaPlayer } from '../components/czytanki/useCzytankaPlayer';

/** Adnotacja zdarzen z panelu - patrz lessonWheelNote (lessonCode jest pusty). */
const ADNOTACJA = 'podręcznik';

// Rozmiary okna. Stoper dostaje wlasna wysokosc, bo w oknie kola zostawal pod
// czasem wielki pusty prostokat; KOMPAKT to jeszcze mniej - samo polecenie
// i czas (srodkowy przycisk w naglowku).
const PIGULKA = { width: 250, height: 44 };
const ROZMIARY = {
  // 390 px, bo w naglowku jest wybor lekcji ("2. IV B"), trzy tryby, Obecność i
  // trzy przyciski okna - przy 360 px ✕ wypadal za prawa krawedz.
  kolo: { width: 390, height: 600 },
  stoper: { width: 390, height: 300 },
  stoperKompakt: { width: 300, height: 138 },
  czytanki: { width: 390, height: 560 },
};

const KLUCZ_KLASY = 'apka-szkolna:panel:classId';
const KLUCZ_MINUT = 'apka-szkolna:panel:minuty';
const DOMYSLNE_MINUTY = 5;

export function Panel() {
  const classes = useStore((s) => s.classes);
  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);

  const [classId, setClassId] = useState<string>(() => localStorage.getItem(KLUCZ_KLASY) ?? '');
  // Klasa z localStorage moze juz nie istniec (skasowana, inne konto) - wtedy pierwsza z listy.
  useEffect(() => {
    if (sortedClasses.length === 0) return;
    if (!sortedClasses.some((c) => c.id === classId)) {
      setClassId(sortedClasses[0].id);
    }
  }, [sortedClasses, classId]);
  useEffect(() => {
    if (classId) localStorage.setItem(KLUCZ_KLASY, classId);
  }, [classId]);

  // Lekcja z planu. Efekt odpala sie tylko przy ZMIANIE lekcji z planu (klucz:
  // dzien + komorka), wiec reczny wybor w naglowku nie jest co sekunde
  // nadpisywany - trzyma sie do nastepnego dzwonka.
  const timetable = useStore((s) => s.timetable);
  const periods = useStore((s) => s.periods);
  const now = useNow(1000);
  const lekcjaZPlanu = currentOrNextEntry(timetable, periods, now);
  const dzisiaj = toDateKey(now);
  const kluczLekcji = lekcjaZPlanu ? `${dzisiaj}:${lekcjaZPlanu.id}` : '';
  // Wybrana komorka planu (dzien + id), albo null = sama klasa, bez lekcji.
  const [wybranaLekcja, setWybranaLekcja] = useState<string | null>(null);
  useEffect(() => {
    const id = lekcjaZPlanu?.classId;
    if (id && classes.some((c) => c.id === id)) {
      setClassId(id);
      setWybranaLekcja(kluczLekcji);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kluczLekcji, classes.length]);

  const lekcjeDzis = entriesForDay(timetable, weekdayOf(now));
  const lekcja = lekcjeDzis.find((e) => `${dzisiaj}:${e.id}` === wybranaLekcja && e.classId === classId);

  function wybierz(wartosc: string) {
    const [rodzaj, id] = [wartosc.slice(0, 2), wartosc.slice(2)];
    if (rodzaj === 'l:') {
      const e = lekcjeDzis.find((x) => x.id === id);
      if (!e?.classId) return;
      setClassId(e.classId);
      setWybranaLekcja(`${dzisiaj}:${e.id}`);
    } else {
      setClassId(id);
      setWybranaLekcja(null);
    }
  }

  const [rozwiniety, setRozwiniety] = useState(true);
  const [tryb, setTryb] = useState<PanelTryb>('kolo');
  const [kompakt, setKompakt] = useState(false);
  // Stan listy obecnosci siedzi TU, a nie w komponencie trybu, bo Esc ma najpierw
  // zamykac liste, a klawisze (spacja/1/2) nie moga dzialac na to, co pod nia.
  const [obecnoscOtwarta, setObecnoscOtwarta] = useState(false);

  // Pamiec "kto juz dzis byl losowany" jest wspolna z apka webowa: panel czyta
  // te same zdarzenia z dzisiaj dla tej klasy, wiec kto odpowiadal na kole
  // powtorzeniowym z rana, nie wraca na kolo przy podreczniku (patrz
  // useTaskWheel i useTodayEventsPull). Przycisk Reset zaczyna liczenie od nowa.
  const wheel = useTaskWheel({ classId });

  // Stoper. Dlugosc pamietana miedzy uruchomieniami panelu, polecenie nie -
  // dotyczy konkretnego zadania i puste pole jest lepszym startem niz cudze.
  const [minuty, setMinuty] = useState<number>(() => {
    const zapisane = Number(localStorage.getItem(KLUCZ_MINUT));
    return Number.isFinite(zapisane) && zapisane >= 1 ? zapisane : DOMYSLNE_MINUTY;
  });
  const [polecenie, setPolecenie] = useState('');
  useEffect(() => {
    localStorage.setItem(KLUCZ_MINUT, String(minuty));
  }, [minuty]);
  const stoper = useCountdown(minuty * 60);

  // Czytanka gra dalej po zwinieciu do pigulki i po przejsciu na kolo.
  const czytanka = useCzytankaPlayer();
  const { toggle: czytankaToggle, seekBy: czytankaSeekBy } = czytanka;

  // Rozmiar okna idzie za stanem UI. Pierwsze wywolanie tez jest potrzebne:
  // okno startuje w rozmiarze panelu, ale po restarcie chcemy zgodnosc.
  useEffect(() => {
    const rozmiar = !rozwiniety
      ? PIGULKA
      : tryb === 'stoper'
        ? kompakt
          ? ROZMIARY.stoperKompakt
          : ROZMIARY.stoper
        : tryb === 'czytanki'
          ? ROZMIARY.czytanki
          : ROZMIARY.kolo;
    void ustawRozmiarOkna(rozmiar.width, rozmiar.height);
  }, [rozwiniety, tryb, kompakt]);

  // Tlo strony musi byc przezroczyste - okno Tauri jest transparent, wiec
  // szare tlo body rysowaloby prostokat wokol zaokraglonych rogow panelu.
  // `panel-gotowy` dodatkowo chowa pasek ratunkowy z main.tsx (PanelPasek):
  // od tego momentu przeciaganie i zamykanie sa w naglowku panelu.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('panel-tryb', 'panel-gotowy');
    return () => html.classList.remove('panel-gotowy');
  }, []);

  // Minimalizacja z paska zadan = zwiniecie do pigulki (pasek_zadan.rs).
  useEffect(() => {
    let zdejmij: (() => void | Promise<void>) | null = null;
    void nasluchujZwiniecia(() => setRozwiniety(false)).then((f) => {
      zdejmij = f;
    });
    return () => {
      void zdejmij?.();
    };
  }, []);

  const { spin, grade, undoLast, canSpin, graded, currentStudent, canUndo } = wheel;
  const stoperRunning = stoper.running;
  const stoperFinished = stoper.finished;
  const { start: stoperStart, pause: stoperPause } = stoper;

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      // Pole polecenia w stoperze - spacja ma tam pisac, a nie startowac.
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape') {
        if (obecnoscOtwarta) setObecnoscOtwarta(false);
        else setRozwiniety(false);
        return;
      }
      if (!rozwiniety || obecnoscOtwarta) return;

      // Ctrl+Z = cofnij, w obu trybach i tak samo jak wszedzie indziej w apce.
      if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (canUndo) undoLast();
        return;
      }

      if (tryb === 'czytanki') {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          czytankaToggle();
        } else if (e.key === 'ArrowLeft') {
          czytankaSeekBy(-10);
        } else if (e.key === 'ArrowRight') {
          czytankaSeekBy(10);
        }
        return;
      }

      if (tryb === 'stoper') {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          if (stoperFinished) return;
          if (stoperRunning) stoperPause();
          else stoperStart();
        }
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (canSpin) spin();
      } else if (e.key === '1') {
        if (currentStudent && !graded) grade('plus', ADNOTACJA);
      } else if (e.key === '2') {
        if (currentStudent && !graded) grade('kropka', ADNOTACJA);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (canUndo) undoLast();
      }
    },
    [
      rozwiniety,
      obecnoscOtwarta,
      tryb,
      czytankaToggle,
      czytankaSeekBy,
      stoperRunning,
      stoperFinished,
      stoperStart,
      stoperPause,
      canSpin,
      spin,
      currentStudent,
      graded,
      grade,
      canUndo,
      undoLast,
    ],
  );
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  const nazwaKlasy = sortedClasses.find((c) => c.id === classId)?.name ?? '-';
  const status = periodStatus(periods, now);
  // "3. lekcja" tylko wtedy, gdy wybrana klasa to faktycznie ta z planu.
  const podpisLekcji = lekcja ? `${lekcja.period}. lekcja` : null;
  const nazwaPo = new Map(sortedClasses.map((c) => [c.id, c.name]));

  if (!rozwiniety) {
    return (
      <Pigulka
        nazwaKlasy={nazwaKlasy}
        // Zwiniety panel ma dalej pokazywac odliczanie - inaczej "zwin, zeby nie
        // zaslanialo" znaczyloby "strac stoper z oczu".
        stoper={stoper.running || stoper.finished ? formatMmSs(stoper.remainingSec) : null}
        koniecCzasu={stoper.finished}
        czytanka={czytanka.playing ? formatCzasu(czytanka.duration - czytanka.currentTime) : null}
        zegar={`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`}
        dzwonek={
          status.kind === 'lesson'
            ? { tekst: formatRemaining(status.remainingSec), sec: status.remainingSec }
            : status.kind === 'break'
              ? { tekst: `przerwa ${formatRemaining(status.remainingSec)}`, sec: null }
              : null
        }
        onRozwin={() => setRozwiniety(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-gray-900 text-gray-200 shadow-2xl ring-1 ring-gray-700">
      {/* Uwaga dana z telefonu (widok "Sala") wyskakuje tez tu, nad multipodrecznikiem. */}
      <IncomingUwagaToast tone="dark" />
      <PanelNaglowek
        wybor={lekcja ? `l:${lekcja.id}` : `k:${classId}`}
        lekcje={lekcjeDzis
          .filter((e) => e.classId && nazwaPo.has(e.classId))
          .map((e) => ({ value: `l:${e.id}`, label: `${e.period}. ${nazwaPo.get(e.classId as string)}` }))}
        klasy={sortedClasses.map((c) => ({ value: `k:${c.id}`, label: c.name }))}
        onWybor={wybierz}
        tryb={tryb}
        onTryb={setTryb}
        obecnoscOtwarta={obecnoscOtwarta}
        onObecnosc={setObecnoscOtwarta}
        kompakt={kompakt}
        onKompakt={tryb === 'stoper' ? setKompakt : undefined}
        onZwin={() => {
          setObecnoscOtwarta(false);
          setRozwiniety(false);
        }}
        onZamknij={isTauri() ? () => void zamknijOkno() : undefined}
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {tryb === 'kolo' ? (
          <PanelWheel wheel={wheel} adnotacja={ADNOTACJA} onObecnosc={() => setObecnoscOtwarta(true)} />
        ) : tryb === 'stoper' ? (
          <PanelStoper
            polecenie={polecenie}
            onPolecenie={setPolecenie}
            minuty={minuty}
            onMinuty={setMinuty}
            remainingSec={stoper.remainingSec}
            running={stoper.running}
            finished={stoper.finished}
            onStart={stoper.start}
            onPauza={stoper.pause}
            onReset={stoper.reset}
            kompakt={kompakt}
          />
        ) : (
          <PanelCzytanki player={czytanka} />
        )}

        {obecnoscOtwarta && (
          <PanelObecnosc
            classId={classId}
            podpis={podpisLekcji ? `${nazwaKlasy} · ${podpisLekcji}` : nazwaKlasy}
            students={wheel.classStudents}
            absentSet={wheel.absentSet}
            onTogglePresent={wheel.togglePresent}
            onZamknij={() => setObecnoscOtwarta(false)}
          />
        )}
      </div>
    </div>
  );
}

function Pigulka({
  nazwaKlasy,
  stoper,
  koniecCzasu,
  czytanka,
  zegar,
  dzwonek,
  onRozwin,
}: {
  nazwaKlasy: string;
  stoper: string | null;
  koniecCzasu: boolean;
  /** Pozostaly czas grajacej czytanki - pigulka pokazuje, ze lektor czyta. */
  czytanka: string | null;
  /** Aktualna godzina "10:42". */
  zegar: string;
  /** Do dzwonka wg planu: na lekcji "23 min" (z sekundami do kolorow), na przerwie opis; poza planem null. */
  dzwonek: { tekst: string; sec: number | null } | null;
  onRozwin: () => void;
}) {
  const uchwyt = useUchwytPrzeciagania(onRozwin);
  return (
    <div className="flex h-full w-full items-center justify-center p-1">
      <div
        {...uchwyt}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onRozwin();
        }}
        title="Panel lekcji - kliknij, żeby rozwinąć; przeciągnij, żeby przesunąć"
        className={`flex h-full w-full cursor-pointer select-none items-center gap-2 rounded-full px-4 shadow-lg ring-1 ring-gray-700 ${
          koniecCzasu ? 'bg-red-700 text-white' : 'bg-gray-900 text-gray-100 hover:bg-gray-800'
        }`}
      >
        <span aria-hidden className="text-lg leading-none">🎡</span>
        <span className="text-sm font-semibold">{nazwaKlasy}</span>
        {stoper ? (
          <span className="ml-auto text-sm font-bold tabular-nums">{stoper}</span>
        ) : czytanka ? (
          <span className="ml-auto text-sm tabular-nums text-accent-300">🔊 {czytanka}</span>
        ) : (
          <span className="ml-auto flex items-baseline gap-2 tabular-nums">
            <span className="text-xs text-gray-400">{zegar}</span>
            {dzwonek && (
              <span
                className={
                  dzwonek.sec === null
                    ? 'text-xs text-gray-400'
                    : `text-sm font-semibold ${
                        dzwonek.sec <= 60 ? 'text-red-400' : dzwonek.sec <= 5 * 60 ? 'text-amber-300' : 'text-gray-100'
                      }`
                }
              >
                {dzwonek.tekst}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
