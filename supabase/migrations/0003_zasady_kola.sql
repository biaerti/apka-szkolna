-- Nowe zasady kola fortuny: nazewnictwo "minus" -> "plomba", cztery wyniki
-- odpowiedzi (plus/kropka/plomba/pass), eskalacja uwag i rozliczenia
-- (rozliczenie/jedynka/piatka). Uruchamiane recznie w panelu Supabase.

-- 1) Zdejmujemy stary check constraint na recap_events.result, zeby moc
--    zaktualizowac istniejace wiersze bez konfliktu.
alter table public.recap_events drop constraint if exists recap_events_result_check;

-- 2) Migracja istniejacych danych na nowe nazewnictwo.
update public.recap_events set result = 'plomba' where result = 'minus';
update public.recap_events set result = 'hint_plomba' where result = 'hint_minus';

-- 3) Nowy check z pelna lista dozwolonych wynikow.
alter table public.recap_events
  add constraint recap_events_result_check
  check (result in ('plus', 'kropka', 'plomba', 'pass', 'hint_plomba', 'uwaga', 'rozliczenie', 'jedynka', 'piatka'));

-- 4) Adnotacja do zdarzenia (np. przy jedynce/piatce/rozliczeniu).
alter table public.recap_events add column if not exists note text;

-- 5) Ustawienia: progi przeliczania plusow/plomb na oceny.
alter table public.settings add column if not exists pluses_for_five integer not null default 3;
alter table public.settings add column if not exists plomby_for_one integer not null default 3;
