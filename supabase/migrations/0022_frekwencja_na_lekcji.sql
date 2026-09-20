-- Frekwencja jest teraz zapisywana dla konkretnej godziny. Brak wiersza = obecny,
-- status "absent" = nieobecny, "late" = spóźniony.
alter table public.absences
  add column if not exists status text not null default 'absent';

alter table public.absences drop constraint if exists absences_status_check;
alter table public.absences
  add constraint absences_status_check check (status in ('absent', 'late'));
