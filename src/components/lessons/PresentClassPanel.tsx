// Plywajaca zakladka "Klasa" na ekranie prezentacji (LessonPresent) - dyskretny
// uchwyt przy prawej krawedzi, ktory rozwija liste uczniow klasy z liczba uwag
// w tym miesiacu i przyciskiem szybkiego dodania uwagi, bez wychodzenia z
// prezentacji i bez modala. Nie pokazujemy go na slajdzie recap - tam jest juz
// pelna sesja kola z wlasna lista uczniow (StudentSidebar).
//
// Stan otwarcia panelu siedzi w rodzicu (LessonPresent), bo klawisz Esc musi
// najpierw zamykac ten panel, a dopiero potem (gdy panel juz zamkniety) dzialac
// jak zwykle - wyjscie z prezentacji.

import { useState } from 'react';
import { useStore } from '../../data/store';
import { warningsThisMonth } from '../../lib/recap';

/** Polska liczba mnoga "uwaga/uwagi/uwag" do badge'a przy uczniu. */
function warningsWord(n: number): string {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return 'uwaga';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'uwagi';
  return 'uwag';
}

export function PresentClassPanel({
  classId,
  open,
  onOpenChange,
}: {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const students = useStore((s) => s.students);
  const recapEvents = useStore((s) => s.recapEvents);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const [flashId, setFlashId] = useState<string | null>(null);

  const classStudents = students
    .filter((st) => st.classId === classId && st.active)
    .sort((a, b) => a.number - b.number);

  function handleWarn(studentId: string) {
    addRecapEvent({ studentId, classId, result: 'uwaga' });
    // Krotki flash zamiast modala - nauczyciel widzi, ze klikniecie "wzielo".
    setFlashId(studentId);
    window.setTimeout(() => setFlashId((id) => (id === studentId ? null : id)), 500);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={open ? 'Zamknij panel klasy' : 'Otwórz panel klasy'}
        aria-expanded={open}
        className="fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-md bg-gray-800/60 px-1.5 py-4 text-[11px] tracking-wide text-gray-300 hover:bg-gray-800/90"
        style={{ writingMode: 'vertical-rl' }}
      >
        Klasa
      </button>

      {open && (
        <div className="fixed right-0 top-0 z-30 flex h-full w-72 flex-col border-l border-gray-700 bg-gray-900/95 text-gray-200 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
            <span className="text-sm font-medium">Uwagi - klasa</span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Zamknij panel klasy"
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {classStudents.length === 0 ? (
              <p className="p-3 text-xs text-gray-500">Ta klasa nie ma jeszcze uczniów.</p>
            ) : (
              classStudents.map((st) => {
                const count = warningsThisMonth(recapEvents, st.id, new Date());
                const flashing = flashId === st.id;
                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 border-b border-gray-800 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm">
                        {st.number}. {st.lastName} {st.firstName}
                      </div>
                      {count > 0 && (
                        <div className={`text-xs ${flashing ? 'text-amber-300' : 'text-gray-400'}`}>
                          {count} {warningsWord(count)}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWarn(st.id)}
                      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        flashing ? 'bg-amber-500 text-gray-900' : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                      }`}
                    >
                      Uwaga
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
