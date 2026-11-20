-- Prace pisemne uczniow (wypracowania, listy) - zakladka "Pisanie" w klasie.
--
-- Bartek fotografuje prace, Claude przepisuje je i ocenia, a apka importuje
-- paczke i przypisuje prace do uczniow. Wszystko, co mowi cos o dziecku
-- (przepisany tekst, ocena, opinia, informacja zwrotna), lezy w kolumnie
-- `dane` zaszyfrowane kluczem z hasla Bartka (enc1:, src/lib/studentCrypto.ts).
-- Zdjecia prac (z podpisami dzieci) ida do prywatnego bucketu "prace" tez
-- zaszyfrowane - Supabase widzi tylko losowe nazwy plikow i bajty.

create table if not exists public.prace_pisemne (
  id text primary key,
  class_id text not null references public.classes(id) on delete cascade,
  student_id text references public.students(id) on delete set null,
  zadanie text not null,
  tytul text not null,
  data date not null,
  dane text not null,
  zdjecia text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prace_pisemne_class_idx on public.prace_pisemne (class_id);
create index if not exists prace_pisemne_student_idx on public.prace_pisemne (student_id);

drop trigger if exists set_updated_at on public.prace_pisemne;
create trigger set_updated_at before update on public.prace_pisemne
  for each row execute function public.set_updated_at();

alter table public.prace_pisemne enable row level security;

drop policy if exists "authenticated full access" on public.prace_pisemne;
create policy "authenticated full access" on public.prace_pisemne
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('prace', 'prace', false, 10485760, array['application/octet-stream'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "prace: odczyt dla zalogowanych" on storage.objects;
create policy "prace: odczyt dla zalogowanych" on storage.objects
  for select to authenticated using (bucket_id = 'prace');

drop policy if exists "prace: zapis dla zalogowanych" on storage.objects;
create policy "prace: zapis dla zalogowanych" on storage.objects
  for insert to authenticated with check (bucket_id = 'prace');

drop policy if exists "prace: usuwanie dla zalogowanych" on storage.objects;
create policy "prace: usuwanie dla zalogowanych" on storage.objects
  for delete to authenticated using (bucket_id = 'prace');
