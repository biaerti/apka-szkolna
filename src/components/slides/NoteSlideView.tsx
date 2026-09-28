// Slajd "Notatka do zeszytu" - zamyka lekcje. Celowo jasne tlo (kartka
// w liniaturze), w odroznieniu od reszty ciemnej prezentacji.
// Linie liniatury: czysty CSS przez repeating-linear-gradient w atrybucie
// style (bez :has(), bez color-mix() - Chrome 109 na szkolnym komputerze).

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { ZeszytIcon } from './ZeszytBadge';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';
import { StopwatchBar } from './StopwatchBar';

const RULED_LINES_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 1px, transparent 1px, transparent 64px)',
  backgroundPosition: '0 120px',
};

const TEMAT_PREFIX = '**Temat:** ';

/**
 * "Temat: Czas na czasownik" -> "Temat: 4.11. Czas na czasownik" - w zeszycie
 * temat ma stac dokladnie tak, jak na slajdzie tematu (z kodem lekcji).
 */
export function withLessonCode(body: string, code?: string): string {
  if (!code || !body.startsWith(TEMAT_PREFIX)) return body;
  const rest = body.slice(TEMAT_PREFIX.length);
  if (rest.startsWith(`${code}.`)) return body;
  return `${TEMAT_PREFIX}${code}. ${rest}`;
}

export function NoteSlideView({ slide, code }: { slide: Extract<Slide, { kind: 'note' }>; code?: string }) {
  const scale = useSlideFontScale();
  const body = withLessonCode(slide.body, code);
  // Notatka jest przepisywana z tablicy, wiec ma byc tak duza, jak sie da -
  // rozmiar dobieramy do dlugosci tresci (fitText.ts), w pikselach kartki 1280x720.
  const bodySize = fitFontSize(body, { width: 1120, height: 480, min: 28, max: 72, scale, lineHeight: 1.6 });

  if (slide.diagram === 'wypowiedzenia') {
    return (
      <div className="flex h-full flex-col bg-amber-50 px-16 py-10 text-amber-950" style={RULED_LINES_STYLE}>
        <div className="text-center">
          <h2 className="text-6xl font-bold">WYPOWIEDZENIA</h2>
        </div>

        <div className="relative mt-5 grid flex-1 grid-cols-2 gap-20 pt-10">
          <svg className="absolute left-0 top-0 h-20 w-full" viewBox="0 0 1000 100" aria-hidden="true">
            <defs>
              <marker id="note-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
              </marker>
            </defs>
            <path d="M500 0 V25 L250 88 M500 25 L750 88" fill="none" stroke="#d97706" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#note-arrow)" />
          </svg>

          <div className="flex flex-col items-center rounded-2xl bg-emerald-100 px-8 py-6 text-center">
            <h3 className="text-5xl font-bold text-emerald-900">ZDANIA</h3>
            <p className="mt-2 text-3xl font-semibold text-emerald-900">mają czasownik<br />w formie osobowej</p>
            <p className="mt-auto text-4xl"><span className="border-b-4 border-emerald-700 font-bold">Pracujemy</span> w ogrodzie.</p>
          </div>

          <div className="flex flex-col items-center rounded-2xl bg-orange-100 px-8 py-6 text-center">
            <h3 className="text-5xl font-bold text-orange-900">RÓWNOWAŻNIKI ZDAŃ</h3>
            <p className="mt-2 text-3xl font-semibold text-orange-900">nie mają czasownika<br />w formie osobowej</p>
            <p className="mt-auto text-4xl font-bold">Praca w ogrodzie.</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-8">
          <p className="flex items-center gap-3 text-3xl font-semibold text-gray-500">
            <ZeszytIcon className="h-10 w-10 text-amber-600" />
            Przerysuj do zeszytu
          </p>
          {slide.timerSec ? <StopwatchBar key={slide.id} timerSec={slide.timerSec} compact autoStart /> : null}
        </div>
      </div>
    );
  }

  if (slide.diagram === 'planRamowy') {
    return (
      <div className="flex h-full flex-col bg-amber-50 px-16 py-9 text-amber-950" style={RULED_LINES_STYLE}>
        <h2 className="text-center text-6xl font-bold text-gray-950">PLAN RAMOWY</h2>

        <div className="mt-7 flex items-center justify-center gap-5" aria-label="Najważniejsze wydarzenia ułożone chronologicznie">
          {['1. Pytanie pani', '2. Śmiech klasy', '3. Obrona kolegi'].map((item, index) => (
            <div key={item} className="contents">
              {index > 0 ? (
                <svg viewBox="0 0 64 36" className="h-9 w-16 shrink-0 text-sky-700" aria-hidden="true">
                  <path d="M4 18h48M40 6l12 12-12 12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
              <div className="flex h-28 w-72 items-center justify-center rounded-2xl bg-sky-100 px-5 text-center text-3xl font-bold text-sky-950">
                {item}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-4xl font-semibold text-sky-900">najważniejsze wydarzenia po kolei</p>

        <div className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-between rounded-2xl bg-orange-100 px-10 py-6 text-orange-950">
          <div>
            <p className="text-4xl font-bold">RÓWNOWAŻNIKI ZDAŃ</p>
            <p className="mt-2 text-3xl">bez czasownika w formie osobowej</p>
          </div>
          <p className="text-right text-3xl font-semibold">Pytanie pani.<br />Śmiech klasy.</p>
        </div>

        <div className="mt-auto flex items-center justify-center gap-8 pt-4">
          <p className="flex items-center gap-3 text-3xl font-semibold text-gray-600">
            <ZeszytIcon className="h-10 w-10 text-amber-600" />
            Przerysuj do zeszytu
          </p>
          {slide.timerSec ? <StopwatchBar key={slide.id} timerSec={slide.timerSec} compact autoStart /> : null}
        </div>
      </div>
    );
  }

  if (slide.diagram === 'formyCzasownika') {
    const formy = [
      { title: 'BEZOKOLICZNIK', examples: 'czytać · zrobić', color: 'bg-amber-100 text-amber-950' },
      { title: 'FORMY NA -NO, -TO', examples: 'czytano · zrobiono', color: 'bg-emerald-100 text-emerald-950' },
      { title: 'NIEOSOBOWE Z „SIĘ”', examples: 'mówi się · planuje się', color: 'bg-rose-100 text-rose-950' },
    ];
    return (
      <div className="flex h-full flex-col bg-amber-50 px-14 py-8 text-amber-950" style={RULED_LINES_STYLE}>
        <h2 className="text-center text-5xl font-bold text-gray-950">FORMY CZASOWNIKA</h2>

        <div className="mt-5 grid grid-cols-2 gap-8">
          <div className="rounded-2xl bg-indigo-100 px-7 py-5 text-center text-indigo-950">
            <h3 className="text-4xl font-bold">OSOBOWA</h3>
            <p className="mt-2 text-3xl">wiadomo, kto działa</p>
            <p className="mt-3 text-4xl font-bold"><span className="border-b-4 border-indigo-700">Uczniowie przygotowali</span> występ.</p>
          </div>
          <div className="rounded-2xl bg-orange-100 px-7 py-5 text-center text-orange-950">
            <h3 className="text-4xl font-bold">NIEOSOBOWA</h3>
            <p className="mt-2 text-3xl">forma nie wskazuje wykonawcy</p>
            <p className="mt-3 text-4xl font-bold"><span className="border-b-4 border-orange-700">Przygotowano</span> występ.</p>
          </div>
        </div>

        <svg className="mx-auto h-16 w-[78%] shrink-0 text-orange-600" viewBox="0 0 900 80" aria-hidden="true">
          <path d="M720 0v20M90 20H810M90 20v54M450 20v54M810 20v54" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="grid grid-cols-3 gap-6">
          {formy.map((forma) => (
            <div key={forma.title} className={`rounded-2xl px-5 py-4 text-center ${forma.color}`}>
              <h4 className="text-3xl font-bold">{forma.title}</h4>
              <p className="mt-2 text-3xl font-semibold">{forma.examples}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-2xl font-semibold text-rose-900">
          Uwaga: samo „się” nie wystarcza. „Ola się śmieje” ma wykonawcę.
        </p>

        <div className="mt-auto flex items-center justify-center gap-8 pt-4">
          <p className="flex items-center gap-3 text-3xl font-semibold text-gray-600">
            <ZeszytIcon className="h-10 w-10 text-amber-600" />
            Przerysuj do zeszytu
          </p>
          {slide.timerSec ? <StopwatchBar key={slide.id} timerSec={slide.timerSec} compact autoStart /> : null}
        </div>
      </div>
    );
  }

  if (slide.diagram === 'trybyCzasownika') {
    const tryby = [
      { title: 'OZNAJMUJĄCY', purpose: 'fakt · informacja', example: 'Czytam książkę.', color: 'bg-sky-100 text-sky-950' },
      { title: 'ROZKAZUJĄCY', purpose: 'polecenie · prośba', example: 'Przeczytaj książkę!', color: 'bg-orange-100 text-orange-950' },
      { title: 'PRZYPUSZCZAJĄCY', purpose: 'możliwość · pragnienie', example: 'Przeczytałbym książkę.', color: 'bg-rose-100 text-rose-950' },
    ];
    return (
      <div className="flex h-full flex-col bg-amber-50 px-14 py-9 text-amber-950" style={RULED_LINES_STYLE}>
        <h2 className="text-center text-6xl font-bold text-gray-950">TRYBY CZASOWNIKA</h2>
        <p className="mt-2 text-center text-3xl font-semibold text-gray-700">Ta sama czynność, inne nastawienie mówiącego</p>

        <div className="mt-8 grid flex-1 grid-cols-3 gap-7">
          {tryby.map((tryb) => (
            <div key={tryb.title} className={`flex flex-col rounded-2xl px-6 py-7 text-center ${tryb.color}`}>
              <h3 className="text-4xl font-bold">{tryb.title}</h3>
              <p className="mt-3 text-3xl font-semibold">{tryb.purpose}</p>
              <div className="my-5 h-1 rounded bg-current opacity-25" />
              <p className="mt-auto text-4xl font-bold leading-tight">{tryb.example}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-3xl font-bold text-rose-900">Przypuszczający rozpoznasz po cząstce -by-.</p>
        <div className="mt-3 flex items-center justify-center gap-8">
          <p className="flex items-center gap-3 text-3xl font-semibold text-gray-600">
            <ZeszytIcon className="h-10 w-10 text-amber-600" />
            Przerysuj do zeszytu
          </p>
          {slide.timerSec ? <StopwatchBar key={slide.id} timerSec={slide.timerSec} compact autoStart /> : null}
        </div>
      </div>
    );
  }

  return (
      <div className="flex h-full flex-col bg-amber-50 px-20 py-12 text-amber-950" style={RULED_LINES_STYLE}>
      <h2 className="mb-6 text-6xl font-bold text-gray-900">{slide.title || 'Notatka do zeszytu'}</h2>

      <RichText
        text={body}
        className="flex-1 space-y-[0.5em] leading-[1.6] text-gray-800"
        style={{ fontSize: bodySize }}
      />

      {/* Ta sama ikonka co plakietka "do zeszytu" na ciemnych slajdach - jedna umowa. */}
      <div className="mt-4 flex items-center justify-center gap-8">
        <p className="flex items-center gap-3 text-3xl font-semibold text-gray-500">
          <ZeszytIcon className="h-10 w-10 text-amber-600" />
          Przepisz do zeszytu
        </p>
        {slide.timerSec ? <StopwatchBar key={slide.id} timerSec={slide.timerSec} compact autoStart /> : null}
      </div>
    </div>
  );
}
