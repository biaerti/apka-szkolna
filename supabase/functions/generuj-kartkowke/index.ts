// Generowanie zadan kartkowki - proxy do OpenRoutera.
//
// Dlaczego funkcja na serwerze, a nie fetch wprost z apki: klucz do platnego
// API nie moze siedziec w przegladarce. Wszystko, co apka dostaje przez
// import.meta.env (VITE_*), laduje w bundlu JS na szkola.klippi.pl i kazdy
// moze to odczytac. Tutaj klucz zostaje po stronie Supabase.
//
// Klucz bierzemy z sekretu funkcji (OPENROUTER_API_KEY), a gdyby go nie bylo -
// z tabeli public.app_secrets, czytanej rola service_role (tabela ma RLS bez
// zadnej polityki, wiec anon ani authenticated jej nie widza).

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Sonnet 5 - najnowszy Sonnet, tanszy od 4.5 i lepszy w ukladaniu zadan.
// Sonnet 3.5 nie jest juz na OpenRouterze dostepny.
const DEFAULT_MODEL = 'anthropic/claude-sonnet-5';

const ALLOWED_ORIGINS = [
  'https://szkola.klippi.pl',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'Metoda nieobsługiwana.' }, 405, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // verify_jwt odsiewa zapytania bez podpisanego tokenu, ale sam klucz anon tez
  // jest poprawnym JWT - stad dodatkowe sprawdzenie, ze to ZALOGOWANY uzytkownik.
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: userData } = await admin.auth.getUser(token);
  if (!userData?.user) return json({ error: 'Trzeba być zalogowanym.' }, 401, origin);

  let payload: { prompt?: unknown; model?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Nieprawidłowe zapytanie.' }, 400, origin);
  }

  const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';
  if (prompt.length < 50) return json({ error: 'Polecenie jest za krótkie.' }, 400, origin);
  if (prompt.length > 20000) return json({ error: 'Polecenie jest za długie.' }, 400, origin);
  const model = typeof payload.model === 'string' && payload.model.startsWith('anthropic/') ? payload.model : DEFAULT_MODEL;

  let apiKey = Deno.env.get('OPENROUTER_API_KEY') ?? '';
  if (!apiKey) {
    const { data } = await admin.from('app_secrets').select('value').eq('key', 'OPENROUTER_API_KEY').maybeSingle();
    apiKey = data?.value ?? '';
  }
  if (!apiKey) {
    return json(
      { error: 'Brak klucza OpenRoutera. Ustaw sekret OPENROUTER_API_KEY w Supabase (Edge Functions → Secrets).' },
      503,
      origin,
    );
  }

  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://szkola.klippi.pl',
        'X-Title': 'Apka szkolna',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });
  } catch {
    return json({ error: 'Nie udało się połączyć z OpenRouterem.' }, 502, origin);
  }

  const raw = await response.text();
  if (!response.ok) {
    // Tresc bledu OpenRoutera bywa dluga i techniczna - do apki idzie skrot,
    // caly komunikat zostaje w logach funkcji.
    console.error('OpenRouter', response.status, raw.slice(0, 500));
    return json({ error: `OpenRouter odpowiedział błędem (${response.status}).` }, 502, origin);
  }

  let text = '';
  let usage: unknown = null;
  try {
    const data = JSON.parse(raw);
    text = data?.choices?.[0]?.message?.content ?? '';
    usage = data?.usage ?? null;
  } catch {
    return json({ error: 'Nieczytelna odpowiedź OpenRoutera.' }, 502, origin);
  }
  if (!text.trim()) return json({ error: 'Model nie zwrócił żadnych zadań.' }, 502, origin);

  return json({ text, model, usage }, 200, origin);
});
