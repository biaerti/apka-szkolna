-- Kod lekcji do zeszytu ("4.3" = rocznik.numer). Nadawany raz przy tworzeniu
-- lekcji i niezmienny - dzieci zapisuja go przy temacie, zeby pozniej odnalezc
-- notatke. Patrz src/lib/lessonCode.ts.
alter table public.lessons add column if not exists code text;
