// Hook logowania (Supabase Auth). Rejestracji kont nie robimy - konto zaklada sie
// w panelu Supabase. Uzywany tylko gdy isSupabaseConfigured() === true.

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from './supabase';

export type AuthStatus = 'unknown' | 'signed-out' | 'signed-in';

interface AuthState {
  status: AuthStatus;
  session: Session | null;
}

export interface UseAuthResult extends AuthState {
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [state, setState] = useState<AuthState>({ status: 'unknown', session: null });

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setState({ status: data.session ? 'signed-in' : 'signed-out', session: data.session ?? null });
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setState({ status: session ? 'signed-in' : 'signed-out', session });
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return 'Nieprawidłowy e-mail lub hasło.';
    }
    return null;
  }

  async function signOut(): Promise<void> {
    const supabase = getSupabase();
    await supabase.auth.signOut();
  }

  return { ...state, signIn, signOut };
}
