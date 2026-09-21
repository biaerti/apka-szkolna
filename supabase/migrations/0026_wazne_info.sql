-- Wazne info dla rodzicow (zakladka "Ważne info").
--
-- Nauczyciel dostaje wazne komunikaty mailem albo przez dziennik VULCAN i
-- przesyla je dalej na skrzynke szkola@klippi.pl. Funkcja serverless
-- (api/wazne-info-pull.ts) czyta te skrzynke po IMAP, lekki model przez
-- OpenRouter wyciaga z kazdego maila konkretne punkty (tytul, tresc, termin,
-- linki) i wrzuca je tutaj. W apce nauczyciel zaznacza punkty, sklada z nich
-- paczke do wyslania rodzicom na WhatsAppie i odhacza jako wyslane.

create table if not exists public.wazne_info (
  id text primary key,
  -- Message-ID maila, z ktorego pochodzi punkt (null = dodane recznie w apce).
  -- Jeden mail moze dac kilka punktow, wiec bez unique.
  message_id text,
  nadawca text,
  temat text,
  otrzymano timestamptz,
  tytul text not null,
  tresc text not null default '',
  -- Termin (data), do ktorej informacja jest aktualna / do ktorej trzeba cos zrobic.
  termin date,
  linki jsonb not null default '[]'::jsonb,
  -- nowe -> wyslane (w paczce) albo pominiete (nie dla rodzicow).
  status text not null default 'nowe' check (status in ('nowe', 'wyslane', 'pominiete')),
  paczka_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Paczka = jedna wiadomosc na WhatsAppa zlozona z kilku punktow.
create table if not exists public.wazne_info_paczki (
  id text primary key,
  tekst text not null,
  wyslano timestamptz not null default now()
);

-- Ktore maile juz przerobione - zeby nie wolac modelu drugi raz po tym samym
-- mailu (nawet jesli nic z niego nie wyszlo).
create table if not exists public.wazne_info_maile (
  message_id text primary key,
  przetworzono timestamptz not null default now()
);

create index if not exists wazne_info_status_idx on public.wazne_info (status, termin);

drop trigger if exists set_updated_at on public.wazne_info;
create trigger set_updated_at before update on public.wazne_info
  for each row execute function public.set_updated_at();

alter table public.wazne_info enable row level security;
alter table public.wazne_info_paczki enable row level security;
alter table public.wazne_info_maile enable row level security;

drop policy if exists "authenticated full access" on public.wazne_info;
create policy "authenticated full access" on public.wazne_info
  for all to authenticated using (true) with check (true);
drop policy if exists "authenticated full access" on public.wazne_info_paczki;
create policy "authenticated full access" on public.wazne_info_paczki
  for all to authenticated using (true) with check (true);
drop policy if exists "authenticated full access" on public.wazne_info_maile;
create policy "authenticated full access" on public.wazne_info_maile
  for all to authenticated using (true) with check (true);
