// Wspolna logika czatu z podstawa programowa: budowa system promptu
// (pelna podstawa IV-VI + lista lektur) i wywolanie OpenRouter.
// Uzywane przez funkcje serverless (api/podstawa-chat.ts) i dev middleware (vite.config.ts).

import { PODSTAWA_SEKCJE, PODSTAWA_ZRODLO } from '../data/podstawaTekst';
import {
  LEKTURY_OBOWIAZKOWE,
  LEKTURY_KROTKIE,
  LEKTURY_KROTKIE_PRZYPIS,
  LEKTURY_UZUPELNIAJACE,
  LEKTURY_UZUPELNIAJACE_ZASADA,
  Lektura,
} from '../data/lektury';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const OPENROUTER_MODEL = 'google/gemini-2.5-flash-lite';

function lekturyToText(lista: Lektura[]): string {
  return lista.map((l) => `- ${l.autor ? `${l.autor}, ` : ''}${l.tytul}`).join('\n');
}

function podstawaToText(): string {
  const parts: string[] = [];
  for (const sekcja of PODSTAWA_SEKCJE) {
    parts.push(`## ${sekcja.tytul}`);
    if (sekcja.opis) parts.push(sekcja.opis);
    for (const dzial of sekcja.dzialy) {
      parts.push(`### ${dzial.tytul}`);
      if (dzial.wstep) parts.push(dzial.wstep);
      parts.push(dzial.punkty.map((p) => `${p.kod}) ${p.tekst}`).join('\n'));
    }
  }
  return parts.join('\n');
}

export function buildSystemPrompt(): string {
  return [
    'Jesteś asystentem nauczyciela języka polskiego w szkole podstawowej (klasy 4 i 5).',
    'Odpowiadasz na pytania o podstawę programową języka polskiego dla klas IV-VI oraz o listę lektur.',
    'Odpowiadaj krótko i konkretnie, po polsku. Gdy przywołujesz wymaganie, podawaj jego kod (np. I.1.3).',
    'Jeśli pytanie wykracza poza podstawę programową i lektury, powiedz to wprost.',
    '',
    `Źródło: ${PODSTAWA_ZRODLO}`,
    '',
    '# Podstawa programowa języka polskiego, klasy IV-VI',
    podstawaToText(),
    '',
    '# Lektury (klasy IV-VI)',
    '## Lektury obowiązkowe (pozycje książkowe poznawane w całości)',
    lekturyToText(LEKTURY_OBOWIAZKOWE),
    '## Krótkie utwory poznawane w całości, utwory poznawane we fragmentach i utwory poetyckie',
    lekturyToText(LEKTURY_KROTKIE),
    `Przypis: ${LEKTURY_KROTKIE_PRZYPIS}`,
    '## Przykładowe lektury uzupełniające (od 2024 r. wspólna lista dla klas IV-VIII)',
    lekturyToText(LEKTURY_UZUPELNIAJACE),
    LEKTURY_UZUPELNIAJACE_ZASADA,
  ].join('\n');
}

// Woła OpenRouter i zwraca tekst odpowiedzi. Rzuca Error z czytelnym komunikatem.
export async function askPodstawaChat(apiKey: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenRouter: HTTP ${res.status} ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter: pusta odpowiedź modelu');
  return content;
}

// Walidacja wiadomosci z requestu POST.
export function parseChatMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== 'object') return null;
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) return null;
  const out: ChatMessage[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string' || !content.trim() || content.length > 4000) return null;
    out.push({ role, content });
  }
  return out;
}
