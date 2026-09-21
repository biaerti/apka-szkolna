// Wazne info: odczyt skrzynki szkola@klippi.pl (IMAP, lh.pl) i przerobienie
// nowych maili na punkty dla rodzicow. TYLKO Node - uzywane przez funkcje
// serverless api/wazne-info-pull.ts i dev middleware w vite.config.ts.
//
// Przebieg: lista maili w INBOX -> odrzuc te, ktore juz sa w wazne_info_maile
// -> dla kazdego nowego: sparsuj tresc, zapytaj model (OpenRouter), wstaw punkty
// do wazne_info, zapisz mail jako przerobiony. Maile zostaja na serwerze
// (nic nie kasujemy), pamiec "co juz bylo" siedzi w bazie.
//
// Ustawienia (.env.local / Vercel): MAIL_HOST (mail-serwerNNN.lh.pl; cert jest
// na *.lh.pl, wiec nie mail.klippi.pl), MAIL_PORT (993), MAIL_USER, MAIL_PASSWORD,
// OPENROUTER_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { createClient } from '@supabase/supabase-js';
import {
  buildExtractSystemPrompt,
  buildExtractUserPrompt,
  parseExtractResponse,
  type MailDoPrzerobienia,
  type PullResult,
  type WazneInfoPunkt,
} from './wazneInfoExtract.js';

export const EXTRACT_MODEL = 'google/gemini-2.5-flash-lite';

/**
 * Zmienne srodowiskowe (process.env / loadEnv): MAIL_HOST, MAIL_PORT, MAIL_USER,
 * MAIL_PASSWORD, OPENROUTER_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
 * SUPABASE_SERVICE_ROLE_KEY.
 */
export type MailEnv = Record<string, string | undefined>;

function wymagane(env: MailEnv, klucz: string): string {
  const v = env[klucz]?.trim();
  if (!v) throw new Error(`Brak ${klucz} w ustawieniach serwera (.env.local / Vercel)`);
  return v;
}

/** Pobiera z IMAP wszystkie maile ze skrzynki (naglowki + tresc). */
async function pobierzMaile(env: MailEnv): Promise<MailDoPrzerobienia[]> {
  const client = new ImapFlow({
    host: wymagane(env, 'MAIL_HOST'),
    port: Number(env.MAIL_PORT ?? '993'),
    secure: true,
    auth: { user: wymagane(env, 'MAIL_USER'), pass: wymagane(env, 'MAIL_PASSWORD') },
    logger: false,
    // Funkcja serverless ma limit czasu - lepiej czytelny blad niz zawieszenie.
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 60000,
  });
  await client.connect();
  const maile: MailDoPrzerobienia[] = [];
  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      for await (const msg of client.fetch('1:*', { uid: true, envelope: true, source: true })) {
        if (!msg.source) continue;
        const parsed = await simpleParser(msg.source);
        const messageId = parsed.messageId ?? msg.envelope?.messageId ?? `uid-${msg.uid}`;
        const od = parsed.from?.text ?? msg.envelope?.from?.map((a) => a.address ?? '').join(', ') ?? '';
        // Tekst maila: wolimy plain text, a gdy go nie ma - HTML zrzucony do tekstu.
        const tekst = (parsed.text?.trim() || htmlDoTekstu(parsed.html || '')).trim();
        maile.push({
          messageId,
          nadawca: od,
          temat: parsed.subject ?? msg.envelope?.subject ?? '(bez tematu)',
          otrzymano: new Date(parsed.date ?? msg.envelope?.date ?? Date.now()).toISOString(),
          tekst,
        });
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => undefined);
  }
  return maile;
}

function htmlDoTekstu(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h\d)>/gi, '\n')
    .replace(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n');
}

/** Pyta model o punkty dla rodzicow z jednego maila. */
export async function wyciagnijPunkty(apiKey: string, mail: MailDoPrzerobienia, dzisiaj: string): Promise<WazneInfoPunkt[]> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: EXTRACT_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildExtractSystemPrompt(dzisiaj) },
        { role: 'user', content: buildExtractUserPrompt(mail) },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenRouter: HTTP ${res.status} ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return parseExtractResponse(data.choices?.[0]?.message?.content ?? '');
}

function dzisiajKlucz(): string {
  // Czas polski, nie UTC serwera Vercel - inaczej wieczorem "dzisiaj" bedzie wczoraj.
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(new Date());
}

/** Glowna funkcja: sprawdza skrzynke i dopisuje nowe punkty do bazy. */
export async function pullWazneInfo(env: MailEnv): Promise<PullResult> {
  const apiKey = wymagane(env, 'OPENROUTER_API_KEY');
  const supabase = createClient(wymagane(env, 'VITE_SUPABASE_URL'), wymagane(env, 'SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const maile = await pobierzMaile(env);
  const wynik: PullResult = { wSkrzynce: maile.length, przerobione: 0, punkty: 0 };
  if (maile.length === 0) return wynik;

  const { data: znane, error: errZnane } = await supabase
    .from('wazne_info_maile')
    .select('message_id')
    .in(
      'message_id',
      maile.map((m) => m.messageId),
    );
  if (errZnane) throw new Error(`Supabase: ${errZnane.message}`);
  const znaneId = new Set((znane ?? []).map((r) => r.message_id as string));

  const dzisiaj = dzisiajKlucz();
  for (const mail of maile) {
    if (znaneId.has(mail.messageId)) continue;
    const punkty = mail.tekst ? await wyciagnijPunkty(apiKey, mail, dzisiaj) : [];
    if (punkty.length > 0) {
      const { error } = await supabase.from('wazne_info').insert(
        punkty.map((p) => ({
          id: crypto.randomUUID(),
          message_id: mail.messageId,
          nadawca: mail.nadawca,
          temat: mail.temat,
          otrzymano: mail.otrzymano,
          tytul: p.tytul,
          tresc: p.tresc,
          termin: p.termin,
          linki: p.linki,
          status: 'nowe',
        })),
      );
      if (error) throw new Error(`Supabase: ${error.message}`);
    }
    const { error: errMail } = await supabase.from('wazne_info_maile').insert({ message_id: mail.messageId });
    if (errMail) throw new Error(`Supabase: ${errMail.message}`);
    wynik.przerobione += 1;
    wynik.punkty += punkty.length;
  }
  return wynik;
}

// --- wspolna obsluga zadania HTTP (Vercel + dev middleware) ------------------

export type PullHttpEnv = MailEnv;

/**
 * Sprawdza, czy zadanie przyszlo od zalogowanego uzytkownika apki (Bearer =
 * token sesji Supabase), i dopiero wtedy czyta skrzynke. Bez tego kazdy, kto
 * zna adres, moglby nabijac rachunek OpenRouter.
 */
export async function handlePullRequest(
  authHeader: string | undefined,
  env: PullHttpEnv,
): Promise<{ status: number; body: PullResult | { error: string } }> {
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
  if (!token) return { status: 401, body: { error: 'Zaloguj się w apce' } };
  try {
    const auth = createClient(wymagane(env, 'VITE_SUPABASE_URL'), wymagane(env, 'VITE_SUPABASE_ANON_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await auth.auth.getUser(token);
    if (error || !data.user) return { status: 401, body: { error: 'Sesja wygasła - zaloguj się ponownie' } };
    return { status: 200, body: await pullWazneInfo(env) };
  } catch (err) {
    return { status: 502, body: { error: err instanceof Error ? err.message : 'Nieznany błąd' } };
  }
}
