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
//
// Stan obu trybow (kolo i odliczanie) siedzi TU, a nie w komponentach trybow:
// przelaczenie trybu ani zwiniecie panelu do pigulki nie moze gubic losowania
// ani przerywac stopera.
//
// Rozmiar okna idzie za tym, co jest na ekranie (patrz ROZMIARY): pigulka po
// zwinieciu, wysokie okno pod kolo, niskie pod stoper, a srodkowy przycisk w
// naglowku scisga stoper do samego polecenia i czasu. W przegladarce (dev)
// zmienia sie tylko UI - okna nie ma czym ruszac.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { isTauri, nasluchujZwiniecia, ustawRozmiarOkna, zamknijOkno } from '../lib/desktop';
import { formatMmSs } from '../lib/timer';
import { useCountdown } from '../components/slides/useCountdown';
import { useTaskWheel } from '../components/lessons/useTaskWheel';
import { PanelNaglowek, type PanelTryb } from '../components/panel/PanelNaglowek';
import { PanelStoper } from '../components/panel/PanelStoper';
import { PanelUwagi } from '../components/panel/PanelUwagi';
import { PanelWheel } from '../components/panel/PanelWheel';
import { useUchwytPrzeciagania } from '../components/panel/useUchwytPrzeciagania';

/** Adnotacja zdarzen z panelu - patrz lessonWheelNote (lessonCode jest pusty). */
const ADNOTACJA = 'podręcznik';

// Rozmiary okna. Stoper dostaje wlasna wysokosc, bo w oknie kola zostawal pod
// czasem wielki pusty prostokat; KOMPAKT to jeszcze mniej - samo polecenie
// i czas (srodkowy przycisk w naglowku).
const PIGULKA = { width: 208, height: 44 };
const ROZMIARY = {
  kolo: { width: 360, height: 600 },
  stoper: { width: 360, height: 300 },
  stoperKompakt: { width: 360, height: 150 },
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

  const [rozwiniety, setRozwiniety] = useState(true);
  const [tryb, setTryb] = useState<PanelTryb>('kolo');
  const [kompakt, setKompakt] = useState(false);
  // Stan listy uwag siedzi TU, a nie w komponencie trybu, bo Esc ma najpierw
  // zamykac liste, a klawisze (spacja/1/2) nie moga dzialac na to, co pod nia.
  const [uwagiOtwarte, setUwagiOtwarte] = useState(false);

  // poolMemory 'local': panel ma wlasna pamiec "kto juz byl", kasowana przyciskiem
  // Reset - nie dziedziczy skreslen po kole powtorzeniowym z rana (patrz useTaskWheel).
  const wheel = useTaskWheel({ classId, poolMemory: 'local' });

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

  // Rozmiar okna idzie za stanem UI. Pierwsze wywolanie tez jest potrzebne:
  // okno startuje w rozmiarze panelu, ale po restarcie chcemy zgodnosc.
  useEffect(() => {
    const rozmiar = !rozwiniety
      ? PIGULKA
      : tryb === 'stoper'
        ? kompakt
          ? ROZMIARY.stoperKompakt
          : ROZMIARY.stoper
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
  const currentCanEarnPlus = wheel.currentCanEarnPlus;
  const stoperRunning = stoper.running;
  const stoperFinished = stoper.finished;
  const { start: stoperStart, pause: stoperPause } = stoper;

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      // Pole polecenia w stoperze - spacja ma tam pisac, a nie startowac.
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape') {
        if (uwagiOtwarte) setUwagiOtwarte(false);
        else setRozwiniety(false);
        return;
      }
      if (!rozwiniety || uwagiOtwarte) return;

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
        if (currentStudent && !graded && currentCanEarnPlus) grade('plus', ADNOTACJA);
      } else if (e.key === '2') {
        if (currentStudent && !graded) grade('kropka', ADNOTACJA);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (canUndo) undoLast();
      }
    },
    [
      rozwiniety,
      uwagiOtwarte,
      tryb,
      stoperRunning,
      stoperFinished,
      stoperStart,
      stoperPause,
      canSpin,
      spin,
      currentStudent,
      graded,
      currentCanEarnPlus,
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

  if (!rozwiniety) {
    return (
      <Pigulka
        nazwaKlasy={nazwaKlasy}
        // Zwiniety panel ma dalej pokazywac odliczanie - inaczej "zwin, zeby nie
        // zaslanialo" znaczyloby "strac stoper z oczu".
        stoper={stoper.running || stoper.finished ? formatMmSs(stoper.remainingSec) : null}
        koniecCzasu={stoper.finished}
        onRozwin={() => setRozwiniety(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-gray-900 text-gray-200 shadow-2xl ring-1 ring-gray-700">
      <PanelNaglowek
        classes={sortedClasses}
        classId={classId}
        onClassId={setClassId}
        tryb={tryb}
        onTryb={setTryb}
        uwagiOtwarte={uwagiOtwarte}
        onUwagi={setUwagiOtwarte}
        kompakt={kompakt}
        onKompakt={tryb === 'stoper' ? setKompakt : undefined}
        onZwin={() => {
          setUwagiOtwarte(false);
          setRozwiniety(false);
        }}
        onZamknij={isTauri() ? () => void zamknijOkno() : undefined}
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {tryb === 'kolo' ? (
          <PanelWheel wheel={wheel} adnotacja={ADNOTACJA} />
        ) : (
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
        )}

        {uwagiOtwarte && (
          <PanelUwagi classId={classId} students={wheel.classStudents} onZamknij={() => setUwagiOtwarte(false)} />
        )}
      </div>
    </div>
  );
}

function Pigulka({
  nazwaKlasy,
  stoper,
  koniecCzasu,
  onRozwin,
}: {
  nazwaKlasy: string;
  stoper: string | null;
  koniecCzasu: boolean;
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
        ) : (
          <span className="ml-auto text-xs text-gray-400">koło</span>
        )}
      </div>
    </div>
  );
}
