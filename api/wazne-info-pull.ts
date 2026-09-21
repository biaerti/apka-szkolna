// Funkcja serverless Vercel: sprawdza skrzynke szkola@klippi.pl i dopisuje
// nowe punkty do tabeli wazne_info (zakladka "Ważne info"). Hasla do skrzynki,
// klucz OpenRouter i service role Supabase tylko po stronie serwera.
// Ten sam endpoint w dev obsluguje middleware w vite.config.ts.
//
// Importy z rozszerzeniem .js: Vercel kompiluje TS do ESM bez przepisywania
// sciezek, a Node w ESM nie doklada rozszerzen - bez .js funkcja pada na
// ERR_MODULE_NOT_FOUND. Vite i vitest rozumieja .js -> .ts.

import { handlePullRequest } from '../src/lib/wazneInfoMail.js';

interface VercelRequestLike {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}
interface VercelResponseLike {
  status(code: number): VercelResponseLike;
  json(body: unknown): void;
}

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Tylko POST' });
    return;
  }
  const auth = req.headers.authorization;
  const { status, body } = await handlePullRequest(Array.isArray(auth) ? auth[0] : auth, process.env);
  res.status(status).json(body);
}
