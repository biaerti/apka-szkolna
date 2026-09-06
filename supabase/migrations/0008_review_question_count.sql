-- Miekki limit pytan kola POWTORZENIOWEGO (Settings.reviewQuestionCount, domyslnie 7)
-- - licznik w sesji pokazuje "pytanie X/limit" i po jego osiagnieciu proponuje
-- zakonczenie rundy, ale nie blokuje kolejnych losowan. Patrz src/data/types.ts
-- (Settings) i src/data/remote/mappers.ts (settingsToRow/rowToSettings).
alter table public.settings add column if not exists review_question_count integer;
