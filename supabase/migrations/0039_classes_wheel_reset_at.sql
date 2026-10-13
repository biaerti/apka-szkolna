-- "Reset" kola klasy: od tej chwili liczymy, kto juz byl wylosowany.
-- Dotad trzymany tylko w stanie okna - przeladowanie albo drugie okno
-- (panel desktopowy, telefon) wracalo stare skreslenia.

alter table public.classes add column if not exists wheel_reset_at timestamptz;
