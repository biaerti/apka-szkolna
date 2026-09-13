// Slajd otwierajacy lekcje. W zwyklym wariancie klasa zapisuje temat. Wariant
// `handout` prowadzi rozdanie gotowej karty A5: temat jest juz na wydruku, a
// dzieci tylko wklejaja material i widza trzy cele bez spoilerow z czytanki.
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
import { ZeszytIcon } from './ZeszytBadge';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';

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
  const scale = useSlideFontScale();
  const topicSize = fitFontSize(topic, { width: 1080, height: 300, min: 40, max: 92, scale, lineHeight: 1.25 });
  // Stoper startuje wylaczony przy kazdym wejsciu na slajd - patrz uwaga na gorze.
  const [timerMin, setTimerMin] = useState(0);

  if (slide.variant === 'handout') {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-amber-50 px-16 py-10 text-amber-950">
        <div className="flex items-start justify-between gap-10">
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-center gap-4 text-accent-700">
              <ZeszytIcon className="h-14 w-14" />
              <span className="text-3xl font-bold">Karta do wklejenia</span>
            </div>
            <h1 className="text-[68px] font-bold leading-[1.08] tracking-[-0.03em] text-amber-950">
              {topic || 'Temat lekcji'}
            </h1>
          </div>
          {code && (
            <span className="shrink-0 rounded-2xl bg-accent-700 px-7 py-3 text-[64px] font-bold leading-none tabular-nums text-white">
              {code}
            </span>
          )}
        </div>

        {slide.goals && slide.goals.length > 0 && (
          <div className="mt-8 flex-1 rounded-2xl bg-white px-9 py-7 shadow-[0_12px_32px_rgba(120,53,15,0.10)]">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Dzisiaj nauczysz się:</h2>
            <ul className="space-y-3 text-[32px] leading-tight text-gray-800">
              {slide.goals.map((goal) => (
                <li key={goal} className="flex items-start gap-4">
                  <svg viewBox="0 0 32 32" className="mt-1 h-8 w-8 shrink-0 text-accent-600" aria-hidden="true">
                    <circle cx="16" cy="16" r="13" fill="currentColor" opacity="0.14" />
                    <path d="m10 16 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-7 flex items-center justify-center gap-5 rounded-2xl bg-amber-200 px-8 py-5 text-center text-[30px] font-bold leading-tight text-amber-950">
          <ZeszytIcon className="h-12 w-12 shrink-0 text-amber-700" />
          <span>{slide.note?.trim() || 'Wklejamy karty A5 do zeszytu. Puste pola uzupełnimy pod koniec.'}</span>
        </div>
      </div>
    );
  }

  function cycleTimer() {
    const next = TIMER_MINUTES[(TIMER_MINUTES.indexOf(timerMin) + 1) % TIMER_MINUTES.length];
    setTimerMin(next);
  }

  return (
    <div
      className="relative flex h-full flex-col bg-amber-50 px-16 py-10 text-amber-950"
      style={RULED_LINES_STYLE}
    >
      <div className="flex items-center gap-6">
        <span className="text-3xl font-semibold uppercase tracking-widest text-amber-800">Temat</span>
        {code && (
          <span className="rounded-2xl border-4 border-accent-500 px-7 py-2 text-[80px] font-bold leading-none tabular-nums text-accent-700">
            {code}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center">
        <p className="font-bold leading-snug text-amber-950" style={{ fontSize: topicSize }}>
          {topic || 'Temat lekcji'}
        </p>
      </div>

      {/* Ta sama ikonka co plakietka "do zeszytu" na ciemnych slajdach - jedna umowa. */}
      <p className="flex items-center justify-center gap-3 text-center text-3xl font-semibold text-amber-800">
        <ZeszytIcon className="h-10 w-10 text-amber-600" />
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
