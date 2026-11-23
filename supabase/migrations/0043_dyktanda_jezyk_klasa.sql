-- Dyktanda: jezyk podpowiedzi ucznia (ukrainski albo hiszpanski) i powiazanie
-- z uczniem z dziennika (klasa), zeby zakladka "Zadania domowe" filtrowala po klasach.
-- student_id / class_id to id z apki (imiona uczniow w apce sa zaszyfrowane,
-- tu sa tylko identyfikatory).

alter table public.dyktando_uczniowie add column if not exists jezyk text not null default 'ua';
alter table public.dyktando_uczniowie add column if not exists student_id text;
alter table public.dyktando_uczniowie add column if not exists class_id text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dyktando_uczniowie_jezyk_check') then
    alter table public.dyktando_uczniowie
      add constraint dyktando_uczniowie_jezyk_check check (jezyk in ('ua', 'es'));
  end if;
end $$;

-- Lista na stronie ucznia podaje tez jezyk (napisy i podpowiedzi po ukrainsku albo hiszpansku).
drop function if exists public.dyktando_lista();
create function public.dyktando_lista()
returns table (id uuid, imie text, jezyk text)
language sql stable security definer set search_path = public
as $$
  select u.id, u.imie, u.jezyk from public.dyktando_uczniowie u where u.aktywny order by u.imie;
$$;

revoke all on function public.dyktando_lista() from public;
grant execute on function public.dyktando_lista() to anon, authenticated;
