import { useEffect, useRef } from 'react';
import { useStore } from '../../data/store';
import { toDateKey } from '../../lib/dates';
import {
  buildFrekwencjaTransfer,
  checkRoster,
  rosterSummary,
  type FrekwencjaJob,
  type RosterRow,
} from '../../lib/vulcanFrekwencja';
import {
  claimFrekwencjaJob,
  fetchFrekwencjaJobs,
  finishFrekwencjaJob,
  subscribeFrekwencjaJobs,
} from '../../data/remote/frekwencjaJobs';

const APP_SOURCE = 'apka-szkolna';
const HELPER_SOURCE = 'vulcan-pomocnik';
const POLL_MS = 15000;
/** Tyle czekamy na odpowiedz dodatku po wyslaniu paczki (tworzenie lekcji + klikanie). */
const JOB_TIMEOUT_MS = 3 * 60 * 1000;

/**
 * Komputer z dodatkiem Chrome podejmuje frekwencje sprawdzona na telefonie.
 * Montowane raz (AutoVulcanUwaga w App.tsx), wiec dziala tez w prezentacji.
 *
 * Zlecenie bierze tylko karta, w ktorej odpowiada most dodatku - plywajacy
 * panel i telefon nie maja dodatku i nie przejma zlecenia, ktorego nie
 * wykonaja. Wynik (i lista klasy z VULCANA) wraca VULCAN_FREKWENCJA_RESULT.
 */
export function useAutoVulcanFrekwencja(): void {
  const bridgeReady = useRef(false);
  const busy = useRef<string | null>(null);

  useEffect(() => {
    let stopped = false;
    let timeout: number | undefined;

    function onMessage(event: MessageEvent) {
      if (event.source !== window || !event.data || event.data.source !== HELPER_SOURCE) return;
      if (event.data.type === 'VULCAN_BRIDGE_READY') {
        if (!bridgeReady.current) {
          bridgeReady.current = true;
          void check();
        }
        return;
      }
      if (event.data.type === 'VULCAN_FREKWENCJA_RESULT') void onResult(event.data.detail);
    }

    async function onResult(detail: { jobId?: string; ok?: boolean; message?: string; roster?: RosterRow[] } | undefined) {
      const jobId = detail?.jobId;
      if (!jobId) return;
      if (busy.current === jobId) {
        busy.current = null;
        window.clearTimeout(timeout);
      }
      let rosterNote = '';
      const job = (await fetchFrekwencjaJobs(toDateKey(new Date())).catch(() => [])).find((j) => j.id === jobId);
      if (job && Array.isArray(detail?.roster) && detail.roster.length > 0) {
        const state = useStore.getState();
        const classmates = state.students.filter((st) => st.classId === job.classId);
        const roster = checkRoster(detail.roster, classmates);
        // Numery z dziennika bierzemy z VULCANA - to on jest zrodlem prawdy.
        for (const fix of roster.numberFixes) state.updateStudent(fix.studentId, { number: fix.to });
        rosterNote = rosterSummary(roster);
      }
      const base = detail?.ok ? 'Zapisane w VULCANIE.' : `Nie udało się: ${detail?.message || 'brak szczegółów'}`;
      await finishFrekwencjaJob(jobId, detail?.ok ? 'done' : 'error', rosterNote ? `${base} Lista: ${rosterNote}.` : base).catch(() => {});
      void check();
    }

    async function run(job: FrekwencjaJob) {
      const state = useStore.getState();
      const schoolClass = state.classes.find((c) => c.id === job.classId);
      if (!schoolClass) {
        await finishFrekwencjaJob(job.id, 'error', 'Nie znam tej klasy na komputerze.').catch(() => {});
        return;
      }
      if (!(await claimFrekwencjaJob(job.id, job.createdAt))) return;
      busy.current = job.id;
      const transfer = buildFrekwencjaTransfer(job, schoolClass, state.students);
      window.postMessage({ source: APP_SOURCE, type: 'VULCAN_FREKWENCJA', payload: transfer }, '*');
      timeout = window.setTimeout(() => {
        if (busy.current !== job.id) return;
        busy.current = null;
        void finishFrekwencjaJob(job.id, 'error', 'Pomocnik VULCAN nie odpowiedział w 3 minuty - sprawdź kartę VULCANA na komputerze.');
      }, JOB_TIMEOUT_MS);
    }

    async function check() {
      if (stopped || !bridgeReady.current || busy.current) return;
      let jobs: FrekwencjaJob[];
      try {
        jobs = await fetchFrekwencjaJobs(toDateKey(new Date()));
      } catch {
        return;
      }
      const next = jobs.filter((j) => j.status === 'pending').sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
      if (next) await run(next);
    }

    window.addEventListener('message', onMessage);
    window.postMessage({ source: APP_SOURCE, type: 'VULCAN_BRIDGE_PING' }, '*');
    const poll = window.setInterval(() => void check(), POLL_MS);
    const unsubscribe = subscribeFrekwencjaJobs(() => void check());
    return () => {
      stopped = true;
      window.removeEventListener('message', onMessage);
      window.clearInterval(poll);
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, []);
}
