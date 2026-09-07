// Slajd "Temat lekcji" - to, co klasa zapisuje w zeszycie na poczatku lekcji.
// Jasne tlo w liniature (jak notatka) mowi bez slow: "to sie przepisuje".
//
// Stoper: DOMYSLNIE GO NIE MA. Zapisywanie tematu jednym klasom idzie szybko,
// innym wolno - odliczanie na sztywno tylko poganialo. Zamiast tego w rogu
// slajdu siedzi male kolko: klik dokłada 1, 2, 3, 5 minut albo gasi stoper.
// Ustawienie zyje tylko w tym pokazie (nie zapisuje sie do lekcji) - nauczyciel
// decyduje w trakcie lekcji, patrzac na klase.
//
// Kod lekcji (np. 4.3) jest tu ogromny, tak jak kod zadania na slajdzie `task`:
// dziecko zapisuje "Temat 4.3", a po miesiacach potrafi po tym kodzie odnalezc
// w zeszycie wlasciwa lekcje. Tresc tematu bierzemy z samego slajdu, a gdy jej
// nie ma - z tematu lekcji do dziennika (SlideView podaje go jako lessonTopic),
// zeby zeszyt i dziennik mowily to samo.

import { useState } from 'react';
import clsx from 'clsx';
import type { Slide } from '../../data/types';
import { StopwatchBar } from './StopwatchBar';
import { fitFontSize } from './fitText';

/** Kolejne pozycje kolka stopera (w minutach); 0 = bez stopera. */
const TIMER_MINUTES = [0, 1, 2, 3, 5];

/** Male kolko w rogu slajdu - jedno klikniecie zmienia czas na zapisanie tematu. */
function TimerDial({ minutes, onCycle }: { minutes: number; onCycle: () => void }) {
  return (
    <button
      type="button"
      onClick={onCycle}
      title="Czas na zapisanie tematu: klik zmienia 1, 2, 3, 5 minut albo wyłącza stoper"
      className={clsx(
        'absolute bottom-8 right-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 leading-none',
        minutes > 0 ? 'border-accent-500 text-accent-700' : 'border-gray-300 text-gray-400',
      )}
    >
      {minutes > 0 ? (
        <>
          <span className="text-3xl font-bold tabular-nums">{minutes}</span>
          <span className="text-xs uppercase tracking-widest">min</span>
        </>
      ) : (
        <span className="text-sm uppercase tracking-widest">czas</span>
      )}
    </button>
  );
}

const RULED_LINES_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 64px)',
  backgroundPosition: '0 140px',
};

export function TopicSlideView({
  slide,
  code,
  lessonTopic,
}: {
  slide: Extract<Slide, { kind: 'topic' }>;
  code?: string;
  lessonTopic?: string;
}) {
  const topic = (slide.topic || lessonTopic || '').trim();
  const topicSize = fitFontSize(topic, { width: 1080, height: 300, min: 32, max: 84, lineHeight: 1.25 });
  // Stoper startuje wylaczony przy kazdym wejsciu na slajd - patrz uwaga na gorze.
  const [timerMin, setTimerMin] = useState(0);

  function cycleTimer() {
    const next = TIMER_MINUTES[(TIMER_MINUTES.indexOf(timerMin) + 1) % TIMER_MINUTES.length];
    setTimerMin(next);
  }

  return (
    <div
      className="relative flex h-full flex-col bg-amber-50 px-16 py-10 text-gray-900"
      style={RULED_LINES_STYLE}
    >
      <div className="flex items-center gap-6">
        <span className="text-3xl font-semibold uppercase tracking-widest text-gray-500">Temat</span>
        {code && (
          <span className="rounded-2xl border-4 border-accent-500 px-7 py-2 text-[80px] font-bold leading-none tabular-nums text-accent-700">
            {code}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center">
        <p className="font-bold leading-snug text-gray-900" style={{ fontSize: topicSize }}>
          {topic || 'Temat lekcji'}
        </p>
      </div>

      <p className="text-center text-3xl font-semibold text-gray-500">
        {slide.note?.trim() || 'Zapiszcie temat z kodem i dzisiejszą datą w zeszycie'}
      </p>

      {timerMin > 0 && (
        <div className="mt-4 flex justify-center">
          {/* key = wybrana dlugosc: zmiana na kolku przestawia stoper od nowa */}
          <StopwatchBar key={timerMin} timerSec={timerMin * 60} />
        </div>
      )}

      <TimerDial minutes={timerMin} onCycle={cycleTimer} />
    </div>
  );
}
