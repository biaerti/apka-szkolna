-- Glosowanie klasy nad lekturami: liczba glosow na kandydata, osobno dla
-- rocznika IV i V. Wynik nauczyciel przepisuje do reading_plans jako
-- kolejnosc omawiania. Patrz Settings.readingVotes w src/data/types.ts.
alter table public.settings add column if not exists reading_votes jsonb;
