-- Spotkania w planie tygodnia ("środa 13:00 - spotkanie z Neronem").
--
-- Plan lekcji na pulpicie sluzy tez jako kalendarz: spotkanie ma dzien,
-- godzine (tez poza lekcjami), opcjonalny koniec i tag. w_google zapamietuje,
-- ze spotkanie zostalo juz dodane do Kalendarza Google.

create table if not exists public.spotkania (
  id text primary key,
  tytul text not null,
  data date not null,
  od text not null,
  do_godz text,
  tag text,
  w_google boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists spotkania_data_idx on public.spotkania (data);

drop trigger if exists set_updated_at on public.spotkania;
create trigger set_updated_at before update on public.spotkania
  for each row execute function public.set_updated_at();

alter table public.spotkania enable row level security;

drop policy if exists "authenticated full access" on public.spotkania;
create policy "authenticated full access" on public.spotkania
  for all to authenticated using (true) with check (true);
