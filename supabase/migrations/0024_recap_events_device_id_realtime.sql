-- Urzadzenie, ktore zapisalo zdarzenie kola (losowy id z localStorage,
-- src/lib/device.ts). Komputer po tym poznaje, ze uwaga przyszla z telefonu
-- (widok "Sala"), i pokazuje ja jako popup. Patrz docs/PLAN-sala-lawki-uwagi.md.
alter table public.recap_events
  add column if not exists device_id text;

-- Realtime na zdarzeniach kola: telefon i komputer maja widziec swoje wpisy
-- w sekunde, a nie po kolejnym odpytaniu co kilkanascie sekund.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'recap_events'
  ) then
    alter publication supabase_realtime add table public.recap_events;
  end if;
end $$;
