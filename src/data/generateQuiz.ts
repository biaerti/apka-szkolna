// Wywolanie funkcji "generuj-kartkowke" na Supabase (proxy do OpenRoutera -
// patrz supabase/functions/generuj-kartkowke/index.ts).
//
// Klucz do OpenRoutera siedzi po stronie Supabase, nie w apce: wszystko, co
// przechodzi przez VITE_*, laduje w bundlu JS i jest publiczne. Apka wysyla
// tylko gotowe polecenie i dostaje z powrotem tekst zadan.
//
// Bez skonfigurowanego Supabase (tryb lokalny, localStorage) generowanie jest
// niedostepne - zostaje droga przez schowek.

import { getSupabase, isSupabaseConfigured } from './supabase';

export interface GenerateQuizResult {
  text: string;
  model: string;
}

/** Czy w tej instalacji da sie w ogole wygenerowac zadania jednym klikiem. */
export function canGenerateQuiz(): boolean {
  return isSupabaseConfigured();
}

/**
 * Zwraca surowy tekst zadan od modelu (do przepuszczenia przez
 * parseGeneratedQuiz). Rzuca Error z komunikatem po polsku - modal pokazuje go
 * wprost nauczycielowi.
 */
export async function generateQuizText(prompt: string): Promise<GenerateQuizResult> {
  if (!canGenerateQuiz()) {
    throw new Error('Generowanie działa tylko po zalogowaniu do Supabase. Użyj kopiowania polecenia.');
  }

  const { data, error } = await getSupabase().functions.invoke<{ text?: string; model?: string; error?: string }>(
    'generuj-kartkowke',
    { body: { prompt } },
  );

  // Blad HTTP z funkcji: supabase-js chowa tresc odpowiedzi w error.context,
  // a tam siedzi nasz komunikat po polsku - warto go wyciagnac.
  if (error) {
    const detail = await readFunctionError(error);
    throw new Error(detail ?? 'Nie udało się połączyć z generatorem. Spróbuj ponownie.');
  }
  if (data?.error) throw new Error(data.error);
  if (!data?.text) throw new Error('Generator nie zwrócił żadnych zadań.');

  return { text: data.text, model: data.model ?? '' };
}

async function readFunctionError(error: unknown): Promise<string | null> {
  const context = (error as { context?: unknown })?.context;
  if (context instanceof Response) {
    try {
      const body = await context.json();
      if (typeof body?.error === 'string') return body.error;
    } catch {
      // odpowiedz nie byla JSON-em - zostaje komunikat domyslny
    }
  }
  const message = (error as { message?: unknown })?.message;
  return typeof message === 'string' && message.trim() ? message : null;
}
