// Pasek "Dziś: 1. V A · 2. IV B ..." na pulpicie - dzisiejsze lekcje z planu
// (zakladka "Plan"), z podswietlona trwajaca albo najblizsza lekcja i czasem
// do konca / do jej poczatku. W weekend i bez wpisow nic nie renderuje.
// To NIE sa lekcje z kolejki (te pokazuje TodaySection) - tu chodzi o plan
// dzwonkowy: "w ktorej klasie jestem o ktorej".

import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from '../../data/store';
import {
  currentOrNextEntry,
  entriesForDay,
  formatRemaining,
  parseHm,
  periodStatus,
  weekdayOf,
} from '../../lib/timetable';
import { classBadgeClasses } from '../calendar/classColor';
import { useNow } from '../timetable/useNow';

export function TodayTimetableBar() {
  const classes = useStore((s) => s.classes);
  const periods = useStore((s) => s.periods);
  const timetable = useStore((s) => s.timetable);
  const now = useNow(15_000);

  const weekday = weekdayOf(now);
  const entries = weekday === 0 ? [] : entriesForDay(timetable, weekday);
  if (entries.length === 0) return null;

  const highlighted = currentOrNextEntry(timetable, periods, now);
  const status = periodStatus(periods, now);
  const classById = new Map(classes.map((c) => [c.id, c]));

  // Dopisek przy podswietlonej lekcji: "do końca 12 min" gdy trwa, "za 5 min"
  // gdy dopiero bedzie; po ostatniej lekcji dnia - nic.
  let hint = '';
  if (highlighted) {
    if (status.kind === 'lesson' && status.period.no === highlighted.period) {
      hint = `do końca ${formatRemaining(status.remainingSec)}`;
    } else {
      const start = periods.find((p) => p.no === highlighted.period);
      const startMin = start ? parseHm(start.start) : NaN;
      if (!Number.isNaN(startMin)) {
        const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        hint = `za ${formatRemaining(startMin * 60 - nowSec)}`;
      }
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
      <span className="font-medium text-gray-500">Dziś:</span>
      {entries.map((e, i) => {
        const cls = e.classId ? classById.get(e.classId) : undefined;
        const isHighlighted = highlighted?.id === e.id;
        return (
          <span key={e.id} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">·</span>}
            <span
              className={clsx(
                'flex items-center gap-1 rounded-md px-1.5 py-0.5',
                isHighlighted && 'bg-accent-50 ring-1 ring-accent-300',
              )}
            >
              <span className="tabular-nums text-gray-500">{e.period}.</span>
              <span
                className={clsx(
                  'rounded border px-1.5 py-0.5 text-xs font-medium',
                  cls ? classBadgeClasses(cls.order) : 'border-gray-200 text-gray-400',
                )}
              >
                {cls?.name ?? '?'}
              </span>
              {isHighlighted && hint && <span className="text-xs text-accent-700">{hint}</span>}
            </span>
          </span>
        );
      })}
      <Link to="/plan" className="ml-auto text-xs text-gray-400 hover:text-accent-700 hover:underline">
        Plan
      </Link>
    </div>
  );
}
