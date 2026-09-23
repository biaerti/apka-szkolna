// Zlecenia "frekwencja do VULCANA" w chmurze (tabela vulcan_frekwencja,
// migracja 0030). Poza zwyklym syncem store: to kolejka miedzy telefonem a
// komputerem, a nie dane apki - zyje jeden dzien, a jej stan (pending ->
// sending -> done/error) zmienia sie po obu stronach.

import { getSupabase, isSupabaseConfigured } from '../supabase';
import {
  rowToFrekwencjaJob,
  type FrekwencjaJob,
  type FrekwencjaJobRow,
  type FrekwencjaJobStatus,
  type FrekwencjaMark,
} from '../../lib/vulcanFrekwencja';

const TABLE = 'vulcan_frekwencja';

/** Telefon: nowe (albo ponowione) zlecenie dla lekcji. Nadpisuje poprzednie tej lekcji. */
export async function submitFrekwencjaJob(args: {
  id: string;
  date: string;
  period: number;
  classId: string;
  marks: FrekwencjaMark[];
  topic: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('Brak chmury - telefon nie ma jak przekazać frekwencji komputerowi.');
  const { error } = await getSupabase()
    .from(TABLE)
    .upsert({
      id: args.id,
      date: args.date,
      period: args.period,
      class_id: args.classId,
      marks: args.marks,
      topic: args.topic,
      status: 'pending',
      message: null,
      created_at: new Date().toISOString(),
    });
  if (error) throw error;
}

export async function fetchFrekwencjaJobs(date: string): Promise<FrekwencjaJob[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabase().from(TABLE).select('*').eq('date', date);
  if (error) throw error;
  return ((data ?? []) as FrekwencjaJobRow[]).map(rowToFrekwencjaJob);
}

/**
 * Komputer: przejmij zlecenie. Warunkowy update (tylko z pending) sprawia, ze
 * dwie karty apki nie wpisza tej samej frekwencji dwa razy.
 */
export async function claimFrekwencjaJob(id: string, createdAt: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update({ status: 'sending', message: 'Komputer wpisuje do VULCANA…' })
    .eq('id', id)
    .eq('status', 'pending')
    .eq('created_at', createdAt)
    .select('id');
  if (error) return false;
  return (data ?? []).length > 0;
}

export async function finishFrekwencjaJob(id: string, status: FrekwencjaJobStatus, message: string): Promise<void> {
  await getSupabase().from(TABLE).update({ status, message }).eq('id', id);
}

/** Realtime na tabeli zlecen; zwraca funkcje odpinajaca. */
export function subscribeFrekwencjaJobs(onChange: () => void): () => void {
  if (!isSupabaseConfigured()) return () => {};
  const channel = getSupabase()
    .channel(`vulcan-frekwencja-${Math.random().toString(36).slice(2, 8)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe();
  return () => {
    void getSupabase().removeChannel(channel);
  };
}
