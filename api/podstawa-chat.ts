// Funkcja serverless Vercel: czat z podstawa programowa przez OpenRouter.
// Klucz API tylko po stronie serwera (env OPENROUTER_API_KEY) - nie trafia do bundla klienta.
// Ten sam endpoint w dev obsluguje middleware w vite.config.ts.

import { askPodstawaChat, parseChatMessages } from '../src/lib/podstawaChat';

// Minimalne typy req/res zgodne z runtime @vercel/node (bez zaleznosci od pakietu typow).
interface VercelRequestLike {
  method?: string;
  body?: unknown;
}
interface VercelResponseLike {
  status(code: number): VercelResponseLike;
  json(body: unknown): void;
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Tylko POST' });
    return;
  }
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Brak klucza OPENROUTER_API_KEY na serwerze' });
    return;
  }
  const messages = parseChatMessages(req.body);
  if (!messages) {
    res.status(400).json({ error: 'Nieprawidłowe wiadomości' });
    return;
  }
  try {
    const reply = await askPodstawaChat(apiKey, messages);
    res.status(200).json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Nieznany błąd';
    res.status(502).json({ error: msg });
  }
}
