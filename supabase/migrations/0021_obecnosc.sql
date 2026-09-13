-- Obecnosc z plywajacego panelu: kto jest dzis nieobecny. Trzymamy tylko
-- nieobecnych (brak wiersza = obecny). Nieobecny w danym dniu nie trafia na
-- zadne kolo. Patrz src/data/types.ts (Absence) i src/lib/attendance.ts.
-- Id wyliczane z dnia i ucznia ("abs-RRRR-MM-DD-<student>"), wiec jeden wiersz
-- na ucznia dziennie.

create table if not exists public.absences (
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  class_id text not null references public.classes(id) on delete cascade,
  date date not null,
  period integer,
  at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists absences_date_idx on public.absences (date);

drop trigger if exists set_updated_at on public.absences;
create trigger set_updated_at before update on public.absences
  for each row execute function public.set_updated_at();

alter table public.absences enable row level security;
drop policy if exists "authenticated full access" on public.absences;
create policy "authenticated full access" on public.absences
  for all to authenticated using (true) with check (true);
