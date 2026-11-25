-- Portal ucznia (/uczen): zadania domowe dla wszystkich klas + kurs "Polski krok po kroku".
--
-- Konta bez danych osobowych: uczen loguje sie loginem z kartki (np. "lis27") i haslem.
-- Kto jest kim, wie tylko apka nauczyciela: student_id wskazuje ucznia w dzienniku,
-- a imiona i nazwiska w tabeli students sa zaszyfrowane kluczem Bartka.
-- Tabela zostaje pod stara nazwa dyktando_uczniowie (wyniki, hasla, jezyk z 0042/0043).
--
-- Zadania domowe robia sie same: portal_zadania zwraca lekcje, ktore klasa ucznia
-- zrobila w ostatnich tygodniach (status w lessons.progress), z notatka i kartami
-- "Ćwiczymy razem". Wynik zadania idzie do dyktando_wyniki z lekcja = 'zd:<id lekcji>'.

alter table public.dyktando_uczniowie add column if not exists login text;
alter table public.dyktando_uczniowie add column if not exists polski boolean not null default false;
alter table public.dyktando_uczniowie alter column imie drop not null;

-- Wszyscy dotychczasowi to uczniowie kursu pisowni.
update public.dyktando_uczniowie set polski = true where login is null;

create unique index if not exists dyktando_uczniowie_login_idx
  on public.dyktando_uczniowie (lower(login)) where login is not null;

-- Loginy dla kont sprzed portalu (haslo zostaje to samo).
do $$
declare
  r record;
  slowa text[] := array['lis','sowa','kot','rys','foka','bobr','jez','orzel','wilk','zubr','lew','zebra','panda','delfin','koala','kruk','dzik','los','mors','pingwin'];
  kandydat text;
begin
  for r in select id from public.dyktando_uczniowie where login is null loop
    loop
      kandydat := slowa[1 + floor(random() * array_length(slowa, 1))::int] || (10 + floor(random() * 90))::int;
      exit when not exists (select 1 from public.dyktando_uczniowie where lower(login) = kandydat);
    end loop;
    update public.dyktando_uczniowie set login = kandydat where id = r.id;
  end loop;
end $$;

-- Lista imion przestaje byc publiczna (logowanie loginem).
revoke execute on function public.dyktando_lista() from anon;

create or replace function public.portal_zaloguj(p_login text, p_haslo text)
returns table (id uuid, jezyk text, polski boolean, klasa text)
language sql stable security definer set search_path = public, extensions
as $$
  select u.id, u.jezyk, u.polski, c.name
  from public.dyktando_uczniowie u
  left join public.classes c on c.id = u.class_id
  where lower(u.login) = lower(trim(p_login)) and u.aktywny
    and u.haslo_hash = extensions.crypt(lower(trim(p_haslo)), u.haslo_hash);
$$;

create or replace function public.portal_konto(p_id uuid, p_haslo text)
returns table (login text, jezyk text, polski boolean, klasa text)
language plpgsql stable security definer set search_path = public, extensions
as $$
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  return query
    select u.login, u.jezyk, u.polski, c.name
    from public.dyktando_uczniowie u
    left join public.classes c on c.id = u.class_id
    where u.id = p_id;
end;
$$;

create or replace function public.portal_zadania(p_id uuid, p_haslo text, p_dni int default 28)
returns table (lekcja_id text, tytul text, kod text, data text, slajdy jsonb)
language plpgsql stable security definer set search_path = public, extensions
as $$
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  return query
    select l.id, l.title, l.code,
      coalesce(p.value->>'doneDate', p.value->>'lessonDate'),
      coalesce(
        (select jsonb_agg(s) from jsonb_array_elements(l.slides) s where s->>'kind' in ('note', 'cwiczenie')),
        '[]'::jsonb
      )
    from public.dyktando_uczniowie u
    join public.lessons l on true
    cross join lateral jsonb_each(l.progress) p
    where u.id = p_id
      and p.key = u.class_id
      and p.value->>'status' in ('done', 'in_progress')
      and coalesce(p.value->>'doneDate', p.value->>'lessonDate')
        >= to_char(current_date - least(greatest(p_dni, 1), 90), 'YYYY-MM-DD')
    order by 4 desc, l."order" desc;
end;
$$;

-- Tylko dla Bartka: nowe konto (haslo przychodzi z apki, w bazie zostaje hash).
create or replace function public.portal_dodaj_konto(
  p_login text, p_haslo text, p_student_id text, p_class_id text, p_jezyk text, p_polski boolean
)
returns uuid
language plpgsql security definer set search_path = public, extensions
as $$
declare
  nowy uuid;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Tylko dla nauczyciela';
  end if;
  insert into public.dyktando_uczniowie (login, haslo_hash, student_id, class_id, jezyk, polski)
  values (
    lower(trim(p_login)),
    extensions.crypt(lower(trim(p_haslo)), extensions.gen_salt('bf')),
    p_student_id, p_class_id, coalesce(p_jezyk, 'ua'), coalesce(p_polski, false)
  )
  returning id into nowy;
  return nowy;
end;
$$;

revoke all on function public.portal_zaloguj(text, text) from public;
revoke all on function public.portal_konto(uuid, text) from public;
revoke all on function public.portal_zadania(uuid, text, int) from public;
revoke all on function public.portal_dodaj_konto(text, text, text, text, text, boolean) from public, anon;

grant execute on function public.portal_zaloguj(text, text) to anon, authenticated;
grant execute on function public.portal_konto(uuid, text) to anon, authenticated;
grant execute on function public.portal_zadania(uuid, text, int) to anon, authenticated;
grant execute on function public.portal_dodaj_konto(text, text, text, text, text, boolean) to authenticated;
