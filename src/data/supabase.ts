// Klient Supabase - tworzony leniwie, tylko gdy zmienne srodowiskowe sa ustawione.
// Gdy aplikacja nie jest skonfigurowana (brak .env), dziala w trybie lokalnym
// (localStorage) bez logowania - patrz src/data/store.ts i AuthGate.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function readEnv(): { url: string; anonKey: string } {
  const url = import.meta.env.VITE_SUPABASE_URL ?? '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  return { url: url.trim(), anonKey: anonKey.trim() };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = readEnv();
  return url.length > 0 && anonKey.length > 0;
}

let client: SupabaseClient | null = null;

/** Zwraca leniwie utworzony klient Supabase. Wywolywac tylko gdy isSupabaseConfigured() === true. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const { url, anonKey } = readEnv();
    if (!url || !anonKey) {
      throw new Error('Supabase nie jest skonfigurowane (brak VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
    }
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}
