-- Miejsca w lawkach (widok "Sala" na telefonie). Sala jest jedna dla wszystkich
-- klas: kolumny L / S / P (patrzac na tablice), rzedy od tablicy, w lawce dwa
-- miejsca. Id wyliczane z ucznia ("seat-<student>"), wiec jeden wiersz na
-- ucznia i przesadzenie to upsert. Patrz src/data/types.ts (Seat) i
-- src/lib/seating.ts. Kolumna nazywa sie `col`, bo `column` to slowo kluczowe.

create table if not exists public.seats (
  id text primary key,
  class_id text not null references public.classes(id) on delete cascade,
  student_id text not null unique references public.students(id) on delete cascade,
  col text not null check (col in ('L', 'S', 'P')),
  row integer not null check (row between 1 and 5),
  side integer not null check (side in (1, 2)),
  updated_at timestamptz not null default now()
);

create index if not exists seats_class_idx on public.seats (class_id);

drop trigger if exists set_updated_at on public.seats;
create trigger set_updated_at before update on public.seats
  for each row execute function public.set_updated_at();

alter table public.seats enable row level security;
drop policy if exists "authenticated full access" on public.seats;
create policy "authenticated full access" on public.seats
  for all to authenticated using (true) with check (true);
