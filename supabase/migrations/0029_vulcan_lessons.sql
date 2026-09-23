-- Plan dnia odczytany z VULCANA (drzewo lekcji nauczyciela, razem z
-- zastepstwami). Dodatek "pomocnik VULCAN" czyta go z karty dziennika, apka
-- w Chrome zapisuje tutaj, a plywajacy panel (osobne okno bez dodatku) dociaga
-- dzisiejsze wiersze i pokazuje wlasciwa klase i numer lekcji.
-- Patrz src/data/types.ts (VulcanLesson) i src/lib/vulcanPlan.ts.

create table if not exists public.vulcan_lessons (
  id text primary key,
  date date not null,
  period integer not null,
  class_id text references public.classes(id) on delete set null,
  class_name text not null,
  subject text not null default '',
  replacement text,
  updated_at timestamptz not null default now()
);

create index if not exists vulcan_lessons_date_idx on public.vulcan_lessons (date);

drop trigger if exists set_updated_at on public.vulcan_lessons;
create trigger set_updated_at before update on public.vulcan_lessons
  for each row execute function public.set_updated_at();

alter table public.vulcan_lessons enable row level security;
drop policy if exists "authenticated full access" on public.vulcan_lessons;
create policy "authenticated full access" on public.vulcan_lessons
  for all to authenticated using (true) with check (true);
