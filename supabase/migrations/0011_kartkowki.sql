-- Kartkowki i klasowki (zakladka "Kartkowki"). Pytania siedza w jednej
-- kolumnie jsonb `questions` jako KOPIE tresci z chwili dodania - patrz
-- src/data/types.ts (Quiz, QuizQuestion). Kartkowka nalezy do klasy, nie do
-- rocznika: to konkretne wydarzenie w konkretnej klasie.
create table if not exists public.quizzes (
  id text primary key,
  class_id text not null references public.classes(id) on delete cascade,
  kind text not null check (kind in ('kartkowka', 'klasowka')),
  title text not null,
  date date,
  questions jsonb not null default '[]'::jsonb,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.quizzes;
create trigger set_updated_at before update on public.quizzes
  for each row execute function public.set_updated_at();

alter table public.quizzes enable row level security;
drop policy if exists "authenticated full access" on public.quizzes;
create policy "authenticated full access" on public.quizzes
  for all to authenticated using (true) with check (true);
