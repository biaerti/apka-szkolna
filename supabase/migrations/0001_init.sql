-- Apka szkolna - schemat bazy. Identyfikatory to tekst (UUID generowane w aplikacji).
-- Dostep tylko dla zalogowanego nauczyciela (RLS: rola authenticated).

create table if not exists public.classes (
  id text primary key,
  name text not null,
  "order" integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id text primary key,
  class_id text not null references public.classes(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  number integer not null default 0,
  note text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
create index if not exists students_class_id_idx on public.students(class_id);

create table if not exists public.question_sets (
  id text primary key,
  name text not null,
  topic text,
  class_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id text primary key,
  set_id text not null references public.question_sets(id) on delete cascade,
  text text not null,
  answer text,
  "order" integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists questions_set_id_idx on public.questions(set_id);

create table if not exists public.lessons (
  id text primary key,
  class_id text not null references public.classes(id) on delete cascade,
  title text not null,
  topic text,
  "order" integer not null default 0,
  status text not null default 'planned' check (status in ('planned','in_progress','done','skipped')),
  planned_date date,
  done_date date,
  question_set_id text references public.question_sets(id) on delete set null,
  slides jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
create index if not exists lessons_class_id_idx on public.lessons(class_id);

create table if not exists public.recap_events (
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  class_id text not null references public.classes(id) on delete cascade,
  question_set_id text,
  question_id text,
  result text not null check (result in ('plus','minus','pass','hint_minus')),
  at timestamptz not null default now()
);
create index if not exists recap_events_student_id_idx on public.recap_events(student_id);
create index if not exists recap_events_at_idx on public.recap_events(at);

create table if not exists public.settings (
  id text primary key default 'default',
  passes_per_week integer not null default 2,
  hint_gives_minus boolean not null default true,
  wheel_spin_sec integer not null default 4,
  updated_at timestamptz not null default now()
);

-- updated_at automatycznie
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['classes','students','question_sets','questions','lessons','settings'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- RLS: pelny dostep tylko dla zalogowanego uzytkownika (nauczyciel).
do $$
declare t text;
begin
  foreach t in array array['classes','students','question_sets','questions','lessons','recap_events','settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "authenticated full access" on public.%I', t);
    execute format('create policy "authenticated full access" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
