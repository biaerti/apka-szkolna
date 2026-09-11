-- Dopiski w komorkach planu ("zamiana z Jagoda", "Jagoda ma lekcje - zwolnic
-- sale"). Komorka moze miec sam dopisek bez klasy, wiec class_id przestaje byc
-- wymagane. Patrz TimetableEntry w src/data/types.ts.

alter table public.timetable_entries alter column class_id drop not null;
alter table public.timetable_entries add column if not exists note text;
