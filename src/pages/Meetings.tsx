// Zebrania z rodzicami - lista kafelkow. Jeden kafelek = jedno zebranie,
// klikniecie otwiera skrypt (Zebranie.tsx). Kolejnosc: najblizsze/najnowsze
// zebranie na gorze, bo do niego nauczyciel wraca najczesciej.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../data/store';
import type { Meeting } from '../data/types';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatMeetingDate, meetingSummary } from '../lib/meeting';
import { todayKey } from '../lib/grade';

export function Meetings() {
  const navigate = useNavigate();
  const meetings = useStore((s) => s.meetings);
  const addMeeting = useStore((s) => s.addMeeting);
  const [creating, setCreating] = useState(false);

  const sorted = useMemo(
    () => [...meetings].sort((a, b) => b.date.localeCompare(a.date) || b.order - a.order),
    [meetings],
  );

  function createMeeting() {
    setCreating(true);
    const created = addMeeting({ title: 'Zebranie', date: todayKey(), time: '17:30', place: '', script: '' });
    setCreating(false);
    navigate(`/zebrania/${created.id}`);
  }

  return (
    <div>
      <PageHeader
        title="Zebrania"
        description="Skrypt zebrania z rodzicami - punkty do omówienia, do czytania i edytowania na miejscu."
        actions={
          <Button onClick={createMeeting} disabled={creating}>
            Nowe zebranie
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="Brak zebrań"
          description="Dodaj zebranie i wpisz punkty, które chcesz omówić z rodzicami."
          action={<Button onClick={createMeeting}>Nowe zebranie</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((meeting) => (
            <MeetingTile key={meeting.id} meeting={meeting} onOpen={() => navigate(`/zebrania/${meeting.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingTile({ meeting, onOpen }: { meeting: Meeting; onOpen: () => void }) {
  const summary = meetingSummary(meeting.script);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-accent-300 hover:bg-accent-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
    >
      <p className="text-base font-semibold text-gray-900">{meeting.title}</p>
      <p className="mt-1 text-sm text-accent-700">
        {formatMeetingDate(meeting.date)}, godz. {meeting.time}
        {meeting.place ? ` - ${meeting.place}` : ''}
      </p>
      {summary.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-gray-500">
          {summary.map((point, i) => (
            <li key={i} className="truncate">
              {point}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-gray-400">Pusty skrypt - kliknij, żeby wpisać punkty.</p>
      )}
    </button>
  );
}
