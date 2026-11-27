-- Kurs "Polski krok po kroku": uwaga nauczyciela przy lekcji ucznia
-- (np. "Popraw ó / u i zrób lekcję jeszcze raz").
--
-- Bartek (authenticated) wpisuje uwagi w zakladce Zadania domowe. Jedna uwaga
-- na ucznia i lekcje kursu - nowa zastepuje stara. Gdy uwaga pochodzi z gotowego
-- szablonu, apka zapisuje tez tlumaczenie na jezyk ucznia (przeklad).
-- Uczen (anon) czyta tylko swoje uwagi przez funkcje z haslem i oznacza je
-- jako przeczytane - Bartek widzi wtedy, ze uwaga dotarla.
-- W tresci nie ma danych osobowych: uczen to tylko uczen_id.

create table if not exists public.dyktando_uwagi (
  id uuid primary key default gen_random_uuid(),
  uczen_id uuid not null references public.dyktando_uczniowie(id) on delete cascade,
  lekcja text not null check (length(lekcja) between 1 and 60),
  tresc text not null check (length(tresc) between 1 and 400),
  przeklad text check (przeklad is null or length(przeklad) <= 600),
  created_at timestamptz not null default now(),
  przeczytana_at timestamptz,
  unique (uczen_id, lekcja)
);

alter table public.dyktando_uwagi enable row level security;

drop policy if exists "authenticated full access" on public.dyktando_uwagi;
create policy "authenticated full access" on public.dyktando_uwagi
  for all to authenticated using (true) with check (true);

revoke all on table public.dyktando_uwagi from anon;

create or replace function public.dyktando_moje_uwagi(p_id uuid, p_haslo text)
returns table (id uuid, lekcja text, tresc text, przeklad text, created_at timestamptz, przeczytana_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions
as $$
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  return query
    select u.id, u.lekcja, u.tresc, u.przeklad, u.created_at, u.przeczytana_at
    from public.dyktando_uwagi u where u.uczen_id = p_id order by u.created_at desc;
end;
$$;

create or replace function public.dyktando_uwaga_przeczytana(p_id uuid, p_haslo text, p_uwaga uuid)
returns void
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  update public.dyktando_uwagi
  set przeczytana_at = now()
  where id = p_uwaga and uczen_id = p_id and przeczytana_at is null;
end;
$$;

revoke all on function public.dyktando_moje_uwagi(uuid, text) from public;
revoke all on function public.dyktando_uwaga_przeczytana(uuid, text, uuid) from public;
grant execute on function public.dyktando_moje_uwagi(uuid, text) to anon, authenticated;
grant execute on function public.dyktando_uwaga_przeczytana(uuid, text, uuid) to anon, authenticated;
