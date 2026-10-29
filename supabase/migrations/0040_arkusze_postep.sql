-- Arkusze wyrownawcze (czytanie ze zrozumieniem): ktora klasa juz robila ktory arkusz.
-- Jeden wiersz = arkusz zrobiony z klasa; odznaczenie kasuje wiersz.
-- id = "arkusz-3-sen-pomaga-sie-uczyc|<id klasy>".

create table if not exists public.arkusze_postep (
  id text primary key,
  arkusz text not null,
  class_id text not null,
  done_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.arkusze_postep enable row level security;

drop policy if exists "authenticated full access" on public.arkusze_postep;
create policy "authenticated full access" on public.arkusze_postep
  for all to authenticated using (true) with check (true);
