-- Ostrzezenie: krok przed uwaga.
--
-- Bartek chce najpierw ostrzec ucznia, a dopiero przy powtorce wpisac uwage.
-- Ostrzezenie nie jest ocena ani wpisem do dziennika - zostaje przy uczniu z
-- lekcji na lekcje, az je zdejmie albo zamieni w uwage (wtedy wiersz znika).
-- Dlatego to zwykly recap_event z nowym wynikiem, a nie osobna tabela: bilans
-- go nie liczy (GRADED_RESULTS w src/lib/recap.ts), a zakladka Uwagi filtruje
-- po result = 'uwaga', wiec sama sie nim nie zajmie.

alter table recap_events drop constraint if exists recap_events_result_check;

alter table recap_events add constraint recap_events_result_check check (
  result = any (array[
    'plus', 'kropka', 'plomba', 'pass', 'hint_plomba',
    'uwaga', 'ostrzezenie', 'rozliczenie', 'jedynka', 'piatka'
  ]::text[])
);
