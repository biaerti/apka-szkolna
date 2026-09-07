-- Stoper odpowiedzi na ekranie kola (Settings.answerTimerSec, domyslnie 30 s,
-- 0 = bez stopera). Startuje sam po wylosowaniu ucznia i tylko pokazuje czas -
-- oceny nie zmienia. Patrz src/data/types.ts (Settings),
-- src/data/remote/mappers.ts (settingsToRow/rowToSettings) oraz
-- src/components/recap/AnswerTimer.tsx.
alter table public.settings add column if not exists answer_timer_sec integer;
