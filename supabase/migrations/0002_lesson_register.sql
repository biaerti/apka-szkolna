-- Pola pod dziennik elektroniczny: temat do wpisania i kody podstawy programowej.
alter table public.lessons add column if not exists register_topic text;
alter table public.lessons add column if not exists curriculum text[] not null default '{}';
