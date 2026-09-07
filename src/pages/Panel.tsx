// PLYWAJACY PANEL - trasa /panel, ladowana przez shell desktopowy (folder desktop/).
// Po co: gdy lekcja idzie nie w prezentacji apki, tylko w multipodreczniku GWO
// (albo w czymkolwiek innym na projektorze), kolo na lekcji musi byc NAD tamtym
// oknem. Panel to ta sama mechanika, co szuflada TaskWheelDrawer w prezentacji:
// wybor klasy -> Krec -> plus (dobrze) albo kropka (slabo albo wcale).
//
// Zdarzenia leca do tego samego store (i tej samej chmury), wiec plusy z
// podrecznika licza sie w bilansie miesiaca razem z tymi z prezentacji. Adnotacja
// to "podrecznik" - w bilansie widac, skad plus przyszedl.
//
// Dwa stany okna: PIGULKA (waski pasek, ~208x44) i PANEL (~360x600). Rozmiar
// okna zmienia sie razem z UI - w przegladarce (dev) zmienia sie tylko UI.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { isTauri, nasluchujZwiniecia, ustawRozmiarOkna, zamknijOkno } from '../lib/desktop';
import { useTaskWheel } from '../components/lessons/useTaskWheel';
import { PanelWheel } from '../components/panel/PanelWheel';
import { useUchwytPrzeciagania } from '../components/panel/useUchwytPrzeciagania';

/** Adnotacja zdarzen z panelu - patrz lessonWheelNote (lessonCode jest pusty). */
const ADNOTACJA = 'podręcznik';

const PIGULKA = { width: 208, height: 44 };
const PANEL = { width: 360, height: 600 };

const KLUCZ_KLASY = 'apka-szkolna:panel:classId';

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
  const wheel = useTaskWheel({ classId });

  // Rozmiar okna idzie za stanem UI. Pierwsze wywolanie tez jest potrzebne:
  // okno startuje w rozmiarze panelu, ale po restarcie chcemy zgodnosc.
  useEffect(() => {
    const rozmiar = rozwiniety ? PANEL : PIGULKA;
    void ustawRozmiarOkna(rozmiar.width, rozmiar.height);
  }, [rozwiniety]);

  // Tlo strony musi byc przezroczyste - okno Tauri jest transparent, wiec
  // szare tlo body rysowaloby prostokat wokol zaokraglonych rogow panelu.
  useEffect(() => {
    document.documentElement.classList.add('panel-tryb');
    return () => document.documentElement.classList.remove('panel-tryb');
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

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Escape') {
        setRozwiniety(false);
        return;
      }
      if (!rozwiniety) return;
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
    [rozwiniety, canSpin, spin, currentStudent, graded, currentCanEarnPlus, grade, canUndo, undoLast],
  );
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  const nazwaKlasy = sortedClasses.find((c) => c.id === classId)?.name ?? '—';

  if (!rozwiniety) {
    return <Pigulka nazwaKlasy={nazwaKlasy} onRozwin={() => setRozwiniety(true)} />;
  }

  return (
    <PanelWheel
      wheel={wheel}
      adnotacja={ADNOTACJA}
      classes={sortedClasses}
      classId={classId}
      onClassId={setClassId}
      onZwin={() => setRozwiniety(false)}
      onZamknij={isTauri() ? () => void zamknijOkno() : undefined}
    />
  );
}

function Pigulka({ nazwaKlasy, onRozwin }: { nazwaKlasy: string; onRozwin: () => void }) {
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
        title="Koło fortuny - kliknij, żeby rozwinąć; przeciągnij, żeby przesunąć"
        className="flex h-full w-full cursor-pointer select-none items-center gap-2 rounded-full bg-gray-900 px-4 text-gray-100 shadow-lg ring-1 ring-gray-700 hover:bg-gray-800"
      >
        <span aria-hidden className="text-lg leading-none">🎡</span>
        <span className="text-sm font-semibold">{nazwaKlasy}</span>
        <span className="ml-auto text-xs text-gray-400">koło</span>
      </div>
    </div>
  );
}
