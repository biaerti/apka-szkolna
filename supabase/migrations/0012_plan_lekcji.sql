-- Plan lekcji (zakladka "Plan"): dzwonki i tygodniowa siatka nauczyciela.
-- Patrz src/data/types.ts (LessonPeriod, TimetableEntry) i src/lib/timetable.ts.
-- Obie tabele sa globalne (jeden nauczyciel, jeden plan) - bez kolumny user_id,
-- tak jak reszta schematu.

-- Dzwonki. Kluczem logicznym jest numer godziny (`no`), ale silnik sync
-- (src/data/remote/diff.ts) upsertuje i kasuje po tekstowym `id`, wiec id to
-- numer zapisany jako tekst (mapper: periodToRow).
create table if not exists public.lesson_periods (
  id text primary key,
  no integer not null unique,
  start_time text not null,
  end_time text not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.lesson_periods;
create trigger set_updated_at before update on public.lesson_periods
  for each row execute function public.set_updated_at();

alter table public.lesson_periods enable row level security;
drop policy if exists "authenticated full access" on public.lesson_periods;
create policy "authenticated full access" on public.lesson_periods
  for all to authenticated using (true) with check (true);

-- Siatka: jedna komorka = (dzien 1-5, numer lekcji) -> klasa i sala.
create table if not exists public.timetable_entries (
  id text primary key,
  weekday integer not null check (weekday between 1 and 5),
  period integer not null,
  class_id text not null references public.classes(id) on delete cascade,
  room text,
  updated_at timestamptz not null default now(),
  unique (weekday, period)
);

drop trigger if exists set_updated_at on public.timetable_entries;
create trigger set_updated_at before update on public.timetable_entries
  for each row execute function public.set_updated_at();

alter table public.timetable_entries enable row level security;
drop policy if exists "authenticated full access" on public.timetable_entries;
create policy "authenticated full access" on public.timetable_entries
  for all to authenticated using (true) with check (true);
