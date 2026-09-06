-- Zebrania z rodzicami (zakladka "Zebrania"). Cala tresc zebrania siedzi
-- w jednym polu `script` (markdown-lite) - patrz src/data/types.ts (Meeting).
create table if not exists public.meetings (
  id text primary key,
  title text not null,
  date date not null,
  time text not null default '17:30',
  place text,
  script text not null default '',
  "order" integer not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.meetings;
create trigger set_updated_at before update on public.meetings
  for each row execute function public.set_updated_at();

alter table public.meetings enable row level security;
drop policy if exists "authenticated full access" on public.meetings;
create policy "authenticated full access" on public.meetings
  for all to authenticated using (true) with check (true);
