// Zakladka "Plan": tygodniowy plan nauczyciela (siatka godziny x dni) i lista
// dzwonkow pod spodem. Plan karmi pulpit ("dziś: ...") i zegar na projektorze.

import { useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { TimetableGrid, type EditingCell } from '../components/timetable/TimetableGrid';
import { PeriodsEditor } from '../components/timetable/PeriodsEditor';
import { useNow } from '../components/timetable/useNow';
import type { TimetableEntry } from '../data/types';

/** Najczestsza sala w planie - podpowiedz dla nowych komorek ("" gdy plan pusty). */
export function mostCommonRoom(timetable: TimetableEntry[]): string {
  const counts = new Map<string, number>();
  for (const e of timetable) {
    if (e.room) counts.set(e.room, (counts.get(e.room) ?? 0) + 1);
  }
  let best = '';
  let bestCount = 0;
  for (const [room, count] of counts) {
    if (count > bestCount) {
      best = room;
      bestCount = count;
    }
  }
  return best;
}

export function Timetable() {
  const classes = useStore((s) => s.classes);
  const periods = useStore((s) => s.periods);
  const timetable = useStore((s) => s.timetable);
  const setPeriods = useStore((s) => s.setPeriods);
  const setTimetableEntry = useStore((s) => s.setTimetableEntry);
  const [editing, setEditing] = useState<EditingCell | null>(null);
  // Co 30 s wystarczy: podswietlenie "trwa teraz" zmienia sie co kilkadziesiat minut.
  const now = useNow(30_000);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const defaultRoom = useMemo(() => mostCommonRoom(timetable), [timetable]);

  return (
    <div>
      <PageHeader
        title="Plan lekcji"
        description="Kliknij komórkę, żeby ustawić klasę i salę. Dzisiejszy dzień jest podświetlony."
      />
      <TimetableGrid
        periods={periods}
        timetable={timetable}
        classes={sortedClasses}
        now={now}
        editing={editing}
        defaultRoom={defaultRoom}
        onEdit={setEditing}
        onSave={(cell, classId, room) => setTimetableEntry({ ...cell, classId, room })}
      />
      <PeriodsEditor periods={periods} onChange={setPeriods} />
    </div>
  );
}
