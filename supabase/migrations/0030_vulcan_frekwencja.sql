-- Frekwencja z telefonu do VULCANA. Telefon (widok Sala -> Obecnosc) wstawia
-- zlecenie, komputer z dodatkiem "pomocnik VULCAN" je podejmuje, wpisuje
-- obecnosc w karcie dziennika i odpisuje status. W chmurze nie ma nazwisk:
-- marks to tylko [{ studentId, status }], nazwiska dokleja komputer lokalnie
-- (po odszyfrowaniu). Patrz src/lib/vulcanFrekwencja.ts.

create table if not exists public.vulcan_frekwencja (
  id text primary key,
  date date not null,
  period integer not null,
  class_id text references public.classes(id) on delete cascade,
  marks jsonb not null default '[]'::jsonb,
  topic text not null default '',
  -- pending -> sending -> done | error
  status text not null default 'pending',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vulcan_frekwencja_date_idx on public.vulcan_frekwencja (date);

drop trigger if exists set_updated_at on public.vulcan_frekwencja;
create trigger set_updated_at before update on public.vulcan_frekwencja
  for each row execute function public.set_updated_at();

alter table public.vulcan_frekwencja enable row level security;
drop policy if exists "authenticated full access" on public.vulcan_frekwencja;
create policy "authenticated full access" on public.vulcan_frekwencja
  for all to authenticated using (true) with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'vulcan_frekwencja'
  ) then
    alter publication supabase_realtime add table public.vulcan_frekwencja;
  end if;
end $$;
