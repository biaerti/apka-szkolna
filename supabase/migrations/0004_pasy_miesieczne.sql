-- Pasy przechodza z limitu tygodniowego na miesieczny: nowa kolumna
-- passes_per_month (domyslnie 3), dane przepisane ze starej passes_per_week,
-- stara kolumna usunieta. Uruchamiane recznie w panelu Supabase - uzywamy
-- if exists/if not exists i sprawdzania kolumny w information_schema, zeby
-- dalo sie odpalic plik dwa razy bez bledu (druga wysylka nie ma juz
-- passes_per_week, wiec zwykle "update ... set x = passes_per_week" by sie wywalilo).

alter table public.settings add column if not exists passes_per_month integer not null default 3;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'settings' and column_name = 'passes_per_week'
  ) then
    update public.settings
      set passes_per_month = passes_per_week
      where passes_per_week is not null;
  end if;
end $$;

alter table public.settings drop column if exists passes_per_week;
