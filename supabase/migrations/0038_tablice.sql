-- Tablica dzialu (Excalidraw): jedna scena na rocznik + dzial + tryb
-- ("Co nas czeka", "Czego sie nauczylismy", "Pusta tablica").
-- id = "IV|Rozdział III. Od pomysłu do działania|przed", scena = { elements, files }.

create table if not exists public.tablice (
  id text primary key,
  scena jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.tablice;
create trigger set_updated_at before update on public.tablice
  for each row execute function public.set_updated_at();

alter table public.tablice enable row level security;

drop policy if exists "authenticated full access" on public.tablice;
create policy "authenticated full access" on public.tablice
  for all to authenticated using (true) with check (true);
