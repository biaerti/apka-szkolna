// Popup na komputerze: "Uwaga: Kowalski Jan (IV A) - Przeszkadza na lekcji",
// gdy uwaga przyszla z telefonu (patrz useIncomingUwagi). Prawy dolny rog,
// jedna uwaga naraz (kolejne czekaja w kolejce), znika sama po minucie -
// i tak zostaje w zakladce Uwagi do wpisania po lekcjach.
//
// Przyciski: "Wpisz do VULCANA" (dodatek Chrome otwiera formularz uwagi i
// zatrzymuje sie przed zapisem - useVulcanUwaga), "Później" (zostaw w
// Uwagach), "Cofnij" (pomylka na telefonie - zdarzenie znika).
//
// Montowany w AppShell i w rozwinietym panelu desktopowym. CELOWO nie na
// ekranach projektora (prezentacja, kartkowka, kolo) - klasa nie ma widziec,
// komu wlasnie wpisano uwage.

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../data/store';
import { uwagaLabel } from '../../lib/uwagi';
import { useIncomingUwagi } from './useIncomingUwagi';
import { useVulcanUwaga, VULCAN_STATE_LABEL } from './useVulcanUwaga';

const AUTO_HIDE_MS = 60_000;

export function IncomingUwagaToast({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { pending, dismiss } = useIncomingUwagi();
  const students = useStore((s) => s.students);
  const classes = useStore((s) => s.classes);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);
  const vulcan = useVulcanUwaga();

  const current = pending[0];
  const studentById = useMemo(() => new Map(students.map((st) => [st.id, st])), [students]);
  const classById = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);

  useEffect(() => {
    if (!current) return;
    vulcan.reset();
    const t = window.setTimeout(() => dismiss(current.id), AUTO_HIDE_MS);
    return () => window.clearTimeout(t);
    // dismiss jest stabilne w praktyce (setState), a zalezy nam na id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  if (!current) return null;
  const student = studentById.get(current.studentId);
  const cls = classById.get(current.classId);
  const dark = tone === 'dark';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border p-4 shadow-2xl ${
        dark ? 'border-orange-500/60 bg-gray-900 text-gray-100' : 'border-orange-300 bg-white text-gray-900'
      }`}
    >
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
        <span aria-hidden>!</span> Uwaga z telefonu
        {pending.length > 1 && <span className={dark ? 'text-gray-400' : 'text-gray-400'}>+{pending.length - 1}</span>}
      </div>
      <p className="text-base font-semibold leading-tight">
        {student ? `${student.lastName} ${student.firstName}` : 'Uczeń usunięty'}
        {cls && <span className={`ml-1.5 text-sm font-normal ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{cls.name}</span>}
      </p>
      <p className={`mt-0.5 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{uwagaLabel(current)}</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => void vulcan.send(current)}
          disabled={vulcan.state === 'sending' || vulcan.state === 'sent'}
          className="rounded-md bg-accent-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-60"
        >
          Wpisz do VULCANA
        </button>
        <button
          type="button"
          onClick={() => dismiss(current.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Później
        </button>
        <button
          type="button"
          onClick={() => {
            removeRecapEvent(current.id);
            dismiss(current.id);
          }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Cofnij
        </button>
        <Link to="/uwagi" className={`ml-auto text-xs ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'} hover:underline`}>
          Uwagi
        </Link>
      </div>
      {vulcan.state !== 'idle' && (
        <p className={`mt-2 text-xs ${vulcan.state === 'sent' ? 'text-emerald-600' : vulcan.state === 'sending' ? (dark ? 'text-gray-400' : 'text-gray-500') : 'text-red-600'}`}>
          {VULCAN_STATE_LABEL[vulcan.state]}
        </p>
      )}
    </div>
  );
}
