// Jedno zebranie: skrypt do czytania na miejscu i - po przelaczeniu na
// "Edytuj" - to samo pole jako zwykly tekst do poprawiania. Zapis idzie do
// store od razu przy pisaniu (bez przycisku "Zapisz"), tak jak w edytorze lekcji.

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { RichText } from '../components/slides/RichText';
import { formatMeetingDate } from '../lib/meeting';

export function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const meetings = useStore((s) => s.meetings);
  const updateMeeting = useStore((s) => s.updateMeeting);
  const removeMeeting = useStore((s) => s.removeMeeting);

  const [editing, setEditing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const meeting = meetings.find((m) => m.id === id);

  if (!meeting) {
    return (
      <EmptyState
        title="Nie znaleziono zebrania"
        description="To zebranie mogło zostać usunięte."
        action={
          <Button variant="secondary" onClick={() => navigate('/zebrania')}>
            Wróć do listy zebrań
          </Button>
        }
      />
    );
  }

  function patch(changes: Parameters<typeof updateMeeting>[1]) {
    if (meeting) updateMeeting(meeting.id, changes);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate('/zebrania')}
        className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        &larr; Zebrania
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{meeting.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatMeetingDate(meeting.date)}, godz. {meeting.time}
            {meeting.place ? ` - ${meeting.place}` : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant={editing ? 'primary' : 'secondary'} onClick={() => setEditing((v) => !v)}>
            {editing ? 'Gotowe' : 'Edytuj'}
          </Button>
          {editing && (
            <Button variant="danger" onClick={() => setConfirmRemove(true)}>
              Usuń
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Nazwa</span>
              <Input value={meeting.title} onChange={(e) => patch({ title: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Miejsce</span>
              <Input
                value={meeting.place ?? ''}
                placeholder="np. sala 24"
                onChange={(e) => patch({ place: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Data</span>
              <Input type="date" value={meeting.date} onChange={(e) => patch({ date: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Godzina</span>
              <Input type="time" value={meeting.time} onChange={(e) => patch({ time: e.target.value })} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Skrypt zebrania</span>
            <Textarea
              value={meeting.script}
              onChange={(e) => patch({ script: e.target.value })}
              rows={28}
              className="font-mono leading-relaxed"
            />
            <span className="mt-1 block text-xs text-gray-400">
              Sekcja: "## Tytuł" w nowej linii. Punkt: "- treść". Pogrubienie: **tekst**.
            </span>
          </label>
        </div>
      ) : meeting.script.trim() === '' ? (
        <EmptyState
          title="Pusty skrypt"
          description="Kliknij „Edytuj” i wpisz punkty, które chcesz omówić z rodzicami."
          action={<Button onClick={() => setEditing(true)}>Edytuj</Button>}
        />
      ) : (
        <RichText
          text={meeting.script}
          className="rounded-lg border border-gray-200 bg-white px-6 py-5 text-base leading-relaxed text-gray-800 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:text-gray-900 [&_h2:first-child]:mt-0 [&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:text-base [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3"
        />
      )}

      <ConfirmDialog
        open={confirmRemove}
        title="Usunąć zebranie?"
        message={`Skrypt zebrania „${meeting.title}” zniknie bezpowrotnie.`}
        confirmLabel="Usuń"
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => {
          removeMeeting(meeting.id);
          navigate('/zebrania');
        }}
      />
    </div>
  );
}
