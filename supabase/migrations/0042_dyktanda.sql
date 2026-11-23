-- Dyktanda z pisowni - zadanie domowe dla uczniow z Ukrainy (strona /dyktando).
--
-- Uczen wybiera imie z listy i wpisuje swoje haslo z kartki. Strona dziala bez
-- logowania (rola anon), wiec anon nie ma dostepu do tabel - tylko do funkcji
-- ponizej, ktore sprawdzaja haslo (bcrypt z pgcrypto). Bartek (authenticated)
-- czyta wszystko w apce: Lekcje -> Polski od zera -> Dyktanda.
-- Na liscie sa same imiona (bez nazwisk) - lista musi byc widoczna przed
-- zalogowaniem, wiec nie da sie jej zaszyfrowac kluczem Bartka.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.dyktando_uczniowie (
  id uuid primary key default gen_random_uuid(),
  imie text not null,
  haslo_hash text not null,
  aktywny boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.dyktando_wyniki (
  id uuid primary key default gen_random_uuid(),
  uczen_id uuid not null references public.dyktando_uczniowie(id) on delete cascade,
  lekcja text not null,
  punkty int not null,
  maks int not null,
  bledy jsonb not null default '[]'::jsonb,
  sekundy int,
  created_at timestamptz not null default now()
);

create index if not exists dyktando_wyniki_uczen_idx on public.dyktando_wyniki (uczen_id);

alter table public.dyktando_uczniowie enable row level security;
alter table public.dyktando_wyniki enable row level security;

drop policy if exists "authenticated full access" on public.dyktando_uczniowie;
create policy "authenticated full access" on public.dyktando_uczniowie
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on public.dyktando_wyniki;
create policy "authenticated full access" on public.dyktando_wyniki
  for all to authenticated using (true) with check (true);

-- Lista imion do wyboru (bez hasel).
create or replace function public.dyktando_lista()
returns table (id uuid, imie text)
language sql stable security definer set search_path = public
as $$
  select u.id, u.imie from public.dyktando_uczniowie u where u.aktywny order by u.imie;
$$;

create or replace function public.dyktando_sprawdz(p_id uuid, p_haslo text)
returns boolean
language sql stable security definer set search_path = public, extensions
as $$
  select exists (
    select 1 from public.dyktando_uczniowie u
    where u.id = p_id and u.aktywny
      and u.haslo_hash = extensions.crypt(lower(trim(p_haslo)), u.haslo_hash)
  );
$$;

create or replace function public.dyktando_moje_wyniki(p_id uuid, p_haslo text)
returns table (lekcja text, punkty int, maks int, created_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions
as $$
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  return query
    select w.lekcja, w.punkty, w.maks, w.created_at
    from public.dyktando_wyniki w where w.uczen_id = p_id order by w.created_at;
end;
$$;

create or replace function public.dyktando_zapisz(
  p_id uuid, p_haslo text, p_lekcja text, p_punkty int, p_maks int, p_bledy jsonb, p_sekundy int
)
returns void
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  if length(p_lekcja) > 60 or p_maks < 1 or p_maks > 500 or p_punkty < 0 or p_punkty > p_maks
     or length(coalesce(p_bledy, '[]'::jsonb)::text) > 30000 then
    raise exception 'Niepoprawny wynik';
  end if;
  insert into public.dyktando_wyniki (uczen_id, lekcja, punkty, maks, bledy, sekundy)
  values (p_id, p_lekcja, p_punkty, p_maks, coalesce(p_bledy, '[]'::jsonb), p_sekundy);
end;
$$;

-- Tylko dla Bartka: nowy uczen i nowe haslo (haslo przychodzi z apki, w bazie zostaje hash).
create or replace function public.dyktando_dodaj_ucznia(p_imie text, p_haslo text)
returns uuid
language plpgsql security definer set search_path = public, extensions
as $$
declare
  nowy uuid;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Tylko dla nauczyciela';
  end if;
  insert into public.dyktando_uczniowie (imie, haslo_hash)
  values (trim(p_imie), extensions.crypt(lower(trim(p_haslo)), extensions.gen_salt('bf')))
  returning id into nowy;
  return nowy;
end;
$$;

create or replace function public.dyktando_ustaw_haslo(p_id uuid, p_haslo text)
returns void
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Tylko dla nauczyciela';
  end if;
  update public.dyktando_uczniowie
  set haslo_hash = extensions.crypt(lower(trim(p_haslo)), extensions.gen_salt('bf'))
  where id = p_id;
end;
$$;

revoke all on function public.dyktando_lista() from public;
revoke all on function public.dyktando_sprawdz(uuid, text) from public;
revoke all on function public.dyktando_moje_wyniki(uuid, text) from public;
revoke all on function public.dyktando_zapisz(uuid, text, text, int, int, jsonb, int) from public;
revoke all on function public.dyktando_dodaj_ucznia(text, text) from public, anon;
revoke all on function public.dyktando_ustaw_haslo(uuid, text) from public, anon;

grant execute on function public.dyktando_lista() to anon, authenticated;
grant execute on function public.dyktando_sprawdz(uuid, text) to anon, authenticated;
grant execute on function public.dyktando_moje_wyniki(uuid, text) to anon, authenticated;
grant execute on function public.dyktando_zapisz(uuid, text, text, int, int, jsonb, int) to anon, authenticated;
grant execute on function public.dyktando_dodaj_ucznia(text, text) to authenticated;
grant execute on function public.dyktando_ustaw_haslo(uuid, text) to authenticated;
