-- Mala lista zadan na pulpicie ("rozdać owoce i warzywa w IV A").
--
-- Zadanie moze byc:
-- - ogolne (data null) - lista pod przyciskiem "Do zrobienia",
-- - na dzien (data, bez lekcji) - pod naglowkiem dnia w planie tygodnia,
-- - na lekcje (data + numer lekcji, klasa dla podpisu) - w wierszu lekcji.

create table if not exists public.zadania (
  id text primary key,
  tekst text not null,
  data date,
  lekcja smallint,
  klasa_id text,
  zrobione boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists zadania_data_idx on public.zadania (data);

drop trigger if exists set_updated_at on public.zadania;
create trigger set_updated_at before update on public.zadania
  for each row execute function public.set_updated_at();

alter table public.zadania enable row level security;

drop policy if exists "authenticated full access" on public.zadania;
create policy "authenticated full access" on public.zadania
  for all to authenticated using (true) with check (true);
