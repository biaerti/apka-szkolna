// Kolejka "tematy do VULCANA" na pulpicie: po jednej lekcji naraz, zeby przy
// kazdej bylo widac, czy czeka, czy wlasnie sie dodaje. Wynik przychodzi od
// dodatku jako VULCAN_FREKWENCJA_RESULT z jobId "vt-..." (src/lib/vulcanTemat.ts).

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buildTopicTransfer,
  loadSentTopics,
  saveSentTopics,
  topicKey,
  type TopicItem,
  type TopicSendState,
} from '../../lib/vulcanTemat';

const APP = 'apka-szkolna';
const HELPER = 'vulcan-pomocnik';
/** Otwarcie godziny w drzewie + utworzenie lekcji trwa kilkanascie sekund, w tle dluzej. */
const JOB_TIMEOUT_MS = 2 * 60 * 1000;

interface ResultDetail {
  jobId?: string;
  ok?: boolean;
  existed?: boolean;
  message?: string;
}

function pingBridge(timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    function finish(ok: boolean) {
      window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      resolve(ok);
    }
    function onMessage(event: MessageEvent) {
      if (event.source === window && event.data?.source === HELPER && event.data.type === 'VULCAN_BRIDGE_READY') finish(true);
    }
    window.addEventListener('message', onMessage);
    window.postMessage({ source: APP, type: 'VULCAN_BRIDGE_PING' }, '*');
  });
}

function waitForResult(jobId: string): Promise<ResultDetail> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => finish({ ok: false, message: 'Pomocnik VULCAN nie odpowiedział w 2 minuty - zajrzyj do karty VULCANA.' }), JOB_TIMEOUT_MS);
    function finish(detail: ResultDetail) {
      window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      resolve(detail);
    }
    function onMessage(event: MessageEvent) {
      if (event.source !== window || event.data?.source !== HELPER || event.data.type !== 'VULCAN_FREKWENCJA_RESULT') return;
      if (event.data.detail?.jobId === jobId) finish(event.data.detail);
    }
    window.addEventListener('message', onMessage);
  });
}

export function useVulcanTopics() {
  const [states, setStates] = useState<Record<string, TopicSendState>>(() => loadSentTopics());
  const queue = useRef<TopicItem[]>([]);
  const running = useRef(false);
  const current = useRef<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const update = useCallback((key: string, state: TopicSendState) => {
    if (!alive.current) return;
    setStates((prev) => {
      const next = { ...prev, [key]: state };
      saveSentTopics(next);
      return next;
    });
  }, []);

  const drain = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      while (queue.current.length > 0) {
        const item = queue.current.shift()!;
        const key = topicKey(item);
        const topic = item.topic.trim();
        if (!(await pingBridge())) {
          // Bez dodatku nic z kolejki nie pojdzie - oznacz wszystko naraz.
          for (const rest of [item, ...queue.current.splice(0)]) {
            update(topicKey(rest), { status: 'error', topic: rest.topic.trim(), message: 'Nie widzę dodatku „pomocnik VULCAN”. Jeśli był właśnie odświeżany, odśwież tę kartę (F5) i kartę VULCANA.' });
          }
          return;
        }
        current.current = key;
        update(key, { status: 'sending', topic });
        const transfer = buildTopicTransfer(item);
        const result = waitForResult(transfer.jobId);
        window.postMessage({ source: APP, type: 'VULCAN_FREKWENCJA', payload: transfer }, '*');
        const detail = await result;
        update(key, detail.ok
          ? { status: detail.existed ? 'exists' : 'done', topic, ...(detail.message ? { message: detail.message } : {}) }
          : { status: 'error', topic, message: detail.message || 'Nie udało się.' });
      }
    } finally {
      current.current = null;
      running.current = false;
    }
  }, [update]);

  const send = useCallback((items: TopicItem[]) => {
    const fresh = items.filter((item) => item.topic.trim() && topicKey(item) !== current.current && !queue.current.some((queued) => topicKey(queued) === topicKey(item)));
    if (fresh.length === 0) return;
    queue.current.push(...fresh);
    setStates((prev) => {
      const next = { ...prev };
      for (const item of fresh) next[topicKey(item)] = { status: 'queued', topic: item.topic.trim() };
      return next;
    });
    void drain();
  }, [drain]);

  return { states, send };
}

export type VulcanTopics = ReturnType<typeof useVulcanTopics>;
