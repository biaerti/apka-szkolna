-- Uwagi za zachowanie przestaja byc kara w grze (koniec eskalacji "1. ostrzezenie,
-- 2. bez plusow do konca miesiaca") i staja sie przypominajka do wpisania w
-- dzienniku. Zakladka "Uwagi" pokazuje je w widoku tygodnia, z trescia i
-- odhaczeniem "wpisane".
--
-- Tresc uwagi siedzi w istniejacej kolumnie `note` (dodanej w 0003) - nowa jest
-- tylko flaga "juz wpisane do dziennika". Uruchamiane recznie w panelu Supabase.

alter table public.recap_events add column if not exists wpisane boolean not null default false;

-- Wyszukiwanie uwag po dacie (kalendarz tygodniowy w zakladce "Uwagi").
create index if not exists recap_events_uwagi_idx on public.recap_events (at) where result = 'uwaga';
