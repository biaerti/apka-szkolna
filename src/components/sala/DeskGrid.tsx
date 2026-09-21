// Siatka lawek w widoku Sala, ulozona z perspektywy nauczyciela: TABLICA na
// dole (za plecami), rzad 1 tuz nad nia, dalsze rzedy wyzej, a kolumna P po
// prawej rece. Dane zostaja w kolejnosci od tablicy (rzad 1 pierwszy) - tu
// odwracamy tylko wyswietlanie.
//
// Kazda lawka to kafelek z etykieta ("P1") i dwoma miejscami OBOK SIEBIE, bo
// tak siedza uczniowie w lawce. Miejsce ma przez to ok. 55 px, wiec mieszcza
// sie w nim samo imie (deskName) i dzisiejsze symbole pod spodem - za to
// szesc rzedow wchodzi na jeden ekran telefonu (najwyzej z lekkim przewijaniem).
//
// TABLICA jest sticky przy dolnej krawedzi: gdy rzedy jednak sie nie mieszcza,
// zostaje w polu widzenia jako punkt odniesienia, a przewijanie w gore
// odslania dalsze lawki.
//
// Ten sam komponent obsluguje zwykly widok (tap = akcje dla ucznia) i tryb
// "Rozsadz" (tap = zaznaczenie miejsca), rozni sie tylko tym, co robi tap
// i czy puste miejsca sa klikalne.

import clsx from 'clsx';
import type { RecapEvent, Student } from '../../data/types';
import type { Desk, SeatPosition } from '../../lib/seating';
import { deskName, samePosition } from '../../lib/seating';
import { resultSymbol } from '../../lib/resultSymbol';

export interface DeskGridProps {
  grid: Desk[][];
  classmates: Student[];
  /** Dzisiejsze zdarzenia po uczniu - male symbole przy nazwisku. */
  todayByStudent: Map<string, RecapEvent[]>;
  /** Wiszace ostrzezenia - osobno, bo nie sa zdarzeniem jednego dnia. Uczen moze miec kilka. */
  ostrzezenia: Map<string, RecapEvent[]>;
  editing: boolean;
  selectedPos?: SeatPosition;
  /** Uczen podswietlony po zapisie (krotki flash "wzielo"). */
  flashStudentId?: string | null;
  onTapPlace: (pos: SeatPosition, student?: Student) => void;
}

export function DeskGrid({
  grid,
  classmates,
  todayByStudent,
  ostrzezenia,
  editing,
  selectedPos,
  flashStudentId,
  onTapPlace,
}: DeskGridProps) {
  return (
    <div>
      <div className="mb-1 grid grid-cols-3 gap-2 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
        <span>Lewa</span>
        <span>Środek</span>
        <span>Prawa</span>
      </div>
      <div className="space-y-2">
        {[...grid].reverse().map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-3 gap-2">
            {row.map((desk) => (
              <div key={desk.label} className="rounded-lg border border-gray-200 bg-white p-0.5">
                <div className="px-1 text-[10px] font-semibold leading-tight tabular-nums text-gray-400">{desk.label}</div>
                <div className="grid grid-cols-2 gap-1">
                  {desk.places.map((place) => {
                    const pos: SeatPosition = { column: desk.column, row: desk.row, side: place.side };
                    const selected = selectedPos ? samePosition(selectedPos, pos) : false;
                    const student = place.student;
                    const events = student ? todayByStudent.get(student.id) ?? [] : [];
                    const disabled = !editing && !student;
                    const podpis = student ? deskName(student, classmates) : ' ';
                    const ileOstrzezen = student ? ostrzezenia.get(student.id)?.length ?? 0 : 0;
                    return (
                      <button
                        key={place.side}
                        type="button"
                        disabled={disabled}
                        onClick={() => onTapPlace(pos, student)}
                        aria-label={student ? `${student.lastName} ${student.firstName}, ${desk.label}` : `Wolne miejsce ${desk.label}`}
                        aria-pressed={editing ? selected : undefined}
                        className={clsx(
                          'flex min-h-[2.75rem] w-full flex-col justify-center gap-0.5 rounded-md px-0.5 py-1 text-left leading-tight',
                          // Miejsce ma ok. 50 px, wiec zamiast przycinac imie schodzimy
                          // o stopien nizej z pismem - "Maksymilian" ma byc caly.
                          podpisRozmiar(podpis),
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                          student ? 'bg-gray-100 text-gray-900 active:bg-accent-100' : 'border border-dashed border-gray-300 text-gray-300',
                          editing && !student && 'active:bg-accent-50',
                          selected && 'ring-2 ring-accent-500 bg-accent-50',
                          flashStudentId && student?.id === flashStudentId && 'bg-emerald-100',
                        )}
                      >
                        <span className="w-full truncate font-medium">{podpis}</span>
                        {(ileOstrzezen > 0 || events.length > 0) && (
                          <span className="flex w-full items-center gap-0.5">
                            {ileOstrzezen > 0 && (
                              <span title="ostrzeżenie" className="text-xs font-black text-amber-600">
                                {resultSymbol('ostrzezenie').symbol}
                                {ileOstrzezen > 1 && ileOstrzezen}
                              </span>
                            )}
                            {events.length > 0 && <TodayMarks events={events} />}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 mt-3 rounded bg-gray-800 py-1 text-center text-xs font-semibold uppercase tracking-widest text-gray-200 shadow-[0_-6px_10px_-6px_rgba(0,0,0,0.25)]">
        Tablica
      </div>
    </div>
  );
}

/**
 * Klasa Tailwind z wielkoscia pisma dobrana do dlugosci imienia. Progi wyszly z
 * pomiaru szerokosci tekstu w miejscu (ok. 50 px): "Mateusz" miesci sie w 12 px,
 * "Aleksandra" dopiero w 10 px, a "Maksymilian" w 9 px z ciasniejszym odstepem.
 */
function podpisRozmiar(podpis: string): string {
  if (podpis.length <= 7) return 'text-xs';
  if (podpis.length === 8) return 'text-[11px]';
  if (podpis.length <= 10) return 'text-[10px]';
  return 'text-[9px] tracking-tight';
}

/** Dzisiejsze wyniki ucznia jako ciag symboli ("+ + ▣"), uwaga jako "!". */
export function TodayMarks({ events }: { events: RecapEvent[] }) {
  return (
    <span className="flex shrink-0 gap-0.5 text-xs font-black">
      {events.map((e) => {
        const sym = resultSymbol(e.result);
        return (
          <span
            key={e.id}
            title={sym.label}
            className={clsx(
              e.result === 'plus' && 'text-emerald-600',
              e.result === 'kropka' && 'text-sky-600',
              (e.result === 'plomba' || e.result === 'hint_plomba') && 'text-red-600',
              e.result === 'uwaga' && 'text-orange-600',
              e.result === 'pass' && 'text-amber-600',
            )}
          >
            {sym.symbol}
          </span>
        );
      })}
    </span>
  );
}
