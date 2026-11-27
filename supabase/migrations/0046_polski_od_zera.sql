-- Kurs "Polski od zera" (szkola.klippi.pl/od-zera): pelny kurs polskiego od zera
-- na telefon, logowanie tym samym loginem i haslem co portal ucznia (/uczen).
-- Kod: src/pages/odzera/, tresc: src/data/odzera/, plan roku: docs/kurs-od-zera-plan.md.
--
-- Tryb dostepu na koncie (dyktando_uczniowie.od_zera):
--   'lekcja' - uczen robi kurs NA lekcjach polskiego: kolejna lekcja kursu otwiera
--              sie z poczatkiem kazdej godziny polskiego jego klasy wedlug planu
--              (timetable_entries + lesson_periods), liczac od od_zera_start.
--              od_zera_przesuniecie dodaje (albo odejmuje) lekcje recznie - tak
--              nauczyciel odblokowuje lekcje albo wstrzymuje kurs (zastepstwa,
--              wycieczki, ferie). Zrobione lekcje zostaja otwarte do powtorki.
--   'dom'    - wszystkie lekcje po kolei, bez zegara.
--   null     - konto nie ma kursu.
-- od_zera_jezyk: jezyk podpowiedzi ('ru' rosyjski, 'ua' ukrainski).
--
-- Wyniki etapow lekcji: od_zera_wyniki. Fiszki (powtorki w pudelkach Leitnera,
-- odstepy 1, 2, 4, 7, 14 dni) w od_zera_fiszki - w bazie, bo uczen moze zmienic
-- telefon. Anon dostaje tylko funkcje sprawdzajace haslo (jak w 0042-0044).

alter table public.dyktando_uczniowie add column if not exists od_zera text;
alter table public.dyktando_uczniowie add column if not exists od_zera_jezyk text;
alter table public.dyktando_uczniowie add column if not exists od_zera_start date;
alter table public.dyktando_uczniowie add column if not exists od_zera_przesuniecie int not null default 0;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dyktando_uczniowie_od_zera_check') then
    alter table public.dyktando_uczniowie
      add constraint dyktando_uczniowie_od_zera_check check (od_zera is null or od_zera in ('lekcja', 'dom'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'dyktando_uczniowie_od_zera_jezyk_check') then
    alter table public.dyktando_uczniowie
      add constraint dyktando_uczniowie_od_zera_jezyk_check check (od_zera_jezyk is null or od_zera_jezyk in ('ru', 'ua'));
  end if;
end $$;

create table if not exists public.od_zera_wyniki (
  id uuid primary key default gen_random_uuid(),
  uczen_id uuid not null references public.dyktando_uczniowie(id) on delete cascade,
  lekcja int not null,
  -- etap lekcji: 'powtorka', 'lekcja' (nowe + cwiczenia), 'zeszyt', 'dzwonek' (do dzwonka)
  czesc text not null,
  punkty int not null,
  maks int not null,
  xp int not null default 0,
  bledy jsonb not null default '[]'::jsonb,
  sekundy int,
  ukonczona boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists od_zera_wyniki_uczen_idx on public.od_zera_wyniki (uczen_id, lekcja);

create table if not exists public.od_zera_fiszki (
  uczen_id uuid not null references public.dyktando_uczniowie(id) on delete cascade,
  -- id slowa z tresci kursu (src/data/odzera), np. "szkola"
  item text not null,
  box int not null default 0,
  due date not null,
  last_known boolean,
  reviewed_at timestamptz,
  bledy int not null default 0,
  primary key (uczen_id, item)
);

alter table public.od_zera_wyniki enable row level security;
alter table public.od_zera_fiszki enable row level security;

drop policy if exists "authenticated full access" on public.od_zera_wyniki;
create policy "authenticated full access" on public.od_zera_wyniki
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on public.od_zera_fiszki;
create policy "authenticated full access" on public.od_zera_fiszki
  for all to authenticated using (true) with check (true);

-- Godziny polskiego klasy (bez zajec z wychowawca) od dnia p_od do p_do (lacznie),
-- z poczatkiem i koncem w czasie polskim.
create or replace function public.od_zera_godziny(p_class_id text, p_od date, p_do date)
returns table (poczatek timestamptz, koniec timestamptz)
language sql stable security definer set search_path = public
as $$
  select
    (d::date + lp.start_time::time) at time zone 'Europe/Warsaw',
    (d::date + lp.end_time::time) at time zone 'Europe/Warsaw'
  from generate_series(p_od::timestamp, p_do::timestamp, interval '1 day') d
  join public.timetable_entries t
    on t.class_id = p_class_id
   and t.weekday = extract(isodow from d)::int
   and (t.note is null or t.note not ilike '%wychowaw%')
  join public.lesson_periods lp on lp.no = t.period
  order by 1;
$$;

-- Ile lekcji kursu jest otwartych (tryb 'lekcja'): godziny polskiego, ktore juz
-- sie zaczely od dnia startu, plus reczne przesuniecie. Tryb 'dom' - null (wszystko).
create or replace function public.od_zera_odblokowane(p_id uuid)
returns int
language plpgsql stable security definer set search_path = public
as $$
declare
  u record;
  ile int;
  dzis date := (now() at time zone 'Europe/Warsaw')::date;
begin
  select * into u from public.dyktando_uczniowie where id = p_id;
  if u.od_zera is distinct from 'lekcja' then
    return null;
  end if;
  if u.od_zera_start is null or u.class_id is null or u.od_zera_start > dzis then
    ile := 0;
  else
    select count(*) into ile
    from public.od_zera_godziny(u.class_id, u.od_zera_start, dzis) g
    where g.poczatek <= now();
  end if;
  return greatest(0, ile + coalesce(u.od_zera_przesuniecie, 0));
end;
$$;

-- Stan kursu dla ucznia: konto, ile otwartych lekcji, biezaca i nastepna godzina
-- polskiego, dni tygodnia z polskim (do serii), wyniki i fiszki.
create or replace function public.od_zera_stan(p_id uuid, p_haslo text)
returns jsonb
language plpgsql stable security definer set search_path = public, extensions
as $$
declare
  u record;
  dzis date := (now() at time zone 'Europe/Warsaw')::date;
  lekcja_od timestamptz;
  lekcja_do timestamptz;
  nastepna timestamptz;
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  select * into u from public.dyktando_uczniowie where id = p_id;
  if u.class_id is not null then
    select g.poczatek, g.koniec into lekcja_od, lekcja_do
    from public.od_zera_godziny(u.class_id, dzis, dzis) g
    where g.poczatek <= now() and g.koniec > now()
    limit 1;
    select g.poczatek into nastepna
    from public.od_zera_godziny(u.class_id, greatest(dzis, coalesce(u.od_zera_start, dzis)), dzis + 21) g
    where g.poczatek > now()
    order by g.poczatek
    limit 1;
  end if;
  return jsonb_build_object(
    'tryb', u.od_zera,
    'jezyk', coalesce(u.od_zera_jezyk, 'ua'),
    'login', u.login,
    'odblokowane', public.od_zera_odblokowane(p_id),
    'start', u.od_zera_start,
    'teraz', now(),
    'lekcja_od', lekcja_od,
    'lekcja_do', lekcja_do,
    'nastepna', nastepna,
    'dni_polskiego', coalesce((
      select jsonb_agg(distinct t.weekday)
      from public.timetable_entries t
      where t.class_id = u.class_id and (t.note is null or t.note not ilike '%wychowaw%')
    ), '[]'::jsonb),
    'wyniki', coalesce((
      select jsonb_agg(jsonb_build_object(
        'lekcja', w.lekcja, 'czesc', w.czesc, 'punkty', w.punkty, 'maks', w.maks, 'xp', w.xp,
        'sekundy', w.sekundy, 'ukonczona', w.ukonczona, 'created_at', w.created_at
      ) order by w.created_at)
      from public.od_zera_wyniki w where w.uczen_id = p_id
    ), '[]'::jsonb),
    'fiszki', coalesce((
      select jsonb_agg(jsonb_build_object('item', f.item, 'box', f.box, 'due', f.due, 'last_known', f.last_known))
      from public.od_zera_fiszki f where f.uczen_id = p_id
    ), '[]'::jsonb)
  );
end;
$$;

-- Zapis etapu lekcji + aktualizacja fiszek (p_fiszki: [{"i": "<item>", "k": true|false}]).
-- Fiszka "umiem" idzie o pudelko wyzej (najwyzej raz dziennie), "nie umiem" wraca do 0.
create or replace function public.od_zera_zapisz(
  p_id uuid, p_haslo text, p_lekcja int, p_czesc text, p_punkty int, p_maks int, p_xp int,
  p_bledy jsonb, p_sekundy int, p_ukonczona boolean, p_fiszki jsonb
)
returns void
language plpgsql security definer set search_path = public, extensions
as $$
declare
  odstepy int[] := array[1, 2, 4, 7, 14];
  dzis date := (now() at time zone 'Europe/Warsaw')::date;
  f jsonb;
  stary record;
  nowy_box int;
begin
  if not public.dyktando_sprawdz(p_id, p_haslo) then
    raise exception 'Złe hasło' using errcode = '28P01';
  end if;
  if p_lekcja < 0 or p_lekcja > 300 or p_czesc not in ('powtorka', 'lekcja', 'zeszyt', 'dzwonek')
     or p_maks < 0 or p_maks > 1000 or p_punkty < 0 or p_punkty > p_maks or p_xp < 0 or p_xp > 5000
     or length(coalesce(p_bledy, '[]'::jsonb)::text) > 30000
     or jsonb_array_length(coalesce(p_fiszki, '[]'::jsonb)) > 400 then
    raise exception 'Niepoprawny wynik';
  end if;
  insert into public.od_zera_wyniki (uczen_id, lekcja, czesc, punkty, maks, xp, bledy, sekundy, ukonczona)
  values (p_id, p_lekcja, p_czesc, p_punkty, p_maks, p_xp, coalesce(p_bledy, '[]'::jsonb), p_sekundy, coalesce(p_ukonczona, false));

  for f in select * from jsonb_array_elements(coalesce(p_fiszki, '[]'::jsonb)) loop
    continue when length(f->>'i') is null or length(f->>'i') > 80;
    select * into stary from public.od_zera_fiszki where uczen_id = p_id and item = f->>'i';
    if not found then
      nowy_box := case when (f->>'k')::boolean then 1 else 0 end;
      insert into public.od_zera_fiszki (uczen_id, item, box, due, last_known, reviewed_at, bledy)
      values (p_id, f->>'i', nowy_box, dzis + odstepy[nowy_box + 1], (f->>'k')::boolean, now(),
              case when (f->>'k')::boolean then 0 else 1 end);
    elsif not (f->>'k')::boolean then
      update public.od_zera_fiszki
      set box = 0, due = dzis + 1, last_known = false, reviewed_at = now(), bledy = bledy + 1
      where uczen_id = p_id and item = f->>'i';
    elsif stary.reviewed_at is null or (stary.reviewed_at at time zone 'Europe/Warsaw')::date <> dzis then
      nowy_box := least(stary.box + 1, 4);
      update public.od_zera_fiszki
      set box = nowy_box, due = dzis + odstepy[nowy_box + 1], last_known = true, reviewed_at = now()
      where uczen_id = p_id and item = f->>'i';
    else
      update public.od_zera_fiszki set last_known = true where uczen_id = p_id and item = f->>'i';
    end if;
  end loop;
end;
$$;

-- Dla panelu nauczyciela: otwarte lekcje i nastepna godzina kazdego konta z kursem.
create or replace function public.od_zera_przeglad()
returns table (id uuid, odblokowane int, nastepna timestamptz)
language plpgsql stable security definer set search_path = public
as $$
declare
  dzis date := (now() at time zone 'Europe/Warsaw')::date;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Tylko dla nauczyciela';
  end if;
  return query
    select u.id, public.od_zera_odblokowane(u.id),
      (select g.poczatek from public.od_zera_godziny(u.class_id, greatest(dzis, coalesce(u.od_zera_start, dzis)), dzis + 21) g
       where g.poczatek > now() order by g.poczatek limit 1)
    from public.dyktando_uczniowie u
    where u.od_zera is not null;
end;
$$;

revoke all on function public.od_zera_godziny(text, date, date) from public, anon;
revoke all on function public.od_zera_odblokowane(uuid) from public, anon;
revoke all on function public.od_zera_stan(uuid, text) from public;
revoke all on function public.od_zera_zapisz(uuid, text, int, text, int, int, int, jsonb, int, boolean, jsonb) from public;
revoke all on function public.od_zera_przeglad() from public, anon;

grant execute on function public.od_zera_godziny(text, date, date) to authenticated;
grant execute on function public.od_zera_odblokowane(uuid) to authenticated;
grant execute on function public.od_zera_stan(uuid, text) to anon, authenticated;
grant execute on function public.od_zera_zapisz(uuid, text, int, text, int, int, int, jsonb, int, boolean, jsonb) to anon, authenticated;
grant execute on function public.od_zera_przeglad() to authenticated;
